import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="font-display text-4xl">404</div>
      <p className="text-sm text-muted-foreground">
        Pagina nao encontrada.
      </p>
      <Button asChild>
        <Link href="/">Voltar</Link>
      </Button>
    </main>
  );
}
