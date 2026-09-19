-- DB-SEED-BASE — 개발용 시드 데이터
-- 로컬/스테이징 검증용이다(`supabase db reset`이 로컬 DB에 적용). 실 개인정보는
-- 전혀 쓰지 않으며(example.com 가상 이메일), 6개 허용 테이블 외에는 만들지 않는다.
--
-- user_profiles.id는 auth.users(id)를 참조하므로, 먼저 auth.users에 최소한의
-- 시드 계정 3개(회원 2명 + 관리자 1명)를 만든 뒤 나머지 테이블을 채운다.

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  raw_app_meta_data, raw_user_meta_data, is_super_admin
) values
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated', 'authenticated',
    'seed.member1@example.com', 'seed-not-a-real-password-hash',
    now(), now(), now(),
    '', '', '', '',
    '{"provider":"email","providers":["email"]}', '{}', false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-2222-2222-222222222222',
    'authenticated', 'authenticated',
    'seed.member2@example.com', 'seed-not-a-real-password-hash',
    now(), now(), now(),
    '', '', '', '',
    '{"provider":"email","providers":["email"]}', '{}', false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-3333-3333-333333333333',
    'authenticated', 'authenticated',
    'seed.admin1@example.com', 'seed-not-a-real-password-hash',
    now(), now(), now(),
    '', '', '', '',
    '{"provider":"email","providers":["email"]}', '{}', false
  )
on conflict (id) do nothing;

-- 1. user_profiles ---------------------------------------------------------

insert into public.user_profiles
  (id, nickname, age_range, gender, travel_style, bio, is_adult, adult_verified_at, role)
values
  ('11111111-1111-1111-1111-111111111111', '시드멤버1', '20대', 'female',
   array['자연', '휴양'], '느긋한 여행을 좋아합니다.', true, now(), 'member'),
  ('22222222-2222-2222-2222-222222222222', '시드멤버2', '30대', 'male',
   array['도시', '미식'], '맛집 탐방을 좋아합니다.', true, now(), 'member'),
  ('33333333-3333-3333-3333-333333333333', '시드관리자', '30대', null,
   array[]::text[], null, true, now(), 'admin')
on conflict (id) do nothing;

-- 2. mate_posts --------------------------------------------------------------

insert into public.mate_posts
  (id, author_id, title, country_code, region, start_date, end_date, capacity,
   preferred_conditions, travel_style, description, safety_agreed_at, policy_version, status)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   '오사카 3박4일 같이 가실 분', 'JP', '오사카',
   current_date + interval '30 day', current_date + interval '34 day', 3,
   '20~30대 선호', array['미식', '쇼핑'], '오사카 미식 여행 같이 가요.',
   now(), '2026-08-20', 'RECRUITING'),
  ('aaaaaaaa-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222',
   '방콕 자유여행 동행 구합니다', 'TH', '방콕',
   current_date + interval '10 day', current_date + interval '14 day', 2,
   null, array['도시', '휴양'], '방콕 시내와 근교를 함께 둘러볼 동행을 찾습니다.',
   now(), '2026-08-20', 'RECRUITING'),
  ('aaaaaaaa-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
   '지난달 마감된 여행(예시)', 'TW', '타이베이',
   current_date - interval '40 day', current_date - interval '36 day', 4,
   null, array['미식'], '이미 종료된 모집글 예시입니다.',
   now() - interval '50 day', '2026-08-20', 'CLOSED')
on conflict (id) do nothing;

-- 3. mate_applications ----------------------------------------------------------

insert into public.mate_applications (id, post_id, applicant_id, message, status)
values
  ('bbbbbbbb-0000-0000-0000-000000000001',
   'aaaaaaaa-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222',
   '같이 가고 싶습니다! 잘 부탁드려요.', 'PENDING'),
  ('bbbbbbbb-0000-0000-0000-000000000002',
   'aaaaaaaa-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   '방콕 여행 함께하고 싶어요.', 'ACCEPTED'),
  ('bbbbbbbb-0000-0000-0000-000000000003',
   'aaaaaaaa-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222',
   '이미 마감된 글에 대한 예시 요청입니다.', 'REJECTED')
on conflict (id) do nothing;

-- 4. user_blocks -------------------------------------------------------------

insert into public.user_blocks (id, blocker_id, blocked_id)
values
  ('cccccccc-0000-0000-0000-000000000001',
   '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111')
on conflict (id) do nothing;

-- 5. reports -------------------------------------------------------------------

insert into public.reports
  (id, reporter_id, target_type, target_id, reason_code, description, status, resolved_by, resolved_at)
values
  ('dddddddd-0000-0000-0000-000000000001',
   '22222222-2222-2222-2222-222222222222', 'POST', 'aaaaaaaa-0000-0000-0000-000000000001',
   'SUSPICIOUS_CONTENT', '내용이 의심스러워 신고합니다.', 'OPEN', null, null),
  ('dddddddd-0000-0000-0000-000000000002',
   '11111111-1111-1111-1111-111111111111', 'USER', '22222222-2222-2222-2222-222222222222',
   'HARASSMENT', '불편한 언행이 있었습니다.', 'RESOLVED',
   '33333333-3333-3333-3333-333333333333', now()),
  ('dddddddd-0000-0000-0000-000000000003',
   '22222222-2222-2222-2222-222222222222', 'USER', '11111111-1111-1111-1111-111111111111',
   'SPAM', '스팸성 게시물로 보입니다.', 'DISMISSED',
   '33333333-3333-3333-3333-333333333333', now())
on conflict (id) do nothing;

-- 6. app_settings ----------------------------------------------------------------

insert into public.app_settings (key, value, updated_by)
values
  ('FLIGHT_OUTBOUND_URL', '{"url": "https://www.google.com/travel/flights"}'::jsonb,
   '33333333-3333-3333-3333-333333333333'),
  ('HOTEL_OUTBOUND_URL', '{"url": "https://www.booking.com/"}'::jsonb,
   '33333333-3333-3333-3333-333333333333')
on conflict (key) do nothing;
