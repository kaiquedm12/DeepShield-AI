import Link from "next/link";
import {
  Shield,
  UploadCloud,
  History,
  User,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload", icon: UploadCloud },
  { href: "/analysis", label: "Analise", icon: Shield },
  { href: "/history", label: "Historico", icon: History },
  { href: "/profile", label: "Perfil", icon: User },
  { href: "/settings", label: "Configuracoes", icon: Settings },
];

export function Sidebar({ current }: { current?: string }) {
  return (
    <aside className="hidden h-screen w-64 flex-col gap-6 border-r border-white/10 bg-black/20 p-6 md:flex">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Shield className="h-5 w-5 text-primary" /> DeepShield AI
      </div>
      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = current === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted-foreground transition",
                active && "bg-white/10 text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-muted-foreground">
        Monitoramento ativo • 3 alertas
      </div>
    </aside>
  );
}
