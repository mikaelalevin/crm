"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Customer {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  total_spent: number | null;
  order_count: number | null;
}

interface SalesRep {
  id: string;
  name: string;
  color: string;
}

const ink = "#1A1614";
const inkMuted = "#8A6E55";
const border = "#DDD0B5";
const bg = "#FAF5EB";
const warm = "#F2E8D0";

function getInitials(c: Customer) {
  if (c.first_name && c.last_name) return (c.first_name[0] + c.last_name[0]).toUpperCase();
  if (c.first_name) return c.first_name.slice(0, 2).toUpperCase();
  return c.email.slice(0, 2).toUpperCase();
}

function getFullName(c: Customer) {
  return [c.first_name, c.last_name].filter(Boolean).join(" ") || c.email;
}

function formatLTV(n: number | null) {
  if (!n) return "–";
  return n.toLocaleString("sv") + " kr";
}

function getProbability(c: Customer) {
  if (!c.order_count || !c.total_spent) return 40;
  return Math.min(95, 30 + c.order_count * 8 + (c.total_spent > 10000 ? 20 : 0));
}

export function SaljareView({
  rep,
  initialAssigned,
  allCustomers,
}: {
  rep: SalesRep;
  initialAssigned: Customer[];
  allCustomers: Customer[];
}) {
  const [assigned, setAssigned] = useState<Customer[]>(initialAssigned);
  const [panelOpen, setPanelOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [assigning, setAssigning] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const assignedIds = new Set(assigned.map((c) => c.id));
  const unassigned = allCustomers.filter((c) => !assignedIds.has(c.id));
  const filtered = unassigned.filter((c) => {
    const q = search.toLowerCase();
    return (
      getFullName(c).toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const repInitials = rep.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const totalLTV = assigned.reduce((sum, c) => sum + (c.total_spent ?? 0), 0);

  useEffect(() => {
    if (panelOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [panelOpen]);

  async function assignCustomer(customer: Customer) {
    setAssigning(customer.id);
    const supabase = createClient();
    await supabase.from("customers").update({ sales_rep_id: rep.id }).eq("id", customer.id);
    setAssigned((prev) => [...prev, customer]);
    setAssigning(null);
  }

  async function removeCustomer(customer: Customer) {
    setRemoving(customer.id);
    const supabase = createClient();
    await supabase.from("customers").update({ sales_rep_id: null }).eq("id", customer.id);
    setAssigned((prev) => prev.filter((c) => c.id !== customer.id));
    setRemoving(null);
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-9">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
            style={{ background: rep.color, fontSize: 16 }}
          >
            {repInitials}
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 400, fontSize: 34, letterSpacing: "-0.01em", color: ink }}>
              {rep.name}
            </h1>
            <p style={{ color: inkMuted, fontSize: 14 }}>
              {assigned.length} kunder{totalLTV > 0 ? ` · ${totalLTV.toLocaleString("sv")} kr totalt köpvärde` : ""}
            </p>
          </div>
        </div>
        <button
          onClick={() => setPanelOpen(true)}
          className="flex items-center gap-2 px-4 py-[9px] rounded-lg text-[13px] font-medium"
          style={{ background: ink, color: bg, border: "none", cursor: "pointer", fontFamily: "inherit" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Lägg till kunder
        </button>
      </div>

      {/* Customer table or empty state */}
      {assigned.length === 0 ? (
        <div
          className="rounded-2xl flex flex-col items-center justify-center py-20 gap-4"
          style={{ background: "#FFFFFF", border: `1px dashed ${border}` }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: warm }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={inkMuted} strokeWidth="1.5" className="w-6 h-6">
              <circle cx="12" cy="8" r="4" /><path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-medium text-sm mb-1" style={{ color: ink }}>Inga kunder tilldelade ännu</p>
            <p className="text-sm" style={{ color: inkMuted }}>Lägg till kunder som {rep.name} ansvarar för.</p>
          </div>
          <button
            onClick={() => setPanelOpen(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium mt-2"
            style={{ background: ink, color: bg, border: "none", cursor: "pointer", fontFamily: "inherit" }}
          >
            Lägg till kunder →
          </button>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: `1px solid ${border}` }}>
          <div className="overflow-x-auto">
          <table style={{ width: "100%", minWidth: 560, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Kund", "Totalt köpvärde", "Antal köp", "Sannolikhet", ""].map((h) => (
                  <th key={h} style={{ textAlign: "left", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: inkMuted, fontWeight: 500, padding: "14px 22px", borderBottom: `1px solid ${border}`, background: warm }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assigned.map((c) => {
                const prob = getProbability(c);
                return (
                  <tr key={c.id}>
                    <td style={{ padding: "16px 22px", borderBottom: `1px solid ${border}` }}>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${rep.color}, ${rep.color}99)` }}
                        >
                          {getInitials(c)}
                        </div>
                        <div>
                          <div className="font-semibold text-[13.5px]" style={{ color: ink }}>{getFullName(c)}</div>
                          <div className="text-xs mt-0.5" style={{ color: inkMuted }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 22px", borderBottom: `1px solid ${border}`, fontSize: 13.5, color: ink }}>
                      {formatLTV(c.total_spent)}
                    </td>
                    <td style={{ padding: "16px 22px", borderBottom: `1px solid ${border}`, fontSize: 13.5, color: ink }}>
                      {c.order_count ?? "–"}
                    </td>
                    <td style={{ padding: "16px 22px", borderBottom: `1px solid ${border}` }}>
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-full overflow-hidden" style={{ width: 70, height: 5, background: warm }}>
                          <div style={{ height: "100%", width: `${prob}%`, background: ink, borderRadius: 3 }} />
                        </div>
                        <span className="text-[13.5px]" style={{ color: ink }}>{prob}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 22px", borderBottom: `1px solid ${border}`, textAlign: "right" }}>
                      <button
                        onClick={() => removeCustomer(c)}
                        disabled={removing === c.id}
                        className="text-[12px] px-3 py-1.5 rounded-lg transition-colors"
                        style={{ color: inkMuted, background: "transparent", border: `1px solid ${border}`, cursor: removing === c.id ? "wait" : "pointer", fontFamily: "inherit" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#C45224"; (e.currentTarget as HTMLElement).style.borderColor = "#C45224"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = inkMuted; (e.currentTarget as HTMLElement).style.borderColor = border; }}
                      >
                        {removing === c.id ? "..." : "Ta bort"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Add customers slide-over panel */}
      {panelOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(26,22,20,0.3)" }}
            onClick={() => setPanelOpen(false)}
          />

          {/* Panel */}
          <div
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col"
            style={{ width: 420, background: "#FFFFFF", borderLeft: `1px solid ${border}`, boxShadow: "-8px 0 32px rgba(26,22,20,0.10)" }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${border}` }}>
              <div>
                <h2 className="font-semibold text-[15px]" style={{ color: ink }}>Lägg till kunder</h2>
                <p className="text-xs mt-0.5" style={{ color: inkMuted }}>Tilldela kunder till {rep.name}</p>
              </div>
              <button
                onClick={() => setPanelOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: warm, border: "none", cursor: "pointer", color: ink }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-4" style={{ borderBottom: `1px solid ${border}` }}>
              <div className="relative">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={inkMuted} strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Sök på namn eller e-post..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px] outline-none"
                  style={{ background: bg, border: `1px solid ${border}`, color: ink, fontFamily: "inherit" }}
                  onFocus={(e) => (e.target.style.borderColor = ink)}
                  onBlur={(e) => (e.target.style.borderColor = border)}
                />
              </div>
            </div>

            {/* Customer list */}
            <div className="flex-1 overflow-y-auto px-3 py-3">
              {unassigned.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm" style={{ color: inkMuted }}>Alla kunder är redan tilldelade.</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm" style={{ color: inkMuted }}>Inga kunder matchar sökningen.</p>
                </div>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => assignCustomer(c)}
                    disabled={assigning === c.id}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all"
                    style={{ background: "transparent", border: "none", cursor: assigning === c.id ? "wait" : "pointer", fontFamily: "inherit" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = warm)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #D9896A, #C07858)" }}
                    >
                      {getInitials(c)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-medium truncate" style={{ color: ink }}>{getFullName(c)}</div>
                      <div className="text-xs truncate mt-0.5" style={{ color: inkMuted }}>{c.email}</div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      {c.total_spent ? (
                        <div className="text-[12px] font-medium" style={{ color: ink }}>{formatLTV(c.total_spent)}</div>
                      ) : null}
                      {assigning === c.id ? (
                        <div className="text-[11px]" style={{ color: inkMuted }}>Sparar...</div>
                      ) : (
                        <div className="text-[11px]" style={{ color: "#6B7A63" }}>+ Lägg till</div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Panel footer */}
            <div className="px-6 py-4" style={{ borderTop: `1px solid ${border}` }}>
              <p className="text-xs text-center" style={{ color: inkMuted }}>
                {unassigned.length} kunder utan tilldelad säljare
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
