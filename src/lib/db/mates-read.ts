"use server";

import { createSupabaseServerClient } from "./client";
import type { MatePostRow, MatePostStatus } from "./types";

export interface MatePostFilters {
  countryCode?: string;
  region?: string;
  /** 여행 기간이 이 구간과 겹치는 글만(기간 겹침 필터). */
  startDateFrom?: string;
  endDateTo?: string;
  travelStyle?: string[];
  /** 지정하지 않으면 조회 시점 계산 상태와 무관하게 전부 반환한다. */
  status?: MatePostStatus;
  limit?: number;
}

export interface MatePostWithComputedStatus extends MatePostRow {
  /** status 컬럼 + end_date 경과 여부를 조회 시점에 합산한 실제 상태(REQ-FUNC-037, 배치 없음). */
  effectiveStatus: MatePostStatus;
}

function computeEffectiveStatus(post: MatePostRow): MatePostStatus {
  if (post.status === "CLOSED") return "CLOSED";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(post.end_date) < today ? "CLOSED" : "RECRUITING";
}

type SupabaseServerClient = Awaited<
  ReturnType<typeof createSupabaseServerClient>
>;

/** 로그인 사용자와 서로 차단 관계인 상대의 id 목록(방향 무관, REQ-FUNC-030). */
async function getBlockedCounterpartIds(
  supabase: SupabaseServerClient,
  userId: string | null,
): Promise<string[]> {
  if (!userId) return [];
  const { data } = await supabase
    .from("user_blocks")
    .select("blocker_id, blocked_id")
    .or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`);

  const rows =
    (data as { blocker_id: string; blocked_id: string }[] | null) ?? [];
  return rows.map((r) =>
    r.blocker_id === userId ? r.blocked_id : r.blocker_id,
  );
}

export async function listMatePosts(
  filters: MatePostFilters = {},
): Promise<MatePostWithComputedStatus[]> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  const blockedIds = await getBlockedCounterpartIds(
    supabase,
    auth.user?.id ?? null,
  );

  let query = supabase.from("mate_posts").select("*");
  if (filters.countryCode)
    query = query.eq("country_code", filters.countryCode);
  if (filters.region) query = query.eq("region", filters.region);
  if (filters.startDateFrom)
    query = query.gte("end_date", filters.startDateFrom);
  if (filters.endDateTo) query = query.lte("start_date", filters.endDateTo);
  if (filters.travelStyle?.length) {
    query = query.overlaps("travel_style", filters.travelStyle);
  }
  if (blockedIds.length) {
    query = query.not("author_id", "in", `(${blockedIds.join(",")})`);
  }

  query = query.order("created_at", { ascending: false });
  if (filters.limit) query = query.limit(filters.limit);

  const { data } = await query;
  const rows = (data as MatePostRow[] | null) ?? [];
  const withStatus = rows.map((row) => ({
    ...row,
    effectiveStatus: computeEffectiveStatus(row),
  }));

  return filters.status
    ? withStatus.filter((p) => p.effectiveStatus === filters.status)
    : withStatus;
}

export async function getMatePostDetail(
  postId: string,
): Promise<MatePostWithComputedStatus | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("mate_posts")
    .select("*")
    .eq("id", postId)
    .maybeSingle();

  if (!data) return null;
  const row = data as MatePostRow;
  return { ...row, effectiveStatus: computeEffectiveStatus(row) };
}

export async function listMyMatePosts(): Promise<MatePostRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];

  const { data } = await supabase
    .from("mate_posts")
    .select("*")
    .eq("author_id", auth.user.id)
    .order("created_at", { ascending: false });

  return (data as MatePostRow[] | null) ?? [];
}
