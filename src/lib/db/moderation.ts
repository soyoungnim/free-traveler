"use server";

import { createSupabaseServerClient } from "./client";
import { sanitizeFreeText } from "./sanitize";
import type {
  ReportRow,
  ReportStatus,
  ReportTargetType,
  UserBlockRow,
} from "./types";

export interface ModerationActionResult {
  error: string | null;
  reportId?: string;
}

export interface SubmitReportInput {
  targetType: ReportTargetType;
  targetId: string;
  reasonCode: string;
  description?: string | null;
}

/**
 * 신고 접수. 신고자·피신고자 상세는 관리자만 조회 가능하도록 DB-RLS-BASE의
 * reports_select_reporter_or_staff 정책이 최종 방어선이다(Security AC).
 */
export async function submitReport(
  input: SubmitReportInput,
): Promise<ModerationActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "UNAUTHORIZED" };

  const description = input.description
    ? sanitizeFreeText(input.description)
    : null;

  const { data, error } = await supabase
    .from("reports")
    .insert({
      reporter_id: auth.user.id,
      target_type: input.targetType,
      target_id: input.targetId,
      reason_code: input.reasonCode,
      description,
    })
    .select("id")
    .maybeSingle();

  if (error) return { error: error.message };
  return { error: null, reportId: (data as { id: string } | null)?.id };
}

/** Moderator/Admin 전용 목록(RLS가 일반 사용자의 접근을 이미 차단). */
export async function listReportsForStaff(
  status?: ReportStatus,
): Promise<ReportRow[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from("reports").select("*");
  if (status) query = query.eq("status", status);
  query = query.order("created_at", { ascending: false });

  const { data } = await query;
  return (data as ReportRow[] | null) ?? [];
}

async function transitionReport(
  reportId: string,
  next: "RESOLVED" | "DISMISSED",
): Promise<ModerationActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "UNAUTHORIZED" };

  const { data, error } = await supabase
    .from("reports")
    .update({
      status: next,
      resolved_by: auth.user.id,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", reportId)
    .eq("status", "OPEN")
    .select("id")
    .maybeSingle();

  if (error) return { error: error.message };
  if (!data) return { error: "FORBIDDEN_OR_NOT_FOUND" };
  return { error: null, reportId };
}

export async function resolveReport(
  reportId: string,
): Promise<ModerationActionResult> {
  return transitionReport(reportId, "RESOLVED");
}

export async function dismissReport(
  reportId: string,
): Promise<ModerationActionResult> {
  return transitionReport(reportId, "DISMISSED");
}

export interface BlockActionResult {
  error: string | null;
}

export async function blockUser(blockedId: string): Promise<BlockActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "UNAUTHORIZED" };
  if (auth.user.id === blockedId) return { error: "CANNOT_BLOCK_SELF" };

  const { error } = await supabase.from("user_blocks").insert({
    blocker_id: auth.user.id,
    blocked_id: blockedId,
  });

  if (!error) return { error: null };
  if (error.code === "23505") return { error: null }; // 이미 차단됨 — 멱등 처리
  return { error: error.message };
}

export async function unblockUser(
  blockedId: string,
): Promise<BlockActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "UNAUTHORIZED" };

  const { error } = await supabase
    .from("user_blocks")
    .delete()
    .eq("blocker_id", auth.user.id)
    .eq("blocked_id", blockedId);

  return { error: error ? error.message : null };
}

export async function listMyBlocks(): Promise<UserBlockRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];

  const { data } = await supabase
    .from("user_blocks")
    .select("*")
    .eq("blocker_id", auth.user.id)
    .order("created_at", { ascending: false });

  return (data as UserBlockRow[] | null) ?? [];
}
