-- MUSE Initial Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── BRANDS ───────────────────────────────────────────────────────────────────
create table brands (
  id            uuid primary key default uuid_generate_v4(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  slug          text not null unique,
  shopify_domain text,
  settings      jsonb default '{}',
  brand_voice_json jsonb default '{}',
  created_at    timestamptz not null default now()
);

alter table brands enable row level security;

create policy "brands_owner" on brands
  for all using (auth.uid() = owner_id);

-- ─── CUSTOMERS ────────────────────────────────────────────────────────────────
create table customers (
  id            uuid primary key default uuid_generate_v4(),
  brand_id      uuid not null references brands(id) on delete cascade,
  email         text not null,
  first_name    text,
  last_name     text,
  created_at    timestamptz not null default now(),
  total_spent   numeric(12,2) not null default 0,
  order_count   int not null default 0,
  last_order_at timestamptz,
  last_visit_at timestamptz,
  total_visits  int not null default 0,
  unique (brand_id, email)
);

alter table customers enable row level security;

create policy "customers_brand_owner" on customers
  for all using (
    exists (
      select 1 from brands where brands.id = customers.brand_id and brands.owner_id = auth.uid()
    )
  );

create index customers_brand_idx on customers(brand_id);

-- ─── ORDERS ───────────────────────────────────────────────────────────────────
create table orders (
  id               uuid primary key default uuid_generate_v4(),
  customer_id      uuid not null references customers(id) on delete cascade,
  total            numeric(12,2) not null,
  created_at       timestamptz not null default now(),
  items            jsonb not null default '[]',
  shopify_order_id text
);

alter table orders enable row level security;

create policy "orders_brand_owner" on orders
  for all using (
    exists (
      select 1 from customers c
      join brands b on b.id = c.brand_id
      where c.id = orders.customer_id and b.owner_id = auth.uid()
    )
  );

create index orders_customer_idx on orders(customer_id);

-- ─── RECEIPTS ─────────────────────────────────────────────────────────────────
create table receipts (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references orders(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  file_url    text,
  created_at  timestamptz not null default now()
);

alter table receipts enable row level security;

create policy "receipts_brand_owner" on receipts
  for all using (
    exists (
      select 1 from customers c
      join brands b on b.id = c.brand_id
      where c.id = receipts.customer_id and b.owner_id = auth.uid()
    )
  );

-- ─── WEB SESSIONS ─────────────────────────────────────────────────────────────
create table web_sessions (
  id               uuid primary key default uuid_generate_v4(),
  customer_id      uuid not null references customers(id) on delete cascade,
  started_at       timestamptz not null default now(),
  pageviews        int not null default 0,
  products_viewed  jsonb not null default '[]',
  duration_seconds int not null default 0
);

alter table web_sessions enable row level security;

create policy "web_sessions_brand_owner" on web_sessions
  for all using (
    exists (
      select 1 from customers c
      join brands b on b.id = c.brand_id
      where c.id = web_sessions.customer_id and b.owner_id = auth.uid()
    )
  );

create index web_sessions_customer_idx on web_sessions(customer_id);

-- ─── PRODUCTS ─────────────────────────────────────────────────────────────────
create table products (
  id                 uuid primary key default uuid_generate_v4(),
  brand_id           uuid not null references brands(id) on delete cascade,
  name               text not null,
  price              numeric(12,2) not null default 0,
  image_url          text,
  category           text,
  shopify_product_id text
);

alter table products enable row level security;

create policy "products_brand_owner" on products
  for all using (
    exists (
      select 1 from brands where brands.id = products.brand_id and brands.owner_id = auth.uid()
    )
  );

create index products_brand_idx on products(brand_id);

-- ─── SEGMENTS ─────────────────────────────────────────────────────────────────
create table segments (
  id             uuid primary key default uuid_generate_v4(),
  brand_id       uuid not null references brands(id) on delete cascade,
  name           text not null,
  description    text not null default '',
  mood_gradient  text not null default 'romantics',
  customer_count int not null default 0,
  avg_ltv        numeric(12,2) not null default 0,
  ai_suggestion  text not null default '',
  criteria_json  jsonb not null default '{}',
  created_at     timestamptz not null default now()
);

alter table segments enable row level security;

create policy "segments_brand_owner" on segments
  for all using (
    exists (
      select 1 from brands where brands.id = segments.brand_id and brands.owner_id = auth.uid()
    )
  );

create index segments_brand_idx on segments(brand_id);

-- ─── SEGMENT MEMBERSHIPS ──────────────────────────────────────────────────────
create table segment_memberships (
  id                        uuid primary key default uuid_generate_v4(),
  segment_id                uuid not null references segments(id) on delete cascade,
  customer_id               uuid not null references customers(id) on delete cascade,
  probability_to_purchase   numeric(5,4) not null default 0,
  predicted_next_product_id uuid references products(id),
  unique (segment_id, customer_id)
);

alter table segment_memberships enable row level security;

create policy "segment_memberships_brand_owner" on segment_memberships
  for all using (
    exists (
      select 1 from segments s
      join brands b on b.id = s.brand_id
      where s.id = segment_memberships.segment_id and b.owner_id = auth.uid()
    )
  );

create index segment_memberships_segment_idx on segment_memberships(segment_id);
create index segment_memberships_customer_idx on segment_memberships(customer_id);

-- ─── CAMPAIGNS ────────────────────────────────────────────────────────────────
create table campaigns (
  id           uuid primary key default uuid_generate_v4(),
  brand_id     uuid not null references brands(id) on delete cascade,
  segment_id   uuid references segments(id),
  channel      text not null default 'email',
  subject      text,
  body         text,
  scheduled_at timestamptz,
  status       text not null default 'draft',
  ai_generated boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table campaigns enable row level security;

create policy "campaigns_brand_owner" on campaigns
  for all using (
    exists (
      select 1 from brands where brands.id = campaigns.brand_id and brands.owner_id = auth.uid()
    )
  );

create index campaigns_brand_idx on campaigns(brand_id);

-- ─── LAUNCHES ─────────────────────────────────────────────────────────────────
create table launches (
  id                    uuid primary key default uuid_generate_v4(),
  brand_id              uuid not null references brands(id) on delete cascade,
  product_id            uuid references products(id),
  launch_date           date,
  target_segments       jsonb not null default '[]',
  campaign_sequence_json jsonb not null default '[]',
  created_at            timestamptz not null default now()
);

alter table launches enable row level security;

create policy "launches_brand_owner" on launches
  for all using (
    exists (
      select 1 from brands where brands.id = launches.brand_id and brands.owner_id = auth.uid()
    )
  );

-- ─── AI INSIGHTS ──────────────────────────────────────────────────────────────
create table ai_insights (
  id           uuid primary key default uuid_generate_v4(),
  brand_id     uuid not null references brands(id) on delete cascade,
  type         text not null default 'general',
  title        text not null,
  body         text not null,
  action_label text,
  priority     int not null default 0,
  created_at   timestamptz not null default now()
);

alter table ai_insights enable row level security;

create policy "ai_insights_brand_owner" on ai_insights
  for all using (
    exists (
      select 1 from brands where brands.id = ai_insights.brand_id and brands.owner_id = auth.uid()
    )
  );

create index ai_insights_brand_idx on ai_insights(brand_id, created_at desc);

-- ─── STORAGE BUCKET ───────────────────────────────────────────────────────────
-- Run in Supabase dashboard or via CLI: supabase storage create receipts
-- insert into storage.buckets (id, name, public) values ('receipts', 'receipts', false);
