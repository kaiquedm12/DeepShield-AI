"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Topbar } from "@/components/layout/topbar";
import { apiRequest } from "@/lib/api";
import { getToken } from "@/lib/auth";

type HistoryItem = {
  id: number;
  filename: string;
  status: string;
  created_at: string;
  analysis_id: number | null;
  ai_score: number | null;
};

type HistoryResponse = {
  items: HistoryItem[];
  total: number;
  page: number;
  page_size: number;
};

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / 10)), [total]);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const params = new URLSearchParams({ page: String(page), page_size: "10" });
    if (query) params.set("q", query);
    if (status) params.set("status", status);
    apiRequest<HistoryResponse>(`/upload/history?${params.toString()}`, {}, token)
      .then((data) => {
        setItems(data.items);
        setTotal(data.total);
      })
      .catch(() => null);
  }, [page, query, status]);

  return (
    <DashboardShell current="/history">
      <Topbar title="Historico" />
      <section className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <Input
            placeholder="Buscar por nome"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Input
            placeholder="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {total} resultados
        </div>
      </section>
      <section className="mt-6 grid gap-4">
        {items.length === 0 ? (
          <EmptyState
            title="Sem analises ainda"
            description="Envie seu primeiro video para iniciar o monitoramento forense."
          />
        ) : (
          items.map((item) => (
            <Card key={item.id} className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{item.filename}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-primary">
                  {item.ai_score !== null ? `${Math.round(item.ai_score * 100)}%` : "-"}
                </div>
                <div className="text-xs text-muted-foreground">{item.status}</div>
              </div>
            </Card>
          ))
        )}
      </section>
      <section className="mt-6 flex items-center justify-between text-sm">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Anterior
        </Button>
        <div className="text-muted-foreground">
          Pagina {page} de {totalPages}
        </div>
        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Proxima
        </Button>
      </section>
    </DashboardShell>
  );
}
