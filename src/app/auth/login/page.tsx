"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAF7F2" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-12">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "#B47A75" }}
          />
          <span
            className="text-3xl tracking-widest"
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontWeight: 400,
              color: "#1A1614",
            }}
          >
            MUSE
          </span>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E0D5",
            boxShadow: "0 1px 2px rgba(26,22,20,0.04), 0 4px 16px rgba(26,22,20,0.04)",
          }}
        >
          {sent ? (
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "#F2EDE5" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B47A75" strokeWidth="2">
                  <path d="M3 8l9-5 9 5-9 5-9-5z" />
                  <path d="M3 14l9 5 9-5" />
                  <path d="M3 11l9 5 9-5" />
                </svg>
              </div>
              <h2
                className="text-xl mb-2"
                style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 400, color: "#1A1614" }}
              >
                Kolla din inkorg
              </h2>
              <p className="text-sm" style={{ color: "#8F857E", lineHeight: 1.6 }}>
                Vi har skickat en inloggningslänk till{" "}
                <strong style={{ color: "#1A1614" }}>{email}</strong>. Klicka på
                länken för att logga in.
              </p>
            </div>
          ) : (
            <>
              <h2
                className="text-2xl mb-1"
                style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 400, color: "#1A1614" }}
              >
                Välkommen tillbaka
              </h2>
              <p className="text-sm mb-8" style={{ color: "#8F857E" }}>
                Skriv in din e-postadress så skickar vi en länk.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs mb-2 uppercase tracking-widest"
                    style={{ color: "#8F857E", fontWeight: 500 }}
                  >
                    E-post
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="du@dittvarumärke.se"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: "#FAF7F2",
                      border: "1px solid #E8E0D5",
                      color: "#1A1614",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#1A1614")}
                    onBlur={(e) => (e.target.style.borderColor = "#E8E0D5")}
                  />
                </div>

                {error && (
                  <p className="text-sm" style={{ color: "#B47A75" }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: loading ? "#5C544F" : "#1A1614",
                    color: "#FAF7F2",
                    fontFamily: "inherit",
                    cursor: loading ? "not-allowed" : "pointer",
                    border: "none",
                  }}
                >
                  {loading ? "Skickar..." : "Skicka inloggningslänk"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs mt-8" style={{ color: "#8F857E" }}>
          Inget konto än?{" "}
          <a href="/auth/login" className="underline" style={{ color: "#1A1614" }}>
            Kom igång gratis
          </a>
        </p>
      </div>
    </div>
  );
}
