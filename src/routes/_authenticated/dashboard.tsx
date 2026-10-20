import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Hand } from "@/components/lumi/chrome";
import { AppShell } from "@/components/lumi/AppNav";
import { LumiLoading, MoodComposer } from "@/components/lumi/MoodComposer";
import { SongCard } from "@/components/lumi/SongCard";
import { generateForUser } from "@/lib/lumi.functions";
import { formatDay, useMessages, useProfile } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Meu espaço — Lumi" },
      { name: "description", content: "Seu espaço na Lumi: conte como você está e receba sua mensagem." },
      { property: "og:title", content: "Meu espaço — Lumi" },
      { property: "og:description", content: "Mensagens e músicas escolhidas para o seu momento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

type Result = Awaited<ReturnType<typeof generateForUser>>;

function Dashboard() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile } = useProfile(user.id);
  const { data: messages = [] } = useMessages(user.id);
  const generate = useServerFn(generateForUser);
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    if (profile && !profile.onboarded) navigate({ to: "/onboarding" });
  }, [profile, navigate]);

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setStep((s) => s + 1), 2200);
    return () => clearInterval(t);
  }, [loading]);

  const isPro = profile?.plan === "pro";
  const today = new Date().toDateString();
  const usedToday = messages.filter((m) => new Date(m.created_at).toDateString() === today).length;

  const run = async () => {
    setLoading(true);
    setResult(null);
    setFav(false);
    try {
      const res = await generate({ data: { moodText: mood } });
      setResult(res);
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Algo deu errado.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFav = async () => {
    if (!result?.messageId) return;
    const next = !fav;
    setFav(next);
    await supabase.from("generated_messages").update({ favorite: next }).eq("id", result.messageId);
    queryClient.invalidateQueries({ queryKey: ["messages"] });
  };

  const firstName = (profile?.name ?? "").split(" ")[0];

  return (
    <AppShell>
      <div className="soft-gradient px-5 py-12">
        <div className="mx-auto max-w-xl">
          <Hand>{firstName ? `oi, ${firstName}` : "oi"}</Hand>
          <h1 className="mt-1 text-3xl font-bold">Conte para mim como você está.</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isPro ? "Lumi Pro · mensagens ilimitadas e música personalizada" : `Plano Free · ${Math.min(usedToday, 3)}/3 mensagens hoje`}
          </p>

          <div className="mt-8">
            {loading ? (
              <LumiLoading step={step} />
            ) : (
              <MoodComposer value={mood} onChange={setMood} onSubmit={run} cta="Receber minha mensagem" />
            )}
          </div>

          {result && !loading && (
            <div className="mt-10 space-y-6 animate-fade-up">
              <div className="rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                <p className="text-lg leading-relaxed">{result.message}</p>
                <div className="mt-5 flex justify-end">
                  <Button variant="outline" size="sm" onClick={toggleFav}>
                    {fav ? "♥ Favorita" : "♡ Favoritar"}
                  </Button>
                </div>
              </div>
              {result.recommendation && <SongCard rec={result.recommendation} />}
              {!isPro && !result.risk && (
                <div className="rounded-3xl border border-dashed border-primary/40 bg-card p-6 text-center">
                  <p className="text-sm text-muted-foreground">Existe uma música para esse momento.</p>
                  <Button asChild size="sm" className="mt-3">
                    <Link to="/planos">Descobrir com o Lumi Pro</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <section className="mx-auto max-w-xl px-5 py-10">
        <h2 className="text-lg font-bold">Suas últimas mensagens</h2>
        {messages.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Elas vão aparecer aqui.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {messages.slice(0, 6).map((m) => (
              <li key={m.id} className="rounded-2xl border border-border/70 bg-card p-4">
                <p className="text-xs text-muted-foreground">
                  {formatDay(m.created_at)} {m.favorite && "· ♥"}
                </p>
                <p className="mt-1 text-sm leading-relaxed">{m.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
