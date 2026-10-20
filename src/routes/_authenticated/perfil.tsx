import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Hand } from "@/components/lumi/chrome";
import { AppShell } from "@/components/lumi/AppNav";
import { PrefsForm } from "@/components/lumi/PrefsForm";
import { usePreferences, useProfile } from "@/lib/data";
import { savePrefs } from "@/lib/save-prefs";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil — Lumi" },
      { name: "description", content: "Ajuste seu gosto musical e seu plano na Lumi." },
      { property: "og:title", content: "Perfil — Lumi" },
      { property: "og:description", content: "Suas preferências na Lumi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const { data: profile } = useProfile(user.id);
  const { data: prefs } = usePreferences(user.id);
  const [saving, setSaving] = useState(false);

  return (
    <AppShell>
      <div className="mx-auto max-w-xl px-5 py-12">
        <Hand>você</Hand>
        <h1 className="mt-1 text-3xl font-bold">{profile?.name || "Perfil"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{profile?.email}</p>
        <div className="mt-4 flex items-center gap-3">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
            Plano {profile?.plan === "pro" ? "Pro" : "Free"}
          </span>
          {profile?.plan !== "pro" && (
            <Button asChild size="sm" variant="outline"><Link to="/planos">Ver planos</Link></Button>
          )}
        </div>
        <div className="mt-10 rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
          <h2 className="mb-6 text-lg font-bold">Gosto musical</h2>
          <PrefsForm
            initial={prefs}
            cta="Salvar alterações"
            saving={saving}
            onSave={async (p) => {
              setSaving(true);
              try {
                await savePrefs(user.id, p);
                await queryClient.invalidateQueries({ queryKey: ["preferences"] });
                toast.success("Preferências salvas.");
              } catch {
                toast.error("Não consegui salvar agora.");
              } finally {
                setSaving(false);
              }
            }}
          />
        </div>
      </div>
    </AppShell>
  );
}
