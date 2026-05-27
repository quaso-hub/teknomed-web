## 2.11 Phase 4 (REVISED): Web-Wide Premium Style Polish

CATATAN PENTING: Section ini DIREVISI 2026-05-27. Versi sebelumnya salah arah
(canvas image-sequence untuk product hero) - itu untuk product 3D visualizer
yang dikerjakan di sesi/project terpisah, bukan tanggung jawab repo ini.

Phase 4 di repo ini = mengangkat seluruh tampilan web ke level premium yang
inspirasinya dari worldofnrg, vaonis hyperia, shader.se, digitalists.at,
eatnaked.co - tetapi di-tone-down ke medical contractor authority.

### Decision (locked)
- Tetap motion/react + Lenis. Tidak migrate ke GSAP, R3F, atau WebGPU.
- Tidak ada Three.js di route mana pun untuk Phase 4 (Three.js viewer di
  src/components/Product3DViewer.tsx tetap parked sampai project lain butuh).
- Fokus 100 persen pada visual polish DOM + CSS + motion/react + Lenis.

### Pattern yang Diadopsi (cherry-pick dari section 2.8)

1. Cursor rotation skew - DONE di Phase 3.1.
2. Pre-split WordReveal upgrade - DONE di Phase 3.2.
3. Editorial chapter prefix - DONE di Phase 3.3 (PRJ + ITM).
4. Easing default global - DONE di Phase 3.5 (PREMIUM_EASE).
5. Dual-Lenis pattern - DONE di Phase 1.3.

### Yang Belum Dikerjakan (Phase 4 task list baru)

4.1 Glass Card Variant (NRG pattern)
- Tambah variant 'glass' ke src/components/ui/Card.tsx
- backdrop-filter blur(1rem) + bg rgba 0.2 + GPU detect fallback
- Pakai di section yang butuh depth tanpa bobot 3D
- Effort: 1-2 jam

4.2 Floating Ambient SVG Icons (EatNaked pattern, medical version)
- Buat 5-7 SVG icon medical (gas valve, panel HVAC, modular wall, fan,
  filter, manifold) - simple monoline gaya Iconsax/Phosphor
- Position absolute di Hero Home dengan blur 4-6px per layer
- One-shot reveal: motion.div initial autoAlpha 0 translateZ 300, stagger random
- Tidak loop animasi - parallax dari Lenis scroll yang natural
- Effort: 3-4 jam (sebagian besar buat SVG asset)

4.3 Markers Rail Section Indicator (EatNaked pattern)
- SVG line vertical di sisi kiri ProductDetail/Projects
- Saat scroll masuk section, marker aktif morph dari path lurus ke wave
- Pakai motion.svg dengan pathLength scrollProgress
- Effort: 2-3 jam

4.4 Gradient Border Animation (sudah ada di index.css .gradient-border)
- Pakai di Card hero atau key section sebagai accent visual
- Effort: 30 menit (cuma apply ke 1-2 lokasi)

4.5 Scroll-Driven Reveal Audit
- Pastikan setiap section pakai PREMIUM_EASE
- Stagger orchestration antara CharReveal, ClipReveal, ScaleReveal di Hero
- Effort: 1-2 jam fine-tuning

### Acceptance Phase 4 (Revised)
- Tidak ada Three.js di build graph
- Bundle main tetap dibawah 290 KB / 90 KB gzip
- CSS tetap dibawah 65 KB / 12 KB gzip
- Lighthouse Performance >= 90 mobile di /
- Visual: glass card + floating SVG + markers rail terlihat di setidaknya 2 page

### Yang TIDAK termasuk Phase 4 (di-defer atau handed off)
- 3D product viewer (di-handle sesi/project lain owner)
- glTF model integration
- WebGL shader (NoiseMeshGradient.tsx tetap parked)
- Image-sequence hero canvas (overkill untuk medical brand)
