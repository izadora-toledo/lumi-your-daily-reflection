import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { CalendarDays, Clock3, LockKeyhole, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hand, PageShell } from "@/components/lumi/chrome";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLumiErrorMessage } from "@/lib/errors";
import {
  getFortuneCookieHistory,
  getTodayFortune,
  openFortuneCookie,
} from "@/lib/fortune.functions";
import { fortunes, fortuneDateInSaoPaulo, type Fortune } from "@/lib/fortunes";
import { useProfile } from "@/lib/data";
import { useSession } from "@/lib/session";
import { toast } from "sonner";

export const Route = createFileRoute("/biscoito")({
  head: () => ({
    meta: [
      { title: "Biscoito da sorte — Lumi" },
      {
        name: "description",
        content: "Abra seu biscoito da sorte gratuito e descubra a mensagem que espera por você hoje.",
      },
    ],
  }),
  component: FortuneCookiePage,
});

const TODAY_STORAGE_KEY = "lumi:fortune:today";
const HISTORY_STORAGE_KEY = "lumi:fortune:history";

type SavedFortune = {
  date: string;
  fortuneId: number;
};

function readSavedFortune(): SavedFortune | null {
  try {
    const value = window.localStorage.getItem(TODAY_STORAGE_KEY);
    return value ? (JSON.parse(value) as SavedFortune) : null;
  } catch {
    return null;
  }
}

function readHistory(): number[] {
  try {
    const value = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    return value ? (JSON.parse(value) as number[]) : [];
  } catch {
    return [];
  }
}

function chooseFortune(): Fortune {
  const history = readHistory();
  const available = fortunes.filter((fortune) => !history.includes(fortune.id));
  const pool = available.length ? available : fortunes;
  const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % pool.length;
  return pool[randomIndex]!;
}

function asFortune(value: { fortune_id: number; category: string; message: string }): Fortune {
  return { id: value.fortune_id, category: value.category, message: value.message };
}

function FortuneCookiePage() {
  const queryClient = useQueryClient();
  const { user, loading: sessionLoading } = useSession();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const isPro = profile?.plan === "pro";
  const getToday = useServerFn(getTodayFortune);
  const openForPro = useServerFn(openFortuneCookie);
  const getHistory = useServerFn(getFortuneCookieHistory);
  const [ready, setReady] = useState(false);
  const [opening, setOpening] = useState(false);
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const historyQuery = useQuery({
    queryKey: ["fortune-cookie-history", user?.id],
    enabled: !!user && isPro,
    queryFn: () => getHistory(),
  });

  useEffect(() => {
    if (sessionLoading || (user && profileLoading)) return;

    if (user && isPro) {
      getToday()
        .then((saved) => setFortune(saved ? asFortune(saved) : null))
        .catch((error) =>
          toast.error(getLumiErrorMessage(error, "Não consegui consultar seu biscoito de hoje.")),
        )
        .finally(() => setReady(true));
      return;
    }

    const saved = readSavedFortune();
    setFortune(
      saved?.date === fortuneDateInSaoPaulo()
        ? (fortunes.find((item) => item.id === saved.fortuneId) ?? null)
        : null,
    );
    setReady(true);
  }, [getToday, isPro, profileLoading, sessionLoading, user]);

  const openCookie = async () => {
    if (opening || fortune) return;
    setOpening(true);
    try {
      let selected: Fortune;
      if (user && isPro) {
        const saved = await openForPro();
        selected = asFortune(saved);
        await queryClient.invalidateQueries({ queryKey: ["fortune-cookie-history", user.id] });
      } else {
        selected = chooseFortune();
        const history = readHistory();
        window.localStorage.setItem(
          TODAY_STORAGE_KEY,
          JSON.stringify({
            date: fortuneDateInSaoPaulo(),
            fortuneId: selected.id,
          } satisfies SavedFortune),
        );
        window.localStorage.setItem(
          HISTORY_STORAGE_KEY,
          JSON.stringify([...history.filter((id) => id !== selected.id), selected.id].slice(-500)),
        );
      }

      await new Promise((resolve) => window.setTimeout(resolve, 700));
      setFortune(selected);
    } catch (error) {
      toast.error(getLumiErrorMessage(error, "Não consegui abrir seu biscoito agora."));
    } finally {
      setOpening(false);
    }
  };

  return (
    <PageShell>
      <section className="soft-gradient min-h-[72vh] px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <Hand>uma surpresa por dia</Hand>
          <h1 className="mt-3 text-3xl font-bold sm:text-5xl">Seu biscoito da sorte</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Abra uma vez por dia e descubra a mensagem que o acaso guardou para você.
          </p>

          <Tabs defaultValue="today" className="mt-9">
            <TabsList className="grid h-11 w-full grid-cols-2 rounded-full bg-secondary p-1 sm:mx-auto sm:w-96">
              <TabsTrigger value="today" className="rounded-full">
                Biscoito de hoje
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-full">
                Meu histórico
              </TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="mt-5">
              <div className="rounded-[2rem] border border-primary/15 bg-card p-7 shadow-soft sm:p-10">
            {!ready ? (
              <div className="flex min-h-72 items-center justify-center" aria-label="Carregando">
                <span className="h-3 w-3 animate-float rounded-full bg-primary" />
              </div>
            ) : fortune ? (
              <div className="flex min-h-72 animate-fade-up flex-col items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-3xl">
                  🥠
                </div>
                <div className="mt-6 w-full rounded-2xl border border-primary/15 bg-secondary/50 px-5 py-7">
                  <Sparkles aria-hidden="true" className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-4 text-lg font-medium leading-relaxed sm:text-xl">
                    “{fortune.message}”
                  </p>
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-primary">
                  {fortune.category}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Este é o seu biscoito de hoje. Um novo estará esperando por você amanhã.
                </p>
              </div>
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={openCookie}
                  disabled={opening}
                  aria-label="Abrir meu biscoito da sorte"
                  className={`text-8xl drop-shadow-sm transition-transform duration-500 hover:scale-105 active:scale-95 ${
                    opening ? "animate-bounce" : "animate-float"
                  }`}
                >
                  🥠
                </button>
                <Button size="lg" className="mt-8" onClick={openCookie} disabled={opening}>
                  <Sparkles aria-hidden="true" />
                  {opening ? "Abrindo..." : "Abrir meu biscoito"}
                </Button>
                <p className="mt-4 text-xs text-muted-foreground">É gratuito e não precisa entrar.</p>
              </div>
            )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-5 text-left">
              {!user ? (
                <div className="rounded-[2rem] border border-primary/15 bg-card p-8 text-center shadow-soft">
                  <LockKeyhole aria-hidden="true" className="mx-auto text-primary" />
                  <h2 className="mt-4 text-xl font-bold">Guarde suas mensagens da sorte</h2>
                  <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    Entre na Lumi para acessar o histórico de biscoitos no plano Pro.
                  </p>
                  <Button asChild className="mt-6">
                    <Link to="/auth" search={{ mode: "login" }}>
                      Entrar na Lumi
                    </Link>
                  </Button>
                </div>
              ) : !isPro ? (
                <div className="rounded-[2rem] border border-primary/15 bg-card p-8 text-center shadow-soft">
                  <LockKeyhole aria-hidden="true" className="mx-auto text-primary" />
                  <h2 className="mt-4 text-xl font-bold">Seu histórico no Lumi Pro</h2>
                  <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    No plano Pro, cada biscoito fica guardado com a data e o horário em que você o
                    abriu.
                  </p>
                  <Button asChild className="mt-6">
                    <Link to="/planos">Conhecer o Lumi Pro</Link>
                  </Button>
                </div>
              ) : historyQuery.isLoading ? (
                <div className="flex min-h-52 items-center justify-center rounded-[2rem] border border-primary/15 bg-card shadow-soft">
                  <span className="h-3 w-3 animate-float rounded-full bg-primary" />
                </div>
              ) : historyQuery.data?.length ? (
                <div className="space-y-4">
                  {historyQuery.data.map((item) => {
                    const openedAt = new Date(item.opened_at);
                    return (
                      <article
                        key={item.id}
                        className="rounded-3xl border border-primary/15 bg-card p-6 shadow-soft"
                      >
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays aria-hidden="true" className="h-4 w-4 text-primary" />
                            {openedAt.toLocaleDateString("pt-BR", {
                              timeZone: "America/Sao_Paulo",
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock3 aria-hidden="true" className="h-4 w-4 text-primary" />
                            {openedAt.toLocaleTimeString("pt-BR", {
                              timeZone: "America/Sao_Paulo",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="mt-4 text-base font-medium leading-relaxed">“{item.message}”</p>
                        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">
                          {item.category}
                        </p>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-[2rem] border border-dashed border-border bg-card/60 p-9 text-center text-sm text-muted-foreground">
                  Abra seu primeiro biscoito para começar este histórico.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageShell>
  );
}
