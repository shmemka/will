// Генерирует supabase/seed.sql из тех же данных, что использует сайт.
// Запуск: npm run seed:sql
import { writeFileSync } from 'node:fs'
import { AGENCIES } from '../src/data/agencies'
import { OFFERS, TYPES } from '../src/data/catalog'

const q = (v: unknown): string => {
  if (v === null || v === undefined) return 'null'
  if (typeof v === 'number') return String(v)
  if (typeof v === 'boolean') return v ? 'true' : 'false'
  if (Array.isArray(v) && v.every((x) => typeof x === 'string')) return `array[${v.map(q).join(',')}]::text[]`
  if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`
  return `'${String(v).replace(/'/g, "''")}'`
}

const lines: string[] = ['-- Сгенерировано scripts/generate-seed.ts. Демо-данные каталога.', 'begin;']

for (const a of AGENCIES) {
  lines.push(
    `insert into public.agencies (id, slug, name, short_name, legal_form, address, address_note, okrug, phones, email, hours, dispatcher24, about, strengths, rating, needs_check) values (${[
      a.id, a.slug, a.name, a.short, a.legalForm, a.address, a.addressNote, a.okrug, a.phones, a.email, a.hours, a.dispatcher24, a.about, a.strengths, a.rating, a.needsCheck ?? [],
    ].map(q).join(', ')}) on conflict (id) do update set name = excluded.name, address = excluded.address, phones = excluded.phones, email = excluded.email;`,
  )
}
for (const t of TYPES) {
  lines.push(
    `insert into public.product_types (id, category, name, base_price, unit, art, description, params, traditions, forms, per_guest) values (${[
      t.id, t.category, t.name, t.base, t.unit, t.art, t.desc, t.params, t.traditions ?? null, t.forms ?? null, !!t.perGuest,
    ].map(q).join(', ')}) on conflict (id) do nothing;`,
  )
}
for (const o of OFFERS) {
  lines.push(
    `insert into public.offers (id, type_id, agency_id, name, variant, price, available, rating, reviews_count, palette) values (${[
      o.id, o.typeId, o.agencyId, o.name, o.variant, o.price, o.available, o.rating, o.reviews, o.palette,
    ].map(q).join(', ')}) on conflict (id) do nothing;`,
  )
}
lines.push('commit;')
writeFileSync(new URL('../supabase/seed.sql', import.meta.url), lines.join('\n') + '\n')
console.log(`seed.sql: ${AGENCIES.length} служб, ${TYPES.length} типов, ${OFFERS.length} предложений`)
