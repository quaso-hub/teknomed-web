# 01 — Business Requirements Document (BRD)

> **Project**: Teknomed Integrated System
> **Sponsor**: PT Teknomed Indo Timur
> **Author**: I Kadek Restu Nugraha (NIM 160422146)
> **Versi**: 1.0.0 — 2026-06-18

## 1. Executive Summary

PT Teknomed Indo Timur adalah medical contractor di Manado (berdiri 2021) yang
melayani konstruksi MEP, instalasi gas medis, HVAC, Modular Operating Theatre
(MOT), dan maintenance fasilitas kesehatan. Saat ini perusahaan memiliki tiga
aset digital terpisah yang belum terintegrasi: website company profile, aplikasi
3D product visualization, dan brosur katalog PDF statis.

BRD ini mendefinisikan kebutuhan bisnis untuk membangun sistem terintegrasi yang
menggabungkan ketiga aset menjadi satu platform dengan backend terpusat, admin
panel untuk manajemen konten mandiri, dan inquiry system untuk calon klien.

## 2. Business Context

### 2.1 Profil Perusahaan
- **Nama**: PT Teknomed Indo Timur
- **Berdiri**: 2021
- **Lokasi**: Manado, Sulawesi Utara
- **Area layanan**: Jawa Timur, Bali, NTB, NTT, Sulawesi
- **Pilar bisnis**: 5 (MEP, Gas Medis, HVAC/Cleanroom, MOT, Maintenance)
- **Klien target**: Rumah sakit, klinik, puskesmas, laboratorium

### 2.2 Aset Digital Existing
1. **teknomed-web** — SPA React 19, company profile + katalog (hardcoded data)
2. **3dproductvisualization** — App React 18 + R3F, 6+ produk 3D interaktif
3. **catalog-new** — Astro + paged.js, brosur PDF 55 halaman statis

### 2.3 Kondisi Saat Ini
- Website belum terintegrasi dengan informasi produk terbaru
- Tidak ada cara digital untuk calon klien mengajukan permintaan penawaran
- Komunikasi masih via email/WhatsApp tidak terstruktur
- Update konten katalog butuh edit manual file kode
- 3D viewer terpisah dari website utama

## 3. Problem Statement

Bagaimana merancang dan membangun sistem website perusahaan yang terintegrasi
dengan digital product catalog, 3D interactive viewer, inquiry system, dan
admin panel berbasis Role-Based Access Control (RBAC) untuk mendukung kegiatan
pemasaran PT Teknomed Indo Timur?

## 4. Business Objectives

| ID | Objective | Metric | Target |
|----|-----------|--------|--------|
| BO-01 | Integrasi 3 aset digital jadi 1 platform | Jumlah platform aktif | 1 (dari 3) |
| BO-02 | Admin kelola konten mandiri tanpa developer | % perubahan konten via admin panel | >= 90% |
| BO-03 | Inquiry system terstruktur | % inquiry masuk via form digital | >= 70% |
| BO-04 | 3D viewer accessible dari website utama | Conversion visitor → 3D view | >= 30% |
| BO-05 | PDF katalog generate otomatis dari data terkini | Waktu generate PDF | < 60 detik |
| BO-06 | RBAC untuk multi-user admin | Jumlah role terdefinisi | >= 3 (super_admin, admin, editor) |
| BO-07 | Performa website premium | Lighthouse Performance mobile | >= 90 |

## 5. Stakeholders

| Stakeholder | Role | Kepentingan |
|-------------|------|-------------|
| I Kadek Restu Nugraha | Developer + Mahasiswa KP | Eksekusi sistem, lulus KP |
| Dosen Pembimbing KP | Reviewer | Validasi akademik, kelengkapan dokumen |
| PT Teknomed (Owner) | Sponsor + User admin | Sistem jalan, mudah dikelola, dapat klien |
| Tim Sales Teknomed | User admin | Kelola inquiry, follow up cepat |
| Calon Klien (RS/Klinik) | End user publik | Informasi produk jelas, inquiry mudah |
| Tim Teknis Teknomed | User admin | Update produk, upload 3D asset |

## 6. Business Requirements (High-Level)

### BR-01: Website Publik Terintegrasi
Sistem HARUS menyediakan website publik yang menampilkan profil perusahaan,
layanan, portofolio proyek, dan katalog produk yang terintegrasi dengan 3D
viewer.

### BR-02: Admin Panel dengan RBAC
Sistem HARUS menyediakan admin panel dengan autentikasi JWT dan Role-Based
Access Control untuk pengelolaan konten produk, proyek, inquiry, dan
pengaturan situs.

### BR-03: Inquiry System
Sistem HARUS menyediakan form inquiry publik yang datanya tersimpan di
database terstruktur dan dapat dikelola admin.

### BR-04: 3D Interactive Viewer
Sistem HARUS mengintegrasikan 3D viewer ke halaman produk dengan fitur
assembled/exploded view, rotasi, zoom, dan screenshot.

### BR-05: PDF Catalog Generator
Sistem HARUS dapat generate katalog PDF otomatis dari data produk terkini
di database.

### BR-06: Dinamis (bukan hardcoded)
Konten publik HARUS bersifat dinamis: perubahan di admin panel tampil
real-time di website publik tanpa redeploy kode.

## 7. Success Metrics (KPI)

### 7.1 KPI Fungsional
- 100% produk di database tampil di website publik
- 100% inquiry masuk tersimpan di database + notifikasi admin
- 100% admin role dapat akses fitur sesuai permission
- PDF generate berhasil dalam 60 detik

### 7.2 KPI Non-Fungsional
- Lighthouse Performance >= 90 (mobile)
- Lighthouse Accessibility >= 95
- Uptime >= 99.5% (VPS)
- Rata-rata response time API < 200ms
- Time to Interactive (TTI) < 3.5 detik (mobile 4G)

### 7.3 KPI Bisnis
- Inquiry masuk meningkat 50% dalam 3 bulan pertama
- Waktu follow up inquiry < 24 jam
- Update konten tanpa developer: 100% (admin mandiri)

## 8. Scope

### 8.1 In Scope
- Website publik (company profile, services, projects, catalog, contact)
- 3D viewer integration (iframe micro-frontend)
- Admin panel (CRUD produk, proyek, services, testimonials, inquiries, settings)
- Inquiry system (form publik + admin inbox)
- PDF catalog generator (Node service + catalog-new)
- Backend (Supabase: Postgres + Auth + Storage + RLS)
- RBAC (super_admin, admin, editor, viewer)
- Deployment (VPS Hetzner/DO + Caddy + SSL)

### 8.2 Out of Scope
- Payment gateway / transaksi finansial
- E-commerce / keranjang belanja
- User account publik (hanya admin yang login)
- Mobile app native (PWA saja)
- Real-time chat (WhatsApp link cukup)
- Multi-bahasa (Indonesia saja untuk KP)
- Integrasi CRM pihak ketiga
- Analytics dashboard advanced (Google Analytics cukup)

## 9. Constraints

| ID | Constraint | Impact |
|----|------------|--------|
| C-01 | Timeline KP akademik (~2-3 bulan) | Prioritas Must-have dulu |
| C-02 | Budget hosting minimal | VPS murah + Supabase free tier |
| C-03 | 3 project existing harus dipertahankan | Integrasi via API/iframe, bukan rewrite |
| C-04 | Skill dev: React strong, backend limited | Pakai Supabase (BaaS) bukan custom backend |
| C-05 | 3D viewer pakai R3F, teknomed-web pakai three plain | Integrasi via iframe, bukan bundle |
| C-06 | Domain existing: teknomedindotimurpt.co.id | Subdomain untuk 3D + API |

## 10. Assumptions

- A-01: Supabase free tier cukup untuk traffic KP (500MB DB, 1GB storage, 50k MAU)
- A-02: VPS Hetzner CX22 (1 vCPU, 2GB RAM) cukup untuk PDF service + static serve
- A-03: 3D model files (.glb) tersedia atau bisa dibuat oleh tim Teknomed
- A-04: Foto proyek asli akan disediakan owner untuk Phase 5
- A-05: Owner bersedia assign minimal 1 orang sebagai admin (super_admin)
- A-06: Koneksi internet VPS stabil untuk akses Supabase cloud

## 11. Risks

| ID | Risk | Probability | Impact | Mitigation |
|----|------|-------------|--------|------------|
| R-01 | Supabase free tier habis di tengah KP | Medium | High | Monitor usage, upgrade ke Pro ($25/bln) kalau perlu |
| R-02 | 3D model files terlalu besar (>10MB) | Medium | Medium | Optimasi Draco compression, lazy load |
| R-03 | VPS down saat presentasi KP | Low | High | Backup di Cloudflare Pages, demo local |
| R-04 | RLS policy salah, data bocor | Medium | High | Test thorough, audit sebelum deploy |
| R-05 | PDF generation lambat/fail di VPS | Medium | Medium | Timeout 120s, fallback client-side |
| R-06 | Browser lama tidak support WebGL2 untuk 3D | Low | Medium | Detect + fallback image |
| R-07 | Owner tidak update konten setelah KP | Medium | Low | Training + dokumentasi user guide |

## 12. Dependencies

- D-01: Supabase account (gratis, daftar via GitHub)
- D-02: VPS Hetzner/DigitalOcean (butuh kartu kredit/PayPal)
- D-03: Domain teknomedindotimurpt.co.id (sudah ada, butuh DNS access)
- D-04: 3D model files dari tim Teknomed (format .glb/.gltf)
- D-05: Foto proyek asli dari owner
- D-06: Konten testimonial asli dari owner (sekarang placeholder)

## 13. Timeline High-Level

| Phase | Durasi | Deliverable |
|-------|--------|-------------|
| A. Supabase setup | 1-2 hari | Schema + RLS + storage + seed data |
| B. teknomed-web Supabase integration | 2-3 hari | Data dinamis, loading/error states |
| C. Admin panel | 3-5 hari | CRUD lengkap + auth + RBAC |
| D. 3D viewer integration | 2-3 hari | iframe embed + postMessage |
| E. Inquiry system | 1-2 hari | Form publik + admin inbox |
| F. PDF generator | 2-3 hari | Node service + Puppeteer |
| G. Polish + deploy | 2-3 hari | VPS live + SSL + backup |
| **Total** | **13-21 hari** | **Sistem live** |

Detail per phase lihat [06-ROADMAP.md](./06-ROADMAP.md).

## 14. Approval

| Role | Nama | Tanggal | Tanda Tangan |
|------|------|---------|--------------|
| Developer | I Kadek Restu Nugraha | 2026-06-18 | _pending_ |
| Dosen Pembimbing | _pending_ | _pending_ | _pending_ |
| Sponsor (Owner Teknomed) | _pending_ | _pending_ | _pending_ |
