import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthGate } from "@/components/lumi/AuthGate";
import { Hand, LumiMark } from "@/components/lumi/chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { GENRES, SAD_PREFERENCES, useSession } from "@/lib/session";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Seu gosto musical — Lumi" },
      {
        name: "description",
        content: "Conte à Lumi quais músicas combinam com você.",
      },
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  return (
    <AuthGate>
      <OnboardingForm />
    </AuthGate>
  );
}

function OnboardingForm() {
  const navigate = useNavigate();
  const { user } = useSession();
  const [genres, setGenres] = useState<string[]>([]);
  const [artists, setArtists] = useState("");
  const [sadPreference, setSadPreference] = useState("depende");
  const [discoveryLevel, setDiscoveryLevel] = useState(3);
  const [saving, setSaving] = useState(false);

  const toggleGenre = (genre: string) => {
    setGenres((current) =>
      current.includes(genre) ? current.filter((item) => item !== genre) : [...current, genre],
    );
  };

  const save = async () => {
    if (!user) return;
    if (!genres.length) {
      toast.error("Escolha pelo menos um estilo musical.");
      return;
    }

    setSaving(true);
    const { error: preferencesError } = await supabase.from("user_music_preferences").upsert({
      user_id: user.id,
      genres,
      favorite_artists: artists.trim(),
      sad_music_preference: sadPreference,
      discovery_level: discoveryLevel,
      updated_at: new Date().toISOString(),
    });
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ onboarded: true })
      .eq("id", user.id);
    setSaving(false);

    if (preferencesError || profileError) {
      toast.error("Não consegui salvar suas preferências. Tente novamente.");
      return;
    }
    toast.success("Seu perfil musical está pronto.");
    navigate({ to: "/dashboard" });
  };

  return (
    <main className="soft-gradient min-h-screen px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <div className="flex justify-center">
          <LumiMark />
        </div>
        <div className="mt-8 rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:p-9">
          <div className="text-center">
            <Hand>rapidinho, prometo</Hand>
            <h1 className="mt-2 text-3xl font-bold">Agora quero conhecer o seu ouvido</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Isso ajuda a Lumi a escolher músicas que realmente tenham a sua cara.
            </p>
          </div>

          <section className="mt-9">
            <h2 className="font-semibold">1. Quais estilos você gosta?</h2>
            <p className="mt-1 text-xs text-muted-foreground">Você pode escolher vários.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  aria-pressed={genres.includes(genre)}
                  onClick={() => toggleGenre(genre)}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                    genres.includes(genre)
                      ? "border-primary bg-secondary font-medium text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-9">
            <Label htmlFor="artists" className="font-semibold">
              2. Cite alguns artistas que você ama
            </Label>
            <Input
              id="artists"
              value={artists}
              onChange={(event) => setArtists(event.target.value)}
              placeholder="Ex: Coldplay, Billie Eilish, Taylor Swift..."
              className="mt-3 h-12 rounded-2xl"
            />
          </section>

          <section className="mt-9">
            <h2 className="font-semibold">3. Quando você está triste, você prefere:</h2>
            <RadioGroup value={sadPreference} onValueChange={setSadPreference} className="mt-4">
              {SAD_PREFERENCES.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-background p-4 font-normal hover:border-primary/40"
                >
                  <RadioGroupItem id={option.value} value={option.value} />
                  {option.label}
                </Label>
              ))}
            </RadioGroup>
          </section>

          <section className="mt-9">
            <h2 className="font-semibold">4. Você gosta de descobrir músicas novas?</h2>
            <Slider
              value={[discoveryLevel]}
              onValueChange={([value]) => setDiscoveryLevel(value ?? 3)}
              min={1}
              max={5}
              step={1}
              className="mt-6"
              aria-label="Interesse em descobrir músicas novas"
            />
            <div className="mt-3 flex justify-between gap-4 text-xs text-muted-foreground">
              <span>Prefiro o que já conheço</span>
              <span className="text-right">Adoro descobrir</span>
            </div>
          </section>

          <Button type="button" size="lg" className="mt-10 w-full" onClick={save} disabled={saving}>
            {saving ? "Salvando..." : "Concluir meu perfil"}
          </Button>
        </div>
      </div>
    </main>
  );
}
