import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** Ошибка входа из ссылки в письме (например, ссылка устарела). Читаем до того, как Supabase очистит адрес. */
function readAuthError(): { code: string | null; description: string | null } | null {
  if (typeof window === 'undefined') return null
  const h = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const q = new URLSearchParams(window.location.search)
  const code = h.get('error_code') || q.get('error_code')
  const description = h.get('error_description') || q.get('error_description')
  return code || description ? { code, description } : null
}
export const authUrlError = readAuthError()

// Если ключей нет, сайт работает в демо-режиме: заказы и кабинет хранятся в браузере.
export const supabase: SupabaseClient | null =
  url && key && !url.includes('your-project')
    ? createClient(url, key, {
        auth: { flowType: 'implicit', detectSessionInUrl: true, persistSession: true, autoRefreshToken: true },
      })
    : null

export const isDemo = !supabase
