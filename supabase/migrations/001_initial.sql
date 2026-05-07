-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- CATEGORIES TABLE
-- ============================================
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  name_ar text,
  name_fr text,
  slug text not null unique,
  icon text,
  description text,
  created_at timestamp with time zone default now()
);

-- ============================================
-- UNIVERSITIES TABLE
-- ============================================
create table public.universities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text,
  name_fr text,
  slug text unique,
  type text not null check (type in ('public', 'private')),
  category_id uuid references public.categories(id),
  city text not null,
  address text,
  website text,
  email text,
  phone text,
  instagram text,
  facebook text,
  linkedin text,
  youtube text,
  programs text[] default '{}',
  tuition_fees_min numeric,
  tuition_fees_max numeric,
  tuition_currency text default 'MAD',
  languages text[] default '{}',
  diplomas text[] default '{}',
  logo_url text,
  cover_url text,
  description text,
  description_ar text,
  founded_year integer,
  student_count integer,
  is_active boolean default true,
  is_featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Full text search
create index universities_search_idx on public.universities
  using gin(to_tsvector('french', coalesce(name, '') || ' ' || coalesce(city, '') || ' ' || coalesce(description, '')));

create index universities_city_idx on public.universities(city);
create index universities_type_idx on public.universities(type);
create index universities_category_idx on public.universities(category_id);

-- ============================================
-- FAVORITES TABLE
-- ============================================
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  university_id uuid references public.universities(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(user_id, university_id)
);

create index favorites_user_idx on public.favorites(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Profiles
alter table public.profiles enable row level security;

create policy "Users can view all profiles"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Categories (public read)
alter table public.categories enable row level security;

create policy "Anyone can view categories"
  on public.categories for select using (true);

create policy "Admins can manage categories"
  on public.categories for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Universities (public read)
alter table public.universities enable row level security;

create policy "Anyone can view active universities"
  on public.universities for select using (is_active = true);

create policy "Admins can manage universities"
  on public.universities for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Favorites
alter table public.favorites enable row level security;

create policy "Users can view own favorites"
  on public.favorites for select using (auth.uid() = user_id);

create policy "Users can add favorites"
  on public.favorites for insert with check (auth.uid() = user_id);

create policy "Users can delete own favorites"
  on public.favorites for delete using (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger universities_updated_at
  before update on public.universities
  for each row execute procedure public.handle_updated_at();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Generate slug from name
create or replace function public.generate_slug(name text)
returns text as $$
begin
  return lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(name, '[àáâãäå]', 'a', 'g'),
        '[éèêë]', 'e', 'g'
      ),
      '[^a-z0-9]+', '-', 'g'
    )
  );
end;
$$ language plpgsql;
