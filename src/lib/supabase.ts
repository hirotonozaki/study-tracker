import { createClient } from '@supabase/supabase-js';

// .env の環境変数から Supabase クライアントを生成する
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Supabase の環境変数が未設定です。.env に VITE_SUPABASE_URL と VITE_SUPABASE_ANON_KEY を設定してください。',
  );
}

export const supabase = createClient(url, anonKey);
