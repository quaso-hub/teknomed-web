# 10 — Laporan KP Plan (UBAYA Format)

> **Project**: Laporan Kerja Praktek — Teknomed Integrated System
> **Format**: UBAYA S1/D4 Teknik Informatika
> **Versi**: 1.0.0 — 2026-06-18
> **Sumber**: Analisis 5 contoh KP UBAYA + FORMAT_DOCX_UBAYA.md + ATURAN_BAHASA.md

## 1. Identitas

| Item | Value |
|------|-------|
| **Nama** | I Kadek Restu Nugraha |
| **NIM** | 160422146 |
| **Program Studi** | Teknik Informatika |
| **Fakultas** | Teknik |
| **Universitas** | Universitas Surabaya (UBAYA) |
| **Tempat KP** | PT Teknomed Indo Timur |
| **Periode KP** | [ISI] |
| **Dosen Pembimbing** | [ISI] |
| **Pembimbing Lapangan** | [ISI] |

## 2. Format Dokumen (FORMAT_DOCX_UBAYA.md)

### 2.1 Halaman & Margin
- Ukuran kertas: **A4**
- Margin: Kiri 4cm, Kanan 3cm, Atas 4cm, Bawah 3cm

### 2.2 Font & Spasi
- Font: **Times New Roman 12pt**
- Line spacing: **1.5**
- Paragraph spacing: 0pt before, 0pt after
- Alignment: **Justified**

### 2.3 Heading Hierarchy
| Level | Style | Format |
|-------|-------|--------|
| BAB (H1) | Heading 1 | Center, Bold, 14pt, ALL CAPS |
| Sub-bab (H2) | Heading 2 | Left, Bold, 12pt, Title Case |
| Sub-sub-bab (H3) | Heading 3 | Left, Bold, 12pt, Title Case |

### 2.4 Penomoran
- Bab: BAB I, BAB II, dst (romawi)
- Sub-bab: 1.1, 1.2, dst
- Sub-sub-bab: 1.1.1, 1.1.2, dst
- Gambar: Gambar 1.1, Gambar 2.3 (per bab)
- Tabel: Tabel 1.1, Tabel 2.3 (per bab)

### 2.5 Caption
- Gambar: di bawah gambar, center, 12pt. Format: `Gambar X.Y Judul Singkat`
- Tabel: di atas tabel, left, 12pt. Format: `Tabel X.Y Judul Singkat`

### 2.6 Daftar Pustaka
- Format: **APA 7th edition**
- Urut alfabetis per nama belakang penulis
- Hanging indent 1.27cm
- Spasi 1.0 antar entry, 6pt after

### 2.7 Halaman Khusus
- Halaman judul, lembar pengesahan, kata pengantar, daftar isi, daftar gambar, daftar tabel: nomor romawi kecil (i, ii, iii...)
- Bab 1 dst: nomor arab (1, 2, 3...) di kanan bawah

## 3. Aturan Bahasa (ATURAN_BAHASA.md — Anti-AI Slop)

### 3.1 Vocabulary Replacement (wajib)
| Ganti | Dengan |
|-------|--------|
| merupakan | adalah |
| memerlukan | butuh |
| menggunakan | pakai / memakai |
| memfasilitasi | bantu / mempermudah |
| mengintegrasikan | menggabungkan |
| memanfaatkan | pakai / manfaat |
| sebagaimana | seperti |
| holistik / inovatif / revolusioner / komprehensif | hapus atau ganti spesifik |

### 3.2 Frasa Pengisi (HAPUS)
- "perlu diketahui bahwa"
- "perlu dicatat bahwa"
- "dapat dilihat bahwa"
- "Mari kita bahas"
- "Berikut adalah"
- "Semoga bermanfaat"
- "Dengan demikian"
- "Oleh karena itu" → "Jadi"
- "Sebagaimana telah dijelaskan" → "Seperti sudah dijelaskan"
- "Berdasarkan hasil analisis" → "Dari analisis"
- "Dapat disimpulkan bahwa" → "Jadi"
- "Hal ini menunjukkan bahwa" → "Ini menunjukkan"

### 3.3 Pola Struktural (HAPUS/GANTI)
- Em-dash (— atau –) → koma atau titik
- "tidak hanya X tetapi juga Y" → "X dan Y"
- "X karena tiga hal / tiga alasan" → re-cast naratif
- Kesimpulan artificial di akhir paragraf → hapus
- Kalimat >25 kata → pecah jadi 2-3 kalimat
- Target avg kalimat: 12-15 kata
- "Sumber: Sintesis penulis" di caption → HAPUS, ganti 1 baris penjelasan natural

### 3.4 Bentuk Pasif Berlebihan
- "Data dikumpulkan oleh tim" → "Tim mengumpulkan data"
- "Sistem direkomendasikan" → "Penelitian merekomendasikan sistem"

## 4. Struktur Laporan (7 Bab — pola UBAYA)

Berdasarkan analisis 5 contoh KP UBAYA, pola yang konsisten:

### Halaman Awal (romawi kecil)
| Halaman | Isi | Estimasi Halaman |
|---------|-----|------------------|
| Cover | Judul, nama, NIM, logo UBAYA, logo Teknomed, tahun | 1 |
| Lembar Pengesahan | Tanda tangan dosen + pembimbing lapangan | 1 |
| Abstrak (ID) | Ringkasan 200-300 kata, kata kunci | 1 |
| Abstract (EN) | Translation | 1 |
| Kata Pengantar | Ucapan terima kasih | 1-2 |
| Daftar Isi | TOC otomatis | 2-3 |
| Daftar Gambar | List semua gambar | 1-2 |
| Daftar Tabel | List semua tabel | 1 |

**Subtotal halaman awal: 8-12 halaman**

### BAB I — Pendahuluan
| Sub-bab | Isi | Estimasi Halaman |
|---------|-----|------------------|
| 1.1 Latar Belakang | Konteks PT Teknomed, masalah, motivasi | 3-4 |
| 1.2 Rumusan Masalah | Pertanyaan penelitian | 0.5 |
| 1.3 Tujuan | Tujuan KP | 0.5 |
| 1.4 Manfaat | Bagi perusahaan, mahasiswa, akademis | 0.5-1 |
| 1.5 Ruang Lingkup | In scope + out of scope | 1 |
| 1.6 Rencana Kegiatan | Timeline | 1 |
| 1.7 Sistematika Penulisan | Penjelasan tiap bab | 1 |

**Subtotal Bab 1: 7-9 halaman**

### BAB II — Tinjauan Pustaka / Landasan Teori
| Sub-bab | Isi | Estimasi Halaman |
|---------|-----|------------------|
| 2.1 Profil PT Teknomed Indo Timur | Sejarah, visi-misi, layanan | 2-3 |
| 2.2 Medical Contractor & Fasilitas Kesehatan | Konsep, standar (HTM 02-01, NFPA 99, ISO 14644) | 2-3 |
| 2.3 Teknologi Web | React, Vite, Tailwind, SPA | 2-3 |
| 2.4 3D Visualization (Three.js, R3F) | Konsep WebGL, R3F, assembled/exploded view | 2-3 |
| 2.5 Supabase (BaaS) | Postgres, Auth, RLS, Storage | 2 |
| 2.6 Astro & paged.js | SSG, PDF generation | 1-2 |
| 2.7 RBAC & JWT | Konsep auth, role-based access | 1-2 |

**Subtotal Bab 2: 12-18 halaman**

### BAB III — Analisis
| Sub-bab | Isi | Estimasi Halaman |
|---------|-----|------------------|
| 3.1 Analisis Kondisi Saat Ini | 3 project terpisah, belum terintegrasi | 2-3 |
| 3.2 Analisis Permasalahan | Konten manual, inquiry tidak terstruktur, 3D terpisah | 2-3 |
| 3.3 Analisis Kebutuhan Sistem | Fungsional + non-fungsional | 3-4 |
| 3.4 Analisis Sistem Sejenis | Banding dengan website contractor lain | 1-2 |

**Subtotal Bab 3: 8-12 halaman**

### BAB IV — Perancangan
| Sub-bab | Isi | Estimasi Halaman |
|---------|-----|------------------|
| 4.1 Arsitektur Sistem | Diagram arsitektur (Mermaid) | 2-3 |
| 4.2 Desain Database | ERD Supabase, schema | 3-4 |
| 4.3 Desain Antarmuka Public | Wireframe/mockup Home, Catalog, ProductDetail, Contact | 4-5 |
| 4.4 Desain Antarmuka Admin | Wireframe admin panel | 3-4 |
| 4.5 Desain 3D Viewer | Arsitektur iframe, postMessage | 2 |
| 4.6 Desain PDF Generator | Flow Node service + Puppeteer | 1-2 |

**Subtotal Bab 4: 15-20 halaman**

### BAB V — Implementasi
| Sub-bab | Isi | Estimasi Halaman |
|---------|-----|------------------|
| 5.1 Stack Teknologi | Tabel stack + versi | 1-2 |
| 5.2 Implementasi Public Website | teknomed-web, screenshot | 4-5 |
| 5.3 Implementasi 3D Viewer | 3dproductvisualization, screenshot | 3-4 |
| 5.4 Implementasi Admin Panel | shadcn/admin, screenshot CRUD | 4-5 |
| 5.5 Implementasi Inquiry System | Form + Supabase + email | 2-3 |
| 5.6 Implementasi PDF Generator | Node service + Puppeteer | 2-3 |
| 5.7 Integrasi Supabase | Schema, RLS, Auth | 2-3 |

**Subtotal Bab 5: 18-25 halaman**

### BAB VI — Pengujian
| Sub-bab | Isi | Estimasi Halaman |
|---------|-----|------------------|
| 6.1 Skenario Pengujian | Fungsional, keamanan, performa | 2 |
| 6.2 Pengujian Fungsional | Tabel test case + hasil | 3-4 |
| 6.3 Pengujian Keamanan | RLS, JWT, input validation | 2-3 |
| 6.4 Pengujian Performa | Lighthouse, load time | 2 |
| 6.5 Evaluasi | Analisis hasil, kendala | 1-2 |

**Subtotal Bab 6: 10-13 halaman**

### BAB VII — Penutup
| Sub-bab | Isi | Estimasi Halaman |
|---------|-----|------------------|
| 7.1 Kesimpulan | Pencapaian tujuan | 1-2 |
| 7.2 Saran | Pengembangan selanjutnya | 1 |

**Subtotal Bab 7: 2-3 halaman**

### Halaman Akhir
| Halaman | Isi | Estimasi Halaman |
|---------|-----|------------------|
| Daftar Pustaka | APA 7th, 15-25 referensi | 2-3 |
| Lampiran | Kode kunci, screenshot tambahan, manual | 5-10 |

**Subtotal halaman akhir: 7-13 halaman**

### Total Estimasi
| Bagian | Halaman |
|--------|---------|
| Halaman awal | 8-12 |
| Bab I | 7-9 |
| Bab II | 12-18 |
| Bab III | 8-12 |
| Bab IV | 15-20 |
| Bab V | 18-25 |
| Bab VI | 10-13 |
| Bab VII | 2-3 |
| Halaman akhir | 7-13 |
| **TOTAL** | **87-125 halaman** |

Rata-rata contoh KP UBAYA: 46-155 halaman. Target realistis: **100-120 halaman**.

## 5. Daftar Pustaka (APA 7th — 15-25 referensi)

### 5.1 Referensi Wajib (teori)
```
[1] Pressman, R. S. (2015). Software engineering: A practitioner's approach (8th ed.). McGraw-Hill.
[2] Sommerville, I. (2016). Software engineering (10th ed.). Pearson.
[3] Kurose, J. F., & Ross, K. W. (2017). Computer networking: A top-down approach (7th ed.). Pearson.
[4] Tanenbaum, A. S., & Wetherall, D. J. (2014). Computer networks (5th ed.). Pearson.
```

### 5.2 Referensi Teknologi (dokumentasi resmi)
```
[5] React. (2024). React documentation. https://react.dev
[6] Vite. (2024). Vite guide. https://vitejs.dev/guide
[7] Tailwind CSS. (2024). Tailwind CSS documentation. https://tailwindcss.com/docs
[8] Framer Motion. (2024). Motion documentation. https://motion.dev
[9] Three.js. (2024). Three.js documentation. https://threejs.org/docs
[10] React Three Fiber. (2024). R3F documentation. https://docs.pmnd.rs/react-three-fiber
[11] Supabase. (2024). Supabase documentation. https://supabase.com/docs
[12] Astro. (2024). Astro documentation. https://docs.astro.build
[13] PostgreSQL. (2024). PostgreSQL documentation. https://www.postgresql.org/docs
[14] Caddy. (2024). Caddy documentation. https://caddyserver.com/docs
[15] Puppeteer. (2024). Puppeteer documentation. https://pptr.dev
```

### 5.3 Referensi Standar Medis
```
[16] HTM 02-01. (2022). Medical gas pipeline systems. NHS England.
[17] NFPA 99. (2024). Health care facilities code. National Fire Protection Association.
[18] ISO 14644. (2015). Cleanrooms and associated controlled environments. ISO.
```

### 5.4 Referensi Jurnal/Proseding (cari di Google Scholar)
```
[19-25] Cari 5-7 jurnal terkait:
- Web-based 3D product visualization
- BaaS untuk rapid web development
- RBAC implementation in web app
- Interactive 3D for e-commerce/catalog
- React SPA performance optimization
```

## 6. Tools untuk Menulis Laporan

### 6.1 Recommended: Markdown → DOCX via Pandoc
```bash
# Install pandoc
# Windows: scoop install pandoc atau choco install pandoc

# Convert MD → DOCX dengan template UBAYA
pandoc laporan.md -o laporan.docx \
  --reference-doc=template_ubaya.docx \
  --toc --toc-depth=3 \
  --number-sections
```

### 6.2 Alternative: Langsung DOCX via python-docx
```python
from docx import Document
from docx.shared import Pt, Cm, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document()
# Set margin (Kiri 4cm, Kanan 3cm, Atas 4cm, Bawah 3cm)
sections = doc.sections
for section in sections:
    section.left_margin = Cm(4)
    section.right_margin = Cm(3)
    section.top_margin = Cm(4)
    section.bottom_margin = Cm(3)

# Set font Times New Roman 12pt
style = doc.styles['Normal']
font = style.font
font.name = 'Times New Roman'
font.size = Pt(12)
```

### 6.3 Skill/Agent yang bisa bantu
- `academic-paper` skill — 12-agent pipeline, 6 paper types, APA format
- `office-operator` agent — DOCX CRUD via OfficeCLI
- `docx` skill — Word document creation
- `documentation` skill — Technical docs

## 7. Workflow Penulisan Laporan

### 7.1 Urutan Eksekusi (rekomendasi)
1. **Bab II (Tinjauan Pustaka)** dulu — paling mudah, kumpul referensi
2. **Bab III (Analisis)** — deskripsikan 3 project existing + masalah
3. **Bab IV (Perancangan)** — pakai docs/04-SAD.md + docs/05-DATA_MODEL.md
4. **Bab V (Implementasi)** — screenshot + kode kunci dari project
5. **Bab VI (Pengujian)** — test case + hasil Lighthouse
6. **Bab I (Pendahuluan)** — terakhir, setelah semua bab jadi
7. **Bab VII (Penutup)** — kesimpulan + saran
8. **Halaman awal** — cover, pengesahan, kata pengantar, daftar isi
9. **Daftar Pustaka** — kumpul semua referensi
10. **Lampiran** — kode, screenshot tambahan

### 7.2 Quality Gate per Bab
- [ ] Ikut ATURAN_BAHASA.md 100% (no "merupakan", no em-dash, no frasa pengisi)
- [ ] Format FORMAT_DOCX_UBAYA.md (TNR 12pt, 1.5 spasi, margin 4-3-4-3)
- [ ] Heading hierarchy benar (BAB → 1.1 → 1.1.1)
- [ ] Caption gambar/tabel benar
- [ ] Sitasi APA 7th
- [ ] Kalimat <25 kata
- [ ] Tidak fabrikasi referensi/data

### 7.3 Estimasi Waktu Penulisan
| Bab | Estimasi (hari) |
|-----|-----------------|
| Bab II | 3-4 |
| Bab III | 2-3 |
| Bab IV | 3-4 |
| Bab V | 4-5 |
| Bab VI | 2-3 |
| Bab I | 2 |
| Bab VII | 1 |
| Halaman awal + akhir | 2 |
| Revisi + polish | 3-5 |
| **Total** | **22-29 hari (4-6 minggu)** |

Bisa parallel dengan eksekusi sistem (Phase A-G). Saat Phase F selesai, Bab V sudah bisa mulai.

## 8. Mapping Dokumen docs/ → Bab Laporan

| Bab Laporan | Sumber docs/ |
|-------------|--------------|
| Bab I.1 Latar Belakang | 01-BRD.md (business context, problem) |
| Bab I.5 Ruang Lingkup | 01-BRD.md (scope), 02-PRD.md (MoSCoW) |
| Bab II.1 Profil Teknomed | 01-BRD.md (business context) |
| Bab II.3-7 Teknologi | 04-SAD.md (tech stack, ADR) |
| Bab III.1 Kondisi Saat Ini | 09-PROJECT_ANALYSIS.md (3 project) |
| Bab III.3 Kebutuhan | 02-PRD.md (features), 03-SRS.md (FR + NFR) |
| Bab IV.1 Arsitektur | 04-SAD.md (diagrams) |
| Bab IV.2 Database | 05-DATA_MODEL.md (schema, ERD) |
| Bab IV.3-4 Antarmuka | 02-PRD.md (UX requirements) |
| Bab V.1 Stack | 04-SAD.md (tech stack) |
| Bab V.2-7 Implementasi | 06-ROADMAP.md (deliverables per phase) |
| Bab VI.1 Skenario | 03-SRS.md (acceptance criteria) |
| Bab VII.1 Kesimpulan | 01-BRD.md (objectives + KPI) |

## 9. Output Location

```
D:\playgrounds\laporan_magang\
├── 05_draft_doc\
│   ├── bab1-pendahuluan.md
│   ├── bab2-tinjauan-pustaka.md
│   ├── bab3-analisis.md
│   ├── bab4-perancangan.md
│   ├── bab5-implementasi.md
│   ├── bab6-pengujian.md
│   ├── bab7-penutup.md
│   ├── halaman-awal\
│   │   ├── cover.md
│   │   ├── pengesahan.md
│   │   ├── abstrak.md
│   │   ├── kata-pengantar.md
│   │   └── daftar-isi.md
│   ├── daftar-pustaka.md
│   └── lampiran\
└── 06_output\
    └── laporan-kp-teknomed.docx  (final, via pandoc)
```
