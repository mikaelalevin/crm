alter table customers add column if not exists ai_prediction jsonb;
alter table customers add column if not exists ai_prediction_at timestamptz;
