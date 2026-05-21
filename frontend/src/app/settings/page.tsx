"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Topbar } from "@/components/layout/topbar";

export default function SettingsPage() {
  return (
    <DashboardShell current="/settings">
      <Topbar title="Configuracoes" />
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <div className="text-sm text-muted-foreground">Preferencias</div>
          <div className="mt-4 space-y-3 text-sm">
            <div>Tema: Dark elegante</div>
            <div>Notificacoes: Ativas</div>
            <div>Exportacao: PDF + JSON</div>
          </div>
          <Button className="mt-6" variant="outline">
            Alterar preferencias
          </Button>
        </Card>
        <Card>
          <div className="text-sm text-muted-foreground">Seguranca</div>
          <div className="mt-4 space-y-3 text-sm">
            <div>Rotacao de token: 30 dias</div>
            <div>Regras de upload: 500MB</div>
            <div>Rate limit: 30 req/min</div>
          </div>
          <Button className="mt-6" variant="outline">
            Atualizar seguranca
          </Button>
        </Card>
      </section>
    </DashboardShell>
  );
}
