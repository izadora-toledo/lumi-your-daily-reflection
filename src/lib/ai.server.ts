const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.7-flash";

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

type ChatMessage = { role: "system" | "user"; content: string };

async function callGateway(messages: ChatMessage[]): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429)
      throw new Error("A Lumi está recebendo muitos pedidos agora. Tente de novo em instantes.");
    if (res.status === 402)
      throw new Error(
        "Os créditos de IA acabaram. Adicione créditos para continuar usando a Lumi.",
      );
    throw new Error(`Falha ao falar com a IA (${res.status}): ${body.slice(0, 200)}`);
  }

  const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return json.choices?.[0]?.message?.content?.trim() ?? "";
}

function parseJson<T>(raw: string): T | null {
  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as T;
  } catch {
    return null;
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
  if (detectRisk(moodText)) {
    return { message: SAFETY_MESSAGE, mood: "risco", risk: true };
  }

  const raw = await callGateway([
    { role: "system", content: MESSAGE_SYSTEM_PROMPT },
    { role: "user", content: moodText.slice(0, 500) },
  ]);

  const parsed = parseJson<{ message?: string; mood?: string }>(raw);
  return {
    message:
      parsed?.message?.trim() ||
      raw ||
      "Ficou difícil encontrar as palavras agora. Tente de novo em instantes.",
    mood: (parsed?.mood ?? "").toString().slice(0, 40) || "indefinido",
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
  const raw = await callGateway([
    {
      role: "system",
      content: `Você é Lumi e escolhe uma música REAL e existente para o momento de uma pessoa.
Nunca invente músicas ou artistas.
Considere o sentimento atual, os estilos e artistas favoritos, a preferência da pessoa em momentos tristes e o quanto ela gosta de descobrir músicas novas.
A explicação deve ser pessoal, em português do Brasil, com no máximo 3 frases, conectando o que ela escreveu com a escolha.
Retorne apenas JSON: {"song": "...", "artist": "...", "explanation": "..."}`,
    },
    {
      role: "user",
      content: `Sentimento atual: ${moodText.slice(0, 500)}
Estilos favoritos: ${prefs.genres.join(", ") || "não informado"}
Artistas favoritos: ${prefs.favoriteArtists || "não informado"}
Quando está triste prefere: ${prefs.sadMusicPreference}
Interesse em descobrir músicas novas (1 a 5): ${prefs.discoveryLevel}`,
    },
  ]);

  const parsed = parseJson<{ song?: string; artist?: string; explanation?: string }>(raw);
  if (!parsed?.song || !parsed?.artist) {
    throw new Error("Não consegui escolher uma música agora. Tente novamente.");
  }
  return {
    song: parsed.song,
    artist: parsed.artist,
    explanation: parsed.explanation?.trim() ?? "",
  };
}

export function spotifySearchUrl(song: string, artist: string): string {
  return `https://open.spotify.com/search/${encodeURIComponent(`${song} ${artist}`)}`;
}
