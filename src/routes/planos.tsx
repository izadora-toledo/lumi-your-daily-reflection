import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Hand, PageShell } from "@/components/lumi/chrome";
import { useSession } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos — Lumi" },
      { name: "description", content: "Lumi Free e Lumi Pro: mensagens e músicas escolhidas para você." },
      { property: "og:title", content: "Planos — Lumi" },
      { property: "og:description", content: "Compare o Lumi Free e o Lumi Pro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Plans,
});

function Plans() {
  const { user } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const goPro = async () => {
    if (!user) return navigate({ to: "/auth", search: { mode: "signup" } });
    const { error } = await supabase.from("profiles").update({ plan: "pro" }).eq("id", user.id);
    if (error) return toast.error("Não consegui ativar agora.");
    await queryClient.invalidateQueries();
    toast.success("Lumi Pro ativado (modo demonstração).");
    navigate({ to: "/dashboard" });
  };

  return (
    <PageShell>
      <div className="soft-gradient px-5 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <Hand>escolha o seu</Hand>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Planos da Lumi</h1>
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
          <PlanCard
            name="Free"
            price="R$ 0"
            items={["3 mensagens por dia", "Histórico de mensagens", "Favoritar mensagens"]}
            action={<Button variant="outline" className="w-full" onClick={() => navigate({ to: user ? "/dashboard" : "/experiencia" })}>Começar grátis</Button>}
          />
          <PlanCard
            highlight
            name="Pro"
            price="R$ 19,90/mês"
            items={["Mensagens ilimitadas", "Música personalizada a cada momento", "Minha trilha: histórico musical", "Recomendações que aprendem com você"]}
            action={<Button className="w-full" onClick={goPro}>Assinar o Pro</Button>}
          />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Pagamento ainda não está ativo — a assinatura é ativada em modo demonstração.
        </p>
      </div>
    </PageShell>
  );
}

function PlanCard({ name, price, items, action, highlight }: { name: string; price: string; items: string[]; action: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`rounded-3xl border bg-card p-7 text-left shadow-soft ${highlight ? "border-primary" : "border-border/70"}`}>
      <p className="font-hand text-2xl text-primary">{name}</p>
      <p className="mt-1 text-2xl font-bold">{price}</p>
      <ul className="mt-5 space-y-2 text-sm">
        {items.map((i) => (
          <li key={i}>✓ {i}</li>
        ))}
      </ul>
      <div className="mt-7">{action}</div>
    </div>
  );
}
