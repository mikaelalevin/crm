import { createClient } from "@/lib/supabase/server";

const MOCK_CUSTOMERS = [
  { initials: "EW", gradient: "linear-gradient(135deg,#D4A5A0,#B47A75)", name: "Elsa Wikström", email: "elsa.w@gmail.com", segment: "Stammisar", segColor: "#F4DDD9", segText: "#6F3F3A", ltv: "32 400 kr", next: "22 maj · Linen Mini Dress", prob: 92, status: "Aktiv", statusColor: "#DDE7D7", statusText: "#3E4F36" },
  { initials: "AL", gradient: "linear-gradient(135deg,#C9A961,#8A7038)", name: "Amanda Lundqvist", email: "amanda@studio.se", segment: "VIP-kunder", segColor: "#F2E5C5", segText: "#6A4E1B", ltv: "41 800 kr", next: "24 maj · Cashmere Cardigan", prob: 89, status: "VIP", statusColor: "#DDE7D7", statusText: "#3E4F36" },
  { initials: "FM", gradient: "linear-gradient(135deg,#1A1614,#4D3A35)", name: "Felicia Magnusson", email: "felicia.m@me.com", segment: "Nya kunder", segColor: "#1A1614", segText: "#FAF7F2", ltv: "11 200 kr", next: "20 maj · Oversized Blazer", prob: 87, status: "Aktiv", statusColor: "#DDE7D7", statusText: "#3E4F36" },
  { initials: "VK", gradient: "linear-gradient(135deg,#A8B5A0,#6B7A63)", name: "Vera Karlsson", email: "vera.k@gmail.com", segment: "Vänner & familj", segColor: "#DDE7D7", segText: "#3E4F36", ltv: "980 kr", next: "28 maj · Cotton T-shirt", prob: 64, status: "Ny", statusColor: "#DDE7D7", statusText: "#3E4F36" },
  { initials: "JE", gradient: "linear-gradient(135deg,#6B4F5B,#3D2C35)", name: "Johanna Ekberg", email: "johanna.e@hotmail.com", segment: "På väg bort", segColor: "#E3D5DC", segText: "#4D3540", ltv: "14 600 kr", next: "Osäker", prob: 22, status: "Risk", statusColor: "#F4DDD9", statusText: "#6F3F3A" },
  { initials: "CN", gradient: "linear-gradient(135deg,#C8BCAE,#A8998A)", name: "Carolina Nilsson", email: "carolina.n@me.com", segment: "Inaktiva kunder", segColor: "#F2EDE5", segText: "#5C544F", ltv: "6 200 kr", next: "Behöver aktivering", prob: 18, status: "Inaktiv", statusColor: "#F2EDE5", statusText: "#5C544F" },
];

export default async function CustomersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: brandData } = await supabase
    .from("brands")
    .select("id")
    .eq("owner_id", user!.id)
    .single();

  const brandId: string = (brandData as { id: string } | null)?.id ?? "";

  const { count } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true })
    .eq("brand_id", brandId);

  const hasRealData = (count ?? 0) > 0;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-9">
        <div>
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 400, fontSize: 34, letterSpacing: "-0.01em", color: "#1A1614" }}>Kunder</h1>
          <p className="mt-1.5" style={{ color: "#8F857E", fontSize: 14 }}>
            {hasRealData ? `${count?.toLocaleString("sv")} totalt` : "18 421 totalt"} · Sorterat på predikterad köpsannolikhet 14d
          </p>
        </div>
        <div className="flex gap-2.5">
          <a
            href="/onboarding"
            className="px-4 py-[9px] rounded-lg text-[13px] font-medium"
            style={{ background: "transparent", color: "#1A1614", border: "1px solid #E8E0D5", fontFamily: "inherit", textDecoration: "none" }}
          >
            Importera
          </a>
          <button className="px-4 py-[9px] rounded-lg text-[13px] font-medium" style={{ background: "#1A1614", color: "#FAF7F2", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            Exportera lista
          </button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #E8E0D5" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Kund", "Segment", "LTV", "Predikterat nästa köp", "Sannolikhet", "Status"].map((h) => (
                <th key={h} style={{ textAlign: "left", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8F857E", fontWeight: 500, padding: "14px 22px", borderBottom: "1px solid #E8E0D5", background: "#F2EDE5" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_CUSTOMERS.map((c) => (
              <tr key={c.email} style={{ cursor: "pointer" }}>
                <td style={{ padding: "16px 22px", borderBottom: "1px solid #E8E0D5" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0" style={{ background: c.gradient }}>{c.initials}</div>
                    <div>
                      <div className="font-semibold text-[13.5px]" style={{ color: "#1A1614" }}>{c.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#8F857E" }}>{c.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "16px 22px", borderBottom: "1px solid #E8E0D5" }}>
                  <span className="text-[11px] font-medium px-[9px] py-[3px] rounded-xl" style={{ background: c.segColor, color: c.segText }}>{c.segment}</span>
                </td>
                <td style={{ padding: "16px 22px", borderBottom: "1px solid #E8E0D5", fontSize: 13.5, color: "#1A1614" }}>{c.ltv}</td>
                <td style={{ padding: "16px 22px", borderBottom: "1px solid #E8E0D5", fontSize: 13.5, color: "#1A1614" }}>{c.next}</td>
                <td style={{ padding: "16px 22px", borderBottom: "1px solid #E8E0D5" }}>
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-full overflow-hidden" style={{ width: 70, height: 5, background: "#F2EDE5" }}>
                      <div style={{ height: "100%", width: `${c.prob}%`, background: "#1A1614", borderRadius: 3 }} />
                    </div>
                    <span className="text-[13.5px]" style={{ color: "#1A1614" }}>{c.prob}%</span>
                  </div>
                </td>
                <td style={{ padding: "16px 22px", borderBottom: "1px solid #E8E0D5" }}>
                  <span className="text-[11px] font-medium px-[9px] py-[3px] rounded-xl" style={{ background: c.statusColor, color: c.statusText }}>{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
