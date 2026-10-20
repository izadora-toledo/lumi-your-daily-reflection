import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Hand } from "@/components/lumi/chrome";
import { AppShell } from "@/components/lumi/AppNav";
import { SongCard } from "@/components/lumi/SongCard";
import { formatDay, useProfile, useRecommendations } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/trilha")({
  head: () => ({
    meta: [
      { title: "Minha trilha — Lumi" },
      { name: "description", content: "Todas as músicas que a Lumi escolheu para você." },
      { property: "og:title", content: "Minha trilha — Lumi" },
      { property: "og:description", content: "Seu histórico musical na Lumi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Trilha,
});

function Trilha() {
  const { user } = Route.useRouteContext();
  const { data: profile } = useProfile(user.id);
  const { data: recs = [] } = useRecommendations(user.id);

  return (
    <AppShell>
      <div className="mx-auto max-w-xl px-5 py-12">
        <Hand>sua trilha</Hand>
        <h1 className="mt-1 text-3xl font-bold">Minha trilha</h1>
        {profile?.plan !== "pro" && recs.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-primary/40 bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">As músicas escolhidas para você ficam aqui no Lumi Pro.</p>
            <Button asChild size="sm" className="mt-3"><Link to="/planos">Conhecer o Pro</Link></Button>
          </div>
        ) : recs.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">Sua primeira música vai aparecer aqui.</p>
        ) : (
          <div className="mt-8 space-y-6">
            {recs.map((r) => (
              <div key={r.id}>
                <p className="mb-2 text-xs text-muted-foreground">
                  {formatDay(r.created_at)}{r.mood_label ? ` · ${r.mood_label}` : ""}
                </p>
                <SongCard rec={r} />
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
