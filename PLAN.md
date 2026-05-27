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
