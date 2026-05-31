import { createClient } from "@/lib/supabase/server";
import { getBrandId } from "@/lib/brand";
import { AppShell } from "@/components/layout/AppShell";
import { AiRecommendationsList } from "./AiRecommendationsList";

export default async function AiRecommendationsPage() {
  const supabase = await createClient();
  const brandId = await getBrandId();

  const { data: customersData } = await supabase
    .from("customers")
    .select("id, email, first_name, last_name, total_spent, order_count, last_order_at, ai_prediction, ai_prediction_at")
    .eq("brand_id", brandId)
    .order("total_spent", { ascending: false })
    .limit(50);

  const customers = (customersData ?? []) as {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    total_spent: number | null;
    order_count: number | null;
    last_order_at: string | null;
    ai_prediction: Record<string, unknown> | null;
    ai_prediction_at: string | null;
  }[];

  return (
    <AppShell>
      <AiRecommendationsList customers={customers} />
    </AppShell>
  );
}
