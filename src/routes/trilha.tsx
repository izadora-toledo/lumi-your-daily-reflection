import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CalendarDays, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { AuthGate } from "@/components/lumi/AuthGate";
import { MusicCard } from "@/components/lumi/MusicCard";
import { getLumiErrorMessage } from "@/lib/errors";
import { Hand, PageShell } from "@/components/lumi/chrome";
import { Button } from "@/components/ui/button";
import { formatDay, useProfile, useRecommendations } from "@/lib/data";
import { setMusicFeedback } from "@/lib/lumi.functions";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/trilha")({
  head: () => ({
    meta: [
      { title: "Minha trilha — Lumi" },
      { name: "description", content: "Relembre as músicas escolhidas para seus momentos." },
    ],
  }),
  component: TrailPage,
});

function TrailPage() {
  return (
    <AuthGate>
      <Trail />
    </AuthGate>
  );
}

function Trail() {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const { data: profile } = useProfile(user?.id);
  const { data: recommendations = [] } = useRecommendations(user?.id);
  const feedback = useServerFn(setMusicFeedback);
  const isPro = profile?.plan === "pro";

  const sendFeedback = async (recommendationId: string, value: string) => {
    try {
      await feedback({ data: { recommendationId, feedback: value } });
      await queryClient.invalidateQueries({ queryKey: ["recommendations", user?.id] });
      toast.success("Obrigada! Sua trilha vai ficar cada vez mais com a sua cara.");
    } catch (error) {
      toast.error(getLumiErrorMessage(error, "Não consegui registrar sua opinião."));
    }
  };

  return (
    <PageShell>
      <main className="soft-gradient px-5 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <Hand>música também guarda memória</Hand>
          <h1 className="mt-2 text-4xl font-bold">Minha trilha</h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            As músicas que acompanharam seus momentos ficam reunidas aqui.
          </p>

          {!isPro ? (
            <div className="mt-9 rounded-3xl border border-primary/20 bg-card p-8 text-center shadow-soft">
              <LockKeyhole aria-hidden="true" className="mx-auto text-primary" />
              <h2 className="mt-4 text-xl font-bold">Sua trilha começa no Lumi Pro</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Receba uma música personalizada para cada momento e volte a ela quando quiser.
              </p>
              <Button asChild className="mt-6">
                <Link to="/planos">Conhecer o Lumi Pro</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-9 space-y-7">
              {recommendations.length ? (
                recommendations.map((recommendation) => (
                  <section key={recommendation.id}>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold">{formatDay(recommendation.created_at)}</p>
                        {recommendation.mood_label && (
                          <p className="text-xs capitalize text-muted-foreground">
                            {recommendation.mood_label}
                          </p>
                        )}
                      </div>
                    </div>
                    <MusicCard
                      recommendation={recommendation}
                      onFeedback={(value) => sendFeedback(recommendation.id, value)}
                    />
                  </section>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center text-sm text-muted-foreground">
                  Sua primeira música vai aparecer aqui depois que você contar como está se
                  sentindo.
                </div>
              )}
            </div>
          )}

          <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/60 p-7">
            <CalendarDays aria-hidden="true" className="text-primary" />
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-primary">
              Em breve
            </p>
            <h2 className="mt-1 text-xl font-bold">A trilha sonora do meu mês</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Um retrato musical dos sentimentos e das descobertas que acompanharam seu mês.
            </p>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
