/**
 * Data layer: homepage statistics
 */
import { Building2, Activity, ShieldCheck } from 'lucide-react'

export interface Stat {
  value: number
  suffix: string
  label: string
  iconName: string
  icon: React.ComponentType<{ className?: string }>
}

export const stats: Stat[] = [
  { value: 2021, suffix: '', label: 'Tahun berdiri', iconName: 'Building2', icon: Building2 },
  { value: 6, suffix: '+', label: 'Layanan utama', iconName: 'Activity', icon: Activity },
  { value: 100, suffix: '%', label: 'Fokus kesehatan', iconName: 'ShieldCheck', icon: ShieldCheck },
]
