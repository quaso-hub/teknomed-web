import { type LucideIcon, Wind, Syringe, Home, Building2, Layers3, Calendar, MapPin } from 'lucide-react'

export interface Project {
  id: number
  title: string
  subtitle: string
  category: 'Konstruksi' | 'Penjualan'
  area: string
  year: string
  scope: string[]
  tags: string[]
  highlight: string
  imageUrl: string
  mapQuery: string
}

export interface ScopeCategory {
  label: string
  icon: LucideIcon
  count: number
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Modular Operating Theatre',
    subtitle: 'RSUD Dr. Sam Ratulangi, Manado',
    category: 'Konstruksi',
    area: 'Sulawesi',
    year: '2023',
    scope: ['Panel modular dinding & plafon', 'Integrasi HVAC & gas medis', 'Pintu hermetik & kontrol tekanan', 'Electrical & lighting'],
    tags: ['MOT', 'Cleanroom', 'MEP'],
    highlight: 'Ruang operasi modular standar internasional',
    imageUrl: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80',
    mapQuery: 'RSUD+Dr+Sam+Ratulangi+Manado+Sulawesi+Utara',
  },
  {
    id: 2,
    title: 'Chiller Ruang Radiology',
    subtitle: 'Klinik Spesialis, Manado',
    category: 'Konstruksi',
    area: 'Sulawesi',
    year: '2023',
    scope: ['Instalasi chiller dedicated', 'Sistem kontrol temperatur', 'Monitoring & alarm', 'Commissioning & testing'],
    tags: ['Chiller', 'Radiologi', 'HVAC'],
    highlight: 'Pendinginan presisi untuk peralatan radiologi',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80',
    mapQuery: 'Manado+Sulawesi+Utara+Indonesia',
  },
  {
    id: 3,
    title: 'Ruang Isolasi Tekanan Negatif',
    subtitle: 'RS Bethesda, Tomohon',
    category: 'Konstruksi',
    area: 'Sulawesi',
    year: '2022',
    scope: ['Konstruksi ruang isolasi', 'Sistem tekanan negatif', 'HEPA filtration', 'Monitoring tekanan real-time'],
    tags: ['Isolasi', 'HVAC', 'Cleanroom'],
    highlight: 'Standar WHO untuk ruang isolasi infeksius',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80',
    mapQuery: 'RS+Bethesda+Tomohon+Sulawesi+Utara',
  },
  {
    id: 4,
    title: 'Rehabilitasi Laboratorium',
    subtitle: 'Puskesmas Mapanget, Manado',
    category: 'Konstruksi',
    area: 'Sulawesi',
    year: '2022',
    scope: ['Renovasi total laboratorium', 'Instalasi gas medis', 'Upgrade electrical', 'Ventilasi & exhaust'],
    tags: ['Laboratorium', 'Renovasi', 'MEP'],
    highlight: 'Upgrade fasilitas lab sesuai standar Kemenkes',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80',
    mapQuery: 'Puskesmas+Mapanget+Manado+Sulawesi+Utara',
  },
  {
    id: 5,
    title: 'Lab PCR & Isolasi RITN',
    subtitle: 'RSUP Prof. Kandou, Manado',
    category: 'Konstruksi',
    area: 'Sulawesi',
    year: '2021',
    scope: ['Laboratorium PCR biosafety level 2', 'Ruang isolasi tekanan negatif', 'HVAC & filtrasi khusus', 'Gas medis & electrical'],
    tags: ['PCR', 'Biosafety', 'Isolasi'],
    highlight: 'Fasilitas PCR pertama di Sulawesi Utara',
    imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80',
    mapQuery: 'RSUP+Prof+Kandou+Manado+Sulawesi+Utara',
  },
  {
    id: 6,
    title: 'Instalasi Gas Medis Terpadu',
    subtitle: 'RS Siloam, Manado',
    category: 'Konstruksi',
    area: 'Sulawesi',
    year: '2021',
    scope: ['Jaringan pipa gas medis 3 lantai', 'Outlet O2, N2O, Vacuum, Air', 'Manifold & alarm panel', 'Commissioning & sertifikasi'],
    tags: ['Gas Medis', 'Pipeline', 'Instalasi'],
    highlight: 'Sistem gas medis terintegrasi multi-lantai',
    imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80',
    mapQuery: 'RS+Siloam+Manado+Sulawesi+Utara',
  },
]

export const SCOPE_CATEGORIES: ScopeCategory[] = [
  { label: 'Tata Udara', icon: Wind, count: 4 },
  { label: 'Maintenance Gas Medis', icon: Syringe, count: 3 },
  { label: 'Ruangan', icon: Home, count: 5 },
  { label: 'Bangunan', icon: Building2, count: 6 },
]

export const PROJECT_AREAS = ['Jawa Timur', 'Bali', 'NTB', 'NTT', 'Sulawesi'] as const

export const PROJECT_STATS = [
  { label: 'Total Proyek', getValue: () => `${PROJECTS.length}+`, icon: Layers3 },
  { label: 'Tahun Aktif', getValue: () => '2021-Sekarang', icon: Calendar },
  { label: 'Area Layanan', getValue: () => `${PROJECT_AREAS.length}`, icon: MapPin },
] as const

export const PROJECT_CATEGORIES = ['Semua', 'Konstruksi', 'Penjualan'] as const
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]

export function getProjectById(id: number): Project | undefined {
  return PROJECTS.find((p) => p.id === id)
}
