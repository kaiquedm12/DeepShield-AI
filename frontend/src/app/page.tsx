"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const stats = [
  { label: "Videos analisados", value: "128K+" },
  { label: "Precisao media", value: "94.2%" },
  { label: "Tempo medio", value: "3m 18s" },
];

const features = [
  {
    title: "Motor forense multimodal",
    description:
      "Combina analise visual, audio e biometria para detectar sinais sutis de manipulacao.",
  },
  {
    title: "Linha do tempo inteligente",
    description:
      "Destaca trechos suspeitos e explica tecnicamente cada inconsistência encontrada.",
  },
  {
    title: "Relatorios exportaveis",
    description:
      "Gere PDF e JSON assinados para compliance, auditorias e processos legais.",
  },
];

const pricing = [
  {
    tier: "Starter",
    price: "R$ 299",
    description: "Para criadores e agencias pequenas.",
    items: ["150 analises/mes", "Relatorios basicos", "Suporte 48h"],
  },
  {
    tier: "Pro",
    price: "R$ 1290",
    description: "Times de seguranca e midia.",
    items: ["1500 analises/mes", "Relatorios avancados", "Suporte 12h"],
  },
  {
    tier: "Enterprise",
    price: "Custom",
    description: "Operacoes criticas e integracoes profundas.",
    items: ["SLA dedicado", "IA custom", "On-premise"],
  },
];

const faq = [
  {
    q: "Como o DeepShield AI detecta deepfakes?",
    a: "O motor combina modelos de visao computacional, analise de audio e inconsistencias biomecanicas.",
  },
  {
    q: "O sistema e adequado para pericia legal?",
    a: "Sim. Os relatorios incluem trilha de auditoria, confianca e exportacao assinada.",
  },
  {
    q: "Quais formatos sao suportados?",
    a: "MP4, MOV, AVI e MKV, com limite de 500MB por envio.",
  },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-[length:60px_60px] opacity-10" />
      <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-aurora blur-[140px]" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-lg font-semibold tracking-[0.3em]">DeepShield</div>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features">Recursos</a>
          <a href="#ai">IA</a>
          <a href="#pricing">Planos</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Criar conta</Link>
          </Button>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1.2fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          <Badge>Autenticidade de video em tempo real</Badge>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
            Detecte deepfakes com inteligencia forense que inspira confianca.
          </h1>
          <p className="text-lg text-muted-foreground">
            O DeepShield AI combina visao computacional, audio forense e modelos
            generativos para revelar manipulacoes invisiveis a olho nu.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/upload">Analisar agora</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">Ver dashboard</Link>
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-8">
            {stats.map((item) => (
              <div key={item.label}>
                <div className="text-2xl font-semibold">{item.value}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-cyan-500/20 via-transparent to-emerald-500/20 blur-2xl" />
          <Card className="relative flex h-full flex-col gap-6">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4">
              <div className="text-xs uppercase text-muted-foreground">Analise ativa</div>
              <div className="mt-4 text-3xl font-semibold">87% IA</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Confianca 91% • 2 inconsistencias encontradas
              </div>
            </div>
            <div className="grid gap-3">
              {[
                "Desvio de sincronizacao labial detectado",
                "Sombras inconsistentes em 3 trechos",
                "Assinatura acustica sintetica",
              ].map((line) => (
                <div
                  key={line}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                >
                  {line}
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Timeline forense sincronizada
            </div>
          </Card>
        </motion.div>
      </section>

      <section id="features" className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <h3 className="font-display text-xl">{feature.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section id="ai" className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Badge>IA Explicavel</Badge>
            <h2 className="mt-4 font-display text-3xl">
              Um pipeline forense end-to-end treinado para detectar geracao sintetica.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Combina redes neurais visuais, analise espectral de audio e modelos
              generativos para entregar uma estimativa probabilistica transparente.
            </p>
            <div className="mt-6 grid gap-4">
              {["Deteccao facial", "Anomalias de movimento", "Audio sintetico"].map(
                (label) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                  >
                    {label}
                  </div>
                )
              )}
            </div>
          </div>
          <Card>
            <h3 className="font-display text-xl">Relatorio detalhado</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Evidencias, explicacoes tecnicas e timeline de eventos suspeitos
              prontos para exportacao.
            </p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-muted-foreground">
              00:12 - 00:16 • Artefato de voz sintetica
              <br />
              00:32 - 00:35 • Deriva de sincronizacao labial
              <br />
              00:44 - 00:47 • Desvio de iluminacao detectado
            </div>
          </Card>
        </div>
      </section>

      <section id="pricing" className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16">
        <h2 className="font-display text-3xl">Planos sob medida</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pricing.map((plan) => (
            <Card key={plan.tier}>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {plan.tier}
              </div>
              <div className="mt-4 text-3xl font-semibold">{plan.price}</div>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {plan.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <Button className="mt-6 w-full" variant="outline">
                Comecar
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section id="faq" className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16">
        <h2 className="font-display text-3xl">FAQ</h2>
        <div className="mt-8 grid gap-4">
          {faq.map((item) => (
            <Card key={item.q}>
              <h3 className="text-lg font-semibold">{item.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24">
        <Card className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl">Pronto para blindar sua midia?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Inicie um upload e receba um relatorio forense em minutos.
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="/upload">Comecar agora</Link>
          </Button>
        </Card>
      </section>
    </main>
  );
}
