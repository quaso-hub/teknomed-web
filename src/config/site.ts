/**
 * Site configuration - single source of truth untuk company info.
 * Nanti saat koneksi ke 2 project lain, ini bisa jadi shared package
 * atau di-fetch dari API. Sekarang tetap static untuk simplicity.
 */
export const SITE = {
  name: 'PT Teknomed Indo Timur',
  shortName: 'Teknomed',
  tagline: 'Medical Contractor',
  description:
    'Solusi konstruksi fasilitas kesehatan: MEP, tata udara, instalasi gas medis, Modular Operating Theatre, dan maintenance.',
  founded: 2021,

  contact: {
    email: 'teknomedindotimurpt@gmail.com',
    phone: '+62 812-4436-0317',
    phoneHref: 'tel:+6281244360317',
    whatsapp: 'https://wa.me/6281244360317',
  },

  address: {
    full: 'Perumahan Tamansari Metropolitan, Cluster Lihaga, Ruko No.19, Paniki Bawah, Mapanget, Manado, Sulawesi Utara 95256',
    city: 'Manado',
    province: 'Sulawesi Utara',
    zipCode: '95256',
  },

  hours: {
    weekdays: 'Senin - Jumat, 08.00 - 17.00 WITA',
    weekend: 'Sabtu & Minggu: Tutup',
  },

  serviceAreas: ['Jawa Timur', 'Bali', 'NTB', 'NTT', 'Sulawesi'],

  logo: '/logo_pt.png',
  favicon: '/favicon.svg',

  /** SEO */
  url: 'https://teknomedindotimurpt.co.id',
  titleTemplate: '%s | PT Teknomed Indo Timur',
  defaultTitle: 'PT Teknomed Indo Timur - Medical Contractor',
  ogImage: '/logo_pt.png',
} as const
