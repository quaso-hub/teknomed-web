import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cznygqrxvxttxmmkpody.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bnlncXJ4dnh0dHhtbWtwb2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MDg2MzIsImV4cCI6MjA5NzI4NDYzMn0.VnKumGt_y1NALcITNkUY_DsnhSMf8zhI6hklu1GD2HM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
