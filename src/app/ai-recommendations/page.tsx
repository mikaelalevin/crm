import { AppShell } from "@/components/layout/AppShell";

export default function AiRecommendationsPage() {
  return (
    <AppShell>
      <div className="animate-fade-in">
        <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 400, fontSize: 34, color: "#1A1614" }}>AI-rekommendationer</h1>
        <p className="mt-2" style={{ color: "#8F857E" }}>Kommer snart — produktrekommendationer per kund baserat på köphistorik.</p>
      </div>
    </AppShell>
  );
}
