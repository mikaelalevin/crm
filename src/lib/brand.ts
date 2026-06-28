import { createClient } from "@/lib/supabase/server";

export async function getBrandId(): Promise<string> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from("brands")
        .select("id")
        .eq("owner_id", user.id)
        .order("created_at")
        .limit(1);
      return (data?.[0] as { id: string } | undefined)?.id ?? "";
    }
  } catch {
    // fall through to demo brand ID
  }

  return process.env.NEXT_PUBLIC_DEMO_BRAND_ID ?? "";
}
