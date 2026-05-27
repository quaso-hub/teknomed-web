/**
 * Data layer: service catalog
 * Isolated from components for reuse across projects.
 */
import { type Service } from '../types'
import { Hammer, Zap, Layers3, Gauge, Snowflake, Stethoscope } from 'lucide-react'

export const services: Service[] = [
  {
    slug: 'civil-work',
    title: 'Civil Work',
    description: 'Infrastruktur sipil, pondasi, dan koordinasi lapangan untuk fasilitas kesehatan.',
    icon: 'Hammer',
    category: 'construction',
  },
  {
    slug: 'electrical',
    title: 'Electrical',
    description: 'Pemasangan, pemeliharaan, dan perbaikan sistem kelistrikan rumah sakit.',
    icon: 'Zap',
    category: 'construction',
  },
  {
    slug: 'mot',
    title: 'MOT',
    description: 'Modular Operating Theatre, ICU, clean room, partisi, dan plafon modular.',
    icon: 'Layers3',
    category: 'construction',
  },
  {
    slug: 'mechanical',
    title: 'Mechanical',
    description: 'Analisis, desain, manufaktur, dan pemeliharaan sistem mekanikal.',
    icon: 'Gauge',
    category: 'construction',
  },
  {
    slug: 'hvac',
    title: 'HVAC',
    description: 'Kontrol suhu, kelembapan, dan ventilasi untuk kenyamanan serta kesehatan.',
    icon: 'Snowflake',
    category: 'construction',
  },
  {
    slug: 'gas-medis',
    title: 'Instalasi Gas Medis',
    description: 'Pasokan, pengelolaan, dan kontrol gas medis untuk prosedur kesehatan.',
    icon: 'Stethoscope',
    category: 'construction',
  },
]

/** Map icon name to Lucide component */
export const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Hammer, Zap, Layers3, Gauge, Snowflake, Stethoscope,
}
