export default function SegmentsPage() {
  const segments = [
    {
      id: "romantics",
      name: "Loyal Romantics",
      desc: "Återkommande kunder som älskar säsongskollektioner.",
      tag: "Mest värdefull",
      gradient: "linear-gradient(135deg, #D4A5A0 0%, #B47A75 100%)",
      customers: "1 284",
      ltv: "14 200 kr",
      active: "92%",
    },
    {
      id: "trends",
      name: "Trend Hunters",
      desc: "Köper alltid nya releaser först.",
      tag: "Tidiga adopters",
      gradient: "linear-gradient(135deg, #1A1614 0%, #3D3530 100%)",
      customers: "847",
      ltv: "8 900 kr",
      active: "88%",
    },
    {
      id: "vip",
      name: "Best Friends",
      desc: "Dina mest lojala kunder.",
      tag: "VIP — Topp 5%",
      gradient: "linear-gradient(135deg, #C9A961 0%, #8A7038 100%)",
      customers: "312",
      ltv: "42 800 kr",
      active: "96%",
    },
    {
      id: "new",
      name: "Curious Newcomers",
      desc: "Första köpet inom 30 dagar.",
      tag: "Nya kunder",
      gradient: "linear-gradient(135deg, #A8B5A0 0%, #6B7A63 100%)",
      customers: "486",
      ltv: "980 kr",
      active: "34%",
    },
    {
      id: "sleeping",
      name: "Sleeping Beauties",
      desc: "Har inte handlat på 90+ dagar.",
      tag: "Sleeping Beauties",
      gradient: "linear-gradient(135deg, #C8BCAE 0%, #A8998A 100%)",
      customers: "1 642",
      ltv: "6 200 kr",
      active: "42%",
    },
    {
      id: "drift",
      name: "About to Drift",
      desc: "Var aktiva för 60–90 dagar sen.",
      tag: "Akut — Churn-risk",
      gradient: "linear-gradient(135deg, #6B4F5B 0%, #3D2C35 100%)",
      customers: "412",
      ltv: "9 100 kr",
      active: "68%",
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-9">
        <div>
          <h1
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontWeight: 400,
              fontSize: 34,
              letterSpacing: "-0.01em",
              color: "#1A1614",
            }}
          >
            Segment
          </h1>
          <p className="mt-1.5" style={{ color: "#8F857E", fontSize: 14 }}>
            12 AI-genererade segment som uppdateras automatiskt baserat på beteende.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            className="px-4 py-[9px] rounded-lg text-[13px] font-medium"
            style={{ background: "transparent", color: "#1A1614", border: "1px solid #E8E0D5", fontFamily: "inherit", cursor: "pointer" }}
          >
            Importera från Klaviyo
          </button>
          <button
            className="flex items-center gap-1.5 px-4 py-[9px] rounded-lg text-[13px] font-medium"
            style={{ background: "#1A1614", color: "#FAF7F2", border: "none", cursor: "pointer", fontFamily: "inherit" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14" /></svg>
            Skapa segment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {segments.map((seg) => (
          <a
            key={seg.id}
            href={`/segments/${seg.id}`}
            className="flex flex-col rounded-2xl overflow-hidden transition-all"
            style={{ background: "#FFFFFF", border: "1px solid #E8E0D5", textDecoration: "none" }}
          >
            <div className="relative overflow-hidden" style={{ height: 110, background: seg.gradient }}>
              <div className="absolute inset-0" style={{ opacity: 0.15, backgroundImage: "radial-gradient(circle at 30% 30%, white 0.5px, transparent 1px)", backgroundSize: "22px 22px" }} />
              <span
                className="absolute text-[10.5px] uppercase tracking-[0.08em] font-semibold px-[9px] py-[4px] rounded-xl"
                style={{ top: 14, left: 16, background: "rgba(255,255,255,0.92)", color: "#1A1614" }}
              >
                {seg.tag}
              </span>
            </div>
            <div className="p-5">
              <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 19, fontWeight: 500, color: "#1A1614" }}>{seg.name}</div>
              <div className="mt-1 text-[13px]" style={{ color: "#5C544F" }}>{seg.desc}</div>
              <div className="flex justify-between mt-4 pt-3.5" style={{ borderTop: "1px solid #E8E0D5" }}>
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
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
