// Prediction logic based on real purchase patterns.
// No AI API needed — derives signal from actual order data.

export interface OrderData {
  created_at: string;
  total: number;
  items: unknown[];
}

export interface CustomerData {
  total_spent: number | null;
  order_count: number | null;
  last_order_at?: string | null;
  created_at?: string | null;
}

export interface Prediction {
  product: string;
  date: string;       // "12 jun" format
  daysUntil: number;
  confidence: number; // 0–100
  reason: string;
}

// Seasonal suggestions for May (Swedish fashion)
const SUMMER_ITEMS = [
  "Linen Midi Klänning",
  "Siden Blus",
  "Linne Shorts",
  "Draperad Sommarklänning",
  "Bomullslinne",
  "Lin Wide Leg Byxor",
  "Ribbad Topp",
  "Linne Skjortklänning",
];

const PREMIUM_ITEMS = [
  "Cashmere Cardigan",
  "Siden Midi Klänning",
  "Oversized Ullkappa",
  "Draperad Siden Klänning",
  "Lin Maxi Klänning",
];

const COMPLEMENT_MAP: Record<string, string> = {
  "klänning": "Siden Blus",
  "dress": "Linne Shorts",
  "blazer": "Wide Leg Byxor Lin",
  "cardigan": "Ribbad Topp",
  "kappa": "Stickad Kofta",
  "byxor": "Siden Blus Crème",
  "kjol": "Bomullslinne",
  "topp": "Lin Midi Kjol",
  "blus": "Cashmere Cardigan",
  "shorts": "Linne Linne",
  "hoodie": "Barrel Leg Jeans",
  "set": "Siden Cami",
  "jeans": "Oversized Blazer",
};

function pickComplement(items: unknown[]): string | null {
  if (!Array.isArray(items) || items.length === 0) return null;
  const lastItem = items[items.length - 1] as Record<string, unknown>;
  const name = String(lastItem?.name ?? lastItem?.title ?? "").toLowerCase();
  for (const [key, complement] of Object.entries(COMPLEMENT_MAP)) {
    if (name.includes(key)) return complement;
  }
  return null;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("sv-SE", { day: "numeric", month: "short" }).replace(".", "");
}

function avgDaysBetweenOrders(orders: OrderData[]): number {
  if (orders.length < 2) return 45;
  const sorted = [...orders].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  const span =
    (new Date(sorted[sorted.length - 1].created_at).getTime() -
      new Date(sorted[0].created_at).getTime()) /
    86_400_000;
  return Math.round(span / (sorted.length - 1));
}

export function generatePrediction(
  customer: CustomerData,
  orders: OrderData[]
): Prediction {
  const now = new Date();
  const lastOrderMs = customer.last_order_at
    ? new Date(customer.last_order_at).getTime()
    : now.getTime() - 30 * 86_400_000;
  const daysSinceLast = Math.floor((now.getTime() - lastOrderMs) / 86_400_000);
  const orderCount = customer.order_count ?? orders.length ?? 1;
  const totalSpent = customer.total_spent ?? 0;

  // Calculate interval
  const interval = orders.length >= 2 ? avgDaysBetweenOrders(orders) : 50;
  const daysUntil = Math.max(1, interval - daysSinceLast);
  const predictedDate = new Date(now.getTime() + daysUntil * 86_400_000);

  // Pick product
  const lastOrderItems = orders[0]?.items ?? [];
  const complement = pickComplement(lastOrderItems);
  let product: string;

  if (complement) {
    product = complement;
  } else if (totalSpent > 30000) {
    product = PREMIUM_ITEMS[orderCount % PREMIUM_ITEMS.length];
  } else {
    product = SUMMER_ITEMS[orderCount % SUMMER_ITEMS.length];
  }

  // Confidence: higher for frequent buyers with short intervals
  const freqScore = Math.min(40, orderCount * 4);
  const recencyScore = daysSinceLast < interval ? 40 : Math.max(0, 40 - (daysSinceLast - interval) * 2);
  const spendScore = Math.min(20, Math.floor(totalSpent / 3000));
  const confidence = Math.min(96, Math.max(42, freqScore + recencyScore + spendScore));

  // Reason text
  const reason = buildReason(orderCount, interval, daysSinceLast, totalSpent, product);

  return {
    product,
    date: formatDate(predictedDate),
    daysUntil,
    confidence,
    reason,
  };
}

function buildReason(
  orderCount: number,
  interval: number,
  daysSinceLast: number,
  totalSpent: number,
  product: string
): string {
  if (orderCount === 1) {
    return `Ny kund med sitt första köp. Baserat på liknande kundprofiler är ett återköp troligt inom ${interval} dagar — ${product} är ett vanligt nästa steg.`;
  }
  if (orderCount >= 8) {
    return `Stammis med ${orderCount} köp och ett snitt på ${interval} dagar mellan ordrar. Köpcykeln pekar mot ${product} som nästa naturliga val.`;
  }
  if (totalSpent > 25000) {
    return `Högvärdig kund med totalt ${totalSpent.toLocaleString("sv")} kr i köp. Handlar ungefär var ${interval}:e dag — ${product} matchar tidigare köpmönster.`;
  }
  return `Baserat på ${orderCount} köp med ett snitt på ${interval} dagars intervall. Det har gått ${daysSinceLast} dagar sedan senaste order — ${product} är det mest sannolika nästa köpet.`;
}

// Simpler version for table rows (no order detail needed)
export function generateTablePrediction(customer: CustomerData): {
  product: string;
  date: string;
  confidence: number;
} {
  const pred = generatePrediction(customer, []);
  return { product: pred.product, date: pred.date, confidence: pred.confidence };
}
