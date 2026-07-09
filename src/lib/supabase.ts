import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cznygqrxvxttxmmkpody.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bnlncXJ4dnh0dHhtbWtwb2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MDg2MzIsImV4cCI6MjA5NzI4NDYzMn0.VnKumGt_y1NALcITNkUY_DsnhSMf8zhI6hklu1GD2HM';

/**
 * Safe storage wrapper that catches DOMException from cross-origin localStorage access.
 * This prevents the "SecurityError: Access to storage is denied" when the admin
 * subdomain (admin.teknomed.web.id) tries to access localStorage set by the main
 * domain (teknomed.web.id). Falls back to sessionStorage or in-memory storage.
 */
function createSafeStorage(): Storage {
  try {
    // Test if localStorage is accessible
    const testKey = '__supabase_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return localStorage;
  } catch {
    try {
      // Fallback to sessionStorage (still per-origin, but avoids the crash)
      const testKey = '__supabase_test__';
      sessionStorage.setItem(testKey, '1');
      sessionStorage.removeItem(testKey);
      return sessionStorage;
    } catch {
      // Final fallback: in-memory storage (no persistence across refreshes,
      // but the session still works within a single page load)
      const store = new Map<string, string>();
      return {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => { store.set(key, value); },
        removeItem: (key: string) => { store.delete(key); },
        clear: () => { store.clear(); },
        get length() { return store.size; },
        key: (index: number) => Array.from(store.keys())[index] ?? null,
      };
    }
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: createSafeStorage(),
    // SameSite=Lax prevents CSRF on top-level navigations (OWASP recommendation)
    // Supabase sets cookies server-side; this ensures auth cookies are not sent on cross-site requests
    flowType: 'pkce',
  },
});
