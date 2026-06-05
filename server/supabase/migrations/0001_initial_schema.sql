-- =====================================================================
-- DevFolio — schema inicial da plataforma de portfólios
-- Execute no SQL Editor do Supabase (ou via `supabase db push`).
-- =====================================================================

-- ---------------------------------------------------------------------
-- profiles : dados públicos de cada programador (1:1 com auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null check (username ~ '^[a-z0-9-]{3,30}$'),
  full_name   text not null,
  bio         text,
  avatar_url  text,
  location    text,
  website_url text,
  is_public   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "public profiles are viewable"
  on public.profiles for select
  using (is_public = true or auth.uid() = id);

create policy "users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- ---------------------------------------------------------------------
-- tags : catálogo global reutilizável
-- ---------------------------------------------------------------------
create table if not exists public.tags (
  id    uuid primary key default gen_random_uuid(),
  name  text unique not null,
  slug  text unique not null,
  color text default '#6366f1'
);

alter table public.tags enable row level security;

create policy "tags are viewable by everyone"
  on public.tags for select
  using (true);

-- ---------------------------------------------------------------------
-- projects : projetos do portfólio de cada dev
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references public.profiles(id) on delete cascade,
  title         text not null,
  slug          text not null,
  description   text,
  long_desc     text,
  cover_url     text,
  repo_url      text,
  live_url      text,
  status        text default 'published' check (status in ('draft','published','archived')),
  featured      boolean default false,
  display_order int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  unique (profile_id, slug)
);

create index if not exists projects_profile_id_idx on public.projects(profile_id);

alter table public.projects enable row level security;

create policy "published projects are viewable"
  on public.projects for select
  using (status = 'published' or auth.uid() = profile_id);

create policy "owners insert own projects"
  on public.projects for insert
  with check (auth.uid() = profile_id);

create policy "owners update own projects"
  on public.projects for update
  using (auth.uid() = profile_id);

create policy "owners delete own projects"
  on public.projects for delete
  using (auth.uid() = profile_id);

-- ---------------------------------------------------------------------
-- project_tags : pivot N:M entre projects e tags
-- ---------------------------------------------------------------------
create table if not exists public.project_tags (
  project_id uuid references public.projects(id) on delete cascade,
  tag_id     uuid references public.tags(id) on delete cascade,
  primary key (project_id, tag_id)
);

alter table public.project_tags enable row level security;

create policy "project tags are viewable"
  on public.project_tags for select
  using (true);

create policy "owners manage own project tags"
  on public.project_tags for all
  using (auth.uid() = (select profile_id from public.projects where id = project_id));

-- ---------------------------------------------------------------------
-- skills : habilidades técnicas do dev
-- ---------------------------------------------------------------------
create table if not exists public.skills (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references public.profiles(id) on delete cascade,
  name          text not null,
  level         text default 'intermediate' check (level in ('beginner','intermediate','advanced','expert')),
  category      text,
  display_order int default 0
);

create index if not exists skills_profile_id_idx on public.skills(profile_id);

alter table public.skills enable row level security;

create policy "skills are viewable by everyone"
  on public.skills for select
  using (true);

create policy "owners manage own skills"
  on public.skills for all
  using (auth.uid() = profile_id);

-- ---------------------------------------------------------------------
-- social_links : links de redes sociais do dev
-- ---------------------------------------------------------------------
create table if not exists public.social_links (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  platform   text not null,
  url        text not null,
  label      text
);

create index if not exists social_links_profile_id_idx on public.social_links(profile_id);

alter table public.social_links enable row level security;

create policy "social links are viewable by everyone"
  on public.social_links for select
  using (true);

create policy "owners manage own social links"
  on public.social_links for all
  using (auth.uid() = profile_id);

-- ---------------------------------------------------------------------
-- Trigger: cria um profile automaticamente quando um usuário se cadastra
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user-' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'full_name', 'Novo Dev')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- Trigger: mantém updated_at sempre atual
-- ---------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
  before update on public.projects
  for each row execute function public.touch_updated_at();
