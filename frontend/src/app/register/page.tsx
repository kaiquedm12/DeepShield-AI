"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, full_name: fullName }),
      });
      router.push("/login");
    } catch (err) {
      setError("Nao foi possivel criar sua conta.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <h1 className="font-display text-2xl">Criar conta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Comece a proteger seu conteudo agora.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Input
            type="text"
            placeholder="Nome completo"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error && <div className="text-sm text-red-400">{error}</div>}
          <Button className="w-full" type="submit">
            Criar conta
          </Button>
        </form>
        <div className="mt-6 text-sm text-muted-foreground">
          Ja possui conta? <Link href="/login">Entrar</Link>
        </div>
      </Card>
    </main>
  );
}
