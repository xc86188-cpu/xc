create extension if not exists "pgcrypto";

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  client_id text,
  source text not null default 'web',
  scene text[] not null default '{}',
  level text,
  shape0 text,
  toe text,
  instep text,
  arch text,
  heel text,
  street_size numeric(4, 1),
  feel text,
  recommended_brand text,
  recommended_model text,
  recommended_size numeric(4, 1),
  alternative_models text[] not null default '{}',
  matched_count integer not null default 0,
  answers jsonb not null default '{}'::jsonb,
  recommendation jsonb not null default '{}'::jsonb,
  user_agent text
);

alter table public.responses enable row level security;

drop policy if exists "public can insert sizing responses" on public.responses;
create policy "public can insert sizing responses"
  on public.responses
  for insert
  to anon
  with check (true);

drop policy if exists "authenticated users can read sizing responses" on public.responses;
create policy "authenticated users can read sizing responses"
  on public.responses
  for select
  to authenticated
  using (true);

-- 公开网页只使用 anon key 写入。
-- 后台页面使用管理员邮箱密码登录后，走 authenticated 权限读取数据。
