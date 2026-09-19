-- DB-SCHEMA-BASE — Supabase 기본 스키마(6테이블)
-- PROJECT_SCOPE.md / DECISION_LOG.md에 따라 정확히 6개 테이블만 만든다.
-- audit_log, media_asset 등 범용 감사 로그·미디어 관리 테이블은 추가하지 않는다.
-- 정확한 생년월일은 어떤 테이블에도 저장하지 않는다(is_adult + adult_verified_at만).

-- 1. user_profiles ------------------------------------------------------

create table public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null,
  age_range text not null,
  gender text,
  travel_style text[] not null default '{}',
  bio text,
  is_adult boolean not null default false,
  adult_verified_at timestamptz,
  role text not null default 'member' check (role in ('member', 'moderator', 'admin')),
  deactivated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

-- 2. mate_posts ----------------------------------------------------------

create table public.mate_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.user_profiles (id) on delete cascade,
  title text not null,
  country_code text not null,
  region text not null,
  start_date date not null,
  end_date date not null,
  capacity int not null check (capacity > 0),
  preferred_conditions text,
  travel_style text[] not null default '{}',
  description text not null,
  safety_agreed_at timestamptz not null,
  policy_version text not null,
  status text not null default 'RECRUITING' check (status in ('RECRUITING', 'CLOSED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

alter table public.mate_posts enable row level security;

-- 3. mate_applications -----------------------------------------------------

create table public.mate_applications (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.mate_posts (id) on delete cascade,
  applicant_id uuid not null references public.user_profiles (id) on delete cascade,
  message text not null check (char_length(message) <= 500),
  status text not null default 'PENDING' check (status in ('PENDING', 'ACCEPTED', 'REJECTED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 동일 사용자·동일 글의 PENDING/ACCEPTED 중복 요청만 차단(REJECTED는 재신청 허용).
create unique index mate_applications_active_unique
  on public.mate_applications (post_id, applicant_id)
  where status in ('PENDING', 'ACCEPTED');

alter table public.mate_applications enable row level security;

-- 4. user_blocks -----------------------------------------------------------

create table public.user_blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references public.user_profiles (id) on delete cascade,
  blocked_id uuid not null references public.user_profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

alter table public.user_blocks enable row level security;

-- 5. reports -----------------------------------------------------------------

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.user_profiles (id) on delete cascade,
  target_type text not null check (target_type in ('POST', 'USER', 'APPLICATION')),
  target_id uuid not null,
  reason_code text not null,
  description text,
  status text not null default 'OPEN' check (status in ('OPEN', 'RESOLVED', 'DISMISSED')),
  resolved_by uuid references public.user_profiles (id),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

-- 6. app_settings --------------------------------------------------------------

create table public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.user_profiles (id),
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;
