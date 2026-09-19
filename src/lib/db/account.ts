"use server";

import { createSupabaseServerClient } from "./client";
import { sanitizeFreeText } from "./sanitize";
import type { UserProfileRow } from "./types";

export interface AccountActionResult {
  error: string | null;
}

export interface UpdateProfileInput {
  nickname: string;
  ageRange: string;
  gender?: string | null;
  travelStyle: string[];
  bio?: string | null;
}

/** 정확한 생년월일은 어떤 함수에서도 받지 않고 저장하지 않는다. */

export async function getMyProfile(): Promise<UserProfileRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", auth.user.id)
    .maybeSingle();

  return data ?? null;
}

export async function updateMyProfile(
  input: UpdateProfileInput,
): Promise<AccountActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "UNAUTHORIZED" };

  const nickname = sanitizeFreeText(input.nickname);
  const bio = input.bio ? sanitizeFreeText(input.bio) : null;

  if (!nickname || !input.ageRange || input.travelStyle.length === 0) {
    return { error: "INVALID_INPUT" };
  }

  const { error } = await supabase
    .from("user_profiles")
    .update({
      nickname,
      age_range: input.ageRange,
      gender: input.gender ?? null,
      travel_style: input.travelStyle,
      bio,
    })
    .eq("id", auth.user.id);

  return { error: error ? error.message : null };
}

/** 성인 확인 완료 처리. 정확한 생년월일 대신 확인 여부·시각만 기록한다(REQ-FUNC-028). */
export async function confirmAdultVerification(): Promise<AccountActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "UNAUTHORIZED" };

  const { error } = await supabase
    .from("user_profiles")
    .update({
      is_adult: true,
      adult_verified_at: new Date().toISOString(),
    })
    .eq("id", auth.user.id);

  return { error: error ? error.message : null };
}

/**
 * 탈퇴 시 즉시 공개 프로필을 비식별화한다(REQ-FUNC-045 축소 범위 — 30일 후
 * 물리적 삭제 배치는 별도 스코프). Auth 계정 자체 삭제는 다루지 않는다.
 */
export async function deactivateMyAccount(): Promise<AccountActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "UNAUTHORIZED" };

  const { error } = await supabase
    .from("user_profiles")
    .update({
      nickname: "탈퇴한 사용자",
      bio: null,
      gender: null,
      travel_style: [],
      deactivated_at: new Date().toISOString(),
    })
    .eq("id", auth.user.id);

  return { error: error ? error.message : null };
}
