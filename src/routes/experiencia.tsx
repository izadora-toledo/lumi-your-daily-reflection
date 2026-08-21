import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Hand, PageShell } from "@/components/lumi/chrome";
import { LumiLoading, MoodComposer } from "@/components/lumi/MoodComposer";
import { SafetyPanel } from "@/components/lumi/SafetyPanel";
import { generatePublicMessage } from "@/lib/lumi.functions";
import { getLumiErrorMessage } from "@/lib/errors";

export const Route = createFileRoute("/experiencia")({
  head: () => ({
    meta: [
      { title: "Sua mensagem — Lumi" },
      {
        name: "description",
        content: "Conte como você está se sentindo e receba palavras escolhidas para esse momento.",
      },
      { property: "og:title", content: "Sua mensagem — Lumi" },
      {
        property: "og:description",
        content: "Uma mensagem curta e acolhedora, feita para o seu momento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Experience,
});

function Experience() {
  const navigate = useNavigate();
  const generate = useServerFn(generatePublicMessage);
  const [mood, setMood] = useState("");
  const [stage, setStage] = useState<"mood" | "loading" | "result">("mood");
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<{ message: string; risk: boolean } | null>(null);

  useEffect(() => {
    if (stage !== "loading") return;
    const timer = setInterval(() => setLoadingStep((s) => s + 1), 2200);
    return () => clearInterval(timer);
  }, [stage]);

  const run = async () => {
    setStage("loading");
    try {
      const res = await generate({ data: { moodText: mood } });
      setResult({ message: res.message, risk: res.risk });
      setStage("result");
    } catch (error) {
      toast.error(getLumiErrorMessage(error, "Não consegui criar sua mensagem agora."));
      setStage("mood");
    }
  };

  return (
    <PageShell>
      <div className="soft-gradient min-h-[70vh] px-5 py-14">
        <div className="mx-auto w-full max-w-xl">
          {stage === "mood" && (
            <>
              <div className="text-center">
                <Hand>sem pressa</Hand>
                <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                  Como você está se sentindo agora?
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Não precisa encontrar a palavra perfeita. Escreva do seu jeito.
                </p>
              </div>
              <div className="mt-8">
                <MoodComposer value={mood} onChange={setMood} onSubmit={run} />
              </div>
            </>
          )}

          {stage === "loading" && <LumiLoading step={loadingStep} />}

          {stage === "result" && result && (
            <div className="animate-fade-up">
              <p className="text-center font-hand text-2xl text-primary">Para você, agora</p>
              <div className="mt-4 rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                <p className="text-lg leading-relaxed">{result.message}</p>
                {result.risk && <SafetyPanel />}
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button variant="outline" onClick={run}>
                  Quero outra mensagem
                </Button>
                <Button
                  variant="ink"
                  onClick={() => navigate({ to: "/auth", search: { mode: "signup" } })}
                >
                  ♡ Guardar
                </Button>
              </div>

              <section className="mt-14 text-center">
                <span className="text-2xl">🎵</span>
                <h2 className="mt-2 text-xl font-bold">Existe uma música para esse momento.</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  A Lumi pode escolher uma música considerando não apenas como você está se
                  sentindo, mas também aquilo que você gosta de ouvir.
                </p>

                <div className="relative mt-6 overflow-hidden rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
                  <div className="pointer-events-none select-none blur-[6px]">
                    <p className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                      Sua música para agora
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-accent" />
                      <div className="text-left">
                        <p className="text-base font-semibold">Uma canção escolhida para você</p>
                        <p className="text-sm text-muted-foreground">Artista que você ama</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-card/40">
                    <span className="rounded-full bg-background px-4 py-2 text-xs font-semibold shadow-soft">
                      🔒 Disponível no Lumi Pro
                    </span>
                  </div>
                </div>

                <Button asChild className="mt-6">
                  <Link to="/planos">Descobrir minha música</Link>
                </Button>
              </section>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
