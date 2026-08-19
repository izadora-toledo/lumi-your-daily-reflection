import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Hand, PageShell } from "@/components/lumi/chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumi — palavras e música para o seu momento" },
      {
        name: "description",
        content:
          "Conte como você está se sentindo. A Lumi encontra as palavras e a música certas para esse momento.",
      },
      { property: "og:title", content: "Lumi — palavras e música para o seu momento" },
      {
        property: "og:description",
        content:
          "Uma companhia delicada de bem-estar com mensagens e músicas escolhidas para você.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const pillars = [
  {
    hand: "acolhimento",
    title: "Escrito para o seu dia",
    text: "Nada de frases prontas. A Lumi lê o que você contou e responde àquele momento específico.",
  },
  {
    hand: "intimidade",
    title: "Só entre vocês",
    text: "Um espaço silencioso, sem feed, sem curtidas, sem ninguém olhando por cima do ombro.",
  },
  {
    hand: "trilha",
    title: "Uma música certa",
    text: "No Lumi Pro, uma música real escolhida pelo seu sentimento e pelo seu gosto musical.",
  },
];

function Index() {
  return (
    <PageShell>
      <section className="soft-gradient relative overflow-hidden px-5 pb-20 pt-16 sm:pt-24">
        <div className="mx-auto max-w-2xl text-center animate-fade-up">
          <Hand>um momento só seu</Hand>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] sm:text-6xl">
            Como você está
            <br />
            <span className="text-primary">se sentindo hoje?</span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            Conte para a Lumi como foi o seu dia. Você receberá algumas palavras escolhidas
            especialmente para esse momento.
          </p>
          <div className="mt-9">
            <Button asChild size="lg">
              <Link to="/experiencia">Quero minha mensagem</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Leva menos de um minuto.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-5 sm:grid-cols-3">
        {pillars.map((p) => (
          <article
            key={p.title}
            className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="font-hand text-xl text-primary">{p.hand}</span>
            <h2 className="mt-1 text-lg font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-20 max-w-3xl px-5 text-center">
        <Hand>e quando falta uma trilha</Hand>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
          Existe uma música para esse momento.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          A Lumi pode escolher uma música considerando não apenas como você está se sentindo, mas
          também aquilo que você gosta de ouvir.
        </p>
        <div className="mt-7">
          <Button asChild variant="outline">
            <Link to="/planos">Conhecer o Lumi Pro</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
