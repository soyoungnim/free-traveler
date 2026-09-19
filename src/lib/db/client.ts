import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server Component/Server Action/Route Handler에서 쓰는 Supabase 클라이언트.
 * anon key + 요청자의 세션 쿠키로 동작해 DB-RLS-BASE 정책이 그대로 적용된다.
 * `SUPABASE_SERVICE_ROLE_KEY`는 여기서 절대 사용하지 않는다(CLAUDE.md 규칙 15).
 *
 * `Database` 제네릭은 이 버전의 @supabase/postgrest-js 타입 추론과 맞지
 * 않아(Update 인자가 never로 좁혀짐) 적용하지 않는다 — 테이블 Row 형태는
 * ./types.ts의 인터페이스로 각 헬퍼 함수의 입출력 시그니처에서 보장한다.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );
}

