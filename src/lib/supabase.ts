import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Если ключей нет, сайт работает в демо-режиме: заказы и кабинет хранятся в браузере.
export const supabase: SupabaseClient | null =
  url && key && !url.includes('your-project') ? createClient(url, key) : null

export const isDemo = !supabase
