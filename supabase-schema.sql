-- ============================================
-- TEKNOMED INTEGRATED SYSTEM - FULL SCHEMA
-- Run this in Supabase SQL Editor
-- Project: cznygqrxvxttxmmkpody
-- ============================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'viewer' check (role in ('super_admin', 'admin', 'editor', 'viewer')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_name text,
  category text not null check (category in ('Konstruksi', 'Penjualan', 'Maintenance')),
  icon text,
  "desc" text,
  summary text,
  specs jsonb default '[]'::jsonb,
  bullets jsonb default '[]'::jsonb,
  tags jsonb default '[]'::jsonb,
  has_3d boolean default false,
  viewer_config jsonb default '{}'::jsonb,
  image_url text,
  gallery jsonb default '[]'::jsonb,
  meta_title text,
  meta_description text,
  published boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists product_3d_assets (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  asset_type text not null check (asset_type in ('model', 'texture', 'env_map', 'screenshot')),
  storage_path text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  category text not null,
  area text,
  year text,
  scope jsonb default '[]'::jsonb,
  tags jsonb default '[]'::jsonb,
  highlight text,
  image_url text,
  map_query text,
  published boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  icon text,
  category text,
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  role text,
  company text,
  project_context text,
  published boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  content jsonb default '{}'::jsonb,
  meta_title text,
  meta_description text,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists site_settings (
  id int primary key default 1,
  company_name text,
  tagline text,
  description text,
  founded int,
  contact jsonb default '{}'::jsonb,
  address jsonb default '{}'::jsonb,
  hours jsonb default '{}'::jsonb,
  service_areas jsonb default '[]'::jsonb,
  theme jsonb default '{}'::jsonb,
  social jsonb default '{}'::jsonb,
  logo text,
  favicon text,
  url text,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_person text not null,
  email text not null,
  phone text,
  product_id uuid references products(id) on delete set null,
  project_type text,
  room_dimensions text,
  quantity int,
  message text not null,
  status text default 'new' check (status in ('new', 'contacted', 'quoted', 'won', 'lost')),
  admin_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  action text not null,
  table_name text not null,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz default now()
);

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- RLS POLICIES
-- ============================================

-- Helper functions
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('super_admin', 'admin', 'editor'))
$$;

-- Enable RLS
alter table profiles enable row level security;
alter table products enable row level security;
alter table product_3d_assets enable row level security;
alter table projects enable row level security;
alter table services enable row level security;
alter table testimonials enable row level security;
alter table pages enable row level security;
alter table site_settings enable row level security;
alter table inquiries enable row level security;
alter table audit_log enable row level security;

-- Profiles
create policy "Users read own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Admin read all profiles" on profiles for select using (public.is_admin());
create policy "Super admin manage profiles" on profiles for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'super_admin')
);

-- Products
create policy "Public read published products" on products for select using (published = true);
create policy "Admin manage products" on products for all using (public.is_admin());

-- Product 3D Assets
create policy "Public read 3d assets" on product_3d_assets for select using (
  exists (select 1 from products where products.id = product_3d_assets.product_id and products.published = true)
);
create policy "Admin manage 3d assets" on product_3d_assets for all using (public.is_admin());

-- Projects
create policy "Public read published projects" on projects for select using (published = true);
create policy "Admin manage projects" on projects for all using (public.is_admin());

-- Services
create policy "Public read published services" on services for select using (published = true);
create policy "Admin manage services" on services for all using (public.is_admin());

-- Testimonials
create policy "Public read published testimonials" on testimonials for select using (published = true);
create policy "Admin manage testimonials" on testimonials for all using (public.is_admin());

-- Pages
create policy "Public read published pages" on pages for select using (published = true);
create policy "Admin manage pages" on pages for all using (public.is_admin());

-- Site Settings
create policy "Public read site settings" on site_settings for select using (true);
create policy "Admin update site settings" on site_settings for update using (public.is_admin());

-- Inquiries
create policy "Public submit inquiries" on inquiries for insert with check (true);
create policy "Admin read inquiries" on inquiries for select using (public.is_admin());
create policy "Admin update inquiries" on inquiries for update using (public.is_admin());

-- Audit Log
create policy "Admin read audit log" on audit_log for select using (public.is_admin());
create policy "System insert audit log" on audit_log for insert with check (public.is_admin());

-- ============================================
-- STORAGE BUCKETS
-- ============================================

insert into storage.buckets (id, name, public) values ('3d-models', '3d-models', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('pdf-catalogs', 'pdf-catalogs', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('project-images', 'project-images', true) on conflict (id) do nothing;

-- Storage policies
create policy "Public read 3d-models" on storage.objects for select using (bucket_id = '3d-models');
create policy "Admin write 3d-models" on storage.objects for insert with check (bucket_id = '3d-models' and public.is_admin());
create policy "Admin update 3d-models" on storage.objects for update using (bucket_id = '3d-models' and public.is_admin());
create policy "Admin delete 3d-models" on storage.objects for delete using (bucket_id = '3d-models' and public.is_admin());

create policy "Public read product-images" on storage.objects for select using (bucket_id = 'product-images');
create policy "Admin write product-images" on storage.objects for insert with check (bucket_id = 'product-images' and public.is_admin());
create policy "Admin update product-images" on storage.objects for update using (bucket_id = 'product-images' and public.is_admin());
create policy "Admin delete product-images" on storage.objects for delete using (bucket_id = 'product-images' and public.is_admin());

create policy "Public read pdf-catalogs" on storage.objects for select using (bucket_id = 'pdf-catalogs');
create policy "Admin write pdf-catalogs" on storage.objects for insert with check (bucket_id = 'pdf-catalogs' and public.is_admin());
create policy "Admin update pdf-catalogs" on storage.objects for update using (bucket_id = 'pdf-catalogs' and public.is_admin());
create policy "Admin delete pdf-catalogs" on storage.objects for delete using (bucket_id = 'pdf-catalogs' and public.is_admin());

create policy "Public read project-images" on storage.objects for select using (bucket_id = 'project-images');
create policy "Admin write project-images" on storage.objects for insert with check (bucket_id = 'project-images' and public.is_admin());
create policy "Admin update project-images" on storage.objects for update using (bucket_id = 'project-images' and public.is_admin());
create policy "Admin delete project-images" on storage.objects for delete using (bucket_id = 'project-images' and public.is_admin());

-- ============================================
-- ADMIN USER PROFILE
-- UUID: 44a4db2a-cf83-42e5-9d53-75cef30bb8c1
-- ============================================

insert into profiles (id, email, full_name, role)
values ('44a4db2a-cf83-42e5-9d53-75cef30bb8c1', 'admin@teknomed.web.id', 'Admin Teknomed', 'super_admin')
on conflict (id) do update set role = 'super_admin';

-- ============================================
-- SEED DATA - PRODUCTS
-- ============================================

insert into products (slug, name, short_name, category, icon, "desc", summary, specs, bullets, tags, published, sort_order) values
('mgps', 'Medical Gas Pipeline System', 'MGPS', 'Konstruksi', 'Syringe',
 'Perencanaan dan instalasi jaringan gas medis untuk fasilitas kesehatan.',
 'Solusi perencanaan dan instalasi jaringan gas medis untuk fasilitas kesehatan.',
 '["O2, N2O, CO2, Vacuum, Air Medis","Sesuai standar HTM 02-01 & NFPA 99","Commissioning & pressure testing","Sertifikasi dan dokumentasi lengkap"]'::jsonb,
 '["Perencanaan jalur pipa dan titik outlet sesuai standar","Instalasi sistem distribusi gas medis (O2, N2O, Vacuum, dll)","Pengujian kebocoran dan commissioning","Maintenance berkala dan after-sales support"]'::jsonb,
 '["Gas Medis","Pipeline","Instalasi"]'::jsonb, true, 1),

('mot', 'Modular Operating Theatre', 'MOT', 'Konstruksi', 'SquareStack',
 'Ruang operasi modular yang dapat dikustomisasi sesuai standar dan kebutuhan.',
 'Ruang operasi modular yang dapat dikustomisasi sesuai standar dan kebutuhan.',
 '["Panel modular anti-bakteri","Integrasi HVAC & electrical","Pintu hermetik & kontrol tekanan","Sesuai standar ISO 14644"]'::jsonb,
 '["Panel modular dinding dan plafon dengan finishing anti-bakteri","Integrasi HVAC, electrical, dan sistem pendukung","Pintu hermetik dan sistem kontrol tekanan","Maintenance dan after-sales support"]'::jsonb,
 '["Ruang Operasi","Modular","Cleanroom"]'::jsonb, true, 2),

('hvac-cleanroom', 'HVAC & Cleanroom', 'HVAC', 'Konstruksi', 'Wind',
 'Sistem tata udara untuk kenyamanan, kontrol temperatur, dan kebersihan ruangan.',
 'Sistem tata udara untuk kenyamanan, kontrol temperatur, dan kebersihan ruangan.',
 '["AHU, FCU, ducting & diffuser","Filtrasi HEPA H13/H14","Balancing & commissioning","BMS integration"]'::jsonb,
 '["Perencanaan load dan kebutuhan airflow","Instalasi AHU, ducting, dan diffuser","Balancing dan testing sesuai standar","Sistem filtrasi HEPA untuk cleanroom"]'::jsonb,
 '["HVAC","Cleanroom","Filtrasi"]'::jsonb, true, 3),

('electrical-mechanical', 'Electrical & Mechanical', 'E&M', 'Konstruksi', 'Zap',
 'Pekerjaan mekanikal dan elektrikal untuk proyek rumah sakit dan klinik.',
 'Pekerjaan mekanikal dan elektrikal untuk proyek rumah sakit dan klinik.',
 '["Panel MDP, SDP, distribusi daya","Grounding & lightning protection","Pompa, plumbing & fire protection","Koordinasi MEP terintegrasi"]'::jsonb,
 '["Instalasi panel listrik dan distribusi daya","Sistem grounding dan proteksi petir","Instalasi pompa, plumbing, dan fire protection","Koordinasi MEP terintegrasi"]'::jsonb,
 '["Electrical","Mechanical","MEP"]'::jsonb, true, 4),

('radiology-chiller', 'Radiology Room Chiller', 'Chiller', 'Penjualan', 'HardHat',
 'Sistem pendinginan khusus untuk ruang radiologi.',
 'Sistem pendinginan khusus untuk ruang radiologi.',
 '["Chiller dedicated radiologi","Kontrol temperatur presisi","Monitoring & alarm system","Maintenance preventif berkala"]'::jsonb,
 '["Chiller dedicated untuk peralatan radiologi","Kontrol temperatur presisi","Monitoring dan alarm system","Maintenance preventif berkala"]'::jsonb,
 '["Chiller","Radiologi","Pendinginan"]'::jsonb, true, 5),

('consumables-spareparts', 'Consumables & Spare Parts', 'Sparepart', 'Penjualan', 'Package',
 'Pengadaan consumable dan spare part peralatan medis.',
 'Pengadaan consumable dan spare part peralatan medis.',
 '["Filter HEPA & pre-filter","Spare part AHU & ducting","Komponen gas medis (valve, regulator)","Consumable maintenance rutin"]'::jsonb,
 '["Filter HEPA dan pre-filter","Spare part AHU dan ducting","Komponen gas medis (valve, regulator, outlet)","Consumable maintenance rutin"]'::jsonb,
 '["Consumable","Spare Part","Pengadaan"]'::jsonb, true, 6)
on conflict (slug) do nothing;

-- ============================================
-- SEED DATA - TESTIMONIALS
-- ============================================

insert into testimonials (quote, name, role, company, project_context, published, sort_order) values
('Tim Teknomed menyelesaikan instalasi Modular Operating Theatre kami sesuai standar ISO 14644. Koordinasi MEP, HVAC, dan gas medis berjalan tertib, commissioning lancar tanpa revisi major.',
 'dr. Manoppo, M.Kes', 'Kepala Instalasi Bedah Sentral', 'RSUD Dr. Sam Ratulangi', 'Proyek MOT, Manado 2023', true, 1),
('Kami mempercayakan instalasi gas medis terpadu 3 lantai kepada Teknomed. Dokumentasi commissioning lengkap, pressure testing sesuai HTM 02-01, dan after-sales support responsif.',
 'Ir. Lengkong', 'Manajer Fasilitas dan Sarana', 'RS Siloam Manado', 'MGPS multi-lantai, Manado 2021', true, 2),
('Untuk ruang isolasi tekanan negatif di tengah pandemi, Teknomed merespons cepat. Sistem HEPA filtration dan monitoring tekanan real-time sesuai standar WHO.',
 'dr. Tumbol, Sp.PD', 'Komite PPI', 'RS Bethesda Tomohon', 'Ruang Isolasi, Tomohon 2022', true, 3),
('Rehabilitasi laboratorium Puskesmas kami selesai tepat waktu dengan kualitas finishing yang rapi. Instalasi gas medis, electrical upgrade, dan ventilasi exhaust dikerjakan terkoordinasi.',
 'Ns. Waworuntu, M.Kes', 'Kepala Puskesmas', 'Puskesmas Mapanget', 'Rehab Lab, Manado 2022', true, 4)
on conflict do nothing;

-- ============================================
-- SEED DATA - SITE SETTINGS
-- ============================================

insert into site_settings (id, company_name, tagline, description, founded, contact, address, hours, service_areas, logo, favicon, url)
values (1, 'PT Teknomed Indo Timur', 'Medical Contractor',
  'Solusi konstruksi fasilitas kesehatan: MEP, tata udara, instalasi gas medis, Modular Operating Theatre, dan maintenance.',
  2021,
  '{"email":"teknomedindotimurpt@gmail.com","phone":"+62 812-4436-0317","phoneHref":"tel:+6281244360317","whatsapp":"https://wa.me/6281244360317"}'::jsonb,
  '{"full":"Perumahan Tamansari Metropolitan, Cluster Lihaga, Ruko No.19, Paniki Bawah, Mapanget, Manado, Sulawesi Utara 95256","city":"Manado","province":"Sulawesi Utara","zipCode":"95256"}'::jsonb,
  '{"weekdays":"Senin - Jumat, 08.00 - 17.00 WITA","weekend":"Sabtu & Minggu: Tutup"}'::jsonb,
  '["Jawa Timur","Bali","NTB","NTT","Sulawesi"]'::jsonb,
  '/logo_pt.png', '/favicon.svg', 'https://teknomed.web.id')
on conflict (id) do nothing;

-- Done!
