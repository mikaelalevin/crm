import { createClient } from "@/lib/supabase/server";
import { getBrandId } from "@/lib/brand";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  const supabase = await createClient();

  const body = await request.json() as {
    customer_id?: string;
    prediction?: {
      product: string;
      date: string;
      daysUntil: number;
      confidence: number;
      reason: string;
    };
  };

  const { customer_id, prediction } = body;
  if (!customer_id) return Response.json({ error: "customer_id krävs" }, { status: 400 });

  const brandId = await getBrandId();
  if (!brandId) return Response.json({ error: "Inget varumärke hittades" }, { status: 404 });

  const { data: brandsData } = await supabase
    .from("brands")
    .select("id, name")
    .eq("id", brandId)
    .limit(1);

  const brand = brandsData?.[0] as { id: string; name: string } | undefined;
  if (!brand) return Response.json({ error: "Inget varumärke hittades" }, { status: 404 });

  const [{ data: customerData }, { data: ordersData }] = await Promise.all([
    supabase
      .from("customers")
      .select("id, email, first_name, last_name, total_spent, order_count, last_order_at, notes")
      .eq("id", customer_id)
      .eq("brand_id", brand.id)
      .single(),
    supabase
      .from("orders")
      .select("total, created_at, items")
      .eq("customer_id", customer_id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (!customerData) return Response.json({ error: "Kund hittades inte" }, { status: 404 });

  const customer = customerData as {
    email: string;
    first_name: string | null;
    last_name: string | null;
    total_spent: number | null;
    order_count: number | null;
    last_order_at: string | null;
    notes: string | null;
  };

  const orders = (ordersData ?? []) as { total: number; created_at: string; items: unknown[] }[];

  const firstName = customer.first_name ?? customer.email.split("@")[0];
  const fullName = [customer.first_name, customer.last_name].filter(Boolean).join(" ") || customer.email;

  const lastItems = orders.slice(0, 3).flatMap((o) => {
    if (!Array.isArray(o.items)) return [];
    return o.items.map((item) => {
      if (typeof item === "object" && item !== null) {
        const it = item as Record<string, unknown>;
        return String(it.name ?? it.title ?? it.product_name ?? "").trim();
      }
      return String(item).trim();
    }).filter(Boolean);
  });

  const lastItemsText = lastItems.length > 0 ? lastItems.slice(0, 4).join(", ") : null;
  const totalSpent = (customer.total_spent ?? 0).toLocaleString("sv");
  const orderCount = customer.order_count ?? 0;
  const daysSinceLast = customer.last_order_at
    ? Math.round((Date.now() - new Date(customer.last_order_at).getTime()) / 86_400_000)
    : null;

  const predProduct = prediction?.product ?? "ett nytt plagg";
  const predDate = prediction?.date ?? "inom kort";
  const predDays = prediction?.daysUntil ?? 14;
  const predReason = prediction?.reason ?? "";

  const prompt = `Du är säljarens assistent på ${brand.name}, ett mode/beauty-varumärke med varmt och personligt tonläge (tänk Studio Acacia, COS, Totême — sofistikerat men mänskligt).

UPPGIFT: Skriv ett kort, personligt utgående meddelande som säljaren ska skicka direkt till kunden. Det ska kännas som att en verklig person skriver — inte ett nyhetsbrev, inte en säljpitch.

KUNDINFO:
- Namn: ${fullName} (tilltala som "${firstName}")
- Totalt spenderat: ${totalSpent} kr
- Antal köp: ${orderCount}
${daysSinceLast !== null ? `- Dagar sedan senaste köp: ${daysSinceLast}` : ""}
${lastItemsText ? `- Senast köpta: ${lastItemsText}` : ""}
${customer.notes ? `- Säljarens anteckning: ${customer.notes}` : ""}

AI-PREDIKTION:
- Kunden förväntas köpa: ${predProduct}
- Inom: ${predDays} dagar (ca ${predDate})
${predReason ? `- Anledning: ${predReason}` : ""}

INSTRUKTIONER:
- Skriv på svenska, varmt och personligt
- Nämn ett specifikt plagg eller kategori kopplat till prediktionen — naturligt, inte påtvingat
- Max 4 meningar — kortare är bättre
- Avsluta med ett konkret nästa steg: boka tid, kom in, ta en titt
- Signera som "teamet på ${brand.name}" — säljaren fyller i sitt eget namn
- Inga emojis, inga utropstecken i onödan
- Känn igen kunden som en stammis om de handlat mer än 2 ggr

Svara ENBART med meddelandet, ingen förklaring, ingen rubrik.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";
    if (!text) throw new Error("Tomt svar från AI");

    return Response.json({ message: text });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Okänt fel";
    const isKeyError = msg.toLowerCase().includes("api key") || msg.toLowerCase().includes("authentication");
    return Response.json(
      { error: isKeyError ? "ANTHROPIC_API_KEY saknas eller är ogiltig" : `Kunde inte generera meddelande: ${msg}` },
      { status: 500 }
    );
  }
}
