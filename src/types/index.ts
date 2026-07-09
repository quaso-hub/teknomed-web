/**
 * Shared type definitions for Teknomed ecosystem.
 * Prep for multi-project consumption.
 *
 * Fields are a superset of what components access.
 * Supabase returns snake_case — the API layer converts to camelCase
 * before the data reaches these types.
 */
import type { ComponentType } from 'react'

/** A single spec entry from the catalog brochure (label + value pair). */
export interface CatalogSpecItem {
  label: string
  value: string
}

/** A named group of catalog specs (e.g. "AHU Double Skin", "X-Ray Viewer"). */
export interface CatalogSpecGroup {
  title: string
  items: CatalogSpecItem[]
  quantity?: number
  unit?: string
}

/** Core service offering */
export interface Service {
  slug: string
  title: string
  description: string
  icon: string // lucide icon name
  category: 'construction' | 'sales' | 'maintenance'
}

/** Product catalog item — superset of local data/products.ts + Supabase columns */
export interface Product {
  slug: string
  name: string
  shortName: string
  summary?: string
  desc: string
  description?: string
  bullets?: string[]
  specs: string[]
  category: string
  tags: string[]
  icon: ComponentType<{ className?: string; size?: number; color?: string }>
  /** Detailed engineering specs from catalog brochure, grouped by component. */
  catalogSpecs?: CatalogSpecGroup[]
}

/** Testimonial / social proof */
export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  quote?: string
  rating?: number
  projectContext?: string
}

/** Project portfolio entry — superset of local data/projects.ts + Supabase columns */
export interface Project {
  id: string
  title: string
  subtitle?: string
  category: string
  location: string
  area?: string
  year: number | string
  description?: string
  highlight?: string
  image?: string
  imageUrl?: string
  scope?: string[]
  tags?: string[]
  mapQuery?: string
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

/** Admin user role — matches Supabase profiles.role CHECK constraint */
export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'viewer'

/** Admin user profile from profiles table */
export interface AdminProfile {
  id: string
  email: string | null
  full_name: string | null
  role: AdminRole
  created_at: string
  updated_at: string
}
