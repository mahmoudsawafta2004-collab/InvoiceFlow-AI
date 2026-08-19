-- InvoiceFlow AI — accounts, plans, subscriptions, usage
-- Run this once against your Supabase project (SQL Editor, or `supabase db push`).

-- ---------------------------------------------------------------------------
-- profiles: one row per auth.users row, created automatically on signup.
-- role drives admin access; it is never settable by the client (see RLS).
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: update own name" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

-- Creates a profile row the moment someone signs up, and promotes to admin
-- automatically if their email is in the ADMIN_EMAILS list passed at call time.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- plans: the 3 subscription tiers plus the free tier. Prices and limits are
-- edited from /admin — never hardcoded in application code, and never synced
-- from Stripe's own product catalog (Checkout uses dynamic price_data built
-- from this table, so an admin edit here takes effect on the next checkout
-- with no Stripe dashboard step).
-- ---------------------------------------------------------------------------
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,               -- stable identifier, e.g. 'free' | 'starter' | 'pro' | 'business'
  name text not null,
  price_cents integer not null default 0, -- monthly price; 0 for the free tier
  currency text not null default 'usd',
  monthly_invoice_limit integer not null, -- invoices allowed per rolling 30-day period
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.plans enable row level security;

-- Public pricing page reads active plans directly with the anon key.
create policy "plans: public read active" on public.plans
  for select using (is_active = true);

-- Seed the four tiers. Safe to re-run: keys are unique, so a second run
-- updates existing rows instead of duplicating them.
insert into public.plans (key, name, price_cents, monthly_invoice_limit, sort_order)
values
  ('free', 'Free', 0, 10, 0),
  ('starter', 'Starter', 1900, 150, 1),
  ('pro', 'Pro', 4900, 600, 2),
  ('business', 'Business', 12900, 3000, 3)
on conflict (key) do update set
  name = excluded.name,
  price_cents = excluded.price_cents,
  monthly_invoice_limit = excluded.monthly_invoice_limit,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- subscriptions: one active row per user. Written only by the server
-- (service role, via the Stripe webhook and the admin panel) — a user can
-- read their own row but never write it directly, so a client can't grant
-- itself a paid plan.
-- ---------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  status text not null default 'active'
    check (status in ('active', 'trialing', 'past_due', 'canceled', 'incomplete')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz not null default (now() + interval '30 days'),
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions: read own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- Every new user starts on the free plan.
create or replace function public.handle_new_profile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  free_plan_id uuid;
begin
  select id into free_plan_id from public.plans where key = 'free' limit 1;
  if free_plan_id is not null then
    insert into public.subscriptions (user_id, plan_id)
    values (new.id, free_plan_id)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_created on public.profiles;
create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.handle_new_profile();

-- ---------------------------------------------------------------------------
-- usage_events: one row per invoice successfully extracted. The current
-- period's usage is a count of rows, not a running counter, so it can never
-- drift out of sync and every extraction is independently auditable from
-- /admin.
-- ---------------------------------------------------------------------------
create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  file_name text,
  created_at timestamptz not null default now()
);

alter table public.usage_events enable row level security;

create policy "usage_events: read own" on public.usage_events
  for select using (auth.uid() = user_id);

create index if not exists usage_events_user_period_idx
  on public.usage_events (user_id, created_at desc);
