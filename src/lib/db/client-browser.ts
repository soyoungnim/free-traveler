import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Component에서 쓰는 Supabase 클라이언트.
 * anon key로만 동작하며, 인증된 사용자의 세션은 자동으로 감지된다.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
