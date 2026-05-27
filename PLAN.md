# PLAN.md - Teknomed Web 3D Premium Direction

> Living plan untuk transformasi teknomed-web jadi pengalaman premium dengan kualitas referensi: World of NRG, Vaonis Hyperia, Shader.se, Digitalists.at, EatNaked.co.
>
> Dibuat: 2026-05-27. Update terakhir: 2026-05-27.
> Status repo saat plan ini dibuat: commit 481de8e (cursor fix + 3D placeholder), main branch.
> Pasangan dokumen: HANDOFF.md (konteks bisnis + arsitektur), PLAN.md (file ini, prioritas eksekusi).

---

## 0. TL;DR

- Repo sudah di clean checkpoint setelah komit besar UI/UX rebuild dan fix cursor + placeholder 3D. Lint, type, build hijau.
- Sesi ini menambahkan referensi kualitas tinggi yang harus jadi standar visual baru:
  worldofnrg, hyperia, shader.se, digitalists.at, eatnaked.
- Plan ini mengelompokkan pekerjaan jadi 6 fase terurut, masing-masing dengan akseptansi
  dan budget bundle yang jelas. Fase 1 dan 2 wajib diselesaikan sebelum eksperimen 3D
  besar agar fondasi tidak retak saat kompleksitas naik.
- Risiko terbesar: cursor: none global di index.css (sudah dihapus), Lenis + iframe Maps,
  dan biaya WebGL kalau dipakai di Hero. Plan ini meredam ketiganya di Fase 1.

---

## 1. Snapshot Status (per 2026-05-27)

### 1.1 Verified hijau
- TypeScript: 0 error
- ESLint: 0 error, 0 warning
- Vite build: ~600 ms, 0 error
- 7 routes terdaftar, ProductDetail kini hanya 7.18 kB (3D viewer di-pause)
- Main CSS turun 63 -> 55 kB setelah hapus rule cursor: none global

### 1.2 Sudah ada (committed di main)
- Komponen QoL: BackToTop, ScrollProgress, RouteProgressBar, CommandPalette, Toast
- Smooth scroll: SmoothScrollProvider via Lenis
- Cursor: CustomCursor di Motion.tsx (sekarang co-exist dengan native cursor)
- Motion primitives: CharReveal, ClipReveal, ScaleReveal, HorizontalScrollSection,
  MarqueeTrack, ViewParallax (di samping primitives lama)
- Data layer: src/types, src/config/site.ts, src/data/{products,projects,services,stats}
- Hooks: useScrollTo, useHotkey
- 3D viewer per produk di /catalog/:slug DI-PAUSE dengan placeholder gradient
  (file Product3DViewer.tsx tetap ada, tinggal di-rewire saat fase 4)
- Shader baru di src/shaders/meshGradient.{vert,frag}.glsl + komponen NoiseMeshGradient
  (file sudah ada tapi BELUM dipakai di mana pun)

### 1.3 Bermasalah laten yang masih perlu dirapikan
1. Lenis bisa ganggu iframe Maps di Projects modal dan Contact (lihat utility
   .lenis-smooth iframe { pointer-events: none }). Modal sudah pasang stop overflow
   tapi belum disconnect Lenis saat modal terbuka.
2. Projects.tsx pakai inline style besar sementara codebase lain Tailwind utility,
   inkonsisten dengan rest of pages.
3. Stats di Home.tsx duplicate dengan src/data/stats.ts yang belum dipakai.
4. Bundle main 277 kB / 87 kB gzip masih bisa dipangkas (Lucide tree-shake bisa
   dilanjut, beberapa motion primitive tidak dipakai semua route).
5. NoiseMeshGradient menambah ~0.5 MB Three.js cost kalau dipakai di Hero, harus
   dipertimbangkan vs canvas gradient CSS yang sudah cukup smooth.

### 1.4 Masih TODO dari HANDOFF asli (Section 11)
- Replace approximate Google Maps coordinates dengan koordinat exact
- Cleanup src/assets/react.svg dan src/assets/hero.png jika confirmed unused
- Replace dummy Unsplash project photos dengan foto asli
- Real glTF models untuk replace procedural 3D (akan diatur ulang di fase 4)
- Real backend untuk Contact form (saat ini mailto)
- Sitemap.xml + robots.txt + JSON-LD structured data
- A11y audit dengan screen reader

### 1.5 Yang dijanjikan di HANDOFF Section 16 tapi belum tuntas
- Sticky TOC untuk ProductDetail: belum ada.
- Loading state refinements (hero skeleton, card skeleton, 3D skeleton): hanya
  generic PageSkeleton.
- Form UX contact (inline validation): belum ada validation, masih mailto biasa.
- Extract constants lain ke src/data/: stats sudah, services sudah, sisanya belum.
- Marquee logo / social proof: belum ada section khusus.
## 2. Research Findings - 5 Reference Sites

### 2.1 World of NRG (worldofnrg.com)
Awwwards-grade storytelling site oleh Rogue Studio. Format: card-based topical
explorer dengan video micro-content, bukan single long-scroll. Setiap topik adalah
"slot" dengan thumbnail, tag (Business / Residential / Generation), reading-time,
dan modal player untuk deep-dive. Tidak ada single hero 3D viewer; emosinya
dibangun lewat curation dan pacing. Pelajaran: signature visual tidak harus 3D
mahal, kurasi konten + interaksi kecil yang konsisten bisa menang.

### 2.2 Vaonis Hyperia (vaonis.com/pages/product/hyperia)
Awwwards Honorable Mention 2026. Single product page bercerita 6 bab terurut
("chapters"): Heritage, Combination, Performance, Experience, Mastery, Smart
Experience. Setiap bab punya hero visual (foto produk + lighting dramatis),
sub-section dengan icon explainer, dan teknologi underlying (Canon optics,
17 lens, Air Sphere Coating) dipresentasikan dengan respect. Pelajaran:
"chapter scroll" pattern adalah translasi terbaik untuk produk teknik
seperti MGPS, MOT, HVAC. Hyperia membuktikan kalau angka teknis bisa
seksi kalau dibungkus narasi dan typography yang punya napas.

### 2.3 Shader.se
Self-aware creative studio: positioning "We don't troubleshoot printers."
Tone main: percaya diri, sedikit ironis, tapi work-nya serius. Project
showcase carousel dengan thumb 3D dan judul singkat. Tidak ada bombast
WebGL di hero; investasi visual mereka ada di case studies. Pelajaran:
brand voice + selektif show-off lebih menjual daripada full-throttle 3D
di setiap section.

### 2.4 Digitalists.at
Vienna agency, signature: cursor besar berlabel hex color (0xF1E500), micro
copy yang dipisah per kata "Wir / machen / Ideen / sichtbar / messbar /
erfolgreich". Hero pakai foto background + cursor custom. Service grid
6-7 kotak dengan ikon sketsa monoline. Case studies pakai prefix kode
("CS 695") untuk feel editorial. Pelajaran: cursor identity + word-by-word
typography adalah micro-interaction murah yang signature-able.

### 2.5 EatNaked.co
Health meal-prep brand. Hero dengan multi-layer fruit/veggie illustration
yang melayang, scroll-driven reveal antar tier (Gain Muscle / Maintain /
Lose Weight) dengan kalori before/after metrics. Testimonial slider
profesional dengan foto+role+kutipan. Pelajaran: angka konkret (kalori,
porsi, hari, lokasi) lebih persuasive daripada adjective. Untuk Teknomed
ini berarti: tahun pengalaman, jumlah proyek, area cakupan, jumlah
sertifikasi -> tampilkan dengan tone yang sama.

### 2.6 Sintesis Strategi untuk Teknomed
1. Hero tetap calm (jangan tiru NRG card explorer langsung; brand kita
   medical contractor, butuh authority bukan playfulness).
2. Pakai chapter-scroll pattern Vaonis untuk halaman ProductDetail. Setiap
   produk (MGPS, MOT, HVAC, dst) jadi micro-narasi 4-5 bab dengan visual
   support yang konsisten.
3. Pinjam tone Shader: serius soal kerja, sedikit ringan di copy. Em dash
   diharamkan; pakai hyphen dan koma.
4. Pinjam micro-interaction Digitalists: cursor accent (sudah dilakukan,
   tinggal label opsional), word-by-word reveal di hero (sudah ada
   WordReveal di Motion.tsx).
5. Pinjam clarity EatNaked: setiap claim harus diukur. "5 area" jadi
   "Jawa Timur, Bali, NTB, NTT, Sulawesi". "Berpengalaman" jadi "Sejak 2021".


---

## 2.7 Technical Teardown Synthesis (5 Reference Sites)

Setelah deep research dengan 5 explorer agent, berikut sintesis pattern yang
bisa diadopsi untuk teknomed-web. Ringkasan per site sudah dilakukan; teknik
yang aktionable diekstrak di section 2.8 (cherry-pick) dan section 4 update.

### 2.7.1 Stack Fingerprint Per Site

| Site | Framework | 3D | Smooth Scroll | Animation | Catatan |
|---|---|---|---|---|---|
| NRG | Static HTML + vanilla JS | NONE | Lenis 1.1.14 | Hand-rolled rAF + Lottie | Bundle ~600KB JS critical path. Tidak pakai 3D sama sekali |
| Hyperia | Shopify + Alpine.js | Canvas image-sequence | Lenis | GSAP + ScrollTrigger | Bukan Three.js! Hero pakai 120 frame JPG di canvas. ax-load lazy per section |
| Shader.se | Next.js + R3F | Three.js r183 + WebGPU + TSL | Lenis (forked) | R3F + uikit fork | Single shared canvas full-screen. Selective render. WebGPU bleeding edge |
| Digitalists | WordPress + Barba.js | NONE | Lenis (dual-instance) | GSAP 3 + SplitText + ScrollTrigger | Dual-Lenis: globalLenis + popupLenis untuk modal |
| EatNaked | Custom static + ES modules | Canvas image-sequence x2 | Lenis 1.3.4 | GSAP 3.13 full plugin pack | 9 plugin GSAP. Frame seq 201+40. Custom FlickCards 3D stack |

### 2.7.2 Critical Insights

1. **3D bukan = Three.js**. NRG, Hyperia, EatNaked menghasilkan kesan premium
   3D **tanpa Three.js sama sekali**. Hyperia pakai canvas image-sequence
   (drawImage 120 frame JPG di scroll). EatNaked pakai 201 frame AVIF dual-orient.
   Ini secara performa jauh lebih ramah daripada Three.js + glTF + post-processing.

2. **Lenis adalah baseline 5/5 site**. Sudah diinstal di project. Pertahankan.
   Tapi pelajari pattern dual-instance dari Digitalists untuk modal Projects.

3. **GSAP + ScrollTrigger dominan**. 4/5 site pakai. Project Teknomed sekarang
   pakai motion/react. Decision point: tetap motion/react (sudah committed di
   HANDOFF) atau migrate ke GSAP?
   - Jangan migrate. motion/react useScroll + useTransform setara untuk 80%
     use case yang penting. GSAP punya keunggulan di SplitText (auto split)
     dan Pin (paling stabil), tapi keduanya bisa di-emulate dengan motion/react.
   - Untuk SplitText pattern (signature digitalists), pakai pre-split di JSX
     manual (zero JS hydration cost).
   - Untuk Pin pattern (signature Hyperia), pakai sticky CSS + useScroll.

4. **Shader.se adalah outlier ekstrem**. Mereka WebGPU + TSL + uikit. Tidak
   transferable untuk medical brand (audience mereka peers/agencies, bukan
   klinik). Ambil cuma arsitektur "single shared canvas + selective render"
   sebagai inspirasi, bukan stack.

5. **Bundle budget realistis** untuk teknomed: <= 350 KB gzipped. Ini bisa
   dicapai dengan Lenis (10) + motion/react (sudah ada) + canvas image-seq
   (zero library, hand-rolled drawImage).
## 2.8 Cherry-Pick: Teknik Konkret yang Diadopsi

Dari semua pattern, ini yang dipilih untuk teknomed. Setiap teknik diberi
asal site, mapping ke file project, dan implementation hint.

### 2.8.1 Cursor Rotation Skew (dari Digitalists)
- Asal: digitalists.at GSAP quickTo + clamp delta-X rotation
- Mapping: src/components/Motion.tsx CustomCursor
- Hint: track delta clientX, rotation clamp(-90, 90, 4*delta), reset 400ms timeout
- Effort: 30 menit
- Dampak: cursor punya identitas signature, bukan dot biasa

### 2.8.2 Pre-Split Word Reveal (dari Digitalists)
- Asal: digitalists.at server-side word split, blur+opacity reveal sine.out 1.7s stagger 0.15
- Mapping: src/components/Motion.tsx WordReveal (replace runtime split)
- Hint: terima text prop, .split(' ') di JSX, render per-word motion.span
- Effort: 30 menit
- Dampak: zero hydration cost, identik a11y, premium feel

### 2.8.3 Pinned Chapter Storytelling (dari Hyperia)
- Asal: vaonis hyperia hyperiaStorytelling 580vh sticky 3 absolute beats blur+opacity scrub
- Mapping: src/pages/ProductDetail.tsx restructure jadi chapter
- Hint: useScroll target=ref offset=start start, end end, useTransform per beat opacity 0->1->0
- Effort: 1-2 sesi (per produk butuh content beats)
- Dampak: signature hero pattern medical authority

### 2.8.4 Canvas Image-Sequence Hero (dari Hyperia + EatNaked)
- Asal: hyperia 120 frame JPG drawImage scroll, eatnaked 201 frame AVIF dual-orient
- Mapping: ganti placeholder ProductDetail viewer current dengan canvas frame seq
- Hint: prerender 60-80 frame dari Blender per produk, AVIF dengan poster fallback
- Effort: 2-3 sesi (need 3D modeling per produk)
- Dampak: 3D feel tanpa Three.js bundle cost, mobile friendly
- Decision deferred ke Phase 4

### 2.8.5 Glass Card with Backdrop Blur (dari NRG)
- Asal: nrg topicHero glass 40rem x 33rem, blur 1rem, asymmetric padding, accent per category
- Mapping: src/components/ui/Card.tsx variant glass
- Hint: CSS backdrop-filter blur(1rem) bg rgba 0.2 + GPU detect fallback solid bg
- Effort: 1 jam
- Dampak: visual depth tanpa 3D cost

### 2.8.6 Anima Staggered Entry System (dari NRG)
- Asal: nrg data-anima-delay system, easing cubic-bezier 0.55 0.1 0.26 0.995 default
- Mapping: update easing default di Motion.tsx primitives
- Hint: ganti easing cubic-bezier 0.25 0.46 0.45 0.94 jadi 0.55 0.1 0.26 0.995
- Effort: 30 menit (search-replace + visual regression test)
- Dampak: konsistensi feel premium di semua transition

### 2.8.7 Markers Rail MorphSVG (dari EatNaked)
- Asal: eatnaked SVG line per section morph straight to wave saat in-view
- Mapping: section progress indicator vertical kiri-page Teknomed
- Hint: SVG path animation, motion.path d attribute interpolation
- Effort: 1-2 jam
- Dampak: editorial feel

### 2.8.8 Floating Ambient Cutout PNG (dari EatNaked)
- Asal: eatnaked 11 veggie PNG static positioned blur per layer GSAP one-shot reveal
- Mapping: src/pages/Home.tsx hero accent floating elements
- Hint: hardcode 5-7 medical icons SVG (gas valve, panel, fan), absolute pos, blur 4-6px per layer, motion.div initial+animate stagger random
- Effort: 2-3 jam (cari/buat SVG icon yang cocok)
- Dampak: ambient depth, CPU murah karena static + parallax dari Lenis scroll natural

### 2.8.9 Dual-Lenis Pattern (dari Digitalists)
- Asal: digitalists globalLenis stop popupLenis start saat modal open
- Mapping: src/pages/Projects.tsx modal proyek + src/components/SmoothScrollProvider.tsx
- Hint: useLenis hook, lenis.stop() saat modal mount, lenis.start() saat unmount
- Effort: 30 menit
- Dampak: fix bug Lenis vs Maps iframe yang sudah identifikasi di Phase 1

### 2.8.10 Editorial Numeric Prefix (dari Digitalists)
- Asal: digitalists CS 695 prefix mono font 13px uppercase
- Mapping: src/data/projects.ts + src/data/products.ts add field prefix
- Hint: PRJ 2401 untuk projects, ITM 042 untuk products, render dengan font-mono
- Effort: 1 jam
- Dampak: editorial taste signal

## 2.9 Anti-Patterns dari Research (yang DITOLAK untuk Teknomed)

1. WebGPU + TSL + uikit fork (Shader.se). Bleeding edge. Maintenance trap.
   Mobile Safari coverage 88 persen Mei 2026. Teknomed butuh reliability medical-grade.
2. Full-canvas hero tanpa DOM text (Shader.se). Anti-SEO, anti-screen-reader.
3. Ironic corporate copy parody (Shader.se). Anti-medical authority.
4. Film grain + chromatic aberration post-FX. Estetika rusak = anti-medical.
5. cursor: none global (Digitalists style). Sudah dimundurkan, jangan kembali.
6. 9 GSAP plugin loaded (EatNaked). Bundle bloat, kita cuma butuh 2-3 plugin equivalent.
7. Lottie 250KB untuk illustration tunggal (NRG). Pakai inline SVG motion.path.
8. Hardcoded rem positions per breakpoint (EatNaked floating veggies). Pakai
   CSS custom properties + clamp() lebih scalable.
9. WordPress + ACF blocks tanpa code-split (Digitalists 1.2MB bundle). Vite
   sudah handle ini, jangan regress.
10. Audio + preloader gate (Hyperia). Wrong tone untuk medical contractor.

## 2.10 Bundle Budget Revision Berdasar Research

Target update setelah research:

| Route | Sebelum | Target Baru | Strategi |
|---|---|---|---|
| / (Home) | 17.4 KB | <= 25 KB | Tambah ambient floating SVG (no canvas) |
| /catalog | 9.8 KB | <= 15 KB | Tambah filter UI premium |
| /catalog/:slug | 7.2 KB | <= 50 KB (dengan canvas seq) atau <= 12 KB (tanpa) | Decision di Phase 4: full image-sequence (mahal asset 5-8MB JPG) atau static |
| /projects | 17.7 KB | <= 22 KB | Modal dual-Lenis fix masuk sini |
| /about | 6.6 KB | <= 8 KB | Tambah marker rail SVG |
| /services | 6.1 KB | <= 8 KB | - |
| /contact | 11.6 KB | <= 14 KB | Form validation |
| Main shared | 277 KB | <= 280 KB | Lenis sudah masuk. Cap di sini. |
| CSS | 55 KB | <= 60 KB | Tambah glass + marker styles |

Total target gzipped <= 350 KB di route paling berat (catalog/:slug dengan
image-sequence). Mobile fallback: poster image saja, no canvas.

## 2.11 Phase 4 Revision: 3D Direction (Konkret)

Update Phase 4 di section 3 sebelumnya. Sebelumnya: rekomendasi awal Three.js
plain + HDR env + Bloom subtle. Sekarang setelah teardown 5 site:

### Decision (locked)
- TIDAK pakai Three.js untuk Hero / ProductDetail. Beralih ke canvas
  image-sequence pattern (Hyperia + EatNaked).
- Three.js plain TETAP TERSEDIA di src/components/Product3DViewer.tsx untuk
  use case yang real-time interaktif (drag rotate, zoom). Tapi BUKAN pattern
  utama hero ProductDetail.
- Tidak migrate ke R3F. Tidak pakai WebGPU.
- Lenis tetap. motion/react tetap.

### Hero ProductDetail Pattern Baru (Hyperia-style)
1. Pinned section 400-500vh dengan sticky top-0 h-screen.
2. Canvas 1920x1080 (atau 1.5x DPR) di tengah.
3. 60-80 frame JPG/AVIF prerender dari Blender. Per produk butuh:
   - MGPS: rotating manifold panel + pipa exposed
   - MOT: ruang OT module assembled from parts
   - HVAC: AHU cutaway dengan internal flow
   - Electrical: panel cabinet door open reveal breakers
   - Chiller: chassis dengan fan blades animation
   - Consumables: pallet zoom-in to filter detail
4. drawImage di useScroll progress callback (motion/react useMotionValueEvent).
5. Asset weight target: 60 frame x 80KB AVIF = 4.8 MB. Acceptable untuk product page.
6. Mobile fallback: pickFrame[0] sebagai static poster, no canvas.
7. Loader: spinner gate sebelum unpin + first frame ready.

### ProductDetail Chapter Structure Baru
Ganti current single-panel layout dengan 5 chapter:
- Chapter 0: Hero (canvas reveal + product name)
- Chapter 1: Problem (kenapa ini matter, target hospital pain point)
- Chapter 2: Engineering (specs, standards, compliance, technical detail)
- Chapter 3: Visual exploration (3 still photos atau detail crop dengan caption)
- Chapter 4: CTA (request quotation, request site survey, contact)

Setiap chapter pakai pinned-sticky dengan blur+opacity scrub crossfade beats
sesuai pattern Hyperia.

### Asset Pipeline (Phase 4 task baru)
1. Setup Blender atau pakai Spline.design untuk model produk awal.
2. Render 60 frame per produk, output JPG 80 percent quality, target 80KB per frame.
3. Optional: convert ke AVIF dengan sharp atau cwebp. Test ukuran.
4. Naming convention: /public/seq/<slug>/<frame-index>.avif
5. Preload first 5 frame, lazy sisa.
6. Hosting: bundle dist/ atau external CDN kalau total > 30MB.

### Hero Home (Decision pending)
- NoiseMeshGradient sudah dibuat tapi tidak diaktifkan. Test dulu performa di
  iPhone SE / mid Android. Kalau >16ms first paint, drop dan ganti ambient
  floating SVG icon (pattern EatNaked tapi medical icons).
- Decision deferred, evaluasi di Phase 4 hari pertama.

### Acceptance Phase 4 (Updated)
- ProductDetail bundle gzipped <= 60 KB (no Three.js)
- Image sequence asset weight <= 6 MB per produk (12 MB sample untuk 2 produk pertama)
- First Contentful Paint /catalog/:slug <= 1.8s di 4G slow Chrome mobile
- Lighthouse Performance >= 85 mobile
- iPhone SE simulator: scroll smooth 60fps di chapter transition
- prefers-reduced-motion: jump cut, no scrub
- Mobile (< 768px): static poster only, no canvas


---

## 3. Phased Execution Plan

Plan ini dibagi 6 fase. Tiap fase punya gate akseptansi yang jelas. Tidak boleh
lompat fase: fase 1 dan 2 fix fondasi, fase 3-6 baru bangun premium experience.

### FASE 1: Foundation Hardening (1 sesi)

Tujuan: bersihkan teknik debt yang sudah teridentifikasi sebelum sentuh visual.

Tasks:
1. Lenis + Maps iframe coexistence: pasang useEffect di Projects.tsx modal dan
   Contact.tsx untuk panggil lenis.stop() saat modal/section visible, lenis.start()
   saat ditutup. Atau bungkus iframe dengan data-lenis-prevent.
2. Refactor Projects.tsx dari inline style ke Tailwind utility (parity dengan
   pages lain). Modal isolasi keep, tapi inline style internal jadi className.
3. Resolusi duplicate stats: pilih satu sumber. Decision: hapus src/data/stats.ts
   yang belum dipakai, ATAU pindahkan stats home ke data layer dan import.
   Saran: yang kedua (data layer wins) supaya konsisten dengan products/projects.
4. Bundle audit: jalankan vite build dengan analyzer (atau manual scan), pangkas
   import Lucide yang berlebih, pertimbangkan dynamic import untuk Motion
   primitives yang hanya dipakai di 1 page (HorizontalScrollSection di Home,
   misalnya).
5. Cleanup file unused: src/assets/react.svg dan hero.png (verify dulu).

Gate akseptansi:
- npx tsc 0 error, eslint 0 warning, vite build OK
- Modal Projects bisa scroll iframe Maps tanpa lag, drag map tetap responsif
- main bundle <= 270 kB (turun dari 277), CSS <= 55 kB
- Stats Home pakai src/data/stats.ts (single source of truth)

### FASE 2: Page Consistency Pass (1 sesi)

Tujuan: pastikan semua 7 halaman pakai pattern motion + layout yang sama.

Tasks:
1. About, Services, Catalog, Contact: audit penggunaan Reveal/Stagger/CharReveal,
   pastikan ada hierarki entry animation yang konsisten (Hero -> Section title ->
   Body -> CTA).
2. Implement sticky TOC untuk ProductDetail: kiri panel dengan list bab, kanan
   konten. Pakai IntersectionObserver untuk highlight bab aktif.
3. Loading state refinement: ganti generic PageSkeleton dengan per-route skeleton
   yang shape-aware (misal CatalogSkeleton dengan 6 card placeholder).
4. Form UX Contact: tambah inline validation client-side dengan Zod-style schema
   minimal, focus management, pesan error animatif via Toast.
5. Toast integration di pages: pasang useToast() di Contact (submit success/error),
   ProductDetail (request quotation), Catalog (filter change).

Gate akseptansi:
- Tidak ada page yang flash konten kosong sebelum data muncul
- TOC ProductDetail aktif highlight saat scroll
- Form Contact tidak izinkan submit kalau invalid, ada feedback toast
- Konsistensi pattern: tiap page punya hero + 1-2 section + CTA, sama density

### FASE 3: Visual Identity Layer (2 sesi)

Tujuan: bangun identitas visual yang signature, ambil dari Digitalists +
Shader: cursor accent, word reveal, project chapter prefix.

Tasks:
1. Cursor accent dengan label: extend CustomCursor agar bisa carry label opsional
   ("CLICK", "DRAG", brand color hex). Aktif hanya di element-element tertentu
   via data-cursor-label attribute. Tetap co-exist dengan native cursor.
2. Hero word-by-word reveal: WordReveal sudah ada, naikkan kualitas dengan
   per-word filter blur + clipPath, bukan sekadar opacity+y. Ambil pattern
   Digitalists yang setiap kata seakan ada gravity.
3. Project chapter prefix di Projects: prefix "PRJ 2401 / PRJ 2402" gaya editorial,
   inspirasi Digitalists "CS 695".
4. Section divider: ganti FadeLine generik dengan SectionLabel component yang
   ada eyebrow + nomor bab + judul, gaya Vaonis.
5. Marquee logo / partner section: kalau tidak ada logo client real (kemungkinan
   besar), buat alternative: marquee 5 area layanan dengan icon map pin, pakai
   MarqueeTrack yang sudah ada.
6. Hero metric refinement: Counter sudah ada. Ubah label dari "100% fokus medis"
   jadi "5 area layanan" / "6+ layanan inti" / "Sejak 2021" - 3 metric konkret
   gaya EatNaked.

Gate akseptansi:
- Cursor terlihat punya identitas (warna brand + scale up di clickable, optional
  label di CTA primary)
- Hero terasa cinematic 2-3 detik pertama tanpa heavy 3D
- Setiap section punya eyebrow + label, tidak ada "section telanjang"

### FASE 4: 3D Experience Direction (3-4 sesi, paling besar)

Tujuan: kembalikan 3D viewer dengan pendekatan yang seimbang dengan brand
medical contractor: serius, presisi, terkurasi, bukan demo show-off.

Decision tree (harus dijawab di awal fase):
- Procedural per-slug (kembali ke Product3DViewer.tsx) atau real glTF model?
- Render satu viewer di hero ProductDetail saja, atau ada juga di Hero Home
  sebagai brand statement?
- Pakai Three.js plain (existing) atau migrate ke React Three Fiber?

Rekomendasi awal:
- Tetap pakai Three.js plain, hindari R3F dependency baru. File existing sudah
  bagus, tinggal di-rewire dengan polish.
- Hanya render di ProductDetail. Tidak di Home. Home pakai canvas gradient CSS
  + meshGradient shader yang sudah dibuat (kalau performa OK).
- Naikkan kualitas procedural model: pakai PBR proper (MeshStandardMaterial),
  HDR environment lighting (bisa 4-6 KB cubemap built-in Three.js), shadow
  proyek terkurasi (bukan disable total kayak sekarang).

Tasks:
1. Audit Product3DViewer.tsx existing: cari low-hanging fruit polish (lighting,
   material, post-processing).
2. Tambah HDR environment: environment map preset Three.js (RoomEnvironment)
   atau load cubemap kecil dari /public/env/.
3. Add post-processing minimal: Bloom subtle untuk emissive part (chiller LED,
   surgical light), atau tidak sama sekali kalau biaya GPU > nilai.
4. Re-wire ke ProductDetail: ganti placeholder yang sekarang dengan viewer
   asli, plus loading skeleton yang ada brand identity (gradient + spinner
   teknik, bukan generic).
5. Mobile fallback yang elegan: di mobile, tampilkan static foto produk (atau
   render screenshot dari viewer di build-time) dengan badge "View 3D on
   desktop". Hindari kasih beban GPU mobile.
6. Lazy + IntersectionObserver: viewer tidak boleh load dulu sebelum scroll
   masuk viewport. Sudah ada pattern di file existing, validate ulang.

Optional (kalau masih ada budget di fase ini):
- NoiseMeshGradient di Hero Home: aktifkan kalau test menunjukkan first-paint
  tidak terganggu di low-end device. Kalau pelan, simpan untuk fase 6.
- Chapter scroll Vaonis-style untuk ProductDetail: 4-5 mini section per produk
  dengan visual support, bukan single panel layout sekarang.

Gate akseptansi:
- ProductDetail bundle <= 600 kB total (termasuk Three.js chunk), gzip <= 200 kB
- 3D viewer load < 2 detik di network 4G slow di Chrome mobile
- Test di iPhone SE (low-end) tidak crash, fallback ke static foto bekerja
- Lighthouse score Performance >= 80 di /catalog/mgps di mobile

### FASE 5: Content & SEO (1-2 sesi)

Tujuan: konten beneran, bukan dummy.

Tasks:
1. Foto proyek asli: ganti URL Unsplash di src/data/projects.ts dengan foto
   real dari arsip PT Teknomed. Kalau belum ada, request ke owner.
2. Koordinat Maps exact: ganti mapQuery di tiap project dengan koordinat
   lat/lng presisi (atau alamat full).
3. SEO basics: sitemap.xml, robots.txt, JSON-LD untuk Organization +
   LocalBusiness, OG image preset 1200x630 yang konsisten brand.
4. Meta description per page: tidak hardcode default, harus berbeda tiap page.
5. (Optional) Indonesian + English version dengan i18n. Decision: belum perlu
   sampai bisnis butuh.

Gate akseptansi:
- Tidak ada lagi imageUrl Unsplash di src/data/
- Search "teknomed indo timur" di Google preview dengan title + description
  yang benar (cek via Lighthouse SEO)
- Schema.org valid via Google Rich Results Test

### FASE 6: Polish + Cross-Project Connection (waktu fleksibel)

Tujuan: tunggu 2 project lain selesai dasar, lalu integrasi.

Tasks:
1. Backend integration kalau project lain jadi backend: ganti hardcoded data
   dengan fetch ke API. Endpoint sudah didefinisikan di HANDOFF Section 12.
2. Cross-link ke project lain: footer cross-promotion, atau header chip
   "Lihat juga: [Project B name]".
3. Shared brand package kalau scale memang butuh: extract config/site.ts +
   types/index.ts ke @teknomed/brand di monorepo.
4. Backend Contact form: ganti mailto dengan POST /api/contact.

Gate akseptansi:
- Semua data dinamis, tidak ada array hardcoded di pages
- Cross-project navigation jalan dua arah
- Form contact sukses kirim email lewat backend, dengan toast feedback

## 4. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| 3D viewer biaya bundle besar saat di-rewire | High | Medium | Cap chunk 600 kB, lazy + intersection observer, mobile fallback static |
| Lenis bertabrakan dengan Maps iframe | Medium | High | Stop Lenis saat modal terbuka, atau data-lenis-prevent di iframe wrapper |
| CustomCursor terlalu mencolok atau ganggu form | Low | Medium | Sudah turunkan opacity 0.55, size 8px. Hide otomatis di input/textarea via CSS rule |
| Konten asli (foto, koordinat) belum tersedia | High | Low | Sebagian sudah pakai Unsplash, OK untuk sekarang. Fase 5 minta ke owner |
| Awwwards-grade lebih lambat di mobile | Medium | High | Reduced-motion respect sudah ada, ResizeObserver, pixelRatio cap. Test wajib di iPhone SE |
| Refactor inline style Projects.tsx perubahan besar | Low | Low | File self-contained, tidak ganggu API page lain |

---

## 5. Decisions Already Made (jangan diubah lagi tanpa diskusi)

1. Native cursor tetap visible. CustomCursor hanya accent dot.
2. 3D viewer dipause sampai fase 4. Placeholder gradient sekarang sudah cukup baik.
3. Lenis tetap dipakai (smooth scroll), tidak migrate ke pakai native scroll.
4. Tidak migrate ke React Three Fiber. Three.js plain.
5. Tetap no backend, hardcoded TS data. Backend optional di fase 6 saat 2 project
   lain ready.
6. Tailwind v4 CSS-first, no config file, tidak balik ke tailwind.config.js.
7. Data-driven: setiap data baru wajib lewat src/data/ atau src/config/.
8. Em dash diharamkan, hanya hyphen + koma.
9. Color via var(--tm-*) saja. Hardcode hex hanya untuk pure white di on-primary.

---

## 6. Quick Wins (kalau jam terbatas, ambil ini dulu)

Urutan high-leverage low-effort:
1. Hapus stats duplicate di Home.tsx, pakai src/data/stats.ts. (~15 menit)
2. Tambah data-lenis-prevent di Maps iframe wrapper. (~10 menit)
3. Konsolidasi import Lucide di pages: bandingkan tree-shake actual vs declared.
   (~30 menit)
4. Add JSON-LD Organization + LocalBusiness di index.html. (~20 menit)
5. Refactor 1 section Projects.tsx dari inline ke Tailwind sebagai pilot. (~30 menit)

---

## 7. Working Cadence

- Setelah selesai 1 fase, commit checkpoint dengan format
  "feat(scope): phase N complete - <summary>"
- Update PLAN.md di section 1.2 + 1.5 setelah tiap commit (status moves)
- HANDOFF.md tidak perlu sering update. Update kalau ada arsitektur change atau
  decision baru.
- Bandwidth pengguna: jangan lebih dari 1 fase per pesan kecuali user minta
  eksplisit.

---

*Living document. Tiap kali plan kena revisi, append catatan di bawah dengan
tanggal supaya histori keputusan terjaga.*

### Changelog
- 2026-05-27 - Plan dibuat. Fase 1-6 disusun. Cursor + 3D placeholder fix dicommit di 481de8e.
