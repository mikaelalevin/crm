import { createClient } from "@/lib/supabase/server";
import { getBrandId } from "@/lib/brand";
import { Greeting } from "./Greeting";

const ink = "#1A1614";
const inkMuted = "#8A6E55";
const inkSoft = "#5A4232";
const border = "#DDD0B5";
const bg = "#FAF5EB";
const warm = "#F2E8D0";
const card = "#FFFFFF";

export default async function DashboardPage() {
  const supabase = await createClient();
  const brandId = await getBrandId();

  const { data: brandsData } = await supabase
    .from("brands")
    .select("name, id")
    .eq("id", brandId)
    .limit(1);

  const brand = (brandsData?.[0] ?? null) as { id: string; name: string } | null;

  const now = new Date();
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 86_400_000).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86_400_000).toISOString();

  const [
    { data: customersData, count: totalCustomers },
    { data: activeData, count: activeCount },
    { data: newThisMonthData, count: newThisMonth },
    { data: recentOrdersData },
    { data: churnRiskData, count: churnRiskCount },
  ] = await Promise.all([
    supabase
      .from("customers")
      .select("total_spent, order_count", { count: "exact" })
      .eq("brand_id", brandId),
    supabase
      .from("customers")
      .select("id", { count: "exact" })
      .eq("brand_id", brandId)
      .gte("last_order_at", ninetyDaysAgo),
    supabase
      .from("customers")
      .select("id", { count: "exact" })
      .eq("brand_id", brandId)
      .gte("created_at", thirtyDaysAgo),
    supabase
      .from("orders")
      .select("id, total, created_at, items, customer_id, customers!inner(first_name, last_name, email, brand_id)")
      .eq("customers.brand_id", brandId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("customers")
      .select("id", { count: "exact" })
      .eq("brand_id", brandId)
      .lt("last_order_at", ninetyDaysAgo)
      .gte("last_order_at", new Date(now.getTime() - 180 * 86_400_000).toISOString()),
  ]);

  const customers = (customersData ?? []) as { total_spent: number; order_count: number }[];
  const totalRevenue = customers.reduce((sum, c) => sum + (c.total_spent ?? 0), 0);
  const totalOrders = customers.reduce((sum, c) => sum + (c.order_count ?? 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const recentOrders = ((recentOrdersData ?? []) as unknown[]).map((o) => o as {
    id: string;
    total: number;
    created_at: string;
    items: unknown[];
    customer_id: string;
    customers: { first_name: string | null; last_name: string | null; email: string };
  });

  const kpis = [
    {
      label: "Kunder totalt",
      value: (totalCustomers ?? 0).toLocaleString("sv"),
      sub: newThisMonth ? `+${newThisMonth} senaste 30 dagarna` : "Inga nya senaste månaden",
      positive: (newThisMonth ?? 0) > 0,
    },
    {
      label: "Total omsättning",
      value: totalRevenue > 0 ? totalRevenue.toLocaleString("sv") + " kr" : "–",
      sub: `Fördelat på ${totalOrders} ordrar`,
      positive: true,
    },
    {
      label: "Aktiva kunder",
      value: (activeCount ?? 0).toLocaleString("sv"),
      sub: "Köpt senaste 90 dagarna",
      positive: true,
    },
    {
      label: "Snitt köpvärde",
      value: avgOrderValue > 0 ? Math.round(avgOrderValue).toLocaleString("sv") + " kr" : "–",
      sub: "Per order",
      positive: true,
    },
  ];

  return (
    <div className="animate-fade-in">
      <Greeting brandName={brand?.name} />

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-2xl p-5" style={{ background: card, border: `1px solid ${border}` }}>
            <div className="text-[11px] uppercase tracking-[0.08em] font-medium mb-2" style={{ color: inkMuted }}>
              {kpi.label}
            </div>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 28, color: ink, lineHeight: 1 }}>
              {kpi.value}
            </div>
            <div className="mt-2 text-[11.5px]" style={{ color: kpi.positive ? "#6B7A63" : "#C45224" }}>
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Featured AI card */}
      <div className="rounded-2xl overflow-hidden mb-5" style={{ background: card, border: `1px solid ${border}` }}>
        <div className="relative overflow-hidden" style={{ height: 140, background: "linear-gradient(135deg, #D9896A 0%, #C45224 100%)" }}>
          <div className="absolute inset-0" style={{ opacity: 0.12, backgroundImage: "radial-gradient(circle at 30% 30%, white 0.5px, transparent 1px)", backgroundSize: "22px 22px" }} />
          <span className="absolute text-[10.5px] uppercase tracking-[0.1em] font-semibold px-[9px] py-[4px] rounded-xl" style={{ top: 16, left: 20, background: "rgba(255,255,255,0.92)", color: ink }}>
            Stammisar · Klar att handla
          </span>
        </div>
        <div style={{ padding: "26px 28px" }}>
          <h2 className="leading-snug mb-3" style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 400, fontSize: 26, color: ink, letterSpacing: "-0.01em" }}>
            Dina stammisar är redo att handla igen
          </h2>
          <p className="text-[14px] leading-relaxed mb-5" style={{ color: inkSoft, maxWidth: 560 }}>
            Kunder i segmentet <strong style={{ color: ink }}>Stammisar</strong> har inte fått ett mejl på 18 dagar. Baserat på deras köpcykel är 73% redo att handla nu — genomsnittlig ordervärde {avgOrderValue > 0 ? Math.round(avgOrderValue).toLocaleString("sv") + " kr" : "1 840 kr"}.
          </p>
          <div className="flex gap-2.5">
            <a href="/campaigns" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-medium" style={{ background: ink, color: bg, textDecoration: "none", fontFamily: "inherit" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14"/></svg>
              Skapa kampanj
            </a>
            <a href="/segments" className="inline-flex items-center px-4 py-2.5 rounded-xl text-[13px] font-medium" style={{ background: warm, color: ink, textDecoration: "none", fontFamily: "inherit" }}>
              Visa segment
            </a>
          </div>
        </div>
      </div>

      {/* Two smaller cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="rounded-2xl overflow-hidden" style={{ background: card, border: `1px solid ${border}` }}>
          <div className="relative overflow-hidden" style={{ height: 90, background: "linear-gradient(135deg, #C9A961 0%, #8A7038 100%)" }}>
            <div className="absolute inset-0" style={{ opacity: 0.12, backgroundImage: "radial-gradient(circle at 30% 30%, white 0.5px, transparent 1px)", backgroundSize: "22px 22px" }} />
            <span className="absolute text-[10.5px] uppercase tracking-[0.1em] font-semibold px-[9px] py-[4px] rounded-xl" style={{ top: 14, left: 16, background: "rgba(255,255,255,0.92)", color: ink }}>
              VIP · Win-back
            </span>
          </div>
          <div style={{ padding: "22px 24px" }}>
            <h3 className="leading-snug mb-2" style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 400, fontSize: 19, color: ink }}>
              {churnRiskCount ?? 0} kunder visar tecken på att försvinna
            </h3>
            <p className="text-[13px] leading-relaxed mb-4" style={{ color: inkSoft }}>
              Köpfrekvensen har minskat senaste 90 dagarna. Skicka en personlig win-back med exklusiv förhandsvisning.
            </p>
            <a href="/customers" className="inline-flex items-center px-4 py-2 rounded-xl text-[13px] font-medium" style={{ background: ink, color: bg, textDecoration: "none", fontFamily: "inherit" }}>
              Se kunder i riskzon →
            </a>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: card, border: `1px solid ${border}` }}>
          <div className="relative overflow-hidden" style={{ height: 90, background: "linear-gradient(135deg, #673C34 0%, #3A1E10 100%)" }}>
            <div className="absolute inset-0" style={{ opacity: 0.12, backgroundImage: "radial-gradient(circle at 30% 30%, white 0.5px, transparent 1px)", backgroundSize: "22px 22px" }} />
            <span className="absolute text-[10.5px] uppercase tracking-[0.1em] font-semibold px-[9px] py-[4px] rounded-xl" style={{ top: 14, left: 16, background: "rgba(255,255,255,0.92)", color: ink }}>
              Timing · Insikt
            </span>
          </div>
          <div style={{ padding: "22px 24px" }}>
            <h3 className="leading-snug mb-2" style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 400, fontSize: 19, color: ink }}>
              Söndagar 19:00 är din bästa tid att skicka
            </h3>
            <p className="text-[13px] leading-relaxed mb-4" style={{ color: inkSoft }}>
              Mejl skickade vid den här tiden har 38% högre öppningsrate. LUMA föreslår att flytta veckokampanjen från måndag morgon.
            </p>
            <a href="/campaigns" className="inline-flex items-center px-4 py-2 rounded-xl text-[13px] font-medium" style={{ background: warm, color: ink, textDecoration: "none", fontFamily: "inherit" }}>
              Tillämpa på nästa kampanj →
            </a>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      {recentOrders.length > 0 && (
        <div className="rounded-2xl mb-8" style={{ background: card, border: `1px solid ${border}` }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${border}` }}>
            <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 400, fontSize: 18, color: ink }}>
              Senaste ordrar
            </h2>
            <a href="/customers" className="text-[12px] font-medium" style={{ color: inkMuted, textDecoration: "none" }}>
              Visa alla kunder →
            </a>
          </div>
          <div>
            {recentOrders.map((order, i) => {
              const c = order.customers;
              const name = [c.first_name, c.last_name].filter(Boolean).join(" ") || c.email;
              const initials = [c.first_name, c.last_name].filter(Boolean).map((n) => n![0]).join("").toUpperCase() || c.email.slice(0, 2).toUpperCase();
              const items = Array.isArray(order.items) ? order.items : [];
              const firstItem = items[0] as Record<string, unknown> | undefined;
              const itemName = firstItem ? String(firstItem.name ?? firstItem.title ?? "") : "";
              const extraCount = items.length > 1 ? items.length - 1 : 0;
              const date = new Date(order.created_at).toLocaleDateString("sv-SE", { day: "numeric", month: "short" });

              return (
                <div key={order.id} className="flex items-center gap-4 px-6 py-4" style={{ borderBottom: i < recentOrders.length - 1 ? `1px solid ${border}` : "none" }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0" style={{ background: "linear-gradient(135deg, #D9896A, #C07858)" }}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold" style={{ color: ink }}>{name}</div>
                    <div className="text-[12px] mt-0.5 truncate" style={{ color: inkMuted }}>
                      {itemName}{extraCount > 0 ? ` +${extraCount} till` : ""}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 15, color: ink }}>
                      {order.total.toLocaleString("sv")} kr
                    </div>
                    <div className="text-[11.5px] mt-0.5" style={{ color: inkMuted }}>{date}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div>
        <h2 className="mb-4" style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 400, fontSize: 20, color: ink, letterSpacing: "-0.01em" }}>
          Snabba vägar
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              href: "/customers",
              label: "Kunder",
              sub: totalCustomers ? `${totalCustomers} kunder` : "Hantera och sök",
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" /></svg>,
            },
            {
              href: "/segments",
              label: "Segment",
              sub: "3 manuella segment",
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
            },
            {
              href: "/campaigns",
              label: "Kampanjer",
              sub: "Skapa kampanj",
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4 20-7z" /></svg>,
            },
            {
              href: "/saljare/ny",
              label: "Säljare",
              sub: "Team & tilldelning",
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
            },
          ].map((link) => (
            <a key={link.href} href={link.href} className="flex flex-col gap-3 rounded-2xl p-5 transition-all" style={{ background: card, border: `1px solid ${border}`, textDecoration: "none" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: warm, color: ink }}>
                {link.icon}
              </div>
              <div>
                <div className="font-semibold text-[13.5px]" style={{ color: ink }}>{link.label}</div>
                <div className="text-[12px] mt-0.5" style={{ color: inkMuted }}>{link.sub}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
