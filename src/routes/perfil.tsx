import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getLumiErrorMessage } from "@/lib/errors";
import { AuthGate } from "@/components/lumi/AuthGate";
import { Hand, PageShell } from "@/components/lumi/chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { usePreferences, useProfile } from "@/lib/data";
import { GENRES, SAD_PREFERENCES, useSession } from "@/lib/session";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil — Lumi" },
      { name: "description", content: "Atualize seu perfil e suas preferências musicais." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <AuthGate>
      <ProfileForm />
    </AuthGate>
  );
}

function ProfileForm() {
  const navigate = useNavigate();
  const { user } = useSession();
  const { data: profile, refetch: refetchProfile } = useProfile(user?.id);
  const { data: preferences, refetch: refetchPreferences } = usePreferences(user?.id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [artists, setArtists] = useState("");
  const [sadPreference, setSadPreference] = useState("depende");
  const [discoveryLevel, setDiscoveryLevel] = useState(3);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [profile]);

  useEffect(() => {
    if (preferences) {
      setGenres(preferences.genres);
      setArtists(preferences.favorite_artists);
      setSadPreference(preferences.sad_music_preference);
      setDiscoveryLevel(preferences.discovery_level);
    }
  }, [preferences]);

  const toggleGenre = (genre: string) => {
    setGenres((current) =>
      current.includes(genre) ? current.filter((item) => item !== genre) : [...current, genre],
    );
  };

  const save = async () => {
    if (!user) return;
    if (!name.trim() || !email.trim()) {
      toast.error("Preencha seu nome e e-mail.");
      return;
    }
    if (!genres.length) {
      toast.error("Escolha pelo menos um estilo musical.");
      return;
    }

    setSaving(true);
    const emailChanged = email.trim().toLowerCase() !== user.email?.toLowerCase();
    if (emailChanged) {
      const { error } = await supabase.auth.updateUser({ email: email.trim() });
      if (error) {
        setSaving(false);
        toast.error(getLumiErrorMessage(error, "Não consegui atualizar seu e-mail."));
        return;
      }
    }

    const [{ error: profileError }, { error: preferencesError }] = await Promise.all([
      supabase
        .from("profiles")
        .update({ name: name.trim(), email: email.trim() })
        .eq("id", user.id),
      supabase.from("user_music_preferences").upsert({
        user_id: user.id,
        genres,
        favorite_artists: artists.trim(),
        sad_music_preference: sadPreference,
        discovery_level: discoveryLevel,
        updated_at: new Date().toISOString(),
      }),
    ]);
    setSaving(false);

    if (profileError || preferencesError) {
      toast.error("Não consegui salvar todas as alterações.");
      return;
    }
    await Promise.all([refetchProfile(), refetchPreferences()]);
    toast.success(
      emailChanged
        ? "Perfil salvo. Confirme o novo e-mail pela mensagem que enviamos."
        : "Perfil atualizado.",
    );
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <PageShell>
      <main className="soft-gradient px-5 py-12">
        <div className="mx-auto max-w-2xl">
          <Hand>tudo sobre você</Hand>
          <div className="mt-2 flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold sm:text-4xl">Meu perfil</h1>
            <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-primary">
              Lumi {profile?.plan === "pro" ? "Pro" : "Free"}
            </span>
          </div>

          <div className="mt-7 space-y-5 rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:p-8">
            <section>
              <h2 className="text-lg font-bold">Seus dados</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-11 rounded-2xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-11 rounded-2xl"
                  />
                </div>
              </div>
            </section>

            <div className="border-t border-border" />

            <section>
              <h2 className="text-lg font-bold">Seu gosto musical</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Quanto melhor a Lumi conhecer você, mais certeiras ficam as escolhas.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    aria-pressed={genres.includes(genre)}
                    onClick={() => toggleGenre(genre)}
                    className={`cursor-pointer rounded-full border px-3 py-2 text-sm transition-colors ${
                      genres.includes(genre)
                        ? "border-primary bg-secondary text-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              <div className="mt-6 space-y-1.5">
                <Label htmlFor="artists">Artistas favoritos</Label>
                <Input
                  id="artists"
                  value={artists}
                  onChange={(event) => setArtists(event.target.value)}
                  placeholder="Ex: Coldplay, Anavitória, Taylor Swift..."
                  className="h-11 rounded-2xl"
                />
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium">Quando estou triste, prefiro:</p>
                <RadioGroup value={sadPreference} onValueChange={setSadPreference} className="mt-3">
                  {SAD_PREFERENCES.map((option) => (
                    <Label
                      key={option.value}
                      htmlFor={`profile-${option.value}`}
                      className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-background p-3 font-normal"
                    >
                      <RadioGroupItem id={`profile-${option.value}`} value={option.value} />
                      {option.label}
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium">Interesse em descobrir músicas novas</p>
                <Slider
                  value={[discoveryLevel]}
                  onValueChange={([value]) => setDiscoveryLevel(value ?? 3)}
                  min={1}
                  max={5}
                  step={1}
                  className="mt-5"
                  aria-label="Interesse em descobrir músicas novas"
                />
                <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                  <span>Quero o que já conheço</span>
                  <span>Quero novidades</span>
                </div>
              </div>
            </section>

            <Button type="button" size="lg" className="w-full" onClick={save} disabled={saving}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>

          <div className="mt-5 text-center">
            <Button type="button" variant="ghost" onClick={logout}>
              Sair da minha conta
            </Button>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
