-- DB-RLS-BASE — Row Level Security 정책
-- 본인·요청 대상 작성자·Moderator/Admin만 비공개 데이터에 접근하도록
-- 6개 테이블(user_profiles, mate_posts, mate_applications, user_blocks,
-- reports, app_settings) 전체에 RLS 정책을 적용한다.
--
-- 0001_schema.sql에서 RLS는 이미 활성화됐지만 어떤 role에도 테이블 권한이
-- 없어 전부 접근 거부 상태였다. 이 마이그레이션은 필요한 최소 권한을
-- GRANT하고, 그 위에 행 단위 정책으로 실제 접근 범위를 제한한다.

create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.user_profiles p
    where p.id = auth.uid() and p.role in ('moderator', 'admin')
  );
$$;

create or replace function public.is_adult_member()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.user_profiles p
    where p.id = auth.uid() and p.is_adult = true
  );
$$;

-- 1. user_profiles --------------------------------------------------------
-- 이메일·전화번호·정확한 생년월일을 저장하지 않으므로(REQ-FUNC-028) 닉네임 등
-- 기본 필드는 동행 기능 특성상 공개 열람을 허용한다.

grant select on public.user_profiles to anon, authenticated;
grant insert, update on public.user_profiles to authenticated;

create policy user_profiles_select_public
  on public.user_profiles for select
  using (true);

create policy user_profiles_insert_self
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy user_profiles_update_self_or_staff
  on public.user_profiles for update
  using (auth.uid() = id or public.is_staff())
  with check (auth.uid() = id or public.is_staff());

-- 2. mate_posts ------------------------------------------------------------
-- 목록·상세는 비회원도 열람 가능(REQ-FUNC-030 Role Permission Matrix Guest=O).
-- 작성·수정·마감은 성인 확인 완료 작성자 본인만.

grant select on public.mate_posts to anon, authenticated;
grant insert, update, delete on public.mate_posts to authenticated;

create policy mate_posts_select_public
  on public.mate_posts for select
  using (true);

create policy mate_posts_insert_adult_self
  on public.mate_posts for insert
  with check (auth.uid() = author_id and public.is_adult_member());

create policy mate_posts_update_author_or_staff
  on public.mate_posts for update
  using (auth.uid() = author_id or public.is_staff())
  with check (auth.uid() = author_id or public.is_staff());

create policy mate_posts_delete_author_or_staff
  on public.mate_posts for delete
  using (auth.uid() = author_id or public.is_staff());

-- 3. mate_applications -------------------------------------------------------
-- 비공개: 신청자 본인, 해당 모집글 작성자, Moderator/Admin만 열람·처리 가능.

grant select, insert on public.mate_applications to authenticated;
grant update on public.mate_applications to authenticated;

create policy mate_applications_select_involved_or_staff
  on public.mate_applications for select
  using (
    auth.uid() = applicant_id
    or auth.uid() in (select author_id from public.mate_posts where id = post_id)
    or public.is_staff()
  );

create policy mate_applications_insert_adult_self
  on public.mate_applications for insert
  with check (auth.uid() = applicant_id and public.is_adult_member());

create policy mate_applications_update_post_author_or_staff
  on public.mate_applications for update
  using (
    auth.uid() in (select author_id from public.mate_posts where id = post_id)
    or public.is_staff()
  )
  with check (
    auth.uid() in (select author_id from public.mate_posts where id = post_id)
    or public.is_staff()
  );

-- 4. user_blocks -------------------------------------------------------------
-- 비공개: 차단을 건 사람 본인과 Moderator/Admin만 열람 가능.

grant select, insert, delete on public.user_blocks to authenticated;

create policy user_blocks_select_owner_or_staff
  on public.user_blocks for select
  using (auth.uid() = blocker_id or public.is_staff());

create policy user_blocks_insert_owner
  on public.user_blocks for insert
  with check (auth.uid() = blocker_id);

create policy user_blocks_delete_owner
  on public.user_blocks for delete
  using (auth.uid() = blocker_id);

-- 5. reports -------------------------------------------------------------------
-- 비공개: 신고자 본인과 Moderator/Admin만 열람. 피신고자는 열람 권한 없음.
-- 상태 처리(RESOLVED/DISMISSED)는 Moderator/Admin만.

grant select, insert on public.reports to authenticated;
grant update on public.reports to authenticated;

create policy reports_select_reporter_or_staff
  on public.reports for select
  using (auth.uid() = reporter_id or public.is_staff());

create policy reports_insert_self
  on public.reports for insert
  with check (auth.uid() = reporter_id);

create policy reports_update_staff_only
  on public.reports for update
  using (public.is_staff())
  with check (public.is_staff());

-- 6. app_settings ----------------------------------------------------------------
-- 외부 URL 등 설정값 자체는 민감정보가 아니라 공개 열람을 허용하고(여행 도구
-- 화면에서 클라이언트가 읽어야 함), 변경은 Admin만 허용한다.

grant select on public.app_settings to anon, authenticated;
grant insert, update, delete on public.app_settings to authenticated;

create policy app_settings_select_public
  on public.app_settings for select
  using (true);

create policy app_settings_write_admin_only
  on public.app_settings for all
  using (
    exists (
      select 1 from public.user_profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.user_profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
