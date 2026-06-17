import { Zap, Wind, SquareStack, HardHat, Syringe, Package, type LucideIcon } from 'lucide-react'

export interface Product {
  slug: string
  name: string
  shortName: string
  category: 'Konstruksi' | 'Penjualan'
  icon: LucideIcon
  desc: string
  specs: string[]
  tags: string[]
  /** Longer summary for detail page (falls back to desc if absent). */
  summary?: string
  /** Process-oriented bullets for detail page coverage section. */
  bullets?: string[]
}

export const PRODUCTS: Product[] = [
  {
    slug: 'mgps',
    name: 'Medical Gas Pipeline System',
    shortName: 'MGPS',
    category: 'Konstruksi',
    icon: Syringe,
    desc: 'Perencanaan dan instalasi jaringan gas medis untuk fasilitas kesehatan.',
    summary: 'Solusi perencanaan dan instalasi jaringan gas medis untuk fasilitas kesehatan.',
    bullets: [
      'Perencanaan jalur pipa dan titik outlet sesuai standar',
      'Instalasi sistem distribusi gas medis (O2, N2O, Vacuum, dll)',
      'Pengujian kebocoran dan commissioning',
      'Maintenance berkala dan after-sales support',
    ],
    specs: [
      'O2, N2O, CO2, Vacuum, Air Medis',
      'Sesuai standar HTM 02-01 & NFPA 99',
      'Commissioning & pressure testing',
      'Sertifikasi dan dokumentasi lengkap',
    ],
    tags: ['Gas Medis', 'Pipeline', 'Instalasi'],
  },
  {
    slug: 'mot',
    name: 'Modular Operating Theatre',
    shortName: 'MOT',
    category: 'Konstruksi',
    icon: SquareStack,
    desc: 'Ruang operasi modular yang dapat dikustomisasi sesuai standar dan kebutuhan.',
    summary: 'Ruang operasi modular yang dapat dikustomisasi sesuai standar dan kebutuhan.',
    bullets: [
      'Panel modular dinding dan plafon dengan finishing anti-bakteri',
      'Integrasi HVAC, electrical, dan sistem pendukung',
      'Pintu hermetik dan sistem kontrol tekanan',
      'Maintenance dan after-sales support',
    ],
    specs: [
      'Panel modular anti-bakteri',
      'Integrasi HVAC & electrical',
      'Pintu hermetik & kontrol tekanan',
      'Sesuai standar ISO 14644',
    ],
    tags: ['Ruang Operasi', 'Modular', 'Cleanroom'],
  },
  {
    slug: 'hvac-cleanroom',
    name: 'HVAC & Cleanroom',
    shortName: 'HVAC',
    category: 'Konstruksi',
    icon: Wind,
    desc: 'Sistem tata udara untuk kenyamanan, kontrol temperatur, dan kebersihan ruangan.',
    summary: 'Sistem tata udara untuk kenyamanan, kontrol temperatur, dan kebersihan ruangan.',
    bullets: [
      'Perencanaan load dan kebutuhan airflow',
      'Instalasi AHU, ducting, dan diffuser',
      'Balancing dan testing sesuai standar',
      'Sistem filtrasi HEPA untuk cleanroom',
    ],
    specs: [
      'AHU, FCU, ducting & diffuser',
      'Filtrasi HEPA H13/H14',
      'Balancing & commissioning',
      'BMS integration',
    ],
    tags: ['HVAC', 'Cleanroom', 'Filtrasi'],
  },
  {
    slug: 'electrical-mechanical',
    name: 'Electrical & Mechanical',
    shortName: 'E&M',
    category: 'Konstruksi',
    icon: Zap,
    desc: 'Pekerjaan mekanikal dan elektrikal untuk proyek rumah sakit dan klinik.',
    summary: 'Pekerjaan mekanikal dan elektrikal untuk proyek rumah sakit dan klinik.',
    bullets: [
      'Instalasi panel listrik dan distribusi daya',
      'Sistem grounding dan proteksi petir',
      'Instalasi pompa, plumbing, dan fire protection',
      'Koordinasi MEP terintegrasi',
    ],
    specs: [
      'Panel MDP, SDP, distribusi daya',
      'Grounding & lightning protection',
      'Pompa, plumbing & fire protection',
      'Koordinasi MEP terintegrasi',
    ],
    tags: ['Electrical', 'Mechanical', 'MEP'],
  },
  {
    slug: 'radiology-chiller',
    name: 'Radiology Room Chiller',
    shortName: 'Chiller',
    category: 'Penjualan',
    icon: HardHat,
    desc: 'Sistem pendinginan khusus untuk ruang radiologi.',
    summary: 'Sistem pendinginan khusus untuk ruang radiologi.',
    bullets: [
      'Chiller dedicated untuk peralatan radiologi',
      'Kontrol temperatur presisi',
      'Monitoring dan alarm system',
      'Maintenance preventif berkala',
    ],
    specs: [
      'Chiller dedicated radiologi',
      'Kontrol temperatur presisi ±0.5°C',
      'Monitoring & alarm system',
      'Maintenance preventif berkala',
    ],
    tags: ['Chiller', 'Radiologi', 'Pendinginan'],
  },
  {
    slug: 'consumables-spareparts',
    name: 'Consumables & Spare Parts',
    shortName: 'Sparepart',
    category: 'Penjualan',
    icon: Package,
    desc: 'Pengadaan consumable dan spare part peralatan medis.',
    summary: 'Pengadaan consumable dan spare part peralatan medis.',
    bullets: [
      'Filter HEPA dan pre-filter',
      'Spare part AHU dan ducting',
      'Komponen gas medis (valve, regulator, outlet)',
      'Consumable maintenance rutin',
    ],
    specs: [
      'Filter HEPA & pre-filter',
      'Spare part AHU & ducting',
      'Komponen gas medis (valve, regulator)',
      'Consumable maintenance rutin',
    ],
    tags: ['Consumable', 'Spare Part', 'Pengadaan'],
  },
]

export const PRODUCT_CATEGORIES = ['Semua', 'Konstruksi', 'Penjualan'] as const
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}
