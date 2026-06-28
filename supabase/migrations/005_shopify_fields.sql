-- Shopify integration fields

-- brands: access token + last sync timestamp
alter table brands add column if not exists shopify_access_token text;
alter table brands add column if not exists shopify_synced_at timestamptz;

-- customers: track Shopify customer ID for reliable deduplication
alter table customers add column if not exists shopify_customer_id text;
create unique index if not exists customers_shopify_id_idx on customers(brand_id, shopify_customer_id)
  where shopify_customer_id is not null;

-- orders: unique constraint on shopify_order_id required for upsert
create unique index if not exists orders_shopify_order_id_idx on orders(shopify_order_id)
  where shopify_order_id is not null;
