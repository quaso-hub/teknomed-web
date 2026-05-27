# PLAN.md - Teknomed Web 3D Premium Direction

> Living plan untuk transformasi teknomed-web jadi pengalaman premium dengan kualitas referensi: World of NRG, Vaonis Hyperia, Shader.se, Digitalists.at, EatNaked.co.
>
> Dibuat: 2026-05-27. Update terakhir: 2026-05-27.
> Status repo saat plan ini dibuat: commit 739ea6a (clean checkpoint), main branch.
> Pasangan dokumen: HANDOFF.md (konteks bisnis + arsitektur), PLAN.md (file ini, prioritas eksekusi).

---

## 0. TL;DR

- Repo sudah di clean checkpoint setelah komit besar UI/UX rebuild. Lint, type, build hijau.
- Sesi ini menambahkan referensi kualitas tinggi yang harus jadi standar visual baru:
  worldofnrg, hyperia, shader.se, digitalists.at, eatnaked.
- Plan ini mengelompokkan pekerjaan jadi 6 fase terurut, masing-masing dengan akseptansi
  dan budget bundle yang jelas. Fase 1 dan 2 wajib diselesaikan sebelum eksperimen 3D
  besar agar fondasi tidak retak saat kompleksitas naik.
- Risiko terbesar: cursor: none global di index.css, Lenis + iframe Maps, dan biaya
  WebGL second viewer di Hero. Plan ini meredam ketiganya di Fase 1.

---

## 1. Snapshot Status (per 2026-05-27)

### 1.1 Verified hijau
- TypeScript: 0 error
- ESLint: 0 error, 0 warning
- Vite build: 595 ms, 0 error
- 7 routes terdaftar, ProductDetail lazy chunk 543 kB / 137 kB gzip

### 1.2 Sudah ada (uncommitted di sesi sebelumnya, sekarang sudah committed)
- Komponen QoL: BackToTop, ScrollProgress, RouteProgressBar, CommandPalette, Toast
- Smooth scroll: SmoothScrollProvider via Lenis
- Cursor: CustomCursor di Motion.tsx
- Motion primitives: CharReveal, ClipReveal, ScaleReveal, HorizontalScrollSection,
  MarqueeTrack, ViewParallax (di samping primitives lama)
- Data layer: src/types, src/config/site.ts, src/data/{products,projects,services,stats}
- Hooks: useScrollTo, useHotkey
- 3D viewer per produk di /catalog/:slug (Three.js procedural, lazy-loaded)
- Shader baru di src/shaders/meshGradient.{vert,frag}.glsl + komponen NoiseMeshGradient
  (file sudah ada tapi BELUM dipakai di mana pun)

### 1.3 Bermasalah laten yang harus dirapikan duluan
1. cursor: none di index.css adalah global, mengganggu form input dan touch coexistence.
2. Lenis bisa ganggu iframe Maps di Projects modal dan Contact (lihat utility
   .lenis-smooth iframe { pointer-events: none }). Modal sudah pasang stop overflow
   tapi belum disconnect Lenis saat modal terbuka.
3. Projects.tsx pakai inline style besar sementara codebase lain Tailwind utility,
   inkonsisten dengan rest of pages.
4. Stats di Home.tsx duplicate dengan src/data/stats.ts yang belum dipakai.
5. Bundle main 277 kB / 87 kB gzip masih bisa dipangkas (Lucide tree-shake bisa
   dilanjut, beberapa motion primitive tidak dipakai semua route).
6. NoiseMeshGradient menambah 0.5 MB Three.js cost kalau dipakai di Hero, harus
   dipertimbangkan vs canvas gradient CSS yang sudah cukup smooth.

### 1.4 Masih TODO dari HANDOFF asli (Section 11) yang belum dikerjakan
- Replace approximate Google Maps coordinates dengan koordinat exact
- Cleanup src/assets/react.svg dan src/assets/hero.png jika confirmed unused
- Replace dummy Unsplash project photos dengan foto asli
- Real glTF models untuk replace procedural 3D
- Real backend untuk Contact form
- Sitemap.xml + robots.txt + JSON-LD structured data
- A11y audit dengan screen reader

### 1.5 Yang dijanjikan di Section 16 HANDOFF tapi belum tuntas
- Wiring komponen baru ke App.tsx: sudah jadi, tapi cursor: none global belum
  dibatasi ke desktop dengan cursor fine.
- Sticky TOC untuk ProductDetail: belum ada.
- Loading state refinements (hero skeleton, card skeleton, 3D skeleton): hanya
  generic PageSkeleton.
- Form UX contact (inline validation): belum ada validation, masih mailto biasa.
- Extract constants lain ke src/data/: stats sudah, services sudah, sisanya belum.
- Marquee logo / social proof: belum ada section khusus.

