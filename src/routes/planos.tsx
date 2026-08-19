import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Music2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Hand, PageShell } from "@/components/lumi/chrome";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/lib/data";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos — Lumi" },
      {
        name: "description",
        content: "Escolha entre o Lumi Free e o Lumi Pro.",
      },
    ],
  }),
  component: PlansPage,
});

const freeBenefits = [
  "Até 3 mensagens personalizadas por dia",
  "Escreva livremente como está se sentindo",
  "Salve até 5 mensagens favoritas",
];

const proBenefits = [
  "Mensagens personalizadas ilimitadas",
  "Recomendação musical personalizada",
  "Escolha baseada no sentimento e no seu gosto",
  "Explicação do motivo de cada música",
  "Histórico da sua trilha",
  "Mensagens favoritas ilimitadas",
];

function PlansPage() {
  const { user } = useSession();
  const { data: profile } = useProfile(user?.id);

  const requestSubscription = () => {
    toast.info("A assinatura ainda não está aberta. A cobrança será conectada na próxima etapa.");
  };

  return (
    <PageShell>
      <main className="soft-gradient px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <Hand>do seu jeito</Hand>
            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Escolha sua experiência Lumi</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Comece gratuitamente. Quando quiser transformar cada momento também em música, o Lumi
              Pro estará com você.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-border/70 bg-card p-7 shadow-soft sm:p-9">
              <Sparkles aria-hidden="true" className="text-primary" />
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Lumi Free
              </p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-bold">Grátis</span>
              </div>
              <ul className="mt-7 space-y-3">
                {freeBenefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-sm text-muted-foreground">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" size="lg" className="mt-9 w-full">
                <Link
                  to={user ? "/dashboard" : "/auth"}
                  search={user ? undefined : { mode: "signup" }}
                >
                  {profile?.plan === "free" ? "Seu plano atual" : "Começar grátis"}
                </Link>
              </Button>
            </article>

            <article className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card p-7 shadow-glow sm:p-9">
              <span className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                Recomendado
              </span>
              <Music2 aria-hidden="true" className="text-primary" />
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-primary">
                Lumi Pro
              </p>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-bold">R$ 9,90</span>
                <span className="pb-1 text-sm text-muted-foreground">/mês</span>
              </div>
              <ul className="mt-7 space-y-3">
                {proBenefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-sm text-muted-foreground">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                size="lg"
                className="mt-9 w-full"
                onClick={requestSubscription}
                disabled={profile?.plan === "pro"}
              >
                {profile?.plan === "pro" ? "Seu plano atual" : "Assinar Lumi Pro"}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                A cobrança ainda não está ativa neste MVP.
              </p>
            </article>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
