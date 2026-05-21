"use client";

import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Topbar } from "@/components/layout/topbar";
import { apiRequest } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useEffect, useState } from "react";

const stats = [
  { label: "Analises", value: "248" },
  { label: "Videos enviados", value: "73" },
  { label: "Taxa media IA", value: "62%" },
  { label: "Alertas", value: "12" },
];

const chartData = [
  { name: "Jan", score: 44 },
  { name: "Fev", score: 58 },
  { name: "Mar", score: 63 },
  { name: "Abr", score: 72 },
  { name: "Mai", score: 61 },
  { name: "Jun", score: 69 },
];

const history = [
  { name: "campanha-omega.mp4", score: "87%", status: "alto" },
  { name: "entrevista-credito.mov", score: "41%", status: "moderado" },
  { name: "pronunciamento.mkv", score: "12%", status: "baixo" },
];

export default function DashboardPage() {
  const [latestScore, setLatestScore] = useState<string | null>(null);
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    apiRequest<{ ai_score: number }>("/analysis/latest", { method: "GET" }, token)
      .then((data) => setLatestScore(`${Math.round(data.ai_score * 100)}%`))
      .catch(() => null);
  }, []);
  return (
    <DashboardShell current="/dashboard">
      <Topbar title="Dashboard" />
      <section className="mt-8 grid gap-6 md:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label}>
            <div className="text-sm text-muted-foreground">{item.label}</div>
            <div className="mt-3 text-2xl font-semibold">
              {item.label === "Taxa media IA" && latestScore ? latestScore : item.value}
            </div>
          </Card>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="text-sm text-muted-foreground">Score IA mensal</div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#97A3B6" />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{ background: "#0B101B", borderRadius: 12 }}
                />
                <Bar dataKey="score" fill="#46F2D3" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="text-sm text-muted-foreground">Uploads recentes</div>
          <div className="mt-4 space-y-3">
            {history.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
              >
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    risco {item.status}
                  </div>
                </div>
                <div className="text-sm font-semibold text-primary">
                  {item.score}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </DashboardShell>
  );
}
