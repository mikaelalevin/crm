import { AppShell } from "@/components/layout/AppShell";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="animate-fade-in">
        <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 400, fontSize: 34, color: "#1A1614" }}>Integrationer</h1>
        <p className="mt-2" style={{ color: "#8F857E" }}>Koppla Shopify, Plausible och dina emailverktyg.</p>
      </div>
    </AppShell>
  );
}
