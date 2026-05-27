/**
 * Data layer: homepage statistics
 * Single source of truth - dipakai Home.tsx (dan future page)
 *
 * Tone: EatNaked-style - 3 metric konkret + label deskriptif singkat.
 */
import { Building2, MapPin, Layers3, type LucideIcon } from 'lucide-react'

export interface Stat {
  value: number
  suffix: string
  label: string
  sub: string
  icon: LucideIcon
}

export const HOME_STATS: Stat[] = [
  { value: 2021, suffix: '', label: 'Sejak', sub: 'Aktif & beroperasi', icon: Building2 },
  { value: 5,    suffix: '', label: 'Area Layanan', sub: 'Jatim, Bali, NTB, NTT, Sulawesi', icon: MapPin },
  { value: 6,    suffix: '+', label: 'Layanan Inti', sub: 'MEP, Gas Medis, HVAC, MOT', icon: Layers3 },
]
