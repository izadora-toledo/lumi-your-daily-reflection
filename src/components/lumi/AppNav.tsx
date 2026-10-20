import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LumiMark, SiteFooter } from "@/components/lumi/chrome";

const LINKS = [
  { to: "/dashboard", label: "Início" },
  { to: "/trilha", label: "Minha trilha" },
  { to: "/perfil", label: "Perfil" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { mode: "login" }, replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 px-5">
          <LumiMark />
          <nav className="flex items-center gap-1 sm:gap-2">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground font-semibold" }}
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={signOut}
              className="ml-1 rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              Sair
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
