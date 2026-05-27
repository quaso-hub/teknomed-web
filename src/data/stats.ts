/**
 * Data layer: homepage statistics
 * Single source of truth - dipakai Home.tsx (dan future page)
 */
import { Building2, Activity, ShieldCheck, type LucideIcon } from 'lucide-react'

export interface Stat {
  value: number
  suffix: string
  label: string
  sub: string
  icon: LucideIcon
}

export const HOME_STATS: Stat[] = [
  { value: 2021, suffix: '', label: 'Berdiri', sub: 'Aktif & beroperasi', icon: Building2 },
  { value: 6, suffix: '+', label: 'Layanan', sub: 'MEP, Gas, HVAC, MOT', icon: Activity },
  { value: 100, suffix: '%', label: 'Fokus medis', sub: 'Fasilitas kesehatan', icon: ShieldCheck },
]
