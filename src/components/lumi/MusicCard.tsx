import { ExternalLink, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Recommendation = {
  id: string;
  song: string;
  artist: string;
  explanation: string;
  spotify_url: string;
  feedback: string | null;
};

function youtubeSearchUrl(song: string, artist: string) {
  const query = new URLSearchParams({ search_query: `${song} ${artist}` });
  return `https://www.youtube.com/results?${query.toString()}`;
}

export function MusicCard({
  recommendation,
  onFeedback,
  compact = false,
}: {
  recommendation: Recommendation;
  onFeedback?: (value: "love" | "neutral" | "dislike") => void;
  compact?: boolean;
}) {
  return (
    <article className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
          <Music2 aria-hidden="true" className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-semibold">{recommendation.song}</p>
          <p className="truncate text-sm text-muted-foreground">{recommendation.artist}</p>
          <div className="mt-2 flex flex-col items-start gap-1">
            <Button
              asChild
              variant="link"
              className="h-auto justify-start whitespace-normal px-0 py-1 text-left"
            >
              <a href={recommendation.spotify_url} target="_blank" rel="noreferrer">
                Ouvir no Spotify — {recommendation.song}
                <ExternalLink aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              variant="link"
              className="h-auto justify-start whitespace-normal px-0 py-1 text-left"
            >
              <a
                href={youtubeSearchUrl(recommendation.song, recommendation.artist)}
                target="_blank"
                rel="noreferrer"
              >
                Ouvir no YouTube — {recommendation.song}
                <ExternalLink aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {!compact && recommendation.explanation && (
        <div className="mt-5 border-t border-border/70 pt-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Por que escolhi essa para você
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {recommendation.explanation}
          </p>
        </div>
      )}

      {!compact && onFeedback && (
        <div className="mt-5">
          <p className="text-sm font-medium">Essa escolha combinou com você?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              ["love", "❤️ Muito"],
              ["neutral", "😐 Mais ou menos"],
              ["dislike", "👎 Não"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={recommendation.feedback === value}
                onClick={() => onFeedback(value as "love" | "neutral" | "dislike")}
                className={`cursor-pointer rounded-full border px-3 py-2 text-xs transition-colors ${
                  recommendation.feedback === value
                    ? "border-primary bg-secondary text-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
