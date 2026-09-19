"use server";

import { createSupabaseServerClient } from "./client";
import { sanitizeFreeText } from "./sanitize";
import type { MatePostRow } from "./types";

/** 이용약관·안전수칙 정책 버전(REQ-FUNC-080, 동의 시각과 함께 저장). */
const MATE_SAFETY_POLICY_VERSION = "2026-08-20";

/**
 * "use server" 파일의 모든 export는 async 함수여야 한다 — 이 파일을 Client
 * Component에서 import할 경우(CMP-SCR003-MATE-TAB), 상수 export가 하나라도
 * 섞여 있으면 Next.js가 모듈 전체(다른 함수 export 포함)를 무효화한다.
 * 그래서 정책 버전은 값 대신 async getter로만 내보낸다.
 */
export async function getMateSafetyPolicyVersion(): Promise<string> {
  return MATE_SAFETY_POLICY_VERSION;
}

const PHONE_RE = /(?:\+?\d{1,3}[-.\s]?)?0?1\d[-.\s]?\d{3,4}[-.\s]?\d{4}/;
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const MESSENGER_RE =
  /(카카오톡|카톡|kakao|라인|line|텔레그램|telegram|위챗|wechat|디스코드|discord|인스타(그램)?|instagram)\s*(id|아이디)?\s*[:\-]?\s*@?[a-zA-Z0-9_.]{2,}/i;

/**
 * 전화번호·이메일·메신저 ID 패턴 탐지(REQ-FUNC-032). 클라이언트(CMP-SCR003-
 * MATE-TAB)와 서버(이 파일) 양쪽에서 동일 로직으로 재검증한다 — 클라이언트
 * 검증만 믿지 않는다(우회 가능하므로 서버 측 재검증이 최종 방어선).
 * async인 이유는 로직상 필요해서가 아니라 위와 같은 "use server" 모듈
 * export 제약 때문이다(순수 동기 로직을 async 함수로만 감싼 것).
 */
export async function containsContactInfo(text: string): Promise<boolean> {
  return PHONE_RE.test(text) || EMAIL_RE.test(text) || MESSENGER_RE.test(text);
}

export interface MateWriteActionResult {
  error: string | null;
  postId?: string;
}

export interface CreateMatePostInput {
  title: string;
  countryCode: string;
  region: string;
  startDate: string;
  endDate: string;
  capacity: number;
  preferredConditions?: string | null;
  travelStyle: string[];
  description: string;
  safetyRuleAgreed: boolean;
}

async function findContactField(
  input: Pick<
    CreateMatePostInput,
    "title" | "description" | "preferredConditions"
  >,
): Promise<string | null> {
  if (await containsContactInfo(input.title)) return "title";
  if (await containsContactInfo(input.description)) return "description";
  if (
    input.preferredConditions &&
    (await containsContactInfo(input.preferredConditions))
  ) {
    return "preferredConditions";
  }
  return null;
}

export async function createMatePost(
  input: CreateMatePostInput,
): Promise<MateWriteActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "UNAUTHORIZED" };

  if (!input.safetyRuleAgreed) return { error: "SAFETY_RULE_NOT_AGREED" };
  if (new Date(input.endDate) < new Date(input.startDate)) {
    return { error: "INVALID_DATE_RANGE" };
  }
  if (input.capacity <= 0) return { error: "INVALID_CAPACITY" };

  const title = sanitizeFreeText(input.title);
  const description = sanitizeFreeText(input.description);
  const preferredConditions = input.preferredConditions
    ? sanitizeFreeText(input.preferredConditions)
    : null;

  const contactField = await findContactField({
    title,
    description,
    preferredConditions,
  });
  if (contactField) return { error: `CONTACT_INFO_DETECTED:${contactField}` };

  const { data, error } = await supabase
    .from("mate_posts")
    .insert({
      author_id: auth.user.id,
      title,
      country_code: input.countryCode,
      region: input.region,
      start_date: input.startDate,
      end_date: input.endDate,
      capacity: input.capacity,
      preferred_conditions: preferredConditions,
      travel_style: input.travelStyle,
      description,
      safety_agreed_at: new Date().toISOString(),
      policy_version: MATE_SAFETY_POLICY_VERSION,
    })
    .select("id")
    .maybeSingle();

  if (error) return { error: error.message };
  return { error: null, postId: (data as { id: string } | null)?.id };
}

export type UpdateMatePostInput = Partial<
  Pick<
    CreateMatePostInput,
    | "title"
    | "region"
    | "startDate"
    | "endDate"
    | "capacity"
    | "preferredConditions"
    | "travelStyle"
    | "description"
  >
>;

/** 작성자 본인만 수정 가능 — RLS(mate_posts_update_author_or_staff)가 최종 방어선. */
export async function updateMatePost(
  postId: string,
  input: UpdateMatePostInput,
): Promise<MateWriteActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "UNAUTHORIZED" };

  if (
    input.startDate &&
    input.endDate &&
    new Date(input.endDate) < new Date(input.startDate)
  ) {
    return { error: "INVALID_DATE_RANGE" };
  }
  if (input.capacity !== undefined && input.capacity <= 0) {
    return { error: "INVALID_CAPACITY" };
  }

  const patch: Record<string, unknown> = { ...input };
  if (input.title) patch.title = sanitizeFreeText(input.title);
  if (input.description)
    patch.description = sanitizeFreeText(input.description);
  if (input.preferredConditions) {
    patch.preferred_conditions = sanitizeFreeText(input.preferredConditions);
    delete patch.preferredConditions;
  }
  if (input.startDate) {
    patch.start_date = input.startDate;
    delete patch.startDate;
  }
  if (input.endDate) {
    patch.end_date = input.endDate;
    delete patch.endDate;
  }
  if (input.travelStyle) {
    patch.travel_style = input.travelStyle;
    delete patch.travelStyle;
  }

  const contactField = await findContactField({
    title: (patch.title as string) ?? "",
    description: (patch.description as string) ?? "",
    preferredConditions: (patch.preferred_conditions as string) ?? null,
  });
  if (contactField) return { error: `CONTACT_INFO_DETECTED:${contactField}` };

  const { data, error } = await supabase
    .from("mate_posts")
    .update(patch)
    .eq("id", postId)
    .select("id")
    .maybeSingle();

  if (error) return { error: error.message };
  if (!data) return { error: "FORBIDDEN_OR_NOT_FOUND" };
  return { error: null, postId };
}

/** 수동 마감(REQ-FUNC-038). 자동 마감 판정은 API-MATES-READ의 조회 시점 계산을 따른다. */
export async function closeMatePost(
  postId: string,
): Promise<MateWriteActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "UNAUTHORIZED" };

  const { data, error } = await supabase
    .from("mate_posts")
    .update({ status: "CLOSED" })
    .eq("id", postId)
    .select("id")
    .maybeSingle();

  if (error) return { error: error.message };
  if (!data) return { error: "FORBIDDEN_OR_NOT_FOUND" };
  return { error: null, postId };
}

export async function deleteMatePost(
  postId: string,
): Promise<MateWriteActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "UNAUTHORIZED" };

  const { error } = await supabase.from("mate_posts").delete().eq("id", postId);
  if (error) return { error: error.message };
  return { error: null };
}

export type { MatePostRow };
