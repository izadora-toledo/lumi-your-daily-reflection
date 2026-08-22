import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BookHeart, Heart, LockKeyhole, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AuthGate } from "@/components/lumi/AuthGate";
import { MusicCard } from "@/components/lumi/MusicCard";
import { SafetyPanel } from "@/components/lumi/SafetyPanel";
import { LumiLoading, MoodComposer } from "@/components/lumi/MoodComposer";
import { Hand, PageShell } from "@/components/lumi/chrome";
import { Button } from "@/components/ui/button";
import { useMessages, useProfile, useRecommendations } from "@/lib/data";
import { getLumiErrorMessage } from "@/lib/errors";
import { generateForUser, setMessageFavorite, setMusicFeedback } from "@/lib/lumi.functions";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Meu espaço — Lumi" },
      { name: "description", content: "Seu espaço de mensagens e descobertas musicais." },
    ],
  }),
  component: DashboardPage,
});

type GenerationResult = Awaited<ReturnType<ReturnType<typeof useServerFn<typeof generateForUser>>>>;

function DashboardPage() {
  return (
    <AuthGate>
      <Dashboard />
    </AuthGate>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSession();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const { data: messages = [] } = useMessages(user?.id);
  const { data: recommendations = [] } = useRecommendations(user?.id);
  const generate = useServerFn(generateForUser);
  const favorite = useServerFn(setMessageFavorite);
  const feedback = useServerFn(setMusicFeedback);
  const [mood, setMood] = useState("");
  const [generating, setGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<GenerationResult | null>(null);

  useEffect(() => {
    if (!profileLoading && profile && !profile.onboarded) {
      navigate({ to: "/onboarding", replace: true });
    }
  }, [navigate, profile, profileLoading]);

  useEffect(() => {
    if (!generating) return;
    const timer = setInterval(() => setLoadingStep((step) => step + 1), 2200);
    return () => clearInterval(timer);
  }, [generating]);

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return messages.filter((message) => new Date(message.created_at).toDateString() === today)
      .length;
  }, [messages]);

  const favorites = messages.filter((message) => message.favorite);
  const isPro = profile?.plan === "pro";

  const run = async () => {
    if (!mood.trim()) return;
    setGenerating(true);
    setLoadingStep(0);
    try {
      const generated = await generate({ data: { moodText: mood } });
      setResult(generated);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["messages", user?.id] }),
        queryClient.invalidateQueries({ queryKey: ["recommendations", user?.id] }),
      ]);
    } catch (error) {
      toast.error(getLumiErrorMessage(error, "Não consegui gerar sua mensagem."));
    } finally {
      setGenerating(false);
    }
  };

  const toggleFavorite = async (messageId: string, next: boolean) => {
    try {
      await favorite({ data: { messageId, favorite: next } });
      if (result?.messageId === messageId) {
        setResult((current) => (current ? { ...current } : current));
      }
      await queryClient.invalidateQueries({ queryKey: ["messages", user?.id] });
      toast.success(next ? "Mensagem guardada." : "Mensagem removida dos favoritos.");
    } catch (error) {
      toast.error(getLumiErrorMessage(error, "Não consegui guardar a mensagem."));
    }
  };

  const sendFeedback = async (recommendationId: string, value: string) => {
    try {
      await feedback({ data: { recommendationId, feedback: value } });
      await queryClient.invalidateQueries({ queryKey: ["recommendations", user?.id] });
      setResult((current) =>
        current?.recommendation?.id === recommendationId
          ? {
              ...current,
              recommendation: { ...current.recommendation, feedback: value },
            }
          : current,
      );
      toast.success("Obrigada! Vou aprender com essa escolha.");
    } catch (error) {
      toast.error(getLumiErrorMessage(error, "Não consegui registrar sua opinião."));
    }
  };

  return (
    <PageShell>
      <div className="soft-gradient px-5 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Hand>seu momento</Hand>
              <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
                Oi, {profile?.name?.split(" ")[0] || "você"}. Como você está hoje?
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isPro && (
                <Button asChild variant="outline" size="sm">
                  <Link to="/historico">
                    <BookHeart aria-hidden="true" /> Meu histórico
                  </Link>
                </Button>
              )}
              <span className="w-fit rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                {isPro ? "Lumi Pro" : `${todayCount}/3 mensagens hoje`}
              </span>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-border/70 bg-card p-5 shadow-soft sm:p-7">
            {generating ? (
              <LumiLoading step={loadingStep} />
            ) : (
              <MoodComposer
                value={mood}
                onChange={setMood}
                onSubmit={run}
                cta="Receber minha mensagem"
                placeholder="Conte para mim..."
              />
            )}
          </div>

          {result && !generating && (
            <section className="mt-10 animate-fade-up" aria-live="polite">
              <Hand>Para você, agora</Hand>
              <div className="mt-3 rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:p-7">
                <p className="text-lg leading-relaxed">{result.message}</p>
                {result.risk && <SafetyPanel />}
                {result.messageId && (
                  <Button
                    variant="outline"
                    className="mt-5"
                    onClick={() => toggleFavorite(result.messageId!, true)}
                  >
                    <Heart aria-hidden="true" /> Guardar
                  </Button>
                )}
              </div>

              {result.recommendation && (
                <div className="mt-8">
                  <p className="mb-3 text-sm font-medium text-muted-foreground">
                    E para acompanhar esse momento...
                  </p>
                  <MusicCard
                    recommendation={result.recommendation}
                    onFeedback={(value) => sendFeedback(result.recommendation!.id, value)}
                  />
                </div>
              )}

              {!result.isPro && !result.risk && (
                <div className="mt-8 rounded-3xl border border-primary/15 bg-secondary/70 p-6 text-center">
                  <LockKeyhole aria-hidden="true" className="mx-auto text-primary" />
                  <h2 className="mt-3 text-lg font-bold">Existe uma música para esse momento.</h2>
                  <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    No Lumi Pro, cada mensagem vem acompanhada de uma música escolhida pelo seu
                    sentimento e pelo seu gosto.
                  </p>
                  <Button asChild className="mt-5">
                    <Link to="/planos">Conhecer o Lumi Pro</Link>
                  </Button>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-5xl gap-10 px-5 py-14 lg:grid-cols-[1.2fr_0.8fr]">
        <section>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-hand text-xl text-primary">para reler</p>
              <h2 className="text-2xl font-bold">Mensagens que você guardou</h2>
            </div>
            {!isPro && <span className="text-xs text-muted-foreground">{favorites.length}/5</span>}
          </div>

          <div className="mt-5 space-y-3">
            {favorites.length ? (
              favorites.slice(0, 5).map((message) => (
                <article
                  key={message.id}
                  className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft"
                >
                  <p className="text-sm leading-relaxed">{message.message}</p>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(message.id, false)}
                    className="mt-3 cursor-pointer text-xs font-semibold text-primary hover:underline"
                  >
                    Remover dos favoritos
                  </button>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-border p-7 text-center text-sm text-muted-foreground">
                Quando uma mensagem tocar você, guarde para reler depois.
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-hand text-xl text-primary">sua trilha</p>
              <h2 className="text-2xl font-bold">Músicas recentes</h2>
            </div>
            {isPro && recommendations.length > 0 && (
              <Button asChild variant="link" className="px-0">
                <Link to="/trilha">Ver todas</Link>
              </Button>
            )}
          </div>

          <div className="mt-5 space-y-3">
            {isPro ? (
              recommendations.length ? (
                recommendations
                  .slice(0, 3)
                  .map((recommendation) => (
                    <MusicCard key={recommendation.id} recommendation={recommendation} compact />
                  ))
              ) : (
                <div className="rounded-3xl border border-dashed border-border p-7 text-center text-sm text-muted-foreground">
                  Sua próxima descoberta musical vai aparecer aqui.
                </div>
              )
            ) : (
              <div className="rounded-3xl border border-border/70 bg-card p-7 text-center shadow-soft">
                <Sparkles aria-hidden="true" className="mx-auto text-primary" />
                <p className="mt-3 text-sm font-semibold">Disponível no Lumi Pro</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Receba e guarde músicas escolhidas especialmente para você.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
