import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Rec = {
  id: string;
  song: string;
  artist: string;
  explanation: string;
  spotify_url: string | null;
  feedback: string | null;
};

export function SongCard({ rec }: { rec: Rec }) {
  const [feedback, setFeedback] = useState(rec.feedback);

  const send = async (value: string) => {
    setFeedback(value);
    await supabase.from("music_recommendations").update({ feedback: value }).eq("id", rec.id);
  };

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Sua música para agora</p>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent text-2xl">🎵</div>
        <div>
          <p className="text-base font-semibold">{rec.song}</p>
          <p className="text-sm text-muted-foreground">{rec.artist}</p>
        </div>
      </div>
      {rec.explanation && <p className="mt-4 text-sm leading-relaxed">{rec.explanation}</p>}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {rec.spotify_url && (
          <Button asChild size="sm" variant="ink">
            <a href={rec.spotify_url} target="_blank" rel="noreferrer">Ouvir no Spotify</a>
          </Button>
        )}
        {(
          [
            ["gostei", "Gostei"],
            ["nao_combinou", "Não combinou"],
          ] as const
        ).map(([v, l]) => (
          <Button key={v} size="sm" variant={feedback === v ? "default" : "outline"} onClick={() => send(v)}>
            {l}
          </Button>
        ))}
      </div>
    </div>
  );
}
