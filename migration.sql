-- 追加機能用：schema.sql 実行済みのプロジェクトで、SQL Editor に貼り付けて1回だけ実行してください

-- ===== 1. 店舗：取り込み用の列 =====
alter table shops
  add column if not exists source text default 'manual',      -- manual / hotpepper
  add column if not exists source_id text unique,             -- 取得元のID（hp:J000…）
  add column if not exists status text default 'public',      -- public / pending / rejected / gone
  add column if not exists photo_url text,
  add column if not exists url text,
  add column if not exists fetched_at timestamptz;

-- ===== 2. プロフィール =====
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  username text,
  bio text,
  avatar_url text,
  is_admin boolean not null default false,
  updated_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "プロフィールは誰でも閲覧" on profiles for select using (true);
create policy "プロフィール更新は本人" on profiles for update using (auth.uid() = id);
-- is_admin を自分で書き換えられないよう、更新できる列を限定
revoke update on profiles from authenticated, anon;
grant update (username, bio, avatar_url, updated_at) on profiles to authenticated;

-- 新規登録時にプロフィールを自動作成
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, username) values (new.id, new.raw_user_meta_data->>'username') on conflict do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- 既存ユーザーの分を作成
insert into profiles (id, username)
select id, raw_user_meta_data->>'username' from auth.users on conflict do nothing;

-- 管理者判定
create or replace function public.is_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false)
$$;

-- 店舗の閲覧・承認ルールを差し替え
drop policy if exists "店舗は誰でも閲覧" on shops;
create policy "公開店舗は誰でも閲覧、管理者は全件" on shops for select using (status = 'public' or is_admin());
create policy "店舗の更新は管理者" on shops for update using (is_admin());

-- ===== 3. 口コミ：画像と投稿者プロフィールの紐付け =====
alter table reviews add column if not exists image_url text;
alter table reviews drop constraint if exists reviews_user_profile_fk;
alter table reviews add constraint reviews_user_profile_fk foreign key (user_id) references profiles(id) on delete cascade;

-- ===== 4. 画像の保存場所（Storage） =====
insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict do nothing;
create policy "画像は誰でも閲覧" on storage.objects for select using (bucket_id = 'images');
create policy "画像のアップロードは自分のフォルダ" on storage.objects for insert to authenticated
  with check (bucket_id = 'images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "画像の削除は自分のフォルダ" on storage.objects for delete to authenticated
  using (bucket_id = 'images' and (storage.foldername(name))[1] = auth.uid()::text);

-- ===== 5. 自分を管理者にする（メールアドレスを書き換えて実行） =====
-- update profiles set is_admin = true where id = (select id from auth.users where email = 'あなたのメールアドレス');
