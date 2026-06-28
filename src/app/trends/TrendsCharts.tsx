"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const ink = "#1A1614";
const inkMuted = "#8A6E55";
const border = "#DDD0B5";
const warm = "#F2E8D0";

interface MonthData { month: string; revenue: number; }
interface WeekdayData { day: string; revenue: number; }
interface TopItem { name: string; count: number; }

function CustomBarTooltip({ active, payload, label, suffix = " kr" }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 shadow-sm" style={{ background: ink, border: `1px solid ${border}` }}>
      <div className="text-[11px] mb-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 15, color: "white" }}>
        {payload[0].value.toLocaleString("sv")}{suffix}
      </div>
    </div>
  );
}

export function RevenueBarChart({ data }: { data: MonthData[] }) {
  const max = Math.max(...data.map((d) => d.revenue));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={32} margin={{ top: 8, right: 0, left: -10, bottom: 0 }}>
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: inkMuted, fontFamily: "inherit" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: inkMuted, fontFamily: "inherit" }} axisLine={false} tickLine={false}
          tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v} />
        <Tooltip content={<CustomBarTooltip />} cursor={{ fill: warm }} />
        <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.month} fill={entry.revenue === max ? ink : "#C9B8A0"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function WeekdayBarChart({ data }: { data: WeekdayData[] }) {
  const sorted = [...data].filter((d) => d.revenue > 0).sort((a, b) => b.revenue - a.revenue);
  const max = sorted[0]?.revenue ?? 1;
  return (
    <div className="flex flex-col gap-2.5">
      {sorted.map((entry) => (
        <div key={entry.day}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[13px]" style={{ color: ink, fontWeight: entry.revenue === max ? 600 : 400 }}>{entry.day}</span>
            <span className="text-[12px] font-semibold" style={{ color: entry.revenue === max ? "#6B4F5B" : inkMuted }}>
              {entry.revenue.toLocaleString("sv")} kr
            </span>
          </div>
          <div className="rounded-full overflow-hidden" style={{ height: 6, background: warm }}>
            <div style={{
              height: "100%",
              width: `${(entry.revenue / max) * 100}%`,
              background: entry.revenue === max ? "#6B4F5B" : "#C9B8A0",
              borderRadius: 3,
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TopItemsList({ items, maxCount }: { items: TopItem[]; maxCount: number }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.name}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[13px]" style={{ color: ink }}>{item.name}</span>
            <span className="text-[12px] font-semibold" style={{ color: inkMuted }}>{item.count} st</span>
          </div>
          <div className="rounded-full overflow-hidden" style={{ height: 5, background: warm }}>
            <div
              style={{ height: "100%", width: `${(item.count / maxCount) * 100}%`, background: ink, borderRadius: 3, transition: "width 0.6s ease" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
