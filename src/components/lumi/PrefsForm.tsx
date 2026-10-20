import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { GENRES, SAD_PREFERENCES } from "@/lib/session";

export type Prefs = {
  genres: string[];
  favorite_artists: string;
  sad_music_preference: string;
  discovery_level: number;
};

export function PrefsForm({
  initial,
  onSave,
  saving,
  cta,
}: {
  initial?: Partial<Prefs> | null;
  onSave: (p: Prefs) => void;
  saving?: boolean;
  cta: string;
}) {
  const [p, setP] = useState<Prefs>({
    genres: [],
    favorite_artists: "",
    sad_music_preference: "depende",
    discovery_level: 3,
  });

  useEffect(() => {
    if (initial) setP((cur) => ({ ...cur, ...initial, favorite_artists: initial.favorite_artists ?? "" }));
  }, [initial]);

  const toggle = (g: string) =>
    setP((c) => ({ ...c, genres: c.genres.includes(g) ? c.genres.filter((x) => x !== g) : [...c.genres, g] }));

  return (
    <div className="space-y-8">
      <div>
        <Label>Estilos que você gosta</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {GENRES.map((g) => {
            const on = p.genres.includes(g);
            return (
              <button
                key={g}
                type="button"
                onClick={() => toggle(g)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="artists">Artistas favoritos</Label>
        <Input
          id="artists"
          value={p.favorite_artists}
          maxLength={300}
          onChange={(e) => setP({ ...p, favorite_artists: e.target.value })}
          placeholder="Ex: Marisa Monte, Taylor Swift, Djavan"
          className="h-11 rounded-2xl"
        />
      </div>

      <div>
        <Label>Quando você está triste, prefere...</Label>
        <div className="mt-3 space-y-2">
          {SAD_PREFERENCES.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setP({ ...p, sad_music_preference: o.value })}
              className={`block w-full rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                p.sad_music_preference === o.value ? "border-primary bg-secondary" : "border-border bg-card"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Quanto você gosta de descobrir músicas novas?</Label>
        <Slider
          className="mt-4"
          min={1}
          max={5}
          step={1}
          value={[p.discovery_level]}
          onValueChange={([v]) => setP({ ...p, discovery_level: v ?? 3 })}
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>Prefiro o que conheço</span>
          <span>Amo novidades</span>
        </div>
      </div>

      <Button size="lg" className="w-full" disabled={saving || p.genres.length === 0} onClick={() => onSave(p)}>
        {saving ? "Salvando..." : cta}
      </Button>
    </div>
  );
}
