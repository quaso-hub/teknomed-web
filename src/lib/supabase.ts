import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jssqoalxnmkpmogouypy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3FvYWx4bm1rcG1vZ291eXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwODgwMDcsImV4cCI6MjA5NjY2NDAwN30.NCtOrsbefv4c3wN5DGwe10r8eXoF-uGEI3zpEvZfg_I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
