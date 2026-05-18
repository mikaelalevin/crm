"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

function NavIcon({ path }: { path: string }) {
  const icons: Record<string, React.ReactNode> = {
    dashboard: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
    segments: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
        <circle cx="9" cy="9" r="5" />
        <circle cx="16" cy="15" r="5" />
      </svg>
    ),
    customers: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
      </svg>
    ),
    campaigns: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
        <path d="M3 8l9-5 9 5-9 5-9-5z" />
        <path d="M3 14l9 5 9-5" />
        <path d="M3 11l9 5 9-5" />
      </svg>
    ),
    trends: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
        <path d="M3 17l6-6 4 4 8-8" />
        <path d="M14 7h7v7" />
      </svg>
    ),
    ai: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
        <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7z" />
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  };
  return <>{icons[path] ?? null}</>;
}

interface SidebarProps {
  brandName?: string;
  userInitials?: string;
  userEmail?: string;
}

export function Sidebar({ brandName = "Ditt varumärke", userInitials = "?", userEmail = "" }: SidebarProps) {
  const pathname = usePathname();

  const mainNav: NavItem[] = [
    { href: "/dashboard", label: "Översikt", icon: <NavIcon path="dashboard" /> },
    { href: "/segments", label: "Segment", icon: <NavIcon path="segments" />, badge: 12 },
    { href: "/customers", label: "Kunder", icon: <NavIcon path="customers" /> },
    { href: "/campaigns", label: "Kampanjer", icon: <NavIcon path="campaigns" /> },
  ];

  const insightsNav: NavItem[] = [
    { href: "/trends", label: "Trender", icon: <NavIcon path="trends" /> },
    { href: "/ai-recommendations", label: "AI-rekommendationer", icon: <NavIcon path="ai" /> },
  ];

  const configNav: NavItem[] = [
    { href: "/settings", label: "Integrationer", icon: <NavIcon path="settings" /> },
  ];

  function NavLink({ item }: { item: NavItem }) {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link
        href={item.href}
        className="flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13.5px] font-medium transition-all"
        style={{
          background: isActive ? "#1A1614" : "transparent",
          color: isActive ? "#FAF7F2" : "#5C544F",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.background = "#F2EDE5";
            (e.currentTarget as HTMLElement).style.color = "#1A1614";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#5C544F";
          }
        }}
      >
        <span className="flex-shrink-0">{item.icon}</span>
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span
            className="text-[10px] font-semibold px-[7px] py-[2px] rounded-full"
            style={{ background: "#D4A5A0", color: "white" }}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  }

  return (
    <aside
      className="flex flex-col gap-8 sticky top-0 h-screen"
      style={{
        width: 240,
        padding: "28px 20px",
        background: "#FAF7F2",
        borderRight: "1px solid #E8E0D5",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div className="flex items-baseline gap-2 px-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#B47A75" }} />
        <span
          className="text-[28px] tracking-[0.08em]"
          style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 400, color: "#1A1614" }}
        >
          MUSE
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {mainNav.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        <div
          className="text-[11px] uppercase tracking-[0.12em] font-medium px-3 mt-4 mb-2"
          style={{ color: "#8F857E" }}
        >
          Insikter
        </div>

        {insightsNav.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        <div
          className="text-[11px] uppercase tracking-[0.12em] font-medium px-3 mt-4 mb-2"
          style={{ color: "#8F857E" }}
        >
          Konfiguration
        </div>

        {configNav.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* User footer */}
      <div
        className="flex items-center gap-2.5 px-3 py-4"
        style={{ borderTop: "1px solid #E8E0D5" }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #D4A5A0, #6B4F5B)" }}
        >
          {userInitials}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold truncate" style={{ color: "#1A1614" }}>
            {userEmail.split("@")[0] || "Användare"}
          </div>
          <div className="text-[11px] truncate" style={{ color: "#8F857E" }}>
            {brandName}
          </div>
        </div>
      </div>
    </aside>
  );
}
