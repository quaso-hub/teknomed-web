import { supabase } from '../supabase';
import { PRODUCTS, getProductBySlug } from '../../data/products';
import { PROJECTS, getProjectById } from '../../data/projects';
import { services } from '../../data/services';
import { TESTIMONIALS } from '../../data/testimonials';
import { HOME_STATS } from '../../data/stats';
import type { Product, Project, Service, Testimonial } from '../../types';
import type { Stat } from '../../data/stats';

// Map local testimonial format to shared type
const mappedTestimonials: Testimonial[] = TESTIMONIALS.map(t => ({
  id: t.id,
  name: t.name,
  role: t.role,
  company: t.company,
  content: t.quote,
  rating: 5,
}));

// Map local product format to shared type
const mappedProducts: Product[] = PRODUCTS.map(p => ({
  slug: p.slug,
  name: p.name,
  summary: p.summary || p.desc,
  description: p.desc,
  bullets: p.bullets || [],
  category: p.category,
  tags: p.tags,
}));

// Map local project format to shared type
const mappedProjects: Project[] = PROJECTS.map(p => ({
  id: p.id.toString(),
  title: p.title,
  category: p.category === 'Konstruksi' ? 'construction' : 'sales',
  location: p.subtitle || p.area,
  year: parseInt(p.year, 10),
  description: p.highlight,
  image: p.imageUrl,
}));

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
      return data as Product[];
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
      return data as Project[];
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
      return data as Service[];
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
      return data as Testimonial[];
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
      return data as unknown as Stat[];
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
