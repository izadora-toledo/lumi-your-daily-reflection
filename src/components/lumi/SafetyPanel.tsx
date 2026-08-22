import { Phone, ShieldCheck } from "lucide-react";

export function SafetyPanel() {
  return (
    <div className="mt-5 rounded-2xl border border-primary/20 bg-secondary/70 p-4">
      <div className="flex items-start gap-3">
        <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-semibold">Você não precisa passar por isso sem ajuda.</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Fale agora com alguém de confiança. No Brasil, o CVV oferece apoio emocional gratuito 24
            horas pelo número 188. Em risco imediato, procure um pronto-socorro ou ligue 192.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="tel:188"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              <Phone aria-hidden="true" className="h-3.5 w-3.5" /> Ligar para o CVV — 188
            </a>
            <a
              href="tel:192"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold"
            >
              Emergência — 192
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
