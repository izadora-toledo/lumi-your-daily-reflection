import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MOOD_CHIPS } from "@/lib/session";

export function MoodComposer({
  value,
  onChange,
  onSubmit,
  loading,
  cta = "Continuar",
  placeholder = "Ex: Estou cansada, um pouco triste e parece que hoje nada deu muito certo...",
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  cta?: string;
  placeholder?: string;
}) {
  const addChip = (chip: string) => {
    const next = value.trim() ? `${value.trim()} ${chip.toLowerCase()}.` : `${chip}.`;
    onChange(next.slice(0, 300));
  };

  return (
    <div className="animate-fade-up">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 300))}
        placeholder={placeholder}
        rows={6}
        className="min-h-40 resize-none rounded-3xl border-border bg-card p-5 text-base leading-relaxed shadow-soft placeholder:text-muted-foreground/70 focus-visible:ring-primary/30"
      />
      <div className="mt-2 text-right text-xs text-muted-foreground">{value.length}/300</div>

      <div className="mt-4 flex flex-wrap gap-2">
        {MOOD_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => addChip(chip)}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-secondary hover:text-foreground"
          >
            {chip}
          </button>
        ))}
      </div>

      <Button
        size="lg"
        className="mt-8 w-full sm:w-auto"
        disabled={!value.trim() || loading}
        onClick={onSubmit}
      >
        {loading ? "Um instante..." : cta}
      </Button>
    </div>
  );
}

const LOADING_TEXTS = ["Entendendo seu momento...", "Escolhendo algumas palavras para você..."];

export function LumiLoading({ step }: { step: number }) {
  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center animate-fade-up">
      <div className="flex items-end gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-3 w-3 rounded-full bg-primary/70 animate-float"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
      <p key={step} className="text-sm text-muted-foreground animate-fade-up">
        {LOADING_TEXTS[step % LOADING_TEXTS.length]}
      </p>
    </div>
  );
}
