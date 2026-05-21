"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Topbar } from "@/components/layout/topbar";
import { apiRequest } from "@/lib/api";
import { getToken } from "@/lib/auth";

const sampleTimeline = [
  { time: "00:10", value: 0.2 },
  { time: "00:12", value: 0.45 },
  { time: "00:14", value: 0.78 },
  { time: "00:16", value: 0.52 },
  { time: "00:20", value: 0.3 },
  { time: "00:32", value: 0.85 },
  { time: "00:35", value: 0.4 },
];

const sampleFlags = [
  {
    title: "Voice modulation artifact",
    time: "00:12 - 00:16",
    detail: "Assinatura espectral sintetica detectada.",
  },
  {
    title: "Lip sync drift",
    time: "00:32 - 00:35",
    detail: "Desvio de sincronizacao labial.",
  },
];

export default function AnalysisPage() {
  const [score, setScore] = useState(87);
  const [confidence, setConfidence] = useState(91);
  const [timeline, setTimeline] = useState(sampleTimeline);
  const [flags, setFlags] = useState(sampleFlags);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    apiRequest<{
      ai_score: number;
      confidence: number;
      timeline: { start: number; end: number }[];
      visual_flags: { type: string }[];
      audio_flags: { type: string }[];
    }>("/analysis/latest", { method: "GET" }, token)
      .then((data) => {
        setScore(Math.round(data.ai_score * 100));
        setConfidence(Math.round(data.confidence * 100));
        if (data.timeline?.length) {
          setTimeline(
            data.timeline.map((item, index) => ({
              time: `${item.start.toFixed(0)}s`,
              value: Math.min(1, 0.2 + index * 0.15),
            }))
          );
        }
        const mergedFlags = [
          ...data.visual_flags.map((flag) => ({
            title: flag.type,
            time: "Detectado",
            detail: "Inconsistencia visual localizada.",
          })),
          ...data.audio_flags.map((flag) => ({
            title: flag.type,
            time: "Detectado",
            detail: "Anomalia auditiva localizada.",
          })),
        ];
        if (mergedFlags.length) {
          setFlags(mergedFlags);
        }
      })
      .catch(() => null);
  }, []);

  return (
    <DashboardShell current="/analysis">
      <Topbar title="Analise" />
      <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="text-sm text-muted-foreground">Score IA</div>
          <div className="mt-4 text-4xl font-semibold text-primary">{score}%</div>
          <div className="mt-2 text-sm text-muted-foreground">
            Confianca {confidence}%
          </div>
          <div className="mt-6 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline}>
                <XAxis dataKey="time" stroke="#97A3B6" />
                <Tooltip
                  cursor={{ stroke: "rgba(255,255,255,0.2)" }}
                  contentStyle={{ background: "#0B101B", borderRadius: 12 }}
                />
                <Line type="monotone" dataKey="value" stroke="#46F2D3" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="text-sm text-muted-foreground">Trechos suspeitos</div>
          <div className="mt-4 space-y-3">
            {flags.map((flag) => (
              <div
                key={flag.title}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="text-sm font-semibold">{flag.title}</div>
                <div className="text-xs text-muted-foreground">{flag.time}</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {flag.detail}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </DashboardShell>
  );
}
