import { AppShell } from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/server";
import { getBrandId } from "@/lib/brand";
import { ShopifyConnect } from "./ShopifyConnect";

const ink = "#1A1614";
const inkMuted = "#8A6E55";

export default async function SettingsPage() {
  const supabase = await createClient();
  const brandId = await getBrandId();

  let shopifyDomain: string | null = null;
  let shopifySyncedAt: string | null = null;
  let isConnected = false;

  if (brandId) {
    const { data } = await supabase
      .from("brands")
      .select("shopify_domain, shopify_access_token, shopify_synced_at")
      .eq("id", brandId)
      .single();

    if (data) {
      shopifyDomain = data.shopify_domain ?? null;
      shopifySyncedAt = data.shopify_synced_at ?? null;
      isConnected = !!(data.shopify_domain && data.shopify_access_token);
    }
  }

  return (
    <AppShell>
      <div className="animate-fade-in max-w-2xl">
        <div className="mb-8">
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 400, fontSize: 34, color: ink, letterSpacing: "-0.01em" }}>
            Integrationer
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: inkMuted }}>
            Koppla dina verktyg för att samla kunddata på ett ställe.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {brandId ? (
            <ShopifyConnect
              brandId={brandId}
              initialDomain={shopifyDomain}
              initialSyncedAt={shopifySyncedAt}
              isConnected={isConnected}
            />
          ) : (
            <div className="rounded-2xl px-6 py-5 text-[13px]" style={{ border: "1px solid #DDD0B5", color: inkMuted, background: "#FFFFFF" }}>
              Inget varumärke hittades.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
