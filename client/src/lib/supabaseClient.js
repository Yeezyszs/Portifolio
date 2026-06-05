import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY ausentes. Copie .env.example para .env.'
  );
}

// Cliente do browser com a anon key. A sessão é persistida e o token é
// renovado automaticamente pelo SDK.
export const supabase = createClient(url ?? '', anonKey ?? '');
