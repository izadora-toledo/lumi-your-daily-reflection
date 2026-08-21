export type Fortune = {
  id: number;
  category: string;
  message: string;
};

export function fortuneDateInSaoPaulo(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

type FortuneCategory = {
  name: string;
  beginnings: string[];
  endings: string[];
};

const categories: FortuneCategory[] = [
  {
    name: "Oportunidades",
    beginnings: [
      "Uma porta discreta vai se abrir",
      "Uma oportunidade chegará por um caminho inesperado",
      "Um convite simples trará uma boa possibilidade",
      "Uma ideia antiga encontrará o momento certo",
      "Uma resposta positiva está mais perto do que parece",
      "Uma coincidência colocará uma escolha promissora diante de você",
      "Algo que parecia distante começará a se aproximar",
      "Uma conversa breve revelará uma nova possibilidade",
      "Uma chance valiosa surgirá em um detalhe comum",
      "Um caminho pouco óbvio mostrará seu valor",
    ],
    endings: [
      "e sua atenção fará toda a diferença.",
      "quando você menos estiver procurando por ela.",
      "e um primeiro passo transformará o cenário.",
      "trazendo uma mudança melhor do que a imaginada.",
      "e reconhecer o momento certo será a sua sorte.",
    ],
  },
  {
    name: "Encontros",
    beginnings: [
      "Um encontro inesperado deixará uma lembrança especial",
      "Alguém novo cruzará seu caminho com uma boa história",
      "Uma conversa ao acaso terá importância no futuro",
      "Um reencontro acontecerá em uma ocasião improvável",
      "Uma pessoa gentil trará uma notícia agradável",
      "Um nome conhecido reaparecerá com uma surpresa",
      "Uma apresentação despretensiosa criará uma conexão valiosa",
      "Um encontro breve abrirá espaço para algo duradouro",
      "Alguém reconhecerá em você uma qualidade rara",
      "Uma companhia inesperada tornará um dia comum memorável",
    ],
    endings: [
      "e o acaso parecerá ter planejado tudo.",
      "quando os caminhos se cruzarem novamente.",
      "e dela nascerá uma possibilidade feliz.",
      "trazendo uma conexão que merece ser cultivada.",
      "e um pequeno gesto marcará esse momento.",
    ],
  },
  {
    name: "Caminhos",
    beginnings: [
      "Uma mudança de rota levará a uma descoberta feliz",
      "O próximo desvio esconderá uma boa surpresa",
      "Um caminho antes ignorado se mostrará promissor",
      "Uma escolha simples mudará o ritmo dos próximos dias",
      "Uma nova direção ficará clara em breve",
      "Um passo fora do habitual revelará uma paisagem diferente",
      "Uma decisão guardada encontrará sua hora",
      "O caminho mais tranquilo levará mais longe desta vez",
      "Uma alternativa inesperada se tornará a melhor opção",
      "Um novo percurso começará com um sinal pequeno",
    ],
    endings: [
      "e cada passo confirmará a direção.",
      "quando uma escolha precisar ser feita.",
      "levando você a um lugar que ainda não imaginou.",
      "e o destino cuidará de aproximar as peças.",
      "trazendo uma resposta ao longo do percurso.",
    ],
  },
  {
    name: "Conquistas",
    beginnings: [
      "Um esforço silencioso será reconhecido",
      "Uma pequena vitória anunciará uma conquista maior",
      "Algo construído aos poucos começará a dar resultado",
      "Uma meta antiga ficará mais próxima de se realizar",
      "Um talento seu ganhará o espaço que merece",
      "Uma tentativa persistente encontrará uma resposta favorável",
      "Um trabalho bem-feito abrirá uma nova etapa",
      "Uma conquista chegará acompanhada de uma boa notícia",
      "Um resultado esperado virá de uma forma surpreendente",
      "Uma habilidade pouco mostrada será finalmente percebida",
    ],
    endings: [
      "e o resultado terá um significado especial.",
      "antes que esta fase chegue ao fim.",
      "abrindo espaço para um próximo objetivo.",
      "e haverá bons motivos para celebrar.",
      "quando a constância encontrar a ocasião certa.",
    ],
  },
  {
    name: "Surpresas",
    beginnings: [
      "Uma surpresa agradável quebrará a rotina",
      "Uma notícia inesperada mudará os planos para melhor",
      "Um presente simbólico chegará em boa hora",
      "Algo perdido reaparecerá de maneira curiosa",
      "Um detalhe fora do lugar revelará uma boa novidade",
      "Uma mensagem inesperada iluminará um dia comum",
      "Uma reviravolta pequena terá um efeito feliz",
      "Um acontecimento improvável renderá uma ótima história",
      "Uma descoberta casual trará uma alegria inesperada",
      "Um plano improvisado terminará melhor do que o previsto",
    ],
    endings: [
      "e você vai querer guardar esse momento.",
      "quando o dia parecer completamente comum.",
      "trazendo uma história boa para contar.",
      "e o inesperado mostrará seu lado mais bonito.",
      "antes que você consiga adivinhar de onde veio.",
    ],
  },
  {
    name: "Prosperidade",
    beginnings: [
      "Uma escolha prática produzirá bons frutos",
      "Uma oportunidade material surgirá de uma boa parceria",
      "Um recurso inesperado chegará no momento adequado",
      "Uma ideia simples poderá se tornar muito valiosa",
      "Uma negociação caminhará para um resultado favorável",
      "Um projeto ganhará força e encontrará apoio",
      "Uma decisão bem calculada ampliará suas possibilidades",
      "Uma colaboração trará benefícios para todos os envolvidos",
      "Um investimento de tempo começará a mostrar retorno",
      "Uma solução econômica aparecerá onde ninguém procurava",
    ],
    endings: [
      "e a abundância começará por um detalhe.",
      "quando preparação e oportunidade se encontrarem.",
      "abrindo espaço para uma fase mais próspera.",
      "e bons resultados virão em sequência.",
      "trazendo estabilidade para os próximos passos.",
    ],
  },
  {
    name: "Descobertas",
    beginnings: [
      "Uma curiosidade levará a uma descoberta importante",
      "Uma informação nova mudará sua visão sobre um assunto",
      "Um lugar desconhecido revelará algo especial",
      "Uma pergunta simples encontrará uma resposta surpreendente",
      "Um interesse recente abrirá um universo de possibilidades",
      "Uma história escondida chegará até você",
      "Um detalhe antes despercebido ganhará novo significado",
      "Uma experiência diferente revelará uma habilidade",
      "Um aprendizado casual será útil muito em breve",
      "Uma recomendação inesperada levará a algo memorável",
    ],
    endings: [
      "e essa descoberta acompanhará você por muito tempo.",
      "quando a curiosidade falar mais alto.",
      "abrindo uma sequência de novas perguntas.",
      "e o conhecimento chegará de uma forma divertida.",
      "trazendo uma resposta que você nem sabia procurar.",
    ],
  },
  {
    name: "Sincronicidades",
    beginnings: [
      "Dois acontecimentos distantes vão se conectar",
      "Um mesmo sinal aparecerá mais de uma vez",
      "Uma coincidência responderá a uma pergunta antiga",
      "Um horário, um nome ou um lugar ganhará significado",
      "Pequenos acasos formarão uma sequência curiosa",
      "Uma lembrança surgirá pouco antes de se tornar útil",
      "Uma pessoa mencionará exatamente o que você precisava saber",
      "Um objeto comum aparecerá no momento mais oportuno",
      "Uma resposta chegará por uma fonte improvável",
      "Um encontro de circunstâncias facilitará seus planos",
    ],
    endings: [
      "e a conexão ficará clara no momento certo.",
      "quando você prestar atenção aos detalhes.",
      "trazendo a sensação de que nada foi por acaso.",
      "e uma peça importante encontrará seu lugar.",
      "antes que a coincidência possa ser ignorada.",
    ],
  },
  {
    name: "Viagens",
    beginnings: [
      "Um novo lugar entrará nos seus planos",
      "Uma viagem curta renderá uma lembrança duradoura",
      "Um convite poderá levar você para longe da rotina",
      "Um destino inesperado despertará seu interesse",
      "Uma mudança de paisagem trará uma boa descoberta",
      "Um caminho diferente revelará um lugar encantador",
      "Uma oportunidade de viagem surgirá de repente",
      "Um passeio improvisado terá um encontro especial",
      "Um lugar visto apenas de longe ficará mais próximo",
      "Uma jornada começará antes mesmo de sair de casa",
    ],
    endings: [
      "e o trajeto será tão especial quanto a chegada.",
      "quando surgir uma oportunidade inesperada.",
      "trazendo histórias que merecerão ser lembradas.",
      "e uma nova paisagem ficará na memória.",
      "abrindo vontade de conhecer ainda mais caminhos.",
    ],
  },
  {
    name: "Novos ciclos",
    beginnings: [
      "Uma nova fase começará com um acontecimento simples",
      "Algo que termina abrirá espaço para uma novidade melhor",
      "Um hábito novo marcará o começo de uma boa etapa",
      "Uma página em branco ganhará sua primeira história",
      "Um começo discreto crescerá mais do que o esperado",
      "Uma renovação chegará acompanhada de boas oportunidades",
      "Um projeto recente encontrará condições para florescer",
      "Uma mudança pequena dará início a uma sequência positiva",
      "Uma escolha feita agora terá importância no próximo ciclo",
      "Um novo capítulo será anunciado por uma boa notícia",
    ],
    endings: [
      "e os próximos capítulos guardarão boas surpresas.",
      "quando o novo pedir passagem.",
      "trazendo possibilidades que ainda não têm nome.",
      "e o começo terá mais força do que parece.",
      "abrindo uma fase cheia de histórias para viver.",
    ],
  },
];

export const fortunes: Fortune[] = categories.flatMap((category) =>
  category.beginnings.flatMap((beginning) =>
    category.endings.map((ending) => ({
      id: 0,
      category: category.name,
      message: `${beginning}, ${ending}`,
    })),
  ),
).map((fortune, index) => ({ ...fortune, id: index + 1 }));

if (fortunes.length !== 500) {
  throw new Error(`O catálogo de biscoitos deve conter 500 mensagens, mas contém ${fortunes.length}.`);
}
