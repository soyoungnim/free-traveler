/**
 * Supabase `Database` 타입 — supabase/migrations/000*.sql의 6개 테이블과
 * 정확히 일치시킨다. 스키마가 바뀌면 이 파일도 함께 갱신한다.
 *
 * 현재 `createSupabaseServerClient()`(client.ts)에는 이 `Database` 타입을
 * generic으로 넘기지 않는다 — 설치된 @supabase/postgrest-js 버전에서
 * `Relationships` 필드를 추가해도 `.update()` 인자가 `never`로 좁혀지는
 * 문제가 있어, 대신 아래 Row 인터페이스로 각 헬퍼 함수의 입출력을 보장한다.
 */

export type UserRole = "member" | "moderator" | "admin";
export type MatePostStatus = "RECRUITING" | "CLOSED";
export type MateApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export type ReportTargetType = "POST" | "USER" | "APPLICATION";
export type ReportStatus = "OPEN" | "RESOLVED" | "DISMISSED";

export interface UserProfileRow {
  id: string;
  nickname: string;
  age_range: string;
  gender: string | null;
  travel_style: string[];
  bio: string | null;
  is_adult: boolean;
  adult_verified_at: string | null;
  role: UserRole;
  deactivated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MatePostRow {
  id: string;
  author_id: string;
  title: string;
  country_code: string;
  region: string;
  start_date: string;
  end_date: string;
  capacity: number;
  preferred_conditions: string | null;
  travel_style: string[];
  description: string;
  safety_agreed_at: string;
  policy_version: string;
  status: MatePostStatus;
  created_at: string;
  updated_at: string;
}

export interface MateApplicationRow {
  id: string;
  post_id: string;
  applicant_id: string;
  message: string;
  status: MateApplicationStatus;
  created_at: string;
  updated_at: string;
}

export interface UserBlockRow {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export interface ReportRow {
  id: string;
  reporter_id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason_code: string;
  description: string | null;
  status: ReportStatus;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface AppSettingRow {
  key: string;
  value: unknown;
  updated_by: string | null;
  updated_at: string;
}

type TableDef<Row extends object> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      user_profiles: TableDef<UserProfileRow>;
      mate_posts: TableDef<MatePostRow>;
      mate_applications: TableDef<MateApplicationRow>;
      user_blocks: TableDef<UserBlockRow>;
      reports: TableDef<ReportRow>;
      app_settings: TableDef<AppSettingRow>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
