"use server";

import { createSupabaseServerClient } from "./client";

export type OutboundUrlKey = "FLIGHT_OUTBOUND_URL" | "HOTEL_OUTBOUND_URL";

export interface AdminSettingsActionResult {
  error: string | null;
}

/** HTTPS만 허용한다 — http:, javascript:, data: 등은 전부 거부한다. */
function isAllowedHttpsUrl(url: string): boolean {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

export async function getOutboundUrl(
  key: OutboundUrlKey,
): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  const value = (data as { value: unknown } | null)?.value;
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "url" in value) {
    const url = (value as { url?: unknown }).url;
    return typeof url === "string" ? url : null;
  }
  return null;
}

/** DB의 app_settings_write_admin_only RLS 정책이 최종 방어선이지만,
 * 여기서도 먼저 확인해 명확한 오류를 돌려준다. */
export async function setOutboundUrl(
  key: OutboundUrlKey,
  url: string,
): Promise<AdminSettingsActionResult> {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "UNAUTHORIZED" };

  if (!isAllowedHttpsUrl(url)) {
    return { error: "INVALID_URL" };
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", auth.user.id)
    .maybeSingle();
  if ((profile as { role?: string } | null)?.role !== "admin") {
    return { error: "FORBIDDEN" };
  }

  const { error } = await supabase.from("app_settings").upsert({
    key,
    value: { url },
    updated_by: auth.user.id,
    updated_at: new Date().toISOString(),
  });

  return { error: error ? error.message : null };
}
