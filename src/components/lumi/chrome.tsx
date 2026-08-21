import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LumiLogo } from "@/components/lumi/LumiLogo";
import { useSession } from "@/lib/session";

export function LumiMark({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <Link
      to="/"
      aria-label="Lumi — página inicial"
      className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
    >
      <LumiLogo compact={size === "sm"} />
    </Link>
  );
}

export function SiteHeader() {
  const { user } = useSession();

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-5">
        <LumiMark />
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/biscoito"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Biscoito da sorte
          </Link>
          <Link
            to="/planos"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Planos
          </Link>
          {user ? (
            <>
              <Link
                to="/trilha"
                className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:block"
              >
                Minha trilha
              </Link>
              <Link
                to="/perfil"
                className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
              >
                Perfil
              </Link>
              <Button asChild variant="ink" size="sm">
                <Link to="/dashboard">Meu espaço</Link>
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                search={{ mode: "login" }}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Entrar
              </Link>
              <Button asChild variant="ink" size="sm">
                <Link to="/auth" search={{ mode: "login" }}>
                  Começar
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 px-5 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center">
        <LumiMark size="sm" />
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
          Lumi é uma ferramenta de bem-estar e reflexão e não substitui acompanhamento profissional.
        </p>
      </div>
    </footer>
  );
}

export function Hand({ children }: { children: ReactNode }) {
  return <span className="font-hand text-xl text-primary sm:text-2xl">{children}</span>;
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
