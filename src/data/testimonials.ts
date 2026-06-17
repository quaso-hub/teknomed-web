/**
 * Testimonials - social proof untuk B2B medical contractor.
 * Pattern: EatNaked testimonial slider (photo + role + quote).
 *
 * NOTE: Data ini placeholder realistis. Owner harap ganti dengan
 * testimonial asli dari klien (RSUD, RS Siloam, RS Bethesda, dll)
 * saat Phase 5 content audit. Lihat PLAN.md section 3 (Phase 5).
 */
export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  company: string
  /** Project context untuk credibility */
  projectContext: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'tm-01',
    quote:
      'Tim Teknomed menyelesaikan instalasi Modular Operating Theatre kami sesuai standar ISO 14644. Koordinasi MEP, HVAC, dan gas medis berjalan tertib, commissioning lancar tanpa revisi major.',
    name: 'dr. Manoppo, M.Kes',
    role: 'Kepala Instalasi Bedah Sentral',
    company: 'RSUD Dr. Sam Ratulangi',
    projectContext: 'Proyek MOT, Manado 2023',
  },
  {
    id: 'tm-02',
    quote:
      'Kami mempercayakan instalasi gas medis terpadu 3 lantai kepada Teknomed. Dokumentasi commissioning lengkap, pressure testing sesuai HTM 02-01, dan after-sales support responsif.',
    name: 'Ir. Lengkong',
    role: 'Manajer Fasilitas dan Sarana',
    company: 'RS Siloam Manado',
    projectContext: 'MGPS multi-lantai, Manado 2021',
  },
  {
    id: 'tm-03',
    quote:
      'Untuk ruang isolasi tekanan negatif di tengah pandemi, Teknomed merespons cepat. Sistem HEPA filtration dan monitoring tekanan real-time sesuai standar WHO. Tim teknis paham kebutuhan fasyankes.',
    name: 'dr. Tumbol, Sp.PD',
    role: 'Komite PPI',
    company: 'RS Bethesda Tomohon',
    projectContext: 'Ruang Isolasi, Tomohon 2022',
  },
  {
    id: 'tm-04',
    quote:
      'Rehabilitasi laboratorium Puskesmas kami selesai tepat waktu dengan kualitas finishing yang rapi. Instalasi gas medis, electrical upgrade, dan ventilasi exhaust dikerjakan terkoordinasi tanpa mengganggu pelayanan.',
    name: 'Ns. Waworuntu, M.Kes',
    role: 'Kepala Puskesmas',
    company: 'Puskesmas Mapanget',
    projectContext: 'Rehab Lab, Manado 2022',
  },
]
