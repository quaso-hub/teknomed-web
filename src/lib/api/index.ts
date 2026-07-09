import { supabase } from '../supabase';
import { PRODUCTS, getProductBySlug } from '../../data/products';
import { PROJECTS, getProjectById } from '../../data/projects';
import { services } from '../../data/services';
import { TESTIMONIALS } from '../../data/testimonials';
import { HOME_STATS } from '../../data/stats';
import { getCatalogSpecs } from '../../data/catalog-specs';
import type { Product, Project, Service, Testimonial } from '../../types';
import type { Stat } from '../../data/stats';
import type { ComponentType } from 'react';
import {
  Hammer, Zap, Layers3, Gauge, Snowflake, Stethoscope,
  Syringe, Wind, SquareStack, HardHat, Package,
} from 'lucide-react';

// ─── snake_case → camelCase utility ───────────────────────────────────────────

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/** Recursively convert all snake_case keys in an object to camelCase. */
function snakeToCamelObj<T = any>(obj: Record<string, any>): T {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamelObj) as T;
  }
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    const result: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      result[snakeToCamel(key)] = snakeToCamelObj(obj[key]);
    }
    return result as T;
  }
  return obj as T;
}

// ─── Icon resolution (Supabase stores icon as a string name) ──────────────────

const ICON_COMPONENTS: Record<string, ComponentType<{ className?: string; size?: number; color?: string }>> = {
  Hammer, Zap, Layers3, Gauge, Snowflake, Stethoscope,
  Syringe, Wind, SquareStack, HardHat, Package,
};

function resolveIcon(icon: string | ComponentType<any>): ComponentType<any> {
  if (typeof icon === 'string') {
    return ICON_COMPONENTS[icon] ?? Hammer;
  }
  return icon;
}

// ─── Local data fallbacks (full field set matching component expectations) ─────

const mappedTestimonials: Testimonial[] = TESTIMONIALS.map(t => ({
  id: t.id,
  name: t.name,
  role: t.role,
  company: t.company,
  content: t.quote,
  quote: t.quote,
  rating: 5,
  projectContext: t.projectContext,
}));

const mappedProducts: Product[] = PRODUCTS.map(p => ({
  slug: p.slug,
  name: p.name,
  shortName: p.shortName,
  summary: p.summary || p.desc,
  desc: p.desc,
  description: p.desc,
  bullets: p.bullets,
  specs: p.specs,
  category: p.category,
  tags: p.tags,
  icon: p.icon,
  catalogSpecs: getCatalogSpecs(p.slug),
}));

const mappedProjects: Project[] = PROJECTS.map(p => ({
  id: p.id.toString(),
  title: p.title,
  subtitle: p.subtitle,
  category: p.category,
  location: p.area,
  area: p.area,
  year: p.year,
  description: p.highlight,
  highlight: p.highlight,
  image: p.imageUrl,
  imageUrl: p.imageUrl,
  scope: p.scope,
  tags: p.tags,
  mapQuery: p.mapQuery,
}));

// ─── API ──────────────────────────────────────────────────────────────────────

export const api = {
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Supabase getProducts error:', error.message);
        return mappedProducts;
      }
      if (!data || data.length === 0) {
        return mappedProducts;
      }
      // Convert snake_case columns → camelCase, then resolve icon strings
      const converted = (data as any[]).map(row => {
        const obj = snakeToCamelObj<Product>(row);
        obj.icon = resolveIcon(obj.icon);
        // Parse JSONB string fields to arrays/objects
        if (typeof obj.viewerConfig === 'string') {
          try { obj.viewerConfig = JSON.parse(obj.viewerConfig); } catch {}
        }
        if (typeof obj.specs === 'string') {
          try { obj.specs = JSON.parse(obj.specs); } catch {}
        }
        if (typeof obj.bullets === 'string') {
          try { obj.bullets = JSON.parse(obj.bullets); } catch {}
        }
        if (typeof obj.tags === 'string') {
          try { obj.tags = JSON.parse(obj.tags); } catch {}
        }
        if (typeof obj.gallery === 'string') {
          try { obj.gallery = JSON.parse(obj.gallery); } catch {}
        }
        return obj;
      });
      return converted;
    } catch (err) {
      console.error('getProducts exception:', err);
      return mappedProducts;
    }
  },

  async getProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase.from('projects').select('*');
      if (error) {
        console.error('Supabase getProjects error:', error.message);
        return mappedProjects;
      }
      if (!data || data.length === 0) {
        return mappedProjects;
      }
      return data.map(row => snakeToCamelObj<Project>(row));
    } catch (err) {
      console.error('getProjects exception:', err);
      return mappedProjects;
    }
  },

  async getServices(): Promise<Service[]> {
    try {
      const { data, error } = await supabase.from('services').select('*');
      if (error) {
        console.error('Supabase getServices error:', error.message);
        return services;
      }
      if (!data || data.length === 0) {
        return services;
      }
      return data.map(row => snakeToCamelObj<Service>(row));
    } catch (err) {
      console.error('getServices exception:', err);
      return services;
    }
  },

  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const { data, error } = await supabase.from('testimonials').select('*');
      if (error) {
        console.error('Supabase getTestimonials error:', error.message);
        return mappedTestimonials;
      }
      if (!data || data.length === 0) {
        return mappedTestimonials;
      }
      return data.map(row => snakeToCamelObj<Testimonial>(row));
    } catch (err) {
      console.error('getTestimonials exception:', err);
      return mappedTestimonials;
    }
  },

  async getStats(): Promise<Stat[]> {
    try {
      const { data, error } = await supabase.from('stats').select('*');
      if (error) {
        console.error('Supabase getStats error:', error.message);
        return HOME_STATS;
      }
      if (!data || data.length === 0) {
        return HOME_STATS;
      }
      return data.map(row => snakeToCamelObj<Stat>(row));
    } catch (err) {
      console.error('getStats exception:', err);
      return HOME_STATS;
    }
  },
  
  async submitInquiry(data: any) {
    try {
      const { error } = await supabase.from('inquiries').insert([data]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('submitInquiry exception:', err);
      return false;
    }
  }
};

export const { submitInquiry } = api;
