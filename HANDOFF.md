# Teknomed Web - Cross-Session Handoff

> Dokumen tunggal untuk handoff ke sesi AI lain (atau project lain yang akan saling-konek).
> Tujuan: sesi penerima bisa baca file ini sekali dan langsung paham konteks bisnis,
> arsitektur teknis, keputusan desain, dan status kerja saat ini.
>
> Update terakhir: 2026-05-25
> Lokasi repo: `D:\playgrounds\teknomed-web`
> Branch: `main` (banyak file modified, belum di-commit setelah `init project`)

---

## 0. TL;DR untuk Sesi Penerima

- Ini **website corporate** untuk **PT Teknomed Indo Timur** (medical contractor, Manado).
- Dibangun dari **WordPress legacy** (Phlox Pro + Elementor di `teknomedindotimurpt.co.id`)
  yang di-rebuild jadi **React 19 + Vite 8 + Tailwind v4** (BUKAN porting source WP).
- Nanti akan **terhubung ke 2 project lain** (lihat Section 12). Project ini berperan sebagai
  **public-facing marketing + product catalog**, dengan opsi konek ke backend di project lain.
- Stack final dipilih: lightweight, no backend, no CMS, semua data hardcoded di TS constants.
  Ini **disengaja** supaya bisa di-host static (Vercel/Netlify/CDN apapun) tanpa dependency.
- 3D viewer di `/catalog/:slug` sudah live (Three.js procedural, lazy-loaded).
- **Sesi ini: fokus intensif UI/UX polish, QoL features, dan advanced interactions.**
  Command palette (Cmd+K), back-to-top, scroll progress, toast system, dan data layer abstraction
  sedang di-implement untuk kualitas pengalaman premium.

---

## 1. Identitas Bisnis

**Nama legal**: PT Teknomed Indo Timur
**Brand alternatif (untuk product line MOT)**: Elfatech
**Posisi pasar**: Medical contractor (konstruksi + sales + maintenance)
**Berdiri**: 2021
**HQ**: Manado, Sulawesi Utara
**Alamat**: Perumahan Tamansari Metropolitan, Cluster Lihaga, Ruko No.19,
Paniki Bawah, Mapanget, Manado 95256
**Email**: teknomedindotimurpt@gmail.com (primary)
*Catatan*: WP legacy pakai `tmit2024@teknomedindotimurpt.co.id`. Yang aktif sekarang gmail.
**Telepon/WA**: +62 812-4436-0317
**Area layanan**: Jawa Timur, Bali, NTB, NTT, Sulawesi
**Domain produksi WP lama**: https://www.teknomedindotimurpt.co.id (masih hidup, jadi referensi
konten + design tokens)

### Lini bisnis (5 pillar)
1. **Konstruksi MEP** (Mechanical, Electrical, Plumbing) untuk fasyankes
2. **Instalasi Gas Medis** (MGPS - O2, N2O, Vacuum, Compressed Air)
3. **HVAC & Cleanroom** (Air Handling Unit, ducting, HEPA, balancing)
4. **Modular Operating Theatre (MOT)** - product line "Elfatech"
5. **Maintenance** & sales consumables/spare parts

---

## 2. Stack Teknis (locked-in, jangan diubah tanpa diskusi)

| Aspect | Pilihan | Alasan |
|---|---|---|
| Framework | React 19.2 + TypeScript 5.9 | Latest stable, server components TIDAK dipakai (pure SPA) |
| Bundler | Vite 8 (rolldown-based) | Fastest, plugin Tailwind native, build < 1s |
| Routing | react-router-dom 7 | Pakai BrowserRouter (bukan data router) - simpel |
| Styling | Tailwind CSS v4 | CSS-first (`@import "tailwindcss"`), no postcss config, no tailwind.config.js |
| Animasi | motion v12 (rebrand dari framer-motion) | API mirip framer, lebih kecil |
| 3D | three 0.183 + @types/three | Pakai langsung, BUKAN React Three Fiber |
| Icons | lucide-react 1.6 | Tree-shakeable, satu chunk per icon |
| Utility | clsx + tailwind-merge -> `cn()` helper | Standard shadcn pattern |
| State | useState/useContext only | Tidak perlu Zustand/Redux - data hardcoded |
| Backend | TIDAK ADA | Mailto link untuk contact, semua data static TS |
| Lint | ESLint 9 flat config + typescript-eslint | Cukup |
| Test | TIDAK ADA setup | Belum diperlukan, semua deterministik |

**Build commands (PowerShell-safe, pakai `;` bukan `&&`)**:
```
npm run dev                  # Vite dev server
npx tsc --noEmit             # Type check (PENTING: tanpa argumen file, biar baca tsconfig)
npx eslint src/              # Lint
npx vite build               # Production build
```

**Quirk Windows**: `npx vite build` kadang gagal `EPERM` saat dev server lain masih hold
file di `dist/`. Workaround:
```powershell
if (Test-Path 'dist') { Rename-Item 'dist' "dist_old_$([guid]::NewGuid().ToString('N').Substring(0,6))" -Force }
npx vite build
```

---

## 3. Struktur Repo

```
teknomed-web/
├─ HANDOFF.md                    <- DOKUMEN INI (root)
├─ TEKNOMED_WEBSITE_ANALYSIS.md  <- analisis WP legacy (sumber design tokens & IA)
├─ DO_NOT_UPLOAD.md              <- catatan internal, tidak dibaca tooling
├─ README.md                     <- default Vite README, BELUM digarap
├─ index.html                    <- meta tags lengkap (OG, Twitter, theme-color, preconnect fonts)
├─ package.json                  <- 13 deps, 9 devDeps
├─ vite.config.ts                <- 8 baris, hanya plugin react+tailwind
├─ tsconfig.{json,app,node}.json <- strict, verbatimModuleSyntax: true
├─ eslint.config.js              <- flat config
├─ public/
│  ├─ logo_pt.png                <- logo PT (navbar + footer + apple-touch-icon)
│  ├─ favicon.svg                <- biru #043962, "PT" putih
│  └─ icons.svg                  <- (unused, sisa scaffold)
├─ logo/                         <- asset master logo (di-gitignore? cek)
├─ arahan/                       <- 2 file MD export ChatGPT (sejarah perintah, ~1MB each)
├─ .kiro/                        <- konfigurasi Kiro IDE (lsp.json), aman diabaikan
├─ skills/                       <- skill library lokal, BUKAN bagian app
├─ scientific-skills/            <- skill library lokal, BUKAN bagian app
├─ dist/                         <- build output (gitignored)
└─ src/
   ├─ main.tsx                   <- React root: BrowserRouter > ThemeProvider > AppMotionProvider > App
   ├─ App.tsx                    <- shell: RouteProgressBar + Navbar + Suspense + AnimatedRoutes + Footer
   ├─ index.css                  <- design tokens (light/dark), skeleton shimmer, perf utilities
   ├─ assets/                    <- react.svg, hero.png (kemungkinan unused, candidate cleanup)
   ├─ components/
   │  ├─ Container.tsx           <- max-w-7xl wrapper
   │  ├─ Section.tsx             <- section dengan opsional eyebrow/title/description + FadeLine
   │  ├─ Navbar.tsx              <- sticky, blur, mobile drawer, theme toggle, active highlight
   │  ├─ Footer.tsx              <- info perusahaan, kontak, jam buka
   │  ├─ Motion.tsx              <- 12 motion primitives (lihat Section 6)
   │  ├─ RouteProgressBar.tsx    <- gradient bar di top tiap route change
   │  ├─ ThemeProvider.tsx       <- dark/light + persist localStorage + sync prefers-color-scheme
   │  ├─ theme-context.ts        <- context types + useTheme hook (split file biar fast refresh aman)
   │  ├─ Product3DViewer.tsx     <- Three.js procedural 3D, theme-reactive, lazy chunk
   │  └─ ui/
   │     ├─ Badge.tsx            <- named + default export
   │     ├─ Button.tsx           <- named + default export
   │     ├─ Card.tsx             <- Card + Header/Content/Footer/Title/Description
   │     ├─ Skeleton.tsx         <- Skeleton + CardSkeleton + PageSkeleton (shimmer)
   │     └─ Grid.tsx             <- responsive grid wrapper
   ├─ pages/
   │  ├─ Home.tsx                <- hero (SpotlightSection + WordReveal + TiltCard) + stats + services
   │  ├─ About.tsx               <- profile + visi/misi + whyUs (3 card)
   │  ├─ Services.tsx            <- konstruksi vs penjualan, workflow steps, CTA
   │  ├─ Projects.tsx            <- filter tabs + project grid (TiltCard) + modal foto + Maps embed
   │  ├─ Catalog.tsx             <- search (useDeferredValue) + filter (useTransition) + grid produk
   │  ├─ Contact.tsx             <- contact cards + Maps embed + mailto form
   │  └─ ProductDetail.tsx       <- product detail + 3D viewer interaktif
   └─ lib/
      ├─ utils.ts                <- cn() = twMerge(clsx(...))
      └─ useDocumentTitle.ts     <- per-page document.title hook
```

### File yang dibuat/diubah dari template Vite default
- `src/App.css` -> DIHAPUS (tidak terpakai)
- `src/assets/vite.svg` -> DIHAPUS
- `package.json` -> +tailwind, +react-router-dom, +motion, +three, +lucide-react, +clsx, +tailwind-merge
- `vite.config.ts` -> +tailwindcss plugin
- `eslint.config.js` -> +ignores dist
- `index.html` -> meta tags lengkap

---

## 4. Routing & Halaman

```
/                       Home          - PT Teknomed Indo Timur
/about                  About         - Tentang Kami
/services               Services      - Layanan
/projects               Projects      - Proyek
/catalog                Catalog       - Katalog
/catalog/:slug          ProductDetail - {nama produk}
/contact                Contact       - Kontak
*                       Navigate to / - fallback
```

Routing pattern: **lazy + Suspense + AnimatePresence**. Setiap page dynamic-import untuk
code splitting. Skeleton fallback `PageSkeleton` saat loading.

Page transition: fade + slide 16px (in 0.35s, out 0.2s, easeIn). Dijalankan oleh
`AnimatePresence mode="wait"` di `App.tsx` dengan key=pathname.

`RouteProgressBar` (top of viewport): gradient bar tipis sweep kiri-kanan setiap route change,
inspirasi NProgress tapi pure motion.

### Dynamic title
`useDocumentTitle(title)` di tiap page. Format: `{Page} | PT Teknomed Indo Timur`.
Untuk ProductDetail: `{product.name} | PT Teknomed Indo Timur`.

---

## 5. Design System

### 5.1 Filosofi
- **Sumber kebenaran tunggal**: CSS variables di `src/index.css`, BUKAN tailwind.config
  (Tailwind v4 CSS-first).
- **Color rule**: jangan pakai Tailwind arbitrary classes (`bg-[#043962]`) untuk theme color.
  Selalu `style={{ color: 'var(--tm-primary)' }}` atau `className="bg-[var(--tm-primary)]"`.
  Alasan: agar dark mode otomatis terbawa.

### 5.2 Tokens (light mode default)
```
--tm-primary:        #043962  (dark navy, brand utama)
--tm-primary-strong: #022440
--tm-secondary:      #7aaed6
--tm-accent:         #1d4f7a
--tm-footer:         #031a2e
--tm-page:           oklch(0.985 0.003 250)
--tm-surface:        #ffffff
--tm-surface-strong: oklch(0.975 0.003 250)
--tm-surface-muted:  oklch(0.955 0.003 250)
--tm-surface-active: oklch(0.920 0.005 250)
--tm-border:         oklch(0.870 0.008 250)
--tm-text:           oklch(0.205 0.01 250)
--tm-text-strong:    oklch(0.145 0.01 250)
--tm-text-on-muted:  oklch(0.300 0.008 250)
--tm-muted:          oklch(0.420 0.01 250)
--tm-on-primary:     #ffffff
```

### 5.3 Tokens (dark mode, `.dark` di `<html>`)
```
--tm-primary:        #2d7ab8  (bukan #043962 - terlalu gelap di bg dark, gagal AA)
--tm-primary-strong: #7fbfea  (light blue untuk text on dark surface)
--tm-accent:         #5ba3d9
--tm-page:           oklch(0.145 0.005 250)
--tm-surface:        oklch(0.195 0.008 250)
--tm-on-primary:     #ffffff
```

**Sumber tokens**: di-derive dari custom.css WP legacy (`#022A4D` primary, `#98BCDC`
secondary, `#052542` accent, `#002240` footer). Disesuaikan untuk OKLCH + dark mode.

### 5.4 Typography
- **Body**: Inter (variable, opsz 14..32, weight 400-700 + italic 400)
- **Display**: Plus Jakarta Sans (500-800)
- **Mono**: Geist Mono (400-500)
- Loaded via Google Fonts `@import` di `index.css` + preconnect di `index.html`.
- *Catatan*: WP legacy pakai Poppins + Montserrat. Diganti karena Inter lebih neutral
  dan optical sizing-nya mantap.

### 5.5 Hardcoded color rules (corner cases)
- White text on primary background: gunakan literal `#ffffff` (bukan var)
- Dark text on white inverted button: literal `#043962`
- CTA gradient: `linear-gradient(135deg, var(--tm-primary) 0%, var(--tm-accent) 60%, var(--tm-footer) 100%)`
- CTA dengan gradient HARUS pakai `<div style={{background: ...}}>` BUKAN `<Card className="bg-[...]">`
  karena Card punya bg default yang override.

### 5.6 Em dash policy
**Zero em dashes** di seluruh codebase (`-` atau `-`). Pakai hyphen biasa atau koma.
Alasan: konsistensi visual + bahasa Indonesia jarang pakai em dash.

---

## 6. Komponen Motion (`src/components/Motion.tsx`)

Semua animasi sentralisasi di sini. 12 primitives:

| Komponen | Fungsi | Dipakai di |
|---|---|---|
| `AppMotionProvider` | wrap motion config (reduced motion, transition default) | main.tsx |
| `Reveal` | fade + slide masuk on scroll | semua pages |
| `Stagger` + `StaggerItem` | parent + child orchestration | hero, grid lists |
| `FloatCard` | spring hover lift (translate Y) | hero panel, about cards |
| `MagneticWrap` | element tertarik ke cursor | CTA primary buttons |
| `Counter` | animasi angka count-up on viewport entry | stats section Home |
| `ParallaxBg` | bg translate Y based on scroll | (dipakai sparingly) |
| `FadeLine` | horizontal rule scale-X on scroll | divider Section component |
| `WordReveal` | per-kata blur-in stagger | hero paragraph |
| `TiltCard` | 3D perspective tilt follow cursor | service cards, project cards |
| `SpotlightSection` | radial gradient follow cursor | hero section |
| `TextScramble` | TIDAK DIPAKAI (terlalu epileptic untuk medical brand) | - |

`prefers-reduced-motion` di-respect: semua animasi otomatis non-aktif jika user opt out.

---

## 7. Three.js Integration (`src/components/Product3DViewer.tsx`)

**Status**: live, lazy-loaded, dipanggil dari `ProductDetail.tsx`.

### Arsitektur
- **Single component** (~620 baris) yang menerima `slug` prop
- **Per-slug procedural builders** (function dictionary) -> tiap product punya scene unik
- **Theme-reactive**: baca `useTheme()`, palette berubah saat dark/light toggle
- **Performance-aware**:
  - `IntersectionObserver` -> auto-pause render saat off-screen
  - `prefers-reduced-motion` -> matikan auto-rotate + fan spin
  - `ResizeObserver` -> handle container size change tanpa window listener
  - `setPixelRatio(min(devicePixelRatio, 2))` -> cap retina cost
- **Dispose-safe**: traverse scene, dispose geometry + material, remove canvas dari DOM
  saat unmount (no memory leak antar route)
- **OrbitControls**: damping 0.08, polar clamped (mencegah look-from-below), no pan,
  auto-rotate 0.6 speed

### Procedural scenes per slug
| Slug | Scene |
|---|---|
| `mgps` | 4 jalur pipa gas medis (warna konvensi: putih O2, biru air, gelap vacuum, kuning N2O) di wall plate, masing-masing 3 valve handle + outlet drop |
| `mot` | Ruang OT mini: lantai + 3 dinding modular dengan seam panel, meja operasi + kolom + base, surgical light dome dengan emissive bulb, ceiling vent |
| `hvac-cleanroom` | AHU body dengan ribs + fan housing dengan 6 blade berputar, ducting dengan flanges, diffuser + louvers, HEPA filter glow (emissive) |
| `electrical-mechanical` | Panel cabinet + door + hinges + glass window (MeshPhysicalMaterial transmission), 24 breakers grid, 3 LED indicator (hijau/kuning/merah emissive), conduit pipes |
| `radiology-chiller` | Chassis + skirt + top louvers miring + front grille slats, 2 fan rings dengan blade berputar, brand strip |
| `consumables-spareparts` | Pallet kayu + 5 box konsumabel dengan label patches, cylindrical filter dengan ridges + cap |

### Cara swap ke real model glTF
```ts
// di Product3DViewer.tsx, ganti baris ini:
getBuilder(slug)(subject, palette)

// menjadi:
const loader = new GLTFLoader()
const gltf = await loader.loadAsync(`/models/${slug}.glb`)
subject.add(gltf.scene)
```

Drop GLB ke `public/models/` dan kompres dengan draco/meshopt jika > 1MB.

### Bundle impact
- ProductDetail page chunk: 7.6 kB (small)
- Product3DViewer chunk: 543 kB raw / 136 kB gzip
- TIDAK loaded di route lain (verified di build output)

---

## 8. Pages Detail

### 8.1 Home
- Hero: badge "Medical Contractor" + h1 + paragraph (WordReveal) + 2 CTA (Magnetic primary)
- SpotlightSection wrap hero (cursor-follow gradient)
- 3 Stats counters: Project completed, Tahun pengalaman, Area layanan
- Service grid: 6 services (Civil, MEP, MOT, HVAC, Gas Medis, Maintenance) sebagai TiltCard
- CTA banner di bawah

### 8.2 About
- Profile narrative (berdiri 2021)
- Visi card (Compass icon) + Misi card (FileCheck2 icon)
- Why Us 3-card: Track Record (ClipboardList), Tim (Users), Quality (ShieldCheck)

### 8.3 Services
- Tabs/section: KONSTRUKSI vs PENJUALAN
- Workflow 4-step: Konsultasi -> Desain -> Eksekusi -> Maintenance
- CTA contact

### 8.4 Projects
- Filter tabs: All / Konstruksi / Sales (gunakan `useTransition` untuk smooth)
- Scope category icons: Tata Udara, Gas Medis, Ruangan, Bangunan
- Area pills: Jawa Timur, Bali, NTB, NTT, Sulawesi
- Grid TiltCard
- Modal: hero foto + gradient overlay, meta, highlight quote, scope grid, tags, Google Maps iframe, CTA + Maps button
- Project data structure:
  ```ts
  { id, title, subtitle, category, area, year, scope: string[], tags: string[],
    highlight: string, imageUrl: string (Unsplash medical), mapQuery: string }
  ```

### 8.5 Catalog
- Search input dengan `useDeferredValue` (non-blocking filter)
- Category filter dengan `useTransition` + opacity feedback saat pending
- Grid produk dengan slug
- 6 produk:
  - `mgps` - Medical Gas Pipeline System
  - `mot` - Modular Operating Theatre
  - `hvac-cleanroom` - HVAC & Cleanroom
  - `electrical-mechanical` - Electrical & Mechanical
  - `radiology-chiller` - Radiology Room Chiller
  - `consumables-spareparts` - Consumables & Spare Parts

### 8.6 ProductDetail
- Layout 2 kolom (lg+)
- Kiri: Card dengan badges, judul, summary, tag chips, bullet cakupan layanan, CTA mailto + konsultasi
- Kanan: 3D viewer (lazy) dengan badge "Interactive 3D" + hint controls + info card di bawah
- Fallback Suspense: pulse pill "Memuat 3D viewer"

### 8.7 Contact
- Contact cards (alamat, telepon, email, jam buka)
- Google Maps embed (koordinat approximate Manado area)
- Mailto-based form (no backend)

---

## 9. Performance Optimizations

| Optimization | File | Impact |
|---|---|---|
| Route code splitting | `App.tsx` lazy() | Per-page chunk, main bundle ~243 kB |
| Three.js isolated chunk | `ProductDetail` -> lazy `Product3DViewer` | 3D cost only paid di `/catalog/:slug` |
| `useDeferredValue` | Catalog search | Non-blocking input |
| `useTransition` | Catalog filter | Smooth tab switch dengan pending UI |
| `content-visibility: auto` | `.cv-auto` di Section | Skip rendering off-screen sections |
| `contain: layout style paint` | `.perf-card` | Isolate paint layer per card |
| `prefers-reduced-motion` | global CSS + Motion.tsx + Product3DViewer | Disable semua animasi |
| `IntersectionObserver` pause | Product3DViewer | Pause RAF saat off-screen |
| `setPixelRatio` cap 2 | Product3DViewer | Hindari over-render di 4K screen |
| Min touch target 44px | `@media (pointer: coarse)` | Mobile usability |
| Font preconnect | index.html | TTI improvement |

---

## 10. Build Output (Bukti Verifikasi Terakhir)

```
dist/index.html                             2.53 kB
dist/assets/index-CSS                      63.85 kB / 10.97 kB gzip
dist/assets/index-MAIN-JS                 243.07 kB / 77.55 kB gzip
dist/assets/createLucideIcon              161.29 kB / 52.38 kB gzip
dist/assets/Product3DViewer-CHUNK         543.66 kB / 136.65 kB gzip   (lazy)
dist/assets/Home                            9.93 kB
dist/assets/About                           6.04 kB
dist/assets/Services                        6.07 kB
dist/assets/Projects                       17.47 kB
dist/assets/Catalog                         9.91 kB
dist/assets/ProductDetail                   7.59 kB
dist/assets/Contact                         8.36 kB
+ 10 chunks kecil per icon Lucide
Total build time: ~600ms
```

Semua check hijau:
- `npx tsc --noEmit` -> 0 errors
- `npx eslint src/` -> 0 warnings
- `npx vite build` -> success

---

## 11. Status Kerja & Decision Log

### Done
- [x] Setup Vite + React 19 + Tailwind v4
- [x] Theme system (light/dark dengan OKLCH)
- [x] Routing 7 halaman + lazy + AnimatePresence transitions
- [x] Design tokens dari WP legacy (warna + typography)
- [x] 12 motion primitives di Motion.tsx
- [x] Hero dengan WordReveal + Spotlight + Magnetic + Stagger
- [x] Per-page document title
- [x] Mobile drawer navbar + theme toggle
- [x] Projects modal dengan Google Maps embed
- [x] Catalog dengan useDeferredValue + useTransition
- [x] Skeleton shimmer untuk loading states
- [x] Three.js procedural 3D viewer per-slug (6 scenes)
- [x] HANDOFF.md (file ini)

### TODO (prioritized)
- [ ] **Commit current state** - banyak file modified belum di-commit setelah `init project`
- [ ] Replace approximate Google Maps coordinates dengan koordinat exact alamat
- [ ] Cleanup `src/assets/react.svg` dan `src/assets/hero.png` jika confirmed unused
- [ ] Replace dummy Unsplash project photos dengan foto asli
- [ ] (Optional) Real glTF models untuk replace procedural 3D
- [ ] (Optional) Real backend untuk Contact form (saat ini mailto)
- [ ] (Optional) Sitemap.xml + robots.txt + JSON-LD structured data
- [ ] (Optional) A11y audit (focus rings sudah ada, tapi belum tested dengan screen reader)

### Decisions yang DISENGAJA (jangan diubah tanpa diskusi)
1. **No backend**: tetap static SPA. Bisa di-host di mana saja.
2. **Hardcoded data di TS constants**: bukan JSON di `public/`, supaya type-safe.
3. **Tailwind v4 tanpa config file**: pakai `@theme` block di CSS.
4. **CSS variables untuk theme color**: bukan Tailwind config color, supaya dark mode otomatis.
5. **motion (bukan framer-motion)**: rebrand resmi, lebih kecil, API sama.
6. **three plain (bukan @react-three/fiber)**: dependency lebih sedikit, viewer self-contained.
7. **No state library**: useState/useContext cukup untuk app scale ini.
8. **Em dash diharamkan**: konsistensi.
9. **Per-page title via hook**: bukan react-helmet, biar tidak nambah dependency.
10. **PT logo PNG di public**: sumber tunggal, dipakai favicon + apple-touch + navbar + footer.

### Bugs yang sudah di-fix di handoff sebelumnya
- `Section.title` prop dibuat optional (sebelumnya required, blank di Projects/Catalog)
- `Badge` dan `Button` di-export dual (named + default) karena pages import-nya beda gaya
- Dark mode primary `#1a5fa8` -> `#2d7ab8` (gagal AA)
- Catalog input lag saat ketik banyak data -> `useDeferredValue`
- Card default bg override CTA gradient -> ganti ke `<div style={{background}}>`

---

## 12. Cross-Project Connection (Penting untuk Sesi Penerima)

Project ini akan **konek dengan 2 project lain**. Konteks koneksi:

### Pola koneksi yang mungkin (perlu konfirmasi user)
1. **Project lain adalah backend/CMS** -> teknomed-web jadi consumer (fetch produk, project, dll)
2. **Project lain adalah dashboard internal** -> ada link cross-domain dari teknomed-web
3. **Project lain adalah portfolio personal owner** -> embed referensi/case study

### Contract API yang sudah siap di-consume (jika project lain jadi backend)
Saat ini semua data hardcoded di TS files. Kalau mau migrate ke API, target endpoints:
- `GET /api/products` -> array `{ slug, name, summary, bullets[] }`
- `GET /api/products/:slug` -> single product
- `GET /api/projects` -> array (lihat structure di Section 8.4)
- `GET /api/projects/:id` -> single project
- `POST /api/contact` -> form submission (replace mailto)

### Hal yang perlu di-share antar project
- **Brand tokens**: warna `#043962`, font Inter + Plus Jakarta Sans
- **Logo asset**: `public/logo_pt.png`
- **Company info constants**: alamat, email, phone, area layanan
- **TypeScript types**: definisi `Product`, `Project`, `ContactForm` (saat ini inline di pages,
  bisa dipindah ke `src/types/` jika project lain mau share)

### Saran untuk sesi penerima
- Jika project lain pakai stack berbeda (Next.js, Nest.js, Prisma, dll), tetap **konsisten**
  pakai brand tokens di atas.
- Jika perlu single source of truth untuk data perusahaan, pertimbangkan extract ke
  package terpisah (`@teknomed/brand`, `@teknomed/types`) di monorepo. Tapi untuk sekarang
  scale belum perlu.

---

## 13. Reference Files (urutkan baca jika ingin deep dive)

1. **`HANDOFF.md`** (file ini) - one-shot context
2. **`TEKNOMED_WEBSITE_ANALYSIS.md`** - analisis WP legacy, sumber design tokens & IA
3. **`src/index.css`** - design tokens lengkap (light + dark)
4. **`src/App.tsx`** - shell + routing
5. **`src/components/Motion.tsx`** - kalau mau pahami animation system
6. **`src/components/Product3DViewer.tsx`** - kalau touch 3D viewer
7. **`src/pages/Home.tsx`** - representative page (paling kompleks layout-wise)
8. **`arahan/*.md`** - 2 file export ChatGPT (~1MB each), berisi sejarah perintah & diskusi.
   *Catatan*: hanya baca jika butuh konteks historis spesifik. Mostly outdated.

---

## 14. Quick-Start Sesi Baru

```powershell
# 1. Clone / cd
cd D:\playgrounds\teknomed-web

# 2. Install (sekali saja)
npm install

# 3. Verify health
npx tsc --noEmit
npx eslint src/
npx vite build

# 4. Dev
npm run dev
# Buka http://localhost:5173
```

Kalau ada error EPERM saat build, lihat Section 2 (rename dist trick).

---

## 15. Kontak & Owner

- **Owner repo**: pemilik, fungsi sebagai contractor langsung untuk PT Teknomed
- **Sesi AI sebelumnya**: kerja inkremental via OpenCode CLI dengan model claude-opus-4.7
- **Sesi penerima**: silakan pakai HANDOFF.md ini sebagai source of truth.
  Jika ada kontradiksi antara HANDOFF.md dan kode, **kode menang** (HANDOFF mungkin lag).
- Jika user bilang "lanjut yang sebelumnya", merujuk ke list TODO di Section 11.

---

---

## 16. Sesi Ini: UI/UX Polish + QoL + Foundation untuk 2 Project

> **Fokus sesi saat ini** (dimulai 2026-05-25): intensif UI/UX/frontend improvement
> untuk mengangkat kualitas pengalaman pengguna ke standard premium enterprise.
> Bukan feature baru bisnis — semua di bawah ini adalah quality of life, visual polish,
> dan architectural preparation agar nanti koneksi ke 2 project lain seamless.

### 16.1 Komponen Baru yang Sedang Dibangun

| Komponen | File | Fungsi | Status |
|---|---|---|---|
| `BackToTop` | `src/components/BackToTop.tsx` | Button sticky bottom-right dengan SVG progress ring saat scroll | ✅ Done |
| `ScrollProgress` | `src/components/ScrollProgress.tsx` | Thin progress bar pinned top saat scroll halaman | ✅ Done |
| `CommandPalette` | `src/components/CommandPalette.tsx` | Cmd+K navigation overlay (fuzzy search, keyboard nav) | ✅ Done |
| `ToastProvider` + `useToast` | `src/components/Toast.tsx` | Toast notification system (success/error/warning/info) | ✅ Done |
| `useScrollTo` | `src/hooks/useScrollTo.ts` | Smooth scroll helper (selector/number/top) | ✅ Done |
| `useHotkey` | `src/hooks/useHotkey.tsx` | Global keyboard shortcut registration | ✅ Done |
| `Badge` (enhanced) | `src/components/Badge.tsx` | Badge variants: default/outline/secondary/accent/success/warning/danger + size variants | ✅ Done |

### 16.2 Data Layer Abstraction (Foundation untuk 2 Project)

File baru yang memisahkan **data** dari **presentasi** — ini kunci untuk reuse
antar-project dan nanti bisa diganti dengan API call tanpa menyentuh komponen UI.

| File | Konten |
|---|---|
| `src/types/index.ts` | Shared TypeScript interfaces: `Service`, `Product`, `Testimonial`, `Project`, `FAQ`, `NavLink` |
| `src/data/services.ts` | Service catalog constants (6 services, icon mapping) |
| `src/data/stats.ts` | Homepage statistics constants (3 counter items) |

### 16.3 Navbar Enhancement (In Progress)

Menambahkan ke `Navbar.tsx`:
- **Command palette trigger** (Cmd+K icon button)
- **Search toggle** untuk mobile (search icon expand input)
- Improved mobile drawer UX (focus trap, ESC key)

### 16.4 App.tsx Wiring (Plan — belum dieksekusi)

Komponen baru perlu di-wire ke `App.tsx`:
- `<ScrollProgress />` (pinned top, selalu mount saat scroll > 0)
- `<BackToTop />` (floating, z-50)
- `<CommandPalette />` (portal ke body, controlled via hotkey)
- `<ToastProvider>` (wrap app, context provider)

### 16.5 Next Steps untuk Sesi Penerima

Prioritas UI/UX/QoL yang masih pending:

1. **Wire komponen di App.tsx** — langkah pertama saat melanjutkan sesi
2. **Navbar polish** — selesaikan tambahan command palette icon + search toggle + notification badge untuk mobile responsive
3. **Toast integration** — tambahkan `useToast()` di pages untuk feedback actions (e.g. "Copied to clipboard", form submit confirmation)
4. **Scroll-triggered animations** — tambahkan `ScrollReveal` wrapper ke section-section yang belum pakai
5. **Marquee / Logo section** — sosmed links, client logos (Jika perlu social proof)
6. **Sticky TOC untuk ProductDetail** — table of contents yang follow scroll untuk katalog produk
7. **Loading state refinements** — skeleton khusus per section (hero skeleton, card skeleton, 3D skeleton)
8. **Form UX contact** — inline validation, auto-fill dari 2 project nanti jika ada shared user data
9. **Extract constants lain** — duplicate data di pages (`Home.tsx`, `Services.tsx`, etc.) ekstrak ke `src/data/`
10. **Create shared config** — `src/config/site.ts` untuk company info (nama, alamat, kontak yang sekarang hardcoded di Footer/Navbar/Contact)

### 16.6 Design Decisions Sesi Ini (Simpan)

1. **Keep motion primitives**: semua animasi tetap di `Motion.tsx` — tidak split.
   Komponen baru (BackToTop, CommandPalette) pakai `motion/react` langsung
   (bukan via Motion.tsx) karena mereka self-contained dan tidak perlu reuse pattern.
2. **Toast posisi bottom-center**: lebih aksesibel di mobile daripada top-right.
3. **Command palette fuzzy search**: sederhana, `toLowerCase().includes()` —
   tidak perlu Fuse.js untuk scale ini.
4. **Data layer pakai TS modules**: bukan JSON fetch, supaya build tetap static
   dan tidak perlu runtime network request.
5. **Types folder**: sudah dibuat untuk shared contracts — ini fondasi monorepo types.

---

*Dokumen ini ditulis untuk minimum redundancy + maximum signal. Tidak ada filler.
Update dokumen ini setiap kali ada arsitektur change atau decision baru.*
## 17. Sesi Penerima: State Saat Ini (2026-05-27)

> Section ini ditulis di akhir sesi. Inti: tahu apa yang baru, apa yang perlu
> dibaca selanjutnya, apa yang sengaja di-pause.

### 17.1 Apa yang baru dari Section 16
- Lint, type, build hijau di commit 481de8e (main).
- 13 ESLint error dari section 16 sudah dibereskan: CommandPalette
  use-before-declare diperbaiki dengan useCallback + atomic state reset di
  open(); Motion HorizontalScrollSection useTransform-in-callback diekstrak ke
  HScrollDot subcomponent; Toast useToast dipindah ke toast-context.ts supaya
  fast-refresh aman.
- Cursor: rule global cursor: none di index.css dihapus. Native cursor balik.
  CustomCursor jadi accent dot 8px opacity 0.55, mixBlendMode multiply.
- 3D viewer di /catalog/:slug DI-PAUSE: ProductDetail sekarang render
  placeholder gradient dengan icon Move3d + copy "3D experience coming soon".
  File Product3DViewer.tsx tetap ada di src/components/, tinggal di-rewire
  saat fase 4 plan.
- Bundle: ProductDetail 7.18 kB (turun dari 7.6), Three.js chunk hilang dari
  graph (tidak ada route yang panggil), main CSS turun 63 -> 55 kB.
- File baru: PLAN.md di root. Berisi 6 fase eksekusi + research findings
  dari 5 site referensi.
- .gitignore tambah dist_old_*/, .kiro/, logo/, opencode-b-opus.cmd.

### 17.2 Yang harus dibaca sesi penerima
1. PLAN.md (root) - prioritas eksekusi 6 fase + research synthesis.
2. HANDOFF.md section 0-16 - konteks bisnis + arsitektur + history.
3. src/components/Motion.tsx - 16 motion primitives (lihat list di section 6).
4. src/index.css - design tokens + animations + utility classes.
5. src/data/projects.ts dan src/data/products.ts - data shape untuk Catalog
   dan Projects.

### 17.3 Yang sengaja di-pause (jangan diaktifkan tanpa diskusi)
- Product3DViewer.tsx import. Sudah dibuang dari ProductDetail. File tetap
  ada untuk re-wire nanti.
- NoiseMeshGradient.tsx + shader file. Sudah di-write tapi tidak di-import
  dari mana pun. Aktifkan kalau fase 4 putuskan Hero butuh shader background.
- HorizontalScrollSection di Home untuk Services. Sudah aktif, tapi pertimbangkan
  apakah sesuai dengan brand medical (saran PLAN: re-evaluate di fase 3).

### 17.4 Referensi visual baru yang harus jadi standar
1. https://worldofnrg.com - card-based topical explorer + video micro-content
2. https://vaonis.com/pages/product/hyperia - chapter-scroll product page
3. https://www.shader.se - self-aware studio voice
4. https://digitalists.at - cursor identity + word-by-word reveal
5. https://eatnaked.co - metric-driven storytelling

Sintesis lengkap di PLAN.md section 2.

### 17.5 Quick context untuk pertanyaan umum
- "Cursor hilang?" Sudah balik. Section 17.1.
- "3D viewer kemana?" Di-pause sampai fase 4. Section 17.1 dan PLAN section 3.
- "Mau tambah feature X?" Cek dulu PLAN.md, masuk fase berapa? Kalau belum di
  list, append ke section 1.5 (TODO HANDOFF) atau ke fase yang relevan.
- "Build error setelah git pull?" Lihat HANDOFF section 2 (build commands +
  EPERM workaround).
- "Mau ganti warna brand?" src/index.css :root + .dark blocks. Token, bukan
  hex langsung di komponen.

### 17.6 Commit history singkat sesi 2026-05-27
- 739ea6a feat: full UI/UX rebuild - components, motion primitives, data layer, QoL
- 481de8e fix(ux): restore native cursor and pause 3D viewer with placeholder

---

## 18. Sesi Penerima: State Saat Ini (2026-05-28)

> Section ini ditulis di akhir sesi 2026-05-28. Semua fase 1-4 selesai.
> Sesi ini fokus pada: Phase 4 completion + bug fixes + 3D vibe upgrade dari 5 referensi.

### 18.1 Commit history sesi 2026-05-28
- 9d2c3e7 feat(phase-1): foundation hardening complete
- c26f893 feat(phase-2): page consistency pass - validation, TOC, route skeletons
- 7aac403 feat(phase-3): visual identity layer - cursor/word/prefix/easing
- 6ed057c fix(critical): RWD layout, marquee dedup, dark theme tokens, z-index ladder
- ab07ea5 feat(phase-4): premium style polish - glass card, ambient icons, markers rail, gradient border, ease audit
- fa03a28 fix(ux): mobile chapter nav, dark-mode shadow tokens, ease consistency
- b4a974b feat(ux): navbar editorial redesign, mobile chapter nav fix, lenis scroll lock, marquee full-width, shadow tokens
- 58717ad feat(3d-vibe): NRG text wipe, EatNaked glassmorphism CTA, Vaonis perspective card, depth shadows

### 18.2 File baru yang ditambahkan sesi ini
- `src/components/AmbientIcons.tsx` - 6 floating medical/MEP SVG icons di Hero, parallax scroll
- `src/components/MarkersRail.tsx` - animated SVG vertical rail + wave morph di ProductDetail
- `PLAN_PHASE4_REVISED.md` - revised Phase 4 plan (web-wide premium, bukan 3D product viewer)

### 18.3 Perubahan signifikan
1. **Navbar** - editorial redesign: index prefix (01-06), animated active pill (layoutId),
   theme toggle dengan AnimatePresence rotate, mobile drawer dengan numbered nav items.
2. **CommandPalette** - Lenis stop/start saat modal buka/tutup (fix scroll-behind-modal).
3. **ProductDetail** - MobileChapterNav: sticky horizontal pill strip di mobile (top-14).
4. **Home Hero** - text-wipe animation (NRG), glassmorphism CTA (EatNaked),
   perspective-card + shadow-depth pada hero right card (Vaonis).
5. **Card.tsx** - variant="glass" prop: backdrop-blur + rgba bg.
6. **MarqueeTrack** - w-full fix untuk desktop centering.
7. **Shadow tokens** - semua rgba(0,0,0) hardcode diganti ke var(--shadow-*) tokens.
8. **index.css** - tambah: .text-wipe, .cta-glass, .perspective-card, .shadow-depth.

### 18.4 Yang masih pending (Phase 5+)
Per PLAN.md:
- **Phase 5**: foto proyek asli, koordinat Maps, sitemap.xml, JSON-LD, meta per page
- **Phase 6**: backend integration, cross-project connection

### 18.5 Quick context
- "Navbar index prefix?" Digitalists pattern. Lihat Navbar.tsx navItems array.
- "text-wipe gak jalan?" Cek browser support @property CSS. Fallback: text-shimmer.
- "cta-glass warnanya?" Pakai var(--tm-primary) via ::before pseudo. Tidak hardcode hex.
- "AmbientIcons terlalu ramai?" Turunkan opacity di ICONS array di AmbientIcons.tsx.
- "MarkersRail tidak muncul?" Hanya di lg: breakpoint. Mobile pakai MobileChapterNav pills.
- "Phase 5 mulai dari mana?" Foto proyek dulu - ganti Unsplash URL di src/data/projects.ts.

---

## 20. Sesi Penerima: State Saat Ini (2026-05-28 lanjutan 2)

### 20.1 Commit history sesi ini
- 82df053 fix(ux): modal center fix, mobile nav fixed position, area pills centered, cta-glass text force white
- 8d49113 feat(wow): CSS hero mesh bg animated, fix modal scroll/center, mobile nav fixed, area pills centered
- 084e3be fix(colors): pill-fg glassmorphism white, Badge/Button explicit white text, CardDescription token fix

### 20.2 Fixes kritis sesi ini
1. **Projects modal** — `items-start overflow-y-auto pt-[8vh]` + `data-lenis-prevent` pada overlay. Modal sekarang selalu visible dari posisi scroll manapun.
2. **Mobile chapter nav ProductDetail** — ganti `sticky` ke `fixed top-14` dengan spacer div. Tidak lagi ketutupan saat scroll.
3. **Projects area pills** — `justify-center`, hapus label "Area" dan angka index.
4. **Hero background** — CSS animated mesh gradient (`hero-mesh-bg`) dengan `@property` animation. Zero bundle cost, shader.se feel.
5. **Color audit lengkap** — semua issues ditemukan dan fixed:
   - `--tm-pill-fg` di gradient CTA → `rgba(255,255,255,0.15)` glassmorphism + `color: #ffffff`
   - `CardDescription` `--tm-text-on-muted` orphan token → `--tm-muted`
   - `Button` secondary `--tm-on-surface` → `--tm-text-strong`
   - `Badge` default `--tm-on-primary` → explicit `text-white`

### 20.3 3D Primitives yang sudah live di Motion.tsx
- `StaggerItem3D` — Z-axis fly-in (NRG)
- `ScrollTiltCard` — scroll-driven tilt (Vaonis)
- `DepthReveal` — depth entrance blur+scale (EatNaked)
- Applied ke: Home, About, Services, Catalog, Projects

### 20.4 Yang masih pending
- Phase 5: foto proyek asli, sitemap.xml, JSON-LD, meta per page
- Phase 6: backend integration, cross-project connection
- User masih melaporkan ada beberapa button biru tulisan hitam — sudah difix semua yang ditemukan via audit. Jika masih ada, perlu screenshot spesifik dari user.

---

## 19. Sesi Penerima: State Saat Ini (2026-05-28 lanjutan)

### 19.1 Commit history sesi ini (lanjutan dari section 18)
- 5bd64a6 fix(ux): projects redesign editorial, modal lenis scroll, marquee NRG style, command palette scroll fix
- b9bf592 feat(3d): StaggerItem3D, ScrollTiltCard, DepthReveal - scroll-driven 3D from Vaonis/NRG/EatNaked
- 9bd61c9 feat(3d): apply StaggerItem3D + DepthReveal to About, Services, Catalog pages

### 19.2 3D Primitives baru di Motion.tsx
| Component | Pattern dari | Behavior |
|---|---|---|
| `StaggerItem3D` | NRG card grid | Elements fly in dari Z-axis: scale 0.85 + rotateX 12 + blur 4px → normal |
| `ScrollTiltCard` | Vaonis Hyperia | Card tilt driven by scroll position (bukan mouse) — rotateX berubah saat scroll |
| `DepthReveal` | EatNaked/Digitalists | Section entrance: scale 0.9 + y 40 + blur 12px + rotateX 8 → normal |

### 19.3 Fixes sesi ini
- **CommandPalette**: `data-lenis-prevent` + `overscroll-contain` pada ul list — scroll di dalam modal sekarang jalan
- **Projects modal**: `data-lenis-prevent` pada motion.div modal — scroll di dalam modal jalan
- **Marquee**: hapus manual duplicate `[...areas, ...areas]`, biarkan MarqueeTrack handle. NRG editorial style: index prefix + uppercase + ✦ separator + fade edges
- **Projects page**: redesign editorial — Digitalists chapter prefix, image card dengan hover scale, compact stats bar, area pills horizontal

### 19.4 Pages yang sudah pakai 3D primitives
- Home: StaggerItem3D (services), ScrollTiltCard (stats + services), DepthReveal (stats)
- About: StaggerItem3D, DepthReveal
- Services: StaggerItem3D, DepthReveal
- Catalog: StaggerItem3D
- Projects: redesign editorial + modal scroll fix

### 19.5 Yang masih pending
- Button biru tulisan hitam: user melaporkan ada tapi belum bisa diidentifikasi page-nya. Perlu user kasih tau di page mana.
- Phase 5: foto proyek asli, sitemap, JSON-LD, meta per page
