"use client";

import { Card } from "@/components/ui/card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Topbar } from "@/components/layout/topbar";

export default function ProfilePage() {
  return (
    <DashboardShell current="/profile">
      <Topbar title="Perfil" />
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <div className="text-sm text-muted-foreground">Dados pessoais</div>
          <div className="mt-4 space-y-3 text-sm">
            <div>Nome: Ana Ribeiro</div>
            <div>Email: ana@deepshield.ai</div>
            <div>Empresa: DeepShield Labs</div>
          </div>
        </Card>
        <Card>
          <div className="text-sm text-muted-foreground">Seguranca</div>
          <div className="mt-4 space-y-3 text-sm">
            <div>Autenticacao: JWT ativa</div>
            <div>Ultimo login: 20 maio 2026</div>
            <div>IP confiavel: 189.12.34.0</div>
          </div>
        </Card>
      </section>
    </DashboardShell>
  );
}
