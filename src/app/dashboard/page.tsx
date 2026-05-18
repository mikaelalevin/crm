import { createClient } from "@/lib/supabase/server";

const MOCK_INSIGHTS = [
  {
    id: "1",
    dot: "#B47A75",
    title: "Dina stammisar är redo att handla igen",
    body: "214 kunder i segmentet Stammisar har inte fått ett mejl på 18 dagar. Baserat på deras tidigare köpcykel är 73% redo att handla nu. Genomsnittlig ordervärde: 1 840 kr.",
    actions: [
      { label: "Skapa kampanj", href: "/campaigns", primary: true },
      { label: "Visa segment", href: "/segments", primary: false },
    ],
  },
  {
    id: "2",
    dot: "#C9A961",
    title: "28 VIP-kunder visar tecken på att gå förlorade",
    body: "De har minskat sin köpfrekvens med 60% senaste 90 dagarna. Föreslagen åtgärd: personlig win-back med exklusiv förhandsvisning av FW26-kollektionen och deras VIP-rabatt.",
    actions: [
      { label: "Skicka VIP-erbjudande", href: "/campaigns", primary: true },
      { label: "Se kunder", href: "/customers", primary: false },
    ],
  },
  {
    id: "3",
    dot: "#6B7A63",
    title: '"Linen Mini Dress" predikteras bli bästsäljare i juni',
    body: "Baserat på säsongstrender och kundernas wishlist-aktivitet. 1 247 kunder har lagt den i favoriter. Rekommendation: lansera lookbook 25 maj.",
    actions: [{ label: "Planera lansering", href: "/campaigns", primary: true }],
  },
  {
    id: "4",
    dot: "#6B4F5B",
    title: "Söndagar 19:00 är din nya magiska timme",
    body: "Email skickade vid den här tiden har 38% högre öppningsrate. MUSE föreslår att flytta din veckokampanj från måndag morgon.",
    actions: [
      { label: "Tillämpa", href: "/campaigns", primary: false },
      { label: "Ignorera", href: "#", primary: false },
    ],
  },
];

const MOCK_SEGMENTS = [
  {
    id: "vip",
    name: "VIP-kunder",
    desc: "Dina bästa kunder med tillgång till VIP-rabatt och exklusiva erbjudanden.",
    tag: "Topp 5%",
    gradient: "linear-gradient(135deg, #C9A961 0%, #8A7038 100%)",
    customers: "312",
    ltv: "42 800 kr",
    active: "96%",
    suggestion: "28 VIP-kunder är på väg bort — skicka personlig win-back med deras rabattkod.",
  },
  {
    id: "stammisar",
    name: "Stammisar",
    desc: "Återkommande kunder som handlar regelbundet varje säsong.",
    tag: "Mest värdefull",
    gradient: "linear-gradient(135deg, #D4A5A0 0%, #B47A75 100%)",
    customers: "1 284",
    ltv: "14 200 kr",
    active: "92%",
    suggestion: "Skicka spring lookbook senast 22 maj — 73% sannolikhet att handla.",
  },
  {
    id: "vanner-familj",
    name: "Vänner & familj",
    desc: "Nära relationer med tillgång till personlig rabatt och tidig tillgång.",
    tag: "Friends & family",
    gradient: "linear-gradient(135deg, #A8B5A0 0%, #6B7A63 100%)",
    customers: "184",
    ltv: "9 600 kr",
    active: "78%",
    suggestion: "Bjud in till förhandsvisning av FW26 innan den är publik.",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: brand } = await supabase
    .from("brands")
    .select("name, id")
    .eq("owner_id", user!.id)
    .single();

  const { count: customerCount } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true })
    .eq("brand_id", brand!.id);

  const firstName = (user?.email || "").split("@")[0];

  return (
    <div className="animate-fade-in">
      {/* Topbar */}
      <div className="flex justify-between items-center mb-9">
        <div>
          <h1
            className="leading-tight"
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontWeight: 400,
              fontSize: 34,
              letterSpacing: "-0.01em",
              color: "#1A1614",
            }}
          >
            God morgon, {firstName}.
          </h1>
          <p className="mt-1.5" style={{ color: "#8F857E", fontSize: 14 }}>
            Här är vad MUSE har upptäckt sedan igår.
          </p>
        </div>
        <div className="flex gap-2.5 items-center">
          <button
            className="flex items-center gap-1.5 px-4 py-[9px] rounded-lg text-[13px] font-medium transition-all"
            style={{
              background: "transparent",
              color: "#1A1614",
              border: "1px solid #E8E0D5",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            Maj 2026
          </button>
          <a
            href="/campaigns"
            className="flex items-center gap-1.5 px-4 py-[9px] rounded-lg text-[13px] font-medium transition-all"
            style={{
              background: "#1A1614",
              color: "#FAF7F2",
              textDecoration: "none",
              fontFamily: "inherit",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Ny kampanj
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-9">
        <KpiCard
          label="Intäkt 30d"
          value={customerCount && customerCount > 0 ? "—" : "2,84M"}
          delta="↑ 12,4%"
          deltaUp
          meta="vs förra månaden"
        />
        <KpiCard
          label="Aktiva kunder"
          value={customerCount?.toLocaleString("sv") ?? "0"}
          delta={customerCount ? `${customerCount} totalt` : "Importera data"}
          deltaUp={!!customerCount}
          meta="i databasen"
        />
        <KpiCard
          label="Predikterad intäkt 30d"
          value="3,21M"
          delta=""
          deltaUp
          meta={<>Konfidens <strong style={{ color: "#1A1614" }}>87%</strong></>}
        />
        <KpiCard
          label="Churn-risk"
          value="412"
          delta="↑ 28"
          deltaUp={false}
          meta="behöver win-back nu"
        />
      </div>

      {/* AI Insights */}
      <div
        className="rounded-2xl p-7 mb-10"
        style={{ background: "#FFFFFF", border: "1px solid #E8E0D5" }}
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "#1A1614" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
            </svg>
          </div>
          <h3
            style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 500, fontSize: 19, color: "#1A1614" }}
          >
            MUSE upptäckte i morse
          </h3>
          <span className="ml-auto text-xs" style={{ color: "#8F857E" }}>
            Uppdaterades 06:42
          </span>
        </div>

        <div className="flex flex-col gap-3.5">
          {MOCK_INSIGHTS.map((insight) => (
            <div
              key={insight.id}
              className="flex gap-3.5 py-3"
              style={{ borderBottom: "1px solid #E8E0D5" }}
            >
              <div
                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                style={{ background: insight.dot }}
              />
              <div className="flex-1">
                <div className="font-semibold text-[13.5px] mb-1" style={{ color: "#1A1614" }}>
                  {insight.title}
                </div>
                <div className="text-[13px] leading-relaxed" style={{ color: "#5C544F" }}>
                  {insight.body}
                </div>
                <div className="flex gap-2 mt-2">
                  {insight.actions.map((action) => (
                    <a
                      key={action.label}
                      href={action.href}
                      className="text-[11.5px] px-2.5 py-1 rounded-xl font-medium transition-all"
                      style={{
                        background: action.primary ? "#1A1614" : "#F2EDE5",
                        color: action.primary ? "#FAF7F2" : "#1A1614",
                        textDecoration: "none",
                        fontFamily: "inherit",
                        display: "inline-block",
                      }}
                    >
                      {action.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Segments preview */}
      <div className="flex justify-between items-baseline mb-4">
        <h2
          style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 400, fontSize: 22, color: "#1A1614", letterSpacing: "-0.01em" }}
        >
          Dina segment
        </h2>
        <a
          href="/segments"
          className="text-[13px] font-medium"
          style={{
            color: "#1A1614",
            textDecoration: "none",
            borderBottom: "1px solid #1A1614",
            paddingBottom: 1,
          }}
        >
          Se alla 12 →
        </a>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {MOCK_SEGMENTS.map((seg) => (
          <SegmentCard key={seg.id} seg={seg} />
        ))}
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  delta,
  deltaUp,
  meta,
}: {
  label: string;
  value: string;
  delta: string;
  deltaUp: boolean;
  meta: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl transition-all"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E0D5",
        padding: "20px 22px",
      }}
    >
      <div
        className="text-[11.5px] uppercase tracking-[0.1em] font-medium"
        style={{ color: "#8F857E" }}
      >
        {label}
      </div>
      <div
        className="mt-2.5"
        style={{
          fontFamily: "var(--font-fraunces), serif",
          fontSize: 32,
          fontWeight: 400,
          color: "#1A1614",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: "#5C544F" }}>
        {delta && (
          <span style={{ color: deltaUp ? "#6B7A63" : "#B47A75", fontWeight: 600 }}>
            {delta}
          </span>
        )}
        <span>{meta}</span>
      </div>
    </div>
  );
}

function SegmentCard({ seg }: {
  seg: {
    id: string;
    name: string;
    desc: string;
    tag: string;
    gradient: string;
    customers: string;
    ltv: string;
    active: string;
    suggestion: string;
  };
}) {
  return (
    <a
      href={`/segments/${seg.id}`}
      className="flex flex-col rounded-2xl overflow-hidden transition-all group"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E0D5",
        textDecoration: "none",
      }}
    >
      {/* Mood header */}
      <div
        className="relative overflow-hidden"
        style={{ height: 110, background: seg.gradient }}
      >
        {/* Dot pattern */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.15,
            backgroundImage: "radial-gradient(circle at 30% 30%, white 0.5px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <span
          className="absolute text-[10.5px] uppercase tracking-[0.08em] font-semibold px-[9px] py-[4px] rounded-xl"
          style={{
            top: 14,
            left: 16,
            background: "rgba(255,255,255,0.92)",
            color: "#1A1614",
            backdropFilter: "blur(8px)",
          }}
        >
          {seg.tag}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div
          style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 19, fontWeight: 500, color: "#1A1614", letterSpacing: "-0.01em" }}
        >
          {seg.name}
        </div>
        <div className="mt-1 text-[13px] leading-snug" style={{ color: "#5C544F" }}>
          {seg.desc}
        </div>

        {/* Stats */}
        <div
          className="flex justify-between mt-4 pt-3.5"
          style={{ borderTop: "1px solid #E8E0D5" }}
        >
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.08em] font-medium" style={{ color: "#8F857E" }}>Kunder</div>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 17, color: "#1A1614", marginTop: 2 }}>{seg.customers}</div>
          </div>
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.08em] font-medium" style={{ color: "#8F857E" }}>Snitt LTV</div>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 17, color: "#1A1614", marginTop: 2 }}>{seg.ltv}</div>
          </div>
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.08em] font-medium" style={{ color: "#8F857E" }}>Aktiv</div>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 17, color: "#1A1614", marginTop: 2 }}>{seg.active}</div>
          </div>
        </div>

        {/* AI suggestion */}
        <div
          className="flex gap-2.5 items-start rounded-xl mt-4"
          style={{ background: "#F2EDE5", padding: "11px 13px" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#B47A75" className="flex-shrink-0 mt-0.5">
            <path d="M12 2l2 6h6l-5 4 2 7-5-4-5 4 2-7-5-4h6z" />
          </svg>
          <div className="text-[12.5px] leading-snug" style={{ color: "#5C544F" }}>
            <strong style={{ color: "#1A1614" }}>{seg.suggestion.split(" — ")[0]}</strong>
            {seg.suggestion.includes(" — ") ? ` — ${seg.suggestion.split(" — ")[1]}` : ""}
          </div>
        </div>
      </div>
    </a>
  );
}
