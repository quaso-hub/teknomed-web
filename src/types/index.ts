/**
 * Shared type definitions for Teknomed ecosystem.
 * Prep for multi-project consumption.
 */

/** Core service offering */
export interface Service {
  slug: string
  title: string
  description: string
  icon: string // lucide icon name
  category: 'construction' | 'sales' | 'maintenance'
}

/** Product catalog item */
export interface Product {
  slug: string
  name: string
  summary: string
  description?: string
  bullets: string[]
  category: string
  tags: string[]
}

/** Testimonial / social proof */
export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating?: number
}

/** Project portfolio entry */
export interface Project {
  id: string
  title: string
  category: 'construction' | 'sales' | 'maintenance'
  location: string
  year: number
  description: string
  image?: string
}

/** FAQ entry */
export interface FAQ {
  question: string
  answer: string
  category?: string
}

/** Navigation link */
export interface NavLink {
  to: string
  label: string
  icon?: string
}
