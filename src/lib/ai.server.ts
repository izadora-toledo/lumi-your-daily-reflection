const RESPONSES_URL = "https://api.openai.com/v1/responses";
const MODERATIONS_URL = "https://api.openai.com/v1/moderations";
const MESSAGE_MODEL = "gpt-5-nano";
const MUSIC_MODEL = "gpt-5.6-luna";
const MODERATION_MODEL = "omni-moderation-latest";

const RISK_PATTERNS = [
  /me matar/i,
  /suic[ií]d/i,
  /tirar minha vida/i,
  /n[ãa]o quero mais viver/i,
  /quero morrer/i,
  /acabar com tudo/i,
  /me cortar/i,
  /me machucar/i,
  /automutila/i,
  /sumir do mundo/i,
  /desaparecer para sempre/i,
];

export function detectRisk(text: string): boolean {
  return RISK_PATTERNS.some((r) => r.test(text));
}

export const SAFETY_MESSAGE =
  "O que você contou parece pesado demais para carregar sozinha agora, e isso importa. Sua segurança vem primeiro: procure uma pessoa de confiança e apoio imediato neste momento.";

type JsonSchema = Record<string, unknown>;

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

function getApiKey(): string {
  const key = process.env["OPENAI_API_KEY"];
  if (!key) {
    throw new Error("A geração por IA ainda não foi configurada.");
  }
  return key;
}

function extractOutputText(response: OpenAIResponse): string {
  if (response.output_text?.trim()) return response.output_text.trim();

  return (response.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter((content) => content.type === "output_text" && content.text)
    .map((content) => content.text?.trim() ?? "")
    .filter(Boolean)
    .join("\n");
}

async function callOpenAI<T>({
  model,
  instructions,
  input,
  schemaName,
  schema,
}: {
  model: string;
  instructions: string;
  input: string;
  schemaName: string;
  schema: JsonSchema;
}): Promise<T> {
  const res = await fetch(RESPONSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model,
      instructions,
      input,
      store: false,
      max_output_tokens: 500,
      ...(model === MUSIC_MODEL ? { reasoning: { effort: "none" } } : {}),
      text: {
        format: {
          type: "json_schema",
          name: schemaName,
          strict: true,
          schema,
        },
      },
    }),
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("A Lumi está recebendo muitos pedidos agora. Tente de novo em instantes.");
    }
    if (res.status === 401 || res.status === 403) {
      throw new Error("A conexão da Lumi com a IA precisa ser configurada novamente.");
    }
    throw new Error(`Não consegui falar com a IA agora (${res.status}).`);
  }

  const raw = extractOutputText((await res.json()) as OpenAIResponse);
  if (!raw) throw new Error("A IA não retornou uma resposta válida.");
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error("A IA retornou uma resposta incompleta. Tente novamente.");
  }
}

async function hasModeratedRisk(text: string): Promise<boolean> {
  if (detectRisk(text)) return true;

  try {
    const res = await fetch(MODERATIONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getApiKey()}`,
      },
      body: JSON.stringify({ model: MODERATION_MODEL, input: text.slice(0, 500) }),
    });

    if (!res.ok) return false;

    const json = (await res.json()) as {
      results?: Array<{
        categories?: Record<string, boolean>;
      }>;
    };
    const categories = json.results?.[0]?.categories ?? {};
    return Boolean(
      categories["self-harm"] ||
      categories["self-harm/intent"] ||
      categories["self-harm/instructions"],
    );
  } catch {
    return false;
  }
}

const MESSAGE_SYSTEM_PROMPT = `Você é Lumi, uma companhia de bem-estar emocional. Leia como a pessoa está se sentindo e responda com uma mensagem curta, acolhedora e personalizada.

Não dê diagnóstico.
Não se apresente como psicóloga.
Não use linguagem clínica.
Não faça promessas.
Não utilize frases motivacionais clichês.
Não seja excessivamente positiva quando a pessoa estiver passando por algo ruim.
Reconheça o sentimento de maneira natural.

Responda em no máximo 2 ou 3 frases curtas, em português do Brasil.
Retorne apenas JSON no formato:
{"message": "...", "mood": "uma palavra que resume o sentimento, em minúsculas"}`;

export async function generateMotivationalMessage(moodText: string): Promise<{
  message: string;
  mood: string;
  risk: boolean;
}> {
  if (await hasModeratedRisk(moodText)) {
    return { message: SAFETY_MESSAGE, mood: "risco", risk: true };
  }

  const result = await callOpenAI<{ message: string; mood: string }>({
    model: MESSAGE_MODEL,
    instructions: MESSAGE_SYSTEM_PROMPT,
    input: moodText.slice(0, 500),
    schemaName: "lumi_message",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        message: { type: "string" },
        mood: { type: "string" },
      },
      required: ["message", "mood"],
    },
  });

  return {
    message:
      result.message.trim() ||
      "Ficou difícil encontrar as palavras agora. Tente de novo em instantes.",
    mood: result.mood.toString().slice(0, 40) || "indefinido",
    risk: false,
  };
}

export type MusicPrefs = {
  genres: string[];
  favoriteArtists: string;
  sadMusicPreference: string;
  discoveryLevel: number;
};

export async function generateMusicRecommendation(
  moodText: string,
  prefs: MusicPrefs,
): Promise<{ song: string; artist: string; explanation: string }> {
  const result = await callOpenAI<{ song: string; artist: string; explanation: string }>({
    model: MUSIC_MODEL,
    instructions: `Você é Lumi e escolhe uma música REAL e existente para o momento de uma pessoa.
Nunca invente músicas ou artistas.
Considere o sentimento atual, os estilos e artistas favoritos, a preferência da pessoa em momentos tristes e o quanto ela gosta de descobrir músicas novas.
A explicação deve ser pessoal, em português do Brasil, com no máximo 3 frases, conectando o que ela escreveu com a escolha.
Escolha apenas uma música sobre a qual você tenha alta confiança de que o título e o artista estão corretos.`,
    input: `Sentimento atual: ${moodText.slice(0, 500)}
Estilos favoritos: ${prefs.genres.join(", ") || "não informado"}
Artistas favoritos: ${prefs.favoriteArtists || "não informado"}
Quando está triste prefere: ${prefs.sadMusicPreference}
Interesse em descobrir músicas novas (1 a 5): ${prefs.discoveryLevel}`,
    schemaName: "lumi_music_recommendation",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        song: { type: "string" },
        artist: { type: "string" },
        explanation: { type: "string" },
      },
      required: ["song", "artist", "explanation"],
    },
  });

  if (!result.song.trim() || !result.artist.trim()) {
    throw new Error("Não consegui escolher uma música agora. Tente novamente.");
  }
  return {
    song: result.song.trim(),
    artist: result.artist.trim(),
    explanation: result.explanation.trim(),
  };
}

export function spotifySearchUrl(song: string, artist: string): string {
  return `https://open.spotify.com/search/${encodeURIComponent(`${song} ${artist}`)}`;
}
