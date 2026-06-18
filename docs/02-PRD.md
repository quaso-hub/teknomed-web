# 02 — Product Requirements Document (PRD)

> **Project**: Teknomed Integrated System
> **Versi**: 1.0.0 — 2026-06-18
> **Status**: Draft, pending review owner

## 1. Product Vision

> "Satu platform terintegrasi di mana PT Teknomed dapat mempresentasikan
> kemampuan konstruksi medical contractor-nya, menampilkan produk dengan 3D
> interaktif, menerima inquiry calon klien secara terstruktur, dan mengelola
> seluruh konten secara mandiri tanpa bergantung developer."

## 2. Target Users (Personas)

### Persona 1: Admin Teknomed (Primary)
- **Nama**: Pak Andi (Kepala Teknis)
- **Role**: super_admin / admin
- **Tujuan**: Update produk, kelola inquiry, generate PDF katalog
- **Frustrasi**: Harus minta developer untuk update konten kecil
- **Tech skill**: Menengah (pakai Excel, WhatsApp, email) — butuh UI sederhana
- **Device**: Laptop Windows, kadang tablet

### Persona 2: Tim Sales (Secondary)
- **Nama**: Bu Sinta (Sales)
- **Role**: editor (read inquiry, update status)
- **Tujuan**: Follow up inquiry cepat, update status deal
- **Frustrasi**: Inquiry tercecer di WhatsApp, susah track
- **Tech skill**: Menengah
- **Device**: Laptop + HP

### Persona 3: Calon Klien Publik (End User)
- **Nama**: dr. Budi (Kepala Instalasi RS)
- **Role**: publik (no login)
- **Tujuan**: Cari info produk medical gas, lihat 3D, ajukan penawaran
- **Frustrasi**: Website lama tidak informatif, tidak ada 3D, inquiry via email saja
- **Tech skill**: Tinggi (dokter, pakai gadget)
- **Device**: HP Android/iPhone dominan, laptop untuk presentasi

### Persona 4: Owner Teknomed (Stakeholder)
- **Nama**: Bapak Owner
- **Role**: super_admin
- **Tujuan**: Lihat dashboard performa, pastikan sistem jalan
- **Tech skill**: Rendah-menengah
- **Device**: Laptop + HP

## 3. User Stories

### 3.1 Publik (Calon Klien)
| ID | Sebagai | Saya ingin | Supaya |
|----|---------|------------|--------|
| US-P01 | Calon klien | Melihat profil perusahaan | Paham kredibilitas Teknomed |
| US-P02 | Calon klien | Melihat daftar layanan | Tahu scope pekerjaan Teknomed |
| US-P03 | Calon klien | Melihat portofolio proyek | Lihat bukti pengalaman |
| US-P04 | Calon klien | Browse katalog produk | Tahu produk yang tersedia |
| US-P05 | Calon klien | Lihat detail produk dengan 3D viewer | Paham struktur produk secara visual |
| US-P06 | Calon klien | Manipulasi 3D (rotate, zoom, exploded) | Pelajari komponen produk |
| US-P07 | Calon klien | Screenshot 3D view | Simpan/share ke tim |
| US-P08 | Calon klien | Submit inquiry penawaran | Ajukan kebutuhan terstruktur |
| US-P09 | Calon klien | Download katalog PDF | Bawa ke meeting offline |
| US-P10 | Calon klien | Hubungi via WhatsApp/email | Komunikasi langsung |
| US-P11 | Calon klien | Lihat testimoni klien | Validasi social proof |
| US-P12 | Calon klien | Browse di mobile | Akses kapan saja

### 3.2 Admin
| ID | Sebagai | Saya ingin | Supaya |
|----|---------|------------|--------|
| US-A01 | Admin | Login ke admin panel | Akses fitur kelola |
| US-A02 | Admin | Lihat dashboard statistik | Paham performa sistem |
| US-A03 | Admin | CRUD produk | Update katalog |
| US-A04 | Admin | Upload 3D model file | Tambah 3D viewer ke produk |
| US-A05 | Admin | Konfigurasi 3D viewer (highlights, camera) | Custom tampilan 3D |
| US-A06 | Admin | CRUD proyek portofolio | Update portofolio |
| US-A07 | Admin | CRUD services | Update layanan |
| US-A08 | Admin | CRUD testimonials | Update social proof |
| US-A09 | Admin | CRUD dynamic pages | Tambah halaman baru tanpa kode |
| US-A10 | Admin | Lihat inbox inquiry | Kelola lead masuk |
| US-A11 | Admin | Update status inquiry (new/contacted/quoted/won/lost) | Track pipeline |
| US-A12 | Admin | Edit site settings (contact, theme, social) | Update info perusahaan |
| US-A13 | Admin | Generate PDF katalog | Buat brosur terbaru |
| US-A14 | Admin | Manage user admin lain | RBAC |
| US-A15 | Admin | Logout | Keamanan session |

### 3.3 Super Admin
| ID | Sebagai | Saya ingin | Supaya |
|----|---------|------------|--------|
| US-S01 | Super admin | Assign role user | Kontrol akses |
| US-S02 | Super admin | Hapus user admin | Revoke akses |
| US-S03 | Super admin | Lihat audit log | Track perubahan |

## 4. Features (MoSCoW Prioritization)

### 4.1 Must Have (M) — wajib untuk KP
| ID | Feature | Epic |
|----|---------|------|
| F-M01 | Website publik (7 halaman existing) | Public |
| F-M02 | Katalog produk dinamis dari DB | Public |
| F-M03 | 3D viewer embed di produk | Public |
| F-M04 | Form inquiry publik | Public |
| F-M05 | Admin login (JWT) | Admin |
| F-M06 | Admin CRUD produk | Admin |
| F-M07 | Admin CRUD proyek | Admin |
| F-M08 | Admin inbox inquiry | Admin |
| F-M09 | RBAC (super_admin, admin, editor) | Admin |
| F-M10 | Supabase backend + RLS | Backend |
| F-M11 | Deploy VPS | DevOps |

### 4.2 Should Have (S) — penting tapi bisa phase 2
| ID | Feature | Epic |
|----|---------|------|
| F-S01 | Admin CRUD services | Admin |
| F-S02 | Admin CRUD testimonials | Admin |
| F-S03 | Admin site settings (contact, theme) | Admin |
| F-S04 | PDF catalog generator | Backend |
| F-S05 | Admin upload 3D model file | Admin |
| F-S06 | Admin konfigurasi 3D viewer | Admin |
| F-S07 | Screenshot 3D viewer | Public |
| F-S08 | Email notifikasi inquiry masuk | Backend |
| F-S09 | Admin dashboard statistik | Admin |

### 4.3 Could Have (C) — nice to have
| ID | Feature | Epic |
|----|---------|------|
| F-C01 | Admin CRUD dynamic pages | Admin |
| F-C02 | Audit log perubahan | Admin |
| F-C03 | Dark mode admin (tweakcn mono) | Admin |
| F-C04 | PWA (installable, offline) | Public |
| F-C05 | Search produk advanced (filter multi) | Public |
| F-C06 | Export inquiry ke CSV | Admin |
| F-C07 | Multi-photo per produk (gallery) | Admin |

### 4.4 Won't Have (W) — eksplisit di-exclude
| ID | Feature | Alasan |
|----|---------|--------|
| F-W01 | Payment gateway | Out of scope proposal |
| F-W02 | E-commerce cart | B2B contractor, bukan retail |
| F-W03 | User account publik | Tidak perlu, inquiry cukup |
| F-W04 | Multi-bahasa | Fokus ID untuk KP |
| F-W05 | Real-time chat | WhatsApp cukup |
| F-W06 | Mobile app native | PWA cukup |

## 5. Functional Requirements (Summary)

> Detail lengkap di [03-SRS.md](./03-SRS.md)

### 5.1 Public Module
- FR-PUB-01: Halaman Home menampilkan hero, stats, services, projects teaser, testimonials, CTA
- FR-PUB-02: Halaman About menampilkan profil, visi-misi, why us
- FR-PUB-03: Halaman Services menampilkan layanan konstruksi + penjualan, FAQ, partners
- FR-PUB-04: Halaman Projects menampilkan galeri + filter + modal detail
- FR-PUB-05: Halaman Catalog menampilkan grid produk + search + filter kategori
- FR-PUB-06: Halaman ProductDetail menampilkan 5 chapter (overview, preview, coverage, engineering, cta)
- FR-PUB-07: 3D viewer embed di ProductDetail (route /catalog/:slug/3d)
- FR-PUB-08: Halaman Contact menampilkan info kontak + form inquiry + map
- FR-PUB-09: Navbar sticky + mobile drawer + command palette (Cmd+K)
- FR-PUB-10: Footer dengan kontak, social, jam buka
- FR-PUB-11: Dark mode toggle
- FR-PUB-12: Smooth scroll (Lenis) + scroll progress

### 5.2 Admin Module
- FR-ADM-01: Login page (email + password)
- FR-ADM-02: Dashboard: stats card (produk, inquiry new, inquiry total, views)
- FR-ADM-03: Products list (table + search + filter + pagination)
- FR-ADM-04: Product create/edit form (name, slug, category, desc, specs, bullets, tags, 3D config, image)
- FR-ADM-05: Product delete (soft delete via published=false)
- FR-ADM-06: Projects CRUD (sama pattern produk)
- FR-ADM-07: Services CRUD
- FR-ADM-08: Testimonials CRUD
- FR-ADM-09: Inquiries inbox (table + filter status + detail drawer)
- FR-ADM-10: Inquiry status update (new → contacted → quoted → won/lost)
- FR-ADM-11: Site settings (company info, contact, theme, social)
- FR-ADM-12: User management (super_admin only): list, invite, assign role, deactivate
- FR-ADM-13: PDF generator trigger (button → progress → download link)
- FR-ADM-14: Logout

### 5.3 Backend Module
- FR-BE-01: Supabase Postgres schema (lihat 05-DATA_MODEL.md)
- FR-BE-02: RLS policies (public read published, admin write)
- FR-BE-03: Supabase Auth (email/password, JWT)
- FR-BE-04: Supabase Storage (buckets: 3d-models, product-images, pdf-catalogs)
- FR-BE-05: Supabase Edge Function: email notifikasi inquiry (Resend)
- FR-BE-06: Node service (VPS): PDF generator endpoint
- FR-BE-07: Node service: 3D asset serving (atau Supabase Storage langsung)

## 6. Non-Functional Requirements (Summary)

> Detail di [03-SRS.md](./03-SRS.md)

| ID | Kategori | Requirement |
|----|----------|-------------|
| NFR-01 | Performance | LCP < 2.5s mobile 4G |
| NFR-02 | Performance | TTI < 3.5s mobile 4G |
| NFR-03 | Performance | API response < 200ms p95 |
| NFR-04 | Performance | 3D viewer load < 3s (lazy) |
| NFR-05 | Security | JWT auth, RLS, HTTPS only |
| NFR-06 | Security | Input validation (zod), SQL injection prevention (Supabase parameterized) |
| NFR-07 | Reliability | Uptime >= 99.5% |
| NFR-08 | Usability | WCAG 2.1 AA |
| NFR-09 | Usability | Mobile-first responsive |
| NFR-10 | Maintainability | TypeScript strict, ESLint 0 error |
| NFR-11 | SEO | Lighthouse SEO >= 95, sitemap, JSON-LD |
| NFR-12 | Browser | Chrome 100+, Firefox 100+, Safari 15+, Edge 100+ |

## 7. UX Requirements

### 7.1 Public (teknomed-web existing)
- **Tone**: Medical authority — calm, professional, trustworthy
- **Color**: OKLCH blue family (primary #043962, secondary #7aaed6)
- **Typography**: Inter (body) + Plus Jakarta Sans (display) + Geist Mono (code)
- **Motion**: Subtle, premium (PREMIUM_EASE), reduced-motion compliant
- **Layout**: Left-aligned editorial, max-w-7xl, consistent py-14 lg:py-20
- **Reference**: Vaonis Hyperia, worldofnrg, EatNaked (toned down for medical)

### 7.2 Admin (tweakcn mono theme)
- **Tone**: Functional, dense, fast — bukan marketing
- **Color**: Monochrome (tweakcn mono: #737373 primary, #0a0a0a foreground)
- **Typography**: Geist Mono (semua) — vibe developer tool
- **Radius**: 0 (sharp corners)
- **Shadow**: None (flat)
- **Layout**: Sidebar + topbar + content, dense table, keyboard-friendly
- **Reference**: Linear, Vercel dashboard, shadcn/admin

## 8. Content Requirements

### 8.1 Konten Wajib (dari existing)
- 6 produk (MGPS, MOT, HVAC, E&M, Chiller, Consumables)
- 6 proyek (RSUD Ratulangi, Klinik Manado, RS Bethesda, Puskesmas, RS Kandou, RS Siloam)
- 6 services (Civil, Electrical, MOT, Mechanical, HVAC, Gas Medis)
- 4 testimonials (placeholder, ganti real)
- Company info (nama, alamat, kontak, jam buka, area layanan)

### 8.2 Konten Baru (perlu owner)
- Foto proyek asli (ganti Unsplash)
- Testimonial asli (ganti placeholder)
- 3D model files (.glb) untuk produk yang punya 3D
- Logo partner/vendor (jika ada)
- Sertifikasi (ISO, HTM, NFPA)

## 9. Analytics Requirements

- Google Analytics 4 (page views, events)
- Event tracking: 3D view open, inquiry submit, PDF download, CTA click
- Supabase: log inquiry count, admin action count
- Tidak ada analytics di admin panel (privacy)

## 10. Release Criteria (Definition of Done)

### 10.1 Must Have
- [ ] Semua F-M01 sampai F-M11 berfungsi
- [ ] Lighthouse Performance >= 90 mobile
- [ ] Lighthouse Accessibility >= 95
- [ ] 0 error di TSC + ESLint
- [ ] Build production sukses
- [ ] Deploy VPS live dengan HTTPS
- [ ] Admin bisa login + CRUD produk + lihat inquiry
- [ ] Publik bisa submit inquiry + lihat 3D
- [ ] Dokumentasi (BRD, PRD, SRS, SAD) lengkap

### 10.2 Should Have
- [ ] PDF generator berfungsi
- [ ] Email notifikasi inquiry
- [ ] Admin settings editable

## 11. Out of Scope untuk KP

Lihat [01-BRD.md section 8.2](./01-BRD.md#82-out-of-scope).

## 12. Open Questions

| ID | Pertanyaan | Status |
|----|------------|--------|
| Q-01 | Apakah 3D model files sudah ada atau harus dibuat? | Pending owner |
| Q-02 | Foto proyek asli kapan disediakan? | Pending owner |
| Q-03 | Testimonial asli dari siapa? | Pending owner |
| Q-04 | Berapa banyak admin user yang akan dibuat? | Pending owner |
| Q-05 | Domain DNS access bisa diberikan? | Pending owner |
| Q-06 | Budget VPS berapa per bulan? | Pending owner |
| Q-07 | Apakah perlu multi-bahasa di masa depan? | Pending owner |
