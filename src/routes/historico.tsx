import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BookHeart, CalendarDays, Clock3, Heart, LockKeyhole } from "lucide-react";
import { AuthGate } from "@/components/lumi/AuthGate";
import { Hand, PageShell } from "@/components/lumi/chrome";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/lib/data";
import { getMomentHistory } from "@/lib/moment-history.functions";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Histórico de momentos — Lumi" },
      {
        name: "description",
        content: "Releia o que você compartilhou com a Lumi e as mensagens que recebeu.",
      },
    ],
  }),
  component: MomentHistoryPage,
});

function MomentHistoryPage() {
  return (
    <AuthGate>
      <MomentHistory />
    </AuthGate>
  );
}

function MomentHistory() {
  const { user } = useSession();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const history = useServerFn(getMomentHistory);
  const isPro = profile?.plan === "pro";
  const historyQuery = useQuery({
    queryKey: ["moment-history", user?.id],
    enabled: !!user && isPro,
    queryFn: () => history(),
  });

  return (
    <PageShell>
      <main className="soft-gradient min-h-[72vh] px-5 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Hand>sua história em palavras</Hand>
            <h1 className="mt-2 text-3xl font-bold sm:text-5xl">Histórico de momentos</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Releia o que você compartilhou e a resposta que a Lumi preparou para cada momento.
            </p>
          </div>

          {profileLoading ? (
            <div className="mt-10 flex min-h-52 items-center justify-center">
              <span className="h-3 w-3 animate-float rounded-full bg-primary" />
            </div>
          ) : !isPro ? (
            <div className="mt-10 rounded-[2rem] border border-primary/15 bg-card p-8 text-center shadow-soft">
              <LockKeyhole aria-hidden="true" className="mx-auto text-primary" />
              <h2 className="mt-4 text-xl font-bold">Seu diário de momentos no Lumi Pro</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                No plano Pro, você pode acompanhar tudo o que escreveu e cada mensagem recebida ao
                longo do tempo.
              </p>
              <Button asChild className="mt-6">
                <Link to="/planos">Conhecer o Lumi Pro</Link>
              </Button>
            </div>
          ) : historyQuery.isLoading ? (
            <div className="mt-10 flex min-h-52 items-center justify-center">
              <span className="h-3 w-3 animate-float rounded-full bg-primary" />
            </div>
          ) : historyQuery.data?.length ? (
            <div className="mt-10 space-y-5">
              {historyQuery.data.map((item) => {
                const momentDate = new Date(item.mood_entries?.created_at ?? item.created_at);
                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-3xl border border-primary/15 bg-card shadow-soft"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-6 py-4">
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays aria-hidden="true" className="h-4 w-4 text-primary" />
                          {momentDate.toLocaleDateString("pt-BR", {
                            timeZone: "America/Sao_Paulo",
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock3 aria-hidden="true" className="h-4 w-4 text-primary" />
                          {momentDate.toLocaleTimeString("pt-BR", {
                            timeZone: "America/Sao_Paulo",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {item.favorite && <Heart aria-label="Mensagem favorita" className="h-4 w-4 fill-primary text-primary" />}
                    </div>

                    <div className="space-y-5 p-6">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Você escreveu
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                          “{item.mood_entries?.mood_text}”
                        </p>
                      </div>
                      <div className="rounded-2xl bg-secondary/60 p-5">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                          <BookHeart aria-hidden="true" className="h-4 w-4" />
                          A Lumi respondeu
                        </p>
                        <p className="mt-3 text-base leading-relaxed">{item.message}</p>
                      </div>
                      {item.mood_entries?.detected_mood && (
                        <p className="text-xs capitalize text-muted-foreground">
                          Momento: {item.mood_entries.detected_mood}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-10 rounded-[2rem] border border-dashed border-border bg-card/60 p-9 text-center text-sm text-muted-foreground">
              Seus próximos momentos compartilhados com a Lumi aparecerão aqui.
            </div>
          )}
        </div>
      </main>
    </PageShell>
  );
}
