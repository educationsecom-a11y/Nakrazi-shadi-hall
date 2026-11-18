-- Nakreezay Shadi Hall & Banquet — Supabase PostgreSQL Schema & RLS Policies
-- Run this script once in your Supabase SQL Editor (Project: togbanroczwndrvznbrl)

create table if not exists public.admin_users (
  email text primary key,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

insert into public.admin_users (email, role)
values ('educationsecom@gmail.com', 'superadmin')
on conflict (email) do nothing;

create or replace function public.is_nakreezay_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    auth.role() = 'authenticated'
    and (
      lower(coalesce(auth.jwt() ->> 'email', '')) = 'educationsecom@gmail.com'
      or exists (
        select 1
        from public.admin_users au
        where lower(au.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
    );
$$;

create table if not exists public.site_config (
  id text primary key,
  hero_image_url text not null,
  stage_image_url text not null,
  catering_image_url text not null,
  av_image_url text not null,
  base_venue_per_head integer not null default 450,
  phone_display text not null,
  phone_raw text not null,
  whatsapp_number text not null,
  email text not null,
  address_en text not null,
  address_ur text not null,
  visiting_hours_en text not null,
  visiting_hours_ur text not null,
  friday_note_en text not null default '',
  friday_note_ur text not null default '',
  hero_headline_en text not null default '',
  hero_headline_ur text not null default '',
  hero_subheadline_en text not null default '',
  hero_subheadline_ur text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.packages (
  id text primary key,
  name_en text not null,
  name_ur text not null,
  tier_label_en text not null,
  tier_label_ur text not null,
  badge_en text,
  badge_ur text,
  price_per_head integer not null default 0,
  hall_fee_note_en text not null default '',
  hall_fee_note_ur text not null default '',
  description_en text not null default '',
  description_ur text not null default '',
  highlighted boolean not null default false,
  features_en jsonb not null default '[]'::jsonb,
  features_ur jsonb not null default '[]'::jsonb,
  preset_dish_ids jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_dishes (
  id text primary key,
  category text not null,
  name_en text not null,
  name_ur text not null,
  price_per_head integer not null default 0,
  note_en text not null default '',
  note_ur text not null default '',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id text primary key,
  category text not null,
  title_en text not null,
  title_ur text not null,
  caption_en text not null default '',
  caption_ur text not null default '',
  image_url text not null,
  aspect text not null default 'square',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id text primary key,
  number text not null default '01',
  category_en text not null,
  category_ur text not null,
  title_en text not null,
  title_ur text not null,
  summary_en text not null default '',
  summary_ur text not null default '',
  description_en text not null default '',
  description_ur text not null default '',
  image_url text not null,
  features_en jsonb not null default '[]'::jsonb,
  features_ur jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.hall_specs (
  id text primary key,
  name_en text not null,
  name_ur text not null,
  area_sq_ft text not null,
  banquet_capacity text not null,
  theater_capacity text not null,
  bridal_room_en text not null,
  bridal_room_ur text not null,
  climate_control_en text not null,
  climate_control_ur text not null,
  notes_en text not null default '',
  notes_ur text not null default '',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id text primary key,
  initials text not null,
  name text not null,
  location_event_en text not null,
  location_event_ur text not null,
  quote_en text not null,
  quote_ur text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id text primary key,
  question_en text not null,
  question_ur text not null,
  answer_en text not null,
  answer_ur text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id text primary key,
  full_name text not null,
  phone text not null,
  event_date text not null,
  event_shift text not null,
  event_type text not null,
  gents_count integer not null default 0,
  ladies_count integer not null default 0,
  catering text not null default 'Yes - Per Head',
  notes text not null default '',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.admin_users enable row level security;
alter table public.site_config enable row level security;
alter table public.packages enable row level security;
alter table public.menu_dishes enable row level security;
alter table public.gallery_items enable row level security;
alter table public.services enable row level security;
alter table public.hall_specs enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.inquiries enable row level security;

-- Drop existing policies safely for idempotent runs
drop policy if exists "admin_users_admin_all" on public.admin_users;
create policy "admin_users_admin_all" on public.admin_users
  for all using (public.is_nakreezay_admin()) with check (public.is_nakreezay_admin());

-- Public read + Admin write policies for CMS tables
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'site_config',
    'packages',
    'menu_dishes',
    'gallery_items',
    'services',
    'hall_specs',
    'testimonials',
    'faqs'
  ]
  loop
    execute format('drop policy if exists "%s_public_read" on public.%I', tbl, tbl);
    execute format('create policy "%s_public_read" on public.%I for select using (true)', tbl, tbl);

    execute format('drop policy if exists "%s_admin_write" on public.%I', tbl, tbl);
    execute format(
      'create policy "%s_admin_write" on public.%I for all using (public.is_nakreezay_admin()) with check (public.is_nakreezay_admin())',
      tbl,
      tbl
    );
  end loop;
end $$;

-- Inquiries: public visitors can submit pending inquiries; only admins can view/manage them
drop policy if exists "inquiries_public_insert" on public.inquiries;
create policy "inquiries_public_insert" on public.inquiries
  for insert with check (status = 'pending');

drop policy if exists "inquiries_admin_select" on public.inquiries;
create policy "inquiries_admin_select" on public.inquiries
  for select using (public.is_nakreezay_admin());

drop policy if exists "inquiries_admin_update" on public.inquiries;
create policy "inquiries_admin_update" on public.inquiries
  for update using (public.is_nakreezay_admin()) with check (public.is_nakreezay_admin());

drop policy if exists "inquiries_admin_delete" on public.inquiries;
create policy "inquiries_admin_delete" on public.inquiries
  for delete using (public.is_nakreezay_admin());

-- Enable Realtime replication for live CMS & inquiry updates
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'site_config',
    'packages',
    'menu_dishes',
    'gallery_items',
    'services',
    'hall_specs',
    'testimonials',
    'faqs',
    'inquiries'
  ]
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', tbl);
    exception when others then
      null;
    end;
  end loop;
end $$;
