import { AppShell } from "@/components/layout/AppShell";

export default function TrendsPage() {
  return (
    <AppShell>
      <div className="animate-fade-in">
        <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 400, fontSize: 34, color: "#1A1614" }}>Trender</h1>
        <p className="mt-2" style={{ color: "#8A6E55" }}>Kommer snart — försäljnings- och beteendetrender per segment.</p>
      </div>
    </AppShell>
  );
}
