import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "./Sidebar";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: brand } = await supabase
    .from("brands")
    .select("name")
    .eq("owner_id", user.id)
    .single();

  if (!brand) redirect("/onboarding");

  const initials = (user.email || "?")
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen" style={{ background: "#FAF7F2" }}>
      <Sidebar
        brandName={brand.name}
        userInitials={initials}
        userEmail={user.email || ""}
      />
      <main
        className="flex-1 min-w-0"
        style={{ padding: "32px 48px 64px", maxWidth: 1400 }}
      >
        {children}
      </main>
    </div>
  );
}
