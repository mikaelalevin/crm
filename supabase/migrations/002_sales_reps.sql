-- Sales reps within a brand (no separate auth needed)
create table sales_reps (
  id         uuid primary key default uuid_generate_v4(),
  brand_id   uuid not null references brands(id) on delete cascade,
  name       text not null,
  color      text not null default '#D4A5A0',
  created_at timestamptz not null default now()
);

alter table sales_reps enable row level security;

create policy "sales_reps_brand_owner" on sales_reps
  for all using (
    exists (
      select 1 from brands where brands.id = sales_reps.brand_id and brands.owner_id = auth.uid()
    )
  );

create index sales_reps_brand_idx on sales_reps(brand_id);

-- Link customers to a sales rep
alter table customers add column sales_rep_id uuid references sales_reps(id) on delete set null;
create index customers_sales_rep_idx on customers(sales_rep_id);
