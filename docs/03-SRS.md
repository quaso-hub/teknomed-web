# 03 — Software Requirements Specification (SRS)

> **Project**: Teknomed Integrated System
> **Versi**: 1.0.0 — 2026-06-18
> **Standar**: IEEE 830 + ISO/IEC 25010

## 1. Introduction

### 1.1 Purpose
Dokumen ini menspesifikasikan requirement software untuk sistem terintegrasi
PT Teknomed Indo Timur. Ditujukan untuk developer, QA, dan architect.

### 1.2 Scope
Sistem terdiri dari 3 komponen yang terintegrasi via Supabase:
1. **teknomed-web** (public SPA + admin panel)
2. **3dproductvisualization** (3D viewer, embed via iframe)
3. **catalog-new** (PDF generator service di VPS)

### 1.3 Definitions
| Istilah | Definisi |
|---------|----------|
| SPA | Single Page Application |
| R3F | React Three Fiber |
| RLS | Row Level Security (Supabase/Postgres) |
| RBAC | Role-Based Access Control |
| JWT | JSON Web Token |
| MVP | Minimum Viable Product |
| MoSCoW | Must / Should / Could / Won't |
| TTI | Time to Interactive |
| LCP | Largest Contentful Paint |

### 1.4 References
- [01-BRD.md](./01-BRD.md)
- [02-PRD.md](./02-PRD.md)
- [04-SAD.md](./04-SAD.md)
- [05-DATA_MODEL.md](./05-DATA_MODEL.md)
- Proposal KP I Kadek Restu Nugraha

## 2. Overall Description

### 2.1 Product Perspective
Sistem adalah integrasi 3 aplikasi existing + backend baru:

```
┌──────────────────────────────────────────────────────────┐
│                  teknomed-web (SPA)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   Public    │  │   Admin     │  │  3D Viewer      │  │
│  │   Routes    │  │   Routes    │  │  (iframe embed) │  │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘  │
└─────────┼────────────────┼──────────────────┼───────────┘
          │                │                  │
          │ Supabase JS    │ Supabase JS      │ iframe src
          ▼                ▼                  ▼
┌─────────────────────────────┐  ┌─────────────────────────┐
│      Supabase (cloud)       │  │  3dproductvisualization │
│  - Postgres + RLS           │  │  (React 18 + R3F)       │
│  - Auth (JWT)               │  │  Deploy subdomain       │
│  - Storage (3D, images, PDF)│  └─────────────────────────┘
│  - Edge Functions (email)   │
└──────────────┬──────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────┐
│              VPS (Hetzner/DO)                            │
│  - Node service: PDF generator (Puppeteer + catalog-new) │
│  - Nginx/Caddy: static serve SPA + 3D viewer             │
│  - Caddy: auto HTTPS reverse proxy                       │
└──────────────────────────────────────────────────────────┘
```

### 2.2 User Classes
| Class | Akses | Auth |
|-------|-------|------|
| Publik (anon) | Read published content, submit inquiry | Tidak ada |
| Editor | Read/write produk, proyek, inquiry | JWT + role=editor |
| Admin | Editor + settings + user management | JWT + role=admin |
| Super Admin | Admin + assign role + delete user | JWT + role=super_admin |

### 2.3 Operating Environment
- **Client**: Browser modern (Chrome 100+, Firefox 100+, Safari 15+, Edge 100+)
- **Mobile**: iOS Safari 15+, Android Chrome 100+
- **Server**: VPS Ubuntu 24.04 LTS, Node 20 LTS
- **DB**: Supabase Postgres 15 (cloud)
- **Storage**: Supabase Storage (S3-compatible)

## 3. Functional Requirements — Public Module

### FR-PUB-01: Home Page
**Priority**: Must
**Description**: Halaman utama menampilkan hero, stats, services, projects teaser, testimonials, CTA.
**Input**: Tidak ada (read-only)
**Output**: Rendered HTML dari data Supabase
**Rules**:
- Hero: CharReveal "PT Teknomed Indo Timur" + tagline + CTA email
- Stats: Counter animated (proyek, tahun, area)
- Services: 6 card grid (StaggerItem3D + TiltCard3D)
- Projects teaser: 1 CTA card ke /projects
- Testimonials: 4 card grid (EatNaked pattern)
- CTA: Gradient banner + email + WhatsApp
**Data**: `services`, `projects` (3 terbaru), `testimonials`, `site_settings`

### FR-PUB-02: About Page
**Priority**: Must
**Description**: Profil perusahaan, visi-misi, why us.
**Data**: `site_settings`, `services`

### FR-PUB-03: Services Page
**Priority**: Must
**Description**: Layanan konstruksi + penjualan, FAQ, partners.
**Data**: `services`, FAQ (hardcoded atau dari `pages`)

### FR-PUB-04: Projects Page
**Priority**: Must
**Description**: Galeri portofolio + filter kategori + modal detail.
**Input**: Filter (Semua/Konstruksi/Penjualan), click card → modal
**Output**: Grid filtered, modal dengan scope, tags, map embed
**Data**: `projects`
**Rules**:
- Filter: client-side (data kecil)
- Modal: createPortal, focus trap, ESC close, scroll lock
- Map: Google Maps embed via iframe

### FR-PUB-05: Catalog Page
**Priority**: Must
**Description**: Grid produk + search + filter kategori.
**Input**: Search query, filter kategori (Semua/Konstruksi/Penjualan)
**Output**: Filtered grid produk
**Data**: `products` (published=true)
**Rules**:
- Search: client-side, useDeferredValue + useTransition
- Filter: client-side
- Card: TiltCard3D + hover shine
- Click → /catalog/:slug

### FR-PUB-06: Product Detail Page
**Priority**: Must
**Description**: 5 chapter (overview, preview, coverage, engineering, cta) + TOC sticky.
**Input**: slug URL param
**Output**: Rendered product detail
**Data**: `products` by slug
**Rules**:
- TOC: sticky desktop sidebar + mobile horizontal pill
- IntersectionObserver: highlight active chapter
- "View 3D" button → /catalog/:slug/3d (if has_3d=true)
- 404 redirect ke /catalog jika slug tidak ditemukan

### FR-PUB-07: 3D Viewer Embed
**Priority**: Must
**Description**: Halaman full-screen embed 3D viewer via iframe.
**Input**: slug URL param
**Output**: iframe 3D viewer + close button
**Rules**:
- Route: /catalog/:slug/3d
- iframe src: `${VITE_3D_VIEWER_URL}/?product=${slug}`
- postMessage: close viewer → navigate(-1)
- Loading state: skeleton saat iframe load
- Fallback: jika has_3d=false, redirect ke /catalog/:slug

### FR-PUB-08: Contact Page
**Priority**: Must
**Description**: Info kontak + form inquiry + map.
**Input**: Form inquiry (company, person, email, phone, product, message)
**Output**: Submit ke Supabase `inquiries` + toast sukses
**Validation**:
- company: required, min 3 char
- person: required, min 3 char
- email: required, valid email
- phone: optional, numeric + format ID
- product: optional, enum dari products
- message: required, min 10 char
**Rules**:
- Submit → Supabase insert → toast → reset form
- Error → toast error + keep form data
- Honeypot field anti-spam

### FR-PUB-09: Navbar
**Priority**: Must
**Description**: Sticky navbar + mobile drawer + command palette.
**Rules**:
- Desktop: nav links + theme toggle + Cmd+K
- Mobile: hamburger → drawer (focus trap)
- Scrolled: shrink + shadow
- Command palette: Cmd+K/Ctrl+K, search nav + actions

### FR-PUB-10: Footer
**Priority**: Must
**Description**: Kontak, social, jam buka, area layanan.
**Data**: `site_settings`

### FR-PUB-11: Dark Mode
**Priority**: Must
**Description**: Toggle theme (light/dark) + persist localStorage.
**Rules**:
- Default: system preference
- Toggle: button di navbar
- Persist: localStorage `teknomed-theme`
- Apply: class `.dark` di html

### FR-PUB-12: Smooth Scroll
**Priority**: Must
**Description**: Lenis smooth scroll + scroll progress bar.
**Rules**:
- Lenis: smooth scroll desktop + mobile
- Scroll progress: top bar
- Route progress: top bar saat route change
- Reduced motion: disable Lenis

## 4. Functional Requirements — Admin Module

### FR-ADM-01: Login
**Priority**: Must
**Input**: email, password
**Output**: JWT session + redirect /admin
**Rules**:
- Supabase Auth signInWithPassword
- Error: toast "Email atau password salah"
- Success: redirect /admin
- Protected route: cek session, redirect /admin/login jika belum

### FR-ADM-02: Dashboard
**Priority**: Should
**Description**: Stats card (produk total, inquiry new, inquiry total, views bulan ini).
**Data**: aggregate dari Supabase
**Rules**:
- 4 stat card + 1 chart (inquiry per bulan, recharts)
- Recent inquiries (5 terbaru)

### FR-ADM-03: Products List
**Priority**: Must
**Description**: Table produk + search + filter + pagination.
**Input**: search, filter category, page
**Output**: Table (name, category, status, 3D, updated_at, actions)
**Rules**:
- Pagination: 10 per page
- Search: name, slug
- Sort: by updated_at desc default
- Actions: edit, delete (soft), view

### FR-ADM-04: Product Create/Edit
**Priority**: Must
**Input**: Form fields (name, slug auto from name, category, desc, summary, specs[], bullets[], tags[], has_3d, viewer_config, image, published)
**Output**: Insert/update Supabase
**Validation**: zod schema
**Rules**:
- Slug: auto-generate dari name, editable, unique check
- Specs/bullets/tags: dynamic array (add/remove)
- Image: upload ke Supabase Storage `product-images`
- 3D config: JSON editor atau form (modelPath, highlights[], cameraDefault)
- Published: toggle (default true)
- Auto redirect ke list setelah save

### FR-ADM-05: Product Delete
**Priority**: Must
**Input**: Confirm dialog
**Output**: Soft delete (published=false) ATAU hard delete (super_admin only)
**Rules**:
- Default: soft delete (published=false)
- Super admin: option hard delete
- Confirm dialog: "Yakin hapus [name]?"

### FR-ADM-06 to FR-ADM-08: Projects/Services/Testimonials CRUD
**Priority**: Should
**Pattern**: Sama dengan Products, beda fields

### FR-ADM-09: Inquiries Inbox
**Priority**: Must
**Description**: Table inquiry + filter status + detail drawer.
**Input**: filter status (new/contacted/quoted/won/lost), page
**Output**: Table (company, person, product, status, created_at, actions)
**Rules**:
- Click row → drawer detail (full inquiry data)
- Status update: dropdown di drawer
- Export CSV (Could have)

### FR-ADM-10: Inquiry Status Update
**Priority**: Must
**Input**: inquiry_id, new_status
**Output**: Update Supabase
**Rules**:
- Status: new → contacted → quoted → won/lost
- Toast sukses
- Auto timestamp updated_at

### FR-ADM-11: Site Settings
**Priority**: Should
**Description**: Edit company info, contact, theme, social.
**Input**: Form (company_name, tagline, description, contact{}, address{}, hours{}, service_areas[], theme{}, social{})
**Output**: Update `site_settings` table (id=1)
**Rules**:
- Single row (id=1)
- Theme: color picker untuk primary, secondary, accent
- Auto-rebuild CSS variables di public (real-time)

### FR-ADM-12: User Management
**Priority**: Should (super_admin only)
**Description**: List admin users + invite + assign role + deactivate.
**Rules**:
- Invite: Supabase Auth admin.createUser
- Role: update `profiles` table
- Deactivate: Supabase Auth admin.updateUser (ban)

### FR-ADM-13: PDF Generator
**Priority**: Should
**Description**: Trigger generate PDF katalog.
**Input**: Button click
**Output**: Progress → download link
**Rules**:
- Call Node service: POST /api/pdf/generate (JWT verified)
- Node service: fetch data Supabase → render Astro template → Puppeteer PDF → upload Storage
- Progress: polling status atau SSE
- Result: link download dari Storage

### FR-ADM-14: Logout
**Priority**: Must
**Rules**: Supabase Auth signOut → redirect /admin/login

## 5. Functional Requirements — Backend Module

### FR-BE-01: Supabase Schema
Lihat [05-DATA_MODEL.md](./05-DATA_MODEL.md).

### FR-BE-02: RLS Policies
Lihat [05-DATA_MODEL.md](./05-DATA_MODEL.md).

### FR-BE-03: Auth
- Provider: email/password
- JWT: Supabase default (access + refresh token)
- Session: persist di localStorage + cookie
- Password reset: Supabase Auth resetPasswordForEmail

### FR-BE-04: Storage
- Bucket `3d-models`: public read, admin write
- Bucket `product-images`: public read, admin write
- Bucket `pdf-catalogs`: public read, admin write
- Rules: max 50MB per file (3D), 5MB (image), 100MB (PDF)

### FR-BE-05: Edge Function — Email Notification
**Trigger**: insert ke `inquiries` table
**Action**: kirim email ke admin via Resend
**Rules**:
- Supabase Edge Function (Deno)
- Resend API key di Supabase secrets
- Email: subject "Inquiry Baru dari [company]", body inquiry detail

### FR-BE-06: Node Service — PDF Generator
**Endpoint**: POST /api/pdf/generate
**Auth**: JWT verification (Supabase JWT secret)
**Process**:
1. Verify JWT + role (admin/editor/super_admin)
2. Fetch all published products dari Supabase
3. Render Astro template (catalog-new) dengan data baru
4. Puppeteer launch → goto rendered HTML → PDF
5. Upload PDF ke Supabase Storage `pdf-catalogs`
6. Return { url, size, generatedAt }
**Timeout**: 120 detik
**Error**: 500 dengan message

### FR-BE-07: 3D Asset Serving
- Model files (.glb) di Supabase Storage `3d-models`
- Public read URL: `https://[project].supabase.co/storage/v1/object/public/3d-models/[path]`
- 3D viewer fetch via Supabase JS client (anon key)

## 6. Non-Functional Requirements

### 6.1 Performance (ISO 25010 — Performance Efficiency)
| ID | Requirement | Metric |
|----|-------------|--------|
| NFR-PERF-01 | LCP public pages | < 2.5s mobile 4G |
| NFR-PERF-02 | TTI public pages | < 3.5s mobile 4G |
| NFR-PERF-03 | API response p95 | < 200ms |
| NFR-PERF-04 | 3D viewer load (lazy) | < 3s |
| NFR-PERF-05 | PDF generation | < 60s |
| NFR-PERF-06 | Bundle main JS | < 300KB gzip |
| NFR-PERF-07 | Bundle main CSS | < 70KB gzip |
| NFR-PERF-08 | Lighthouse Performance mobile | >= 90 |
| NFR-PERF-09 | Image optimization | WebP/AVIF, lazy load |
| NFR-PERF-10 | Font loading | preload + display=swap |

### 6.2 Security (ISO 25010 — Security)
| ID | Requirement |
|----|-------------|
| NFR-SEC-01 | HTTPS only (Caddy auto SSL, HSTS) |
| NFR-SEC-02 | JWT auth untuk admin, refresh token rotation |
| NFR-SEC-03 | RLS di semua table (no public write kecuali inquiries insert) |
| NFR-SEC-04 | Input validation (zod) di form + API |
| NFR-SEC-05 | SQL injection prevention (Supabase parameterized queries) |
| NFR-SEC-06 | XSS prevention (React default escape, no dangerouslySetInnerHTML) |
| NFR-SEC-07 | CSRF: SameSite cookie + custom header untuk API |
| NFR-SEC-08 | Rate limit inquiry submit (5/menit/IP) |
| NFR-SEC-09 | Honeypot field di inquiry form |
| NFR-SEC-10 | Secret management: Supabase secrets + VPS env vars (not in git) |
| NFR-SEC-11 | Audit log (Could have): log admin actions |
| NFR-SEC-12 | Password policy: min 8 char, Supabase default |

### 6.3 Reliability (ISO 25010 — Reliability)
| ID | Requirement |
|----|-------------|
| NFR-REL-01 | Uptime VPS >= 99.5% |
| NFR-REL-02 | Supabase SLA: 99.9% (cloud) |
| NFR-REL-03 | Backup Supabase: daily automatic |
| NFR-REL-04 | Backup VPS: weekly (manual atau cron) |
| NFR-REL-05 | Error boundary: graceful fallback, no white screen |
| NFR-REL-06 | Retry API: 3x dengan exponential backoff |
| NFR-REL-07 | Offline fallback: cached data + service worker (PWA Could) |

### 6.4 Usability (ISO 25010 — Usability)
| ID | Requirement |
|----|-------------|
| NFR-USA-01 | WCAG 2.1 AA compliance |
| NFR-USA-02 | Keyboard navigation lengkap (Tab, Enter, ESC, arrow) |
| NFR-USA-03 | Focus trap di modal/drawer/palette |
| NFR-USA-04 | Screen reader: ARIA labels, semantic HTML |
| NFR-USA-05 | Color contrast: AA (4.5:1 normal, 3:1 large) |
| NFR-USA-06 | Mobile-first responsive (320px - 1920px) |
| NFR-USA-07 | Touch target: min 44px |
| NFR-USA-08 | Reduced motion: respect prefers-reduced-motion |
| NFR-USA-09 | Loading state: skeleton (route-aware) |
| NFR-USA-10 | Error state: friendly message + retry |

### 6.5 Maintainability (ISO 25010 — Maintainability)
| ID | Requirement |
|----|-------------|
| NFR-MAINT-01 | TypeScript strict mode |
| NFR-MAINT-02 | ESLint 0 error, 0 warning |
| NFR-MAINT-03 | Prettier formatting |
| NFR-MAINT-04 | Component modular (< 300 baris per file) |
| NFR-MAINT-05 | DRY: shared components di src/components |
| NFR-MAINT-06 | Single source of truth: data di Supabase, types di src/types |
| NFR-MAINT-07 | Documentation: README + docs/ + inline JSDoc untuk util |
| NFR-MAINT-08 | Git: conventional commits, PR review |

### 6.6 Portability (ISO 25010 — Portability)
| ID | Requirement |
|----|-------------|
| NFR-PORT-01 | Browser: Chrome 100+, Firefox 100+, Safari 15+, Edge 100+ |
| NFR-PORT-02 | Mobile: iOS Safari 15+, Android Chrome 100+ |
| NFR-PORT-03 | Node 20 LTS (VPS service) |
| NFR-PORT-04 | Container-ready (bisa Dockerize VPS service) |

### 6.7 SEO
| ID | Requirement |
|----|-------------|
| NFR-SEO-01 | Lighthouse SEO >= 95 |
| NFR-SEO-02 | Meta tags per page (title, description, OG, Twitter) |
| NFR-SEO-03 | Sitemap.xml dynamic dari products/pages |
| NFR-SEO-04 | robots.txt |
| NFR-SEO-05 | JSON-LD: Organization, LocalBusiness, Product, BreadcrumbList |
| NFR-SEO-06 | Semantic HTML (h1-h6, nav, main, section, article) |
| NFR-SEO-07 | Alt text semua image |
| NFR-SEO-08 | Canonical URL |

## 7. External Interface Requirements

### 7.1 User Interfaces
- Public: teknomed-web (React SPA)
- Admin: teknomed-web /admin (React SPA, tweakcn mono theme)
- 3D: 3dproductvisualization (React SPA, embed iframe)

### 7.2 Hardware Interfaces
- Tidak ada (web-based)

### 7.3 Software Interfaces
| Interface | Protocol | Purpose |
|-----------|----------|---------|
| Supabase Postgres | HTTPS (REST/Realtime) | Data CRUD |
| Supabase Auth | HTTPS | JWT auth |
| Supabase Storage | HTTPS (S3-compatible) | File upload/download |
| Supabase Edge Function | HTTPS | Email notification |
| Node PDF Service | HTTPS | PDF generation |
| Resend API | HTTPS | Email sending |
| Google Maps | iframe embed | Location display |
| Google Fonts | HTTPS | Font loading |

### 7.4 Communication Interfaces
- HTTPS (TLS 1.3) untuk semua external
- WebSocket (Supabase Realtime) untuk admin realtime update (Could)
- postMessage (iframe communication parent-child 3D viewer)

## 8. System Constraints

- C-01: Timeline KP ~2-3 bulan
- C-02: Budget hosting minimal (VPS $5-10/bln + Supabase free)
- C-03: 3 project existing harus dipertahankan (no rewrite)
- C-04: 3D viewer pakai R3F, teknomed-web pakai three plain (isolasi via iframe)
- C-05: Domain teknomedindotimurpt.co.id (DNS access terbatas)

## 9. Data Requirements

Lihat [05-DATA_MODEL.md](./05-DATA_MODEL.md) untuk schema lengkap.

## 10. Acceptance Criteria per Feature

> Format: Given [context] When [action] Then [expected]

### AC-PUB-08: Inquiry Submit
```
Given calon klien di halaman /contact
When isi form (company=RS Test, person=dr. Test, email=test@rs.com, message=Test inquiry) dan klik Submit
Then form validate, insert ke Supabase inquiries, toast "Inquiry terkirim", form reset
And admin terima email notifikasi
```

### AC-ADM-04: Product Create
```
Given admin login di /admin/products/new
When isi form (name=Test Product, category=Konstruksi, desc=Test, published=true) dan klik Save
Then product insert ke Supabase, redirect /admin/products, product tampil di list
And product tampil di /catalog publik (karena published=true)
```

### AC-PUB-07: 3D Viewer
```
Given calon klien di /catalog/mgps
When klik "View 3D"
Then navigate ke /catalog/mgps/3d
And iframe load 3D viewer dengan product=mgps
And 3D model render, user bisa rotate/zoom/exploded
When klik close (X)
Then navigate back ke /catalog/mgps
```

## 11. Open Issues

Lihat [02-PRD.md section 12](./02-prd.md#12-open-questions).
