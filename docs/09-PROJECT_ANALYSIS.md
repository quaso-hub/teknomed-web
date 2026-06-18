# 09 — Project Analysis (catalog-new + 3dproductvisualization)

> **Project**: Teknomed Integrated System
> **Versi**: 1.0.0 — 2026-06-18
> **Tujuan**: Analisis mendalam 2 project existing untuk integrasi.

## 1. catalog-new (Astro PDF Brochure)

### 1.1 Overview
| Item | Value |
|------|-------|
| **Path** | `C:\Users\warma\Documents\brosur-lin\catalog-new` |
| **Stack** | Astro 5.17 + paged.js 0.4 + Puppeteer 24 |
| **Purpose** | Generate brosur katalog PDF cetak (A4, print-quality) |
| **Output** | Static HTML → Puppeteer render → PDF |
| **Pages** | 55 halaman (cover, TOC, 50+ product pages, certifications, gallery, contact) |

### 1.2 Tech Stack Detail
```json
{
  "dependencies": {
    "astro": "^5.17.1",
    "pagedjs": "^0.4.3",
    "puppeteer": "^24.38.0"
  }
}
```

**astro.config.mjs**:
```js
export default defineConfig({
  output: 'static',  // Static HTML, suitable for Puppeteer PDF
});
```

### 1.3 File Structure
```
catalog-new/
├── src/
│   ├── components/           # Astro components
│   │   ├── CertBadge.astro
│   │   ├── ContactGrid.astro
│   │   ├── DiagramEmbed.astro
│   │   ├── ImagePlaceholder.astro
│   │   ├── PageFooter.astro
│   │   ├── PageHeader.astro
│   │   ├── ProductCompact.astro
│   │   ├── ProductPage.astro
│   │   ├── SectionDivider.astro
│   │   └── SpecTable.astro
│   ├── data/
│   │   └── specs.json        # 31 products, extracted from XLSX
│   ├── pages/                # 55 pages
│   │   ├── 01-cover.astro
│   │   ├── 02-toc.astro
│   │   ├── 03-company-profile.astro
│   │   ├── 04-or-solution.astro
│   │   ├── 05-divider-wall-ceiling.astro
│   │   ├── ... (50+ product pages)
│   │   └── 55-contact.astro
│   └── styles/
│       ├── base.css
│       ├── components.css
│       ├── paged-config.css  # paged.js print config
│       └── tokens.css        # design tokens
├── public/
│   └── assets/
│       ├── diagrams/
│       ├── fonts/
│       ├── icons/
│       ├── images/
│       └── logos/
├── dist/                     # Build output (HTML)
└── package.json
```

### 1.4 Data Model (specs.json)
```json
{
  "_meta": {
    "source": "XLSX:Table 1",
    "source_file": "specs/excel/SPESIFIKASI MOT ELFATECH MA7 MAYOR PIR.xlsx",
    "total_products": 31,
    "generated_by": "scripts/extract-specs.py"
  },
  "pekerjaan_dinding_pabrikasi": {
    "name": "PEKERJAAN DINDING PABRIKASI",
    "section": "A",
    "section_name": "Paket MOT (Modular Operating Theatre)",
    "source_ref": "XLSX:Table 1!B7",
    "specs": []
  },
  "rg_ok": {
    "name": "Rg. OK",
    "section": "A",
    "section_name": "Paket MOT (Modular Operating Theatre)",
    "specs": [
      { "label": null, "value": "Dinding Sandwich" },
      { "label": null, "value": "Wall medical insulated panel PIR, t. 75mm, HRP Antibacterial 0.5mm" }
    ]
  }
}
```

**Struktur**: Object dengan key = product slug, value = `{ name, section, section_name, specs[], quantity?, unit? }`. Total 31 produk dalam 5 section (A-E).

### 1.5 Component Analysis

| Component | Purpose | Reusable? |
|-----------|---------|-----------|
| `PageHeader.astro` | Header tiap halaman (logo, page number, section) | Ya, untuk PDF |
| `PageFooter.astro` | Footer (copyright, page number) | Ya |
| `ProductPage.astro` | Template halaman produk (image + specs + description) | Ya, **key component** |
| `ProductCompact.astro` | Versi compact (multiple products per page) | Ya |
| `SpecTable.astro` | Tabel spesifikasi dari specs.json | Ya, **key component** |
| `CertBadge.astro` | Badge sertifikasi (ISO, CE, dll) | Ya |
| `ContactGrid.astro` | Grid kontak di halaman akhir | Ya |
| `DiagramEmbed.astro` | Embed diagram teknis (SVG) | Ya |
| `ImagePlaceholder.astro` | Placeholder gambar saat asset belum ada | Ya |
| `SectionDivider.astro` | Pembatas antar section | Ya |

### 1.6 PDF Generation Flow (current)
```
specs.json (XLSX extract)
    ↓
Astro build → 55 HTML pages (static)
    ↓
Puppeteer launch → goto HTML → PDF
    ↓
Output: katalog.pdf (A4, print-ready)
```

**Script**: `npm run build-pdf` = `astro build && node ../scripts/generate-pdf-astro.js`

### 1.7 Integration Points for Supabase

**Yang harus berubah**:
1. `src/data/specs.json` → fetch dari Supabase `products` + `product_3d_assets` tables
2. `src/pages/*.astro` → generate dinamis dari data Supabase (atau tetap static tapi data di-fetch saat build)
3. `public/assets/images/` → fetch dari Supabase Storage `product-images`

**Yang tetap**:
1. Semua Astro components (PageHeader, ProductPage, SpecTable, dll)
2. Styles (base, components, paged-config, tokens)
3. paged.js config
4. Puppeteer flow

**Strategy**: 
- Astro tetap static output, tapi data di-fetch saat **build time** (SSG dari Supabase)
- Node service di VPS: 
  1. Fetch data dari Supabase
  2. Write ke `src/data/specs.json` (sementara)
  3. Run `astro build`
  4. Puppeteer generate PDF
  5. Upload ke Supabase Storage

### 1.8 Effort Estimate
| Task | Effort |
|------|--------|
| Modifikasi specs.json fetch dari Supabase | 2 jam |
| Update Astro pages untuk handle data dinamis | 3 jam |
| Node service wrapper (fetch + build + PDF) | 4 jam |
| Test PDF kualitas | 1 jam |
| **Total** | **10 jam (1.5 hari)** |

---

## 2. 3dproductvisualization (React 3D Viewer)

### 2.1 Overview
| Item | Value |
|------|-------|
| **Path** | `D:\playgrounds\3d-product-catalog\3dproductvisualization` |
| **Stack** | React 18 + Vite 6 + @react-three/fiber 8 + @react-three/drei 9 + Three.js 0.183 + MUI 7 + Radix UI + shadcn/ui |
| **Purpose** | 3D interactive viewer untuk produk medical (assembled/exploded view) |
| **Products** | 13 produk unik (wall panel, doors, fixtures, ceiling, medical equipment, HVAC BIM) |

### 2.2 Tech Stack Detail
```json
{
  "dependencies": {
    "@react-three/fiber": "8.16",
    "@react-three/drei": "9.108",
    "three": "^0.183.2",
    "@mui/material": "7.3.5",
    "@mui/icons-material": "7.3.5",
    "@radix-ui/react-*": "various (20+ packages)",
    "class-variance-authority": "0.7.1",
    "cmdk": "1.1.1",
    "lucide-react": "0.487.0",
    "motion": "12.23.24",
    "react-router": "7.13.0",
    "sonner": "2.0.3",
    "tailwind-merge": "3.2.0",
    "vaul": "1.1.2"
  },
  "peerDependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1"
  }
}
```

**Note**: Pakai React 18 (beda dengan teknomed-web yang React 19). Pakai R3F (beda dengan teknomed-web yang three plain). Pakai MUI + Radix + shadcn (beda dengan teknomed-web yang Tailwind pure).

### 2.3 vite.config.ts
```ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'three-addons': ['three/examples/jsm/controls/OrbitControls', '...loaders'],
          'react-vendor': ['react', 'react-dom'],
          'lucide': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
```

**Key**: Manual chunking untuk Three.js (heavy) + React + Lucide. Base path default `/` (perlu set `base: '/3d-viewer/'` atau subdomain untuk deploy).

### 2.4 File Structure
```
3dproductvisualization/
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Main app (sidebar + viewer)
│   │   ├── components/
│   │   │   ├── figma/                 # Figma design tokens
│   │   │   ├── hvac-bim-v2/           # HVAC BIM special viewer
│   │   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── AssembledPanel3D.tsx   # Assembled view component
│   │   │   ├── ExplodedPanel3D.tsx    # Exploded view component
│   │   │   ├── ProductViewerLazy.tsx  # Lazy load viewer
│   │   │   ├── ViewerControls.tsx     # Rotate, zoom, screenshot controls
│   │   │   ├── ViewerErrorBoundary.tsx
│   │   │   ├── ViewerSkeleton.tsx
│   │   │   ├── Sidebar.tsx            # Product list sidebar
│   │   │   └── ... (30+ 3D components per product)
│   │   ├── data/
│   │   │   ├── products.ts            # Type definitions
│   │   │   ├── lazyViewerRegistry.ts  # Lazy load registry
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useHighlightController.ts
│   │   │   ├── useProductViewer.ts
│   │   │   └── useThreeScene.ts
│   │   ├── lib/
│   │   │   ├── geometry-blender.ts
│   │   │   ├── highlight-controller.ts
│   │   │   ├── materials.ts
│   │   │   ├── three-scene.ts
│   │   │   └── viz-interaction-tokens.ts
│   │   ├── products/                  # Product configs (13 files)
│   │   │   ├── index.ts               # Registry
│   │   │   ├── sandwich-radiasi.ts
│   │   │   ├── curving.ts
│   │   │   ├── hermetic-door.ts
│   │   │   ├── pb-lead-door.ts
│   │   │   ├── scrub-sink.ts
│   │   │   ├── pass-box.ts
│   │   │   ├── pacs-cabinet.ts
│   │   │   ├── return-air-grille.ts
│   │   │   ├── laf-system.ts
│   │   │   ├── ceiling-panel.ts
│   │   │   ├── xray-viewer.ts
│   │   │   ├── surgical-control-panel.ts
│   │   │   └── hvac-system.ts
│   │   └── styles/
│   │       ├── highlight.css
│   │       └── ...
│   └── styles/
│       ├── fonts.css
│       ├── index.css
│       ├── tailwind.css
│       └── theme.css
├── public/
│   ├── models/                        # 3D model files (.glb)
│   │   └── hvac/
│   └── logo-elfatech.svg
└── package.json
```

### 2.5 Product Registry (13 products)
```ts
// src/app/products/index.ts
export const PRODUCTS: Product[] = [
  sandwichRadiasi,      // Wall Panel Element (Pb 2mm)
  curvingR40,           // Profile
  hermeticDoor,         // Door (auto sliding)
  pbLeadDoor,           // Door (swing, lead-lined)
  scrubSink,            // Fixture (2-bay)
  passBox,              // Fixture (SUS 304, interlock)
  pacsCabinet,          // Fixture
  returnAirGrille,      // Fixture
  lafSystem,            // Ceiling (LAF)
  ceilingPanel,         // Ceiling system
  xrayViewer,           // Medical equipment (double screen)
  surgicalControlPanel, // Medical equipment (touchscreen)
  hvacSystem,           // BIM system (special viewer)
];
```

### 2.6 Product Config Structure (sample: pass-box.ts)
```ts
const PASS_BOX: Product = {
  id: 'pass-box',
  name: 'Pass Box SUS 304',
  fullName: 'Pass Box Stainless Steel SUS-304',
  description: 'Pass Box stainless steel SUS-304 untuk transfer material steril...',
  category: 'Lainnya',
  badge: 'Cleanroom',
  badgeColor: 'bg-teal-100 text-teal-700',
  viewerType: 'pass-box',
  views: ['assembled', 'exploded'],
  layers: [
    { name: 'SUS 304 Outer (Brushed)', thickness: 1.5, color: 0xc8d4dc, roughness: 0.22, metalness: 0.92 },
    { name: 'Insulasi', thickness: 25, color: 0xd9c8a0, roughness: 0.90, metalness: 0.0 },
    { name: 'SUS 304 Inner (Mirror)', thickness: 1.5, color: 0xe8f0f4, roughness: 0.05, metalness: 0.95 },
  ],
  dimensions: { widthMm: 800, heightMm: 800, depthMm: 500, sceneWidth: 120, sceneHeight: 120, sceneDepth: 75 },
  cameraPresets: [...],
  highlights: [...],
  specs: [...],
};
```

**Key fields**:
- `viewerType`: menentukan komponen 3D mana yang render (pass-box → PassBoxAssembled3D + PassBoxExploded3D)
- `layers`: cross-section material untuk exploded view
- `dimensions`: dimensi nyata (mm) + scene units (Three.js)
- `cameraPresets`: posisi kamera default + preset
- `highlights`: bagian yang bisa di-highlight (hover/pin)
- `specs`: spesifikasi teknis

### 2.7 3D Component Pattern
Setiap produk punya 2 komponen:
- `XxxAssembled3D.tsx` — tampilan utuh
- `XxxExploded3D.tsx` — tampilan terurai (layer dipisah)

Contoh: `PassBoxAssembled3D.tsx` + `PassBoxExploded3D.tsx`

**Lazy load**: `ProductViewerLazy.tsx` + `lazyViewerRegistry.ts` mengatur lazy load per viewerType.

### 2.8 App.tsx Flow
```tsx
function App() {
  const [selected, setSelected] = useState<Product>(PRODUCTS[0]);
  // Preload viewer on mount
  // Handle product selection (optimistic UI)
  // Preload adjacent products (predictive)
  // Keyboard navigation (Arrow Up/Down, j/k)
  
  return (
    <Sidebar products={PRODUCTS} selected={selected} onSelect={handleSelect} />
    <ProductViewerLazy product={selected} />
  );
}
```

### 2.9 Integration Points for teknomed-web + Supabase

**Yang harus berubah**:
1. Tambah env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
2. Modifikasi `App.tsx`: fetch product list dari Supabase (atau terima via URL param)
3. Modifikasi `products/index.ts`: fetch dari Supabase `products` table (where has_3d=true)
4. Modifikasi product configs: bagian dinamis (highlights, camera) dari `viewer_config` JSONB
5. 3D model files: pindah ke Supabase Storage `3d-models` bucket
6. Tambah `postMessage` ke parent (teknomed-web) untuk: close, screenshot, error
7. Set `base: '/3d-viewer/'` di vite.config atau deploy ke subdomain

**Yang tetap**:
1. Semua 3D components (Assembled/Exploded per product)
2. Hooks (useHighlightController, useProductViewer, useThreeScene)
3. Lib (geometry-blender, materials, three-scene)
4. Styles
5. Viewer controls UI

### 2.10 iframe Embed Strategy
```
teknomed-web (parent):
  /catalog/pass-box/3d
    ↓
  <iframe src="https://3d.teknomed.../?product=pass-box" />
    ↓
3dproductvisualization (child):
  App.tsx read URL param ?product=pass-box
    ↓
  Fetch product config dari Supabase
    ↓
  Render PassBoxAssembled3D / PassBoxExploded3D
    ↓
  User click close → postMessage({ type: 'close' })
    ↓
teknomed-web receive postMessage → navigate(-1)
```

### 2.11 Effort Estimate
| Task | Effort |
|------|--------|
| Tambah env Supabase + fetch product list | 2 jam |
| Modifikasi App.tsx (URL param + fetch config) | 3 jam |
| Pindah 3D models ke Supabase Storage | 2 jam |
| postMessage communication | 2 jam |
| vite.config base path + build | 1 jam |
| Deploy ke VPS subdomain | 1 jam |
| Test iframe embed dari teknomed-web | 2 jam |
| **Total** | **13 jam (2 hari)** |

---

## 3. Cross-Project Integration Summary

### 3.1 Data Flow (3 project + Supabase)
```
Supabase (source of truth)
    ↓
    ├── teknomed-web (public SPA)
    │     fetch products, projects, services, testimonials, site_settings
    │     embed 3D viewer via iframe
    │
    ├── 3dproductvisualization (3D viewer)
    │     fetch product viewer_config + 3D models from Storage
    │     embedded via iframe di teknomed-web
    │
    └── catalog-new (PDF generator)
          fetch all products + specs
          Astro build → Puppeteer PDF
          upload PDF ke Storage
```

### 3.2 Shared Data (Supabase)
| Table | teknomed-web | 3d-viewer | catalog-new |
|-------|-------------|-----------|-------------|
| products | read (published) | read (has_3d=true) | read (all published) |
| product_3d_assets | - | read (model path) | - |
| projects | read | - | - |
| services | read | - | - |
| testimonials | read | - | - |
| site_settings | read | - | read (contact info) |
| inquiries | insert (public) + read/update (admin) | - | - |
| pages | read | - | - |

### 3.3 Deployment Topology
| Project | Domain | Hosting |
|---------|--------|---------|
| teknomed-web | teknomedindotimurpt.co.id | VPS (Nginx static) |
| 3d-viewer | 3d.teknomedindotimurpt.co.id | VPS (Nginx static) |
| catalog-new (PDF service) | api.teknomedindotimurpt.co.id | VPS (Node + Puppeteer) |
| Supabase | [ref].supabase.co | Supabase cloud |

### 3.4 Build & Deploy Commands
```bash
# teknomed-web
cd D:\playgrounds\teknomed-web
npm run build
scp -r dist/* root@VPS:/var/www/teknomed-web/

# 3d-viewer
cd D:\playgrounds\3d-product-catalog\3dproductvisualization
npm run build
scp -r dist/* root@VPS:/var/www/3d-viewer/

# catalog-new (PDF service)
cd C:\Users\warma\Documents\brosur-lin\catalog-new
# Tidak di-deploy sebagai static, tapi di-render oleh Node service di VPS
# Node service: fetch Supabase → write specs.json → astro build → puppeteer PDF
```

### 3.5 Environment Variables
| Project | Env | Value |
|---------|-----|-------|
| teknomed-web | `VITE_SUPABASE_URL` | `https://jssqoalxnmkpmogouypy.supabase.co` |
| teknomed-web | `VITE_SUPABASE_ANON_KEY` | `eyJ...anon...` |
| teknomed-web | `VITE_3D_VIEWER_URL` | `https://3d.teknomedindotimurpt.co.id` |
| 3d-viewer | `VITE_SUPABASE_URL` | `https://jssqoalxnmkpmogouypy.supabase.co` |
| 3d-viewer | `VITE_SUPABASE_ANON_KEY` | `eyJ...anon...` |
| PDF service | `SUPABASE_URL` | `https://jssqoalxnmkpmogouypy.supabase.co` |
| PDF service | `SUPABASE_SERVICE_KEY` | `eyJ...service_role...` |
| PDF service | `RESEND_API_KEY` | `re_xxx` |
| PDF service | `PORT` | `3001` |
