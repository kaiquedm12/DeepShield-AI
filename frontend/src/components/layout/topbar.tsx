import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="font-display text-2xl">{title}</h1>
        <p className="text-sm text-muted-foreground">
          Atualizacoes em tempo real sobre suas analises.
        </p>
      </div>
      <Button variant="outline" className="gap-2">
        <Bell className="h-4 w-4" /> Alertas
      </Button>
    </header>
  );
}
