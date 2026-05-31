"use client";

import { useState } from "react";
import { generateTablePrediction } from "@/lib/predictions";

interface AiPrediction {
  product: string;
  date: string;
  daysUntil: number;
  confidence: number;
  reason: string;
  generatedAt: string;
}

interface Customer {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  total_spent: number | null;
  order_count: number | null;
  last_order_at: string | null;
  ai_prediction: Record<string, unknown> | null;
  ai_prediction_at: string | null;
}

const ink = "#1A1614";
const inkMuted = "#8A6E55";
const border = "#DDD0B5";
const warm = "#F2E8D0";
const bg = "#FAF5EB";

function getAiPrediction(c: Customer): AiPrediction | null {
  const p = c.ai_prediction;
  if (!p || typeof p.product !== "string") return null;
  return p as unknown as AiPrediction;
}

function displayName(c: Customer) {
  return [c.first_name, c.last_name].filter(Boolean).join(" ") || c.email;
}

function initials(c: Customer) {
  if (c.first_name && c.last_name) return (c.first_name[0] + c.last_name[0]).toUpperCase();
  return (c.first_name?.[0] ?? c.email[0]).toUpperCase();
}

const AVATAR_COLORS = ["#D9896A", "#A8B5A0", "#C9A961", "#B47A75", "#6B4F5B", "#6B7A63"];

export function AiRecommendationsList({ customers }: { customers: Customer[] }) {
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [predictions, setPredictions] = useState<Record<string, AiPrediction>>(() => {
    const init: Record<string, AiPrediction> = {};
    customers.forEach((c) => {
      const p = getAiPrediction(c);
      if (p) init[c.id] = p;
    });
    return init;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatingAll, setGeneratingAll] = useState(false);

  async function generateOne(customerId: string) {
    setGenerating((g) => ({ ...g, [customerId]: true }));
    setErrors((e) => ({ ...e, [customerId]: "" }));
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: customerId }),
      });
      const data = await res.json() as { prediction?: AiPrediction; error?: string };
      if (!res.ok || data.error) {
        setErrors((e) => ({ ...e, [customerId]: data.error ?? "Fel" }));
      } else if (data.prediction) {
        setPredictions((p) => ({ ...p, [customerId]: data.prediction! }));
      }
    } catch {
      setErrors((e) => ({ ...e, [customerId]: "Nätverksfel" }));
    } finally {
      setGenerating((g) => ({ ...g, [customerId]: false }));
    }
  }

  async function generateAll() {
    setGeneratingAll(true);
    const missing = customers.filter((c) => !predictions[c.id]);
    for (const c of missing) {
      await generateOne(c.id);
    }
    setGeneratingAll(false);
  }

  const withPredictions = customers.filter((c) => predictions[c.id]);
  const withoutPredictions = customers.filter((c) => !predictions[c.id]);

  const sorted = [
    ...withPredictions.sort((a, b) => (predictions[a.id]?.daysUntil ?? 99) - (predictions[b.id]?.daysUntil ?? 99)),
    ...withoutPredictions,
  ];

  const aiCount = withPredictions.length;

  return (
    <div className="animate-fade-in">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 400, fontSize: 34, color: ink, letterSpacing: "-0.01em" }}>
            AI-rekommendationer
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: inkMuted }}>
            Predikterat nästa köp per kund — sorterat på när köpet förväntas
          </p>
        </div>
      </div>

      {aiCount > 0 && (
        <div className="flex items-center gap-2 mb-5">
          <div className="text-[11px] uppercase tracking-[0.1em] font-semibold px-2.5 py-1 rounded-lg" style={{ background: ink, color: "rgba(255,255,255,0.8)" }}>
            {aiCount} AI-prediktioner
          </div>
          <span className="text-[12px]" style={{ color: inkMuted }}>
            {withoutPredictions.length > 0 ? `· ${withoutPredictions.length} kunder kvar att analysera` : "· Alla kunder analyserade"}
          </span>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${border}` }}>
        {sorted.map((c, i) => {
          const aiPred = predictions[c.id];
          const fallback = !aiPred ? generateTablePrediction(c) : null;
          const pred = aiPred ?? fallback!;
          const isAi = !!aiPred;
          const isGenerating = !!generating[c.id];
          const err = errors[c.id];
          const color = AVATAR_COLORS[i % AVATAR_COLORS.length];

          return (
            <div
              key={c.id}
              className="flex items-center gap-4 px-6 py-4"
              style={{ borderTop: i === 0 ? "none" : `1px solid ${border}`, background: "#FFFFFF" }}
            >
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}99)`, fontSize: 13 }}
              >
                {initials(c)}
              </div>

              {/* Name + email */}
              <div className="flex-1 min-w-0">
                <a
                  href={`/customers/${c.id}`}
                  className="text-[13px] font-medium hover:underline"
                  style={{ color: ink, textDecoration: "none" }}
                >
                  {displayName(c)}
                </a>
                <div className="text-[11px] mt-0.5 truncate" style={{ color: inkMuted }}>{c.email}</div>
              </div>

              {/* Prediction */}
              <div className="flex items-center gap-6 flex-shrink-0">
                {isGenerating ? (
                  <div className="flex items-center gap-2 text-[12px]" style={{ color: inkMuted }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Analyserar...
                  </div>
                ) : err ? (
                  <span className="text-[11px]" style={{ color: "#C45224" }}>{err}</span>
                ) : (
                  <>
                    <div className="text-right">
                      <div className="text-[11px] uppercase tracking-[0.06em] font-medium mb-0.5" style={{ color: inkMuted }}>Nästa köp</div>
                      <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 15, color: ink }}>
                        {pred.product}
                      </div>
                    </div>
                    <div className="text-right w-16">
                      <div className="text-[11px] uppercase tracking-[0.06em] font-medium mb-0.5" style={{ color: inkMuted }}>Datum</div>
                      <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 15, color: ink }}>
                        {pred.date}
                      </div>
                    </div>
                    <div className="w-12 text-right">
                      <div className="text-[11px] uppercase tracking-[0.06em] font-medium mb-1" style={{ color: inkMuted }}>Sannolikhet</div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <div className="w-12 rounded-full overflow-hidden" style={{ height: 3, background: warm }}>
                          <div style={{ height: "100%", width: `${pred.confidence}%`, background: isAi ? "#6B4F5B" : ink, borderRadius: 2 }} />
                        </div>
                        <span className="text-[11px] font-semibold" style={{ color: isAi ? "#6B4F5B" : ink }}>
                          {pred.confidence}%
                        </span>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
          );
        })}

        {customers.length === 0 && (
          <div className="px-6 py-12 text-center" style={{ background: "#FFFFFF" }}>
            <p className="text-[14px]" style={{ color: inkMuted }}>Inga kunder att analysera ännu.</p>
          </div>
        )}
      </div>
    </div>
  );
}
