"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ink = "#1A1614";
const bg = "#FAF5EB";
const border = "#DDD0B5";
const warm = "#F2E8D0";
const inkMuted = "#8A6E55";
const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none";
const inputStyle = { background: bg, border: `1px solid ${border}`, color: ink, fontFamily: "inherit" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.1em] font-semibold mb-2" style={{ color: inkMuted }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function NyKund() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [totalSpent, setTotalSpent] = useState("");
  const [orderCount, setOrderCount] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: brandsData } = await supabase
      .from("brands")
      .select("id")
      .eq("owner_id", user.id)
      .order("created_at")
      .limit(1);

    const brandId = (brandsData?.[0] as { id: string } | undefined)?.id;
    if (!brandId) { setError("Kunde inte hitta varumärket."); setLoading(false); return; }

    const { error: err } = await supabase.from("customers").insert({
      brand_id: brandId,
      email: email.trim().toLowerCase(),
      first_name: firstName.trim() || null,
      last_name: lastName.trim() || null,
      phone: phone.trim() || null,
      total_spent: totalSpent ? parseFloat(totalSpent.replace(",", ".")) : 0,
      order_count: orderCount ? parseInt(orderCount) : 0,
      notes: notes.trim() || null,
    });

    if (err) {
      setError(err.message.includes("unique") ? "En kund med den e-postadressen finns redan." : err.message);
      setLoading(false);
      return;
    }

    router.push("/customers");
  }

  return (
    <div className="animate-fade-in max-w-lg">
      <a
        href="/customers"
        className="inline-flex items-center gap-1.5 text-[13px] mb-8"
        style={{ color: inkMuted, textDecoration: "none" }}
      >
        ← Tillbaka till kunder
      </a>

      <h1
        className="mb-1"
        style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 400, fontSize: 34, color: ink }}
      >
        Lägg till kund
      </h1>
      <p className="mb-8" style={{ color: inkMuted, fontSize: 14 }}>
        Fyll i kunduppgifterna manuellt.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ background: "#FFFFFF", border: `1px solid ${border}` }}>
          <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 16, fontWeight: 500, color: ink }}>
            Kontaktuppgifter
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Förnamn">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Elsa"
                className={inputClass}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = ink)}
                onBlur={(e) => (e.target.style.borderColor = border)}
              />
            </Field>
            <Field label="Efternamn">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Wikström"
                className={inputClass}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = ink)}
                onBlur={(e) => (e.target.style.borderColor = border)}
              />
            </Field>
          </div>

          <Field label="E-postadress *">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elsa@exempel.se"
              className={inputClass}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = ink)}
              onBlur={(e) => (e.target.style.borderColor = border)}
            />
          </Field>

          <Field label="Telefon">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+46 70 123 45 67"
              className={inputClass}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = ink)}
              onBlur={(e) => (e.target.style.borderColor = border)}
            />
          </Field>
        </div>

        <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ background: "#FFFFFF", border: `1px solid ${border}` }}>
          <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 16, fontWeight: 500, color: ink }}>
            Köphistorik
          </div>
          <p className="text-[13px] -mt-2" style={{ color: inkMuted }}>
            Valfritt — fyll i om du känner till historiken.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Total köp (kr)">
              <input
                type="text"
                inputMode="decimal"
                value={totalSpent}
                onChange={(e) => setTotalSpent(e.target.value)}
                placeholder="0"
                className={inputClass}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = ink)}
                onBlur={(e) => (e.target.style.borderColor = border)}
              />
            </Field>
            <Field label="Antal ordrar">
              <input
                type="text"
                inputMode="numeric"
                value={orderCount}
                onChange={(e) => setOrderCount(e.target.value)}
                placeholder="0"
                className={inputClass}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = ink)}
                onBlur={(e) => (e.target.style.borderColor = border)}
              />
            </Field>
          </div>
        </div>

        <div className="rounded-2xl p-6 flex flex-col gap-3" style={{ background: "#FFFFFF", border: `1px solid ${border}` }}>
          <Field label="Anteckningar">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Handlar ofta storlek S, gillar linne och naturliga material..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ ...inputStyle, lineHeight: 1.6, resize: "vertical" }}
              onFocus={(e) => (e.target.style.borderColor = ink)}
              onBlur={(e) => (e.target.style.borderColor = border)}
            />
          </Field>
        </div>

        {error && <p className="text-sm" style={{ color: "#C45224" }}>{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 rounded-xl text-sm font-medium"
            style={{ background: warm, color: ink, border: "none", cursor: "pointer", fontFamily: "inherit" }}
          >
            Avbryt
          </button>
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="flex-1 py-3 rounded-xl text-sm font-medium"
            style={{
              background: loading || !email.trim() ? inkMuted : ink,
              color: bg,
              border: "none",
              cursor: loading || !email.trim() ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {loading ? "Sparar..." : "Lägg till kund →"}
          </button>
        </div>
      </form>
    </div>
  );
}
