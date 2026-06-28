"use client";

import { useState } from "react";

export default function CampaignsPage() {
  const [channel, setChannel] = useState("email");
  const [timing, setTiming] = useState("sunday");
  const [subject, setSubject] = useState("En romans börjar — Spring Edit 2026");
  const [body, setBody] = useState(`Kära Elsa,

Det är något med våren som alltid återvänder till samma stilla, romantiska språk — och i år ville vi göra något bara för dig.

Vi har plockat sex plagg från Spring Edit som vi tror kommer kännas som dina. Linne, siden, ull. Inget högt, inget extravagant. Bara det som klär dig.

Med varma hälsningar,
Studio Acacia`);

  const ink = "#1A1614";
  const bg = "#FAF5EB";
  const border = "#DDD0B5";
  const warm = "#F2E8D0";
  const card = "#FFFFFF";
  const inkMuted = "#8A6E55";
  const inkSoft = "#5A4232";

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-9">
        <div>
          <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 400, fontSize: 34, letterSpacing: "-0.01em", color: ink }}>
            Ny kampanj
          </h1>
          <p className="mt-1.5" style={{ color: inkMuted, fontSize: 14 }}>
            HERIA föreslår innehåll baserat på det valda segmentet.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button style={{ background: "transparent", color: ink, border: `1px solid ${border}`, padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            Spara utkast
          </button>
          <button style={{ background: ink, color: bg, border: "none", padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            Granska och skicka →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6">
        {/* Form */}
        <div className="flex flex-col gap-5">
          {/* Step 1 — Segment */}
          <div className="rounded-2xl" style={{ background: card, border: `1px solid ${border}`, padding: "22px 24px" }}>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 500, color: ink, marginBottom: 14 }}>
              1. Vem riktar vi oss till?
            </div>
            <div className="text-[11.5px] uppercase tracking-[0.1em] font-semibold mb-2.5" style={{ color: inkMuted }}>Segment</div>
            <select
              className="w-full rounded-xl px-3.5 py-3 text-sm outline-none"
              style={{ background: bg, border: `1px solid ${border}`, color: ink, fontFamily: "inherit" }}
            >
              <option>Stammisar — 1 284 kunder (rekommenderad)</option>
              <option>VIP-kunder — 312 kunder</option>
              <option>Vänner &amp; familj — 184 kunder</option>
              <option>Nya kunder — 486 kunder</option>
              <option>Inaktiva kunder — 1 642 kunder</option>
              <option>På väg bort — 412 kunder</option>
            </select>
            <div className="flex gap-2.5 items-start mt-3.5 rounded-xl px-3.5 py-3" style={{ background: warm }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#C45224" className="flex-shrink-0 mt-0.5"><path d="M12 2l2 6h6l-5 4 2 7-5-4-5 4 2-7-5-4h6z"/></svg>
              <div className="text-[13px] leading-relaxed" style={{ color: inkSoft }}>
                <strong style={{ color: ink }}>HERIA rekommenderar Stammisar</strong> — 937 av 1 284 är redo att handla nu. Förväntad ROI: <strong style={{ color: ink }}>1 720 000 kr</strong>.
              </div>
            </div>
          </div>

          {/* Step 2 — Channel */}
          <div className="rounded-2xl" style={{ background: card, border: `1px solid ${border}`, padding: "22px 24px" }}>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 500, color: ink, marginBottom: 14 }}>
              2. Kanal
            </div>
            <div className="flex gap-2.5">
              {[
                { id: "email", label: "E-post", sub: "Bäst för det här segmentet" },
                { id: "sms", label: "SMS", sub: "Snabb respons" },
                { id: "push", label: "Push", sub: "App-användare" },
              ].map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setChannel(ch.id)}
                  className="flex-1 py-3.5 rounded-xl text-center transition-all"
                  style={{
                    border: `1.5px solid ${channel === ch.id ? ink : border}`,
                    background: channel === ch.id ? ink : "transparent",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <div className="text-[13px] font-semibold" style={{ color: channel === ch.id ? bg : ink }}>{ch.label}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: channel === ch.id ? "rgba(250,245,235,0.7)" : inkMuted }}>{ch.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3 — Content */}
          <div className="rounded-2xl" style={{ background: card, border: `1px solid ${border}`, padding: "22px 24px" }}>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 500, color: ink, marginBottom: 14 }}>
              3. Innehåll
            </div>
            <button
              className="flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1.5 rounded-2xl mb-4"
              style={{ background: ink, color: bg, border: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2 6h6l-5 4 2 7-5-4-5 4 2-7-5-4h6z"/></svg>
              HERIA har skrivit ett förslag
            </button>

            <div className="text-[11.5px] uppercase tracking-[0.1em] font-semibold mb-2" style={{ color: inkMuted }}>Ämnesrad</div>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl px-3.5 py-3 text-sm outline-none mb-4"
              style={{ background: bg, border: `1px solid ${border}`, color: ink, fontFamily: "inherit" }}
            />

            <div className="text-[11.5px] uppercase tracking-[0.1em] font-semibold mb-2" style={{ color: inkMuted }}>Brödtext</div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-xl px-3.5 py-3 text-sm outline-none"
              rows={7}
              style={{ background: bg, border: `1px solid ${border}`, color: ink, fontFamily: "inherit", lineHeight: 1.55, resize: "vertical" }}
            />
          </div>

          {/* Step 4 — Timing */}
          <div className="rounded-2xl" style={{ background: card, border: `1px solid ${border}`, padding: "22px 24px" }}>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 500, color: ink, marginBottom: 14 }}>
              4. Tidpunkt
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[
                { id: "now", time: "Skicka nu", date: "Direkt", opt: null },
                { id: "sunday", time: "Söndag 19:00", date: "22 maj 2026", opt: "+38% öppningsrate" },
                { id: "ai", time: "AI väljer", date: "Per kund, optimalt", opt: "+52% öppningsrate" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTiming(t.id)}
                  className="rounded-xl text-left transition-all"
                  style={{
                    padding: timing === t.id ? "13px" : "14px",
                    border: timing === t.id ? `2px solid ${ink}` : `1px solid ${border}`,
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 16, color: ink }}>{t.time}</div>
                  <div className="text-[11.5px] mt-0.5" style={{ color: inkMuted }}>{t.date}</div>
                  {t.opt && <div className="text-[11px] mt-1 font-semibold" style={{ color: "#6B7A63" }}>{t.opt}</div>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-2xl overflow-hidden sticky top-6" style={{ background: card, border: `1px solid ${border}`, height: "fit-content" }}>
          <div
            className="flex justify-between items-center"
            style={{ padding: "14px 18px", borderBottom: `1px solid ${border}`, background: warm, fontSize: 12, fontWeight: 600, color: inkSoft, textTransform: "uppercase", letterSpacing: "0.08em" }}
          >
            <span>Förhandsvisning</span>
            <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>iPhone · E-post</span>
          </div>
          <div style={{ padding: 24 }}>
            <div className="text-[11.5px]" style={{ color: inkMuted }}>Studio Acacia &lt;hej@studioacacia.se&gt;</div>
            <div className="mt-2 leading-snug" style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, color: ink }}>
              {subject}
            </div>
            <div
              className="rounded-xl flex items-center justify-center my-4"
              style={{ height: 160, background: "linear-gradient(135deg, #D9896A, #C45224)", fontFamily: "var(--font-fraunces), serif", fontSize: 26, color: "white", letterSpacing: "0.05em" }}
            >
              Spring · 2026
            </div>
            <div className="text-[13px] leading-relaxed" style={{ color: inkSoft }}>
              {body.split("\n").slice(0, 3).map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </div>
            <div
              className="inline-block mt-4 rounded-full px-5 py-3 text-[13px] font-medium"
              style={{ background: ink, color: "white" }}
            >
              Se din edit →
            </div>
            <div className="mt-6 pt-4.5 text-[11px] text-center" style={{ borderTop: `1px solid ${border}`, color: inkMuted }}>
              Skickat med HERIA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
