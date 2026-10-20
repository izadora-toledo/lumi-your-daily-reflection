import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Hand, LumiMark } from "@/components/lumi/chrome";
import { PrefsForm } from "@/components/lumi/PrefsForm";
import { savePrefs } from "@/lib/save-prefs";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Seu gosto musical — Lumi" },
      { name: "description", content: "Conte para a Lumi o que você gosta de ouvir." },
      { property: "og:title", content: "Seu gosto musical — Lumi" },
      { property: "og:description", content: "Personalize suas recomendações musicais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  return (
    <div className="soft-gradient min-h-screen px-5 py-10">
      <div className="mx-auto max-w-xl">
        <LumiMark />
        <div className="mt-10">
          <Hand>quase lá</Hand>
          <h1 className="mt-1 text-3xl font-bold">O que toca no seu coração?</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Assim a Lumi escolhe músicas que combinam com você.
          </p>
        </div>
        <div className="mt-8 rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
          <PrefsForm
            cta="Continuar"
            saving={saving}
            onSave={async (p) => {
              setSaving(true);
              try {
                await savePrefs(user.id, p);
                await queryClient.invalidateQueries();
                navigate({ to: "/dashboard" });
              } catch {
                toast.error("Não consegui salvar agora.");
              } finally {
                setSaving(false);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
