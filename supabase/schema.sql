-- От Души: схема базы для Supabase.
-- Как применить: Supabase Dashboard -> SQL Editor -> вставить этот файл -> Run. Затем так же выполнить seed.sql.

-- ============ Каталог ============
create table if not exists public.agencies (
  id text primary key,
  slug text unique not null,
  name text not null,
  short_name text not null,
  legal_form text,
  address text not null,
  address_note text,
  okrug text,
  phones jsonb not null default '[]',
  email text,
  hours text,
  dispatcher24 boolean default false,
  about text,
  strengths text[] default '{}',
  rating numeric(2,1),
  needs_check text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists public.product_types (
  id text primary key,
  category text not null,
  name text not null,
  base_price integer not null,
  unit text,
  art text,
  description text,
  params jsonb default '[]',
  traditions text[],
  forms text[],
  per_guest boolean default false
);

create table if not exists public.offers (
  id text primary key,
  type_id text not null references public.product_types(id) on delete cascade,
  agency_id text not null references public.agencies(id) on delete cascade,
  name text not null,
  variant text,
  price integer not null check (price >= 0),
  available text not null default 'today' check (available in ('today','tomorrow','order')),
  rating numeric(2,1),
  reviews_count integer default 0,
  palette integer default 0,
  active boolean default true,
  updated_at timestamptz default now()
);
create index if not exists offers_type_idx on public.offers(type_id);
create index if not exists offers_agency_idx on public.offers(agency_id);

-- ============ Заказы ============
create table if not exists public.orders (
  id uuid primary key,
  number text unique not null,
  created_at timestamptz not null default now(),
  customer_email text not null,
  customer_name text not null,
  customer_phone text not null,
  details jsonb not null default '{}',
  payment jsonb not null default '{}',
  total integer not null,
  source text not null default 'catalog' check (source in ('support','catalog'))
);
create index if not exists orders_email_idx on public.orders(lower(customer_email));

create table if not exists public.order_parts (
  id uuid primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  agency_id text not null references public.agencies(id),
  status text not null default 'pending' check (status in ('pending','confirmed','in_progress','done','declined')),
  subtotal integer not null,
  items jsonb not null default '[]',
  updated_at timestamptz not null default now()
);
create index if not exists order_parts_order_idx on public.order_parts(order_id);
create index if not exists order_parts_agency_idx on public.order_parts(agency_id);

-- Сотрудники служб (для будущего кабинета службы на Supabase)
create table if not exists public.agency_members (
  user_id uuid not null references auth.users(id) on delete cascade,
  agency_id text not null references public.agencies(id) on delete cascade,
  primary key (user_id, agency_id)
);

-- ============ Заявки и отзывы ============
create table if not exists public.callback_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text not null,
  preferred_time text,
  topic text,
  created_at timestamptz default now()
);

create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  inn text not null,
  contact text not null,
  phone text not null,
  email text not null,
  services text[] default '{}',
  comment text,
  created_at timestamptz default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  target text not null,            -- id предложения или 'agency:<slug>'
  author text not null,
  rating integer not null check (rating between 1 and 5),
  text text not null,
  order_id uuid references public.orders(id) on delete set null,
  user_id uuid default auth.uid(),
  approved boolean default true,
  created_at timestamptz default now()
);
create index if not exists reviews_target_idx on public.reviews(target);

-- ============ Доступ (RLS) ============
alter table public.agencies enable row level security;
alter table public.product_types enable row level security;
alter table public.offers enable row level security;
alter table public.orders enable row level security;
alter table public.order_parts enable row level security;
alter table public.agency_members enable row level security;
alter table public.callback_requests enable row level security;
alter table public.partner_applications enable row level security;
alter table public.reviews enable row level security;

-- Каталог читают все
create policy "catalog read agencies" on public.agencies for select using (true);
create policy "catalog read types" on public.product_types for select using (true);
create policy "catalog read offers" on public.offers for select using (true);

-- Заказ может создать любой посетитель (кабинет создаётся после оплаты по почте).
-- Важно: перед боевым запуском перенесите создание заказа в Edge Function вместе с платёжным провайдером.
create policy "orders insert" on public.orders for insert to anon, authenticated with check (true);
create policy "order parts insert" on public.order_parts for insert to anon, authenticated with check (true);

-- Вспомогательные функции (security definer), чтобы политики orders и order_parts не ссылались друг на друга по кругу
create or replace function public.is_agency_member(aid text) returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.agency_members where agency_id = aid and user_id = auth.uid())
$$;
create or replace function public.order_email(oid uuid) returns text
  language sql stable security definer set search_path = public as $$
  select lower(customer_email) from public.orders where id = oid
$$;
create or replace function public.order_has_agency_member(oid uuid) returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.order_parts p join public.agency_members m on m.agency_id = p.agency_id
    where p.order_id = oid and m.user_id = auth.uid()
  )
$$;

-- Семья видит свои заказы по почте, с которой вошла
create policy "orders select own" on public.orders for select to authenticated
  using (lower(customer_email) = lower(auth.jwt() ->> 'email'));
create policy "order parts select own" on public.order_parts for select to authenticated
  using (public.order_email(order_id) = lower(auth.jwt() ->> 'email'));

-- Служба видит и меняет только свои части заказов
create policy "orders select agency" on public.orders for select to authenticated
  using (public.order_has_agency_member(id));
create policy "order parts select agency" on public.order_parts for select to authenticated
  using (public.is_agency_member(agency_id));
create policy "order parts update agency" on public.order_parts for update to authenticated
  using (public.is_agency_member(agency_id));
create policy "agency members self" on public.agency_members for select to authenticated using (user_id = auth.uid());
create policy "offers update agency" on public.offers for update to authenticated
  using (public.is_agency_member(agency_id));

-- Заявки только создаются, читать их можно из Dashboard
create policy "callback insert" on public.callback_requests for insert to anon, authenticated with check (true);
create policy "partner app insert" on public.partner_applications for insert to anon, authenticated with check (true);

-- Отзывы
create policy "reviews read" on public.reviews for select using (approved);
create policy "reviews insert" on public.reviews for insert to anon, authenticated with check (rating between 1 and 5);
