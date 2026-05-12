import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://zkquchdaizdjrvlsncbs.supabase.co'
export const supabaseKey = 'sb_publishable_bPO42kQg7TtPM3im9_LBNA_-6-BSw93'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
