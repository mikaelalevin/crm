import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBrandId } from "@/lib/brand";
import { SaljareView } from "./SaljareView";

interface Customer {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  total_spent: number | null;
  order_count: number | null;
  sales_rep_id: string | null;
}

export default async function SaljareDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: repData } = await supabase
    .from("sales_reps")
    .select("id, name, color, email")
    .eq("id", id)
    .single();

  if (!repData) notFound();

  const rep = repData as { id: string; name: string; color: string; email: string | null };

  const brandId = await getBrandId();

  // Fetch all brand customers
  const { data: allCustomersData } = await supabase
    .from("customers")
    .select("id, email, first_name, last_name, total_spent, order_count, sales_rep_id")
    .eq("brand_id", brandId)
    .order("total_spent", { ascending: false });

  const allCustomers = (allCustomersData ?? []) as Customer[];
  const assigned = allCustomers.filter((c) => c.sales_rep_id === id);
  const unassigned = allCustomers.filter((c) => c.sales_rep_id !== id);

  return (
    <SaljareView
      rep={rep}
      initialAssigned={assigned}
      allCustomers={[...assigned, ...unassigned]}
    />
  );
}
