"use server";

import { createSupabaseServerClient } from "./client";
import { sanitizeFreeText } from "./sanitize";
import type { MateApplicationRow, MateApplicationStatus } from "./types";

export interface MateApplicationActionResult {
  error: string | null;
}

export interface SubmitApplicationInput {
  postId: string;
  message: string;
}

/**
 * 참가 요청 제출. 동일 글에 대한 PENDING/ACCEPTED 중복 요청은
 * DB unique index(mate_applications_active_unique)가 최종 차단한다(23505).
 */
export async function submitApplication(
  input: SubmitApplicationInput,
): Promise<MateApplicationActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "UNAUTHORIZED" };

  const message = sanitizeFreeText(input.message);
  if (!message || message.length > 500) return { error: "INVALID_MESSAGE" };

  const { error } = await supabase.from("mate_applications").insert({
    post_id: input.postId,
    applicant_id: auth.user.id,
    message,
  });

  if (!error) return { error: null };
  if (error.code === "23505") return { error: "DUPLICATE_APPLICATION" };
  return { error: error.message };
}

export async function listApplicationsForPost(
  postId: string,
): Promise<MateApplicationRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("mate_applications")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });
  return (data as MateApplicationRow[] | null) ?? [];
}

export async function listMyApplications(): Promise<MateApplicationRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];

  const { data } = await supabase
    .from("mate_applications")
    .select("*")
    .eq("applicant_id", auth.user.id)
    .order("created_at", { ascending: false });
  return (data as MateApplicationRow[] | null) ?? [];
}

/**
 * PENDING → ACCEPTED/REJECTED 전이. 실제 "작성자만 승인 가능" 강제는
 * DB-RLS-BASE의 mate_applications_update_post_author_or_staff 정책이 한다 —
 * 비작성자가 시도하면 UPDATE가 0행에 적용되어 아래에서 FORBIDDEN_OR_NOT_FOUND로
 * 돌아온다(REQ-FUNC-036, Security AC "비작성자 승인 시도 403"과 동일 취지).
 */
async function transitionApplication(
  applicationId: string,
  next: MateApplicationStatus,
): Promise<MateApplicationActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "UNAUTHORIZED" };

  const { data, error } = await supabase
    .from("mate_applications")
    .update({ status: next })
    .eq("id", applicationId)
    .eq("status", "PENDING")
    .select()
    .maybeSingle();

  if (error) return { error: error.message };
  if (!data) return { error: "FORBIDDEN_OR_NOT_FOUND" };
  return { error: null };
}

export async function acceptApplication(
  applicationId: string,
): Promise<MateApplicationActionResult> {
  return transitionApplication(applicationId, "ACCEPTED");
}

export async function rejectApplication(
  applicationId: string,
): Promise<MateApplicationActionResult> {
  return transitionApplication(applicationId, "REJECTED");
}
