const FRIENDLY_ERRORS: Array<[RegExp, string]> = [
  [/invalid login credentials/i, "E-mail ou senha incorretos."],
  [/email not confirmed/i, "Confirme seu e-mail antes de entrar."],
  [/user already registered|already been registered/i, "Este e-mail já possui uma conta."],
  [/password should be at least/i, "A senha precisa ter pelo menos 6 caracteres."],
  [/failed to fetch|fetch failed|network|networkerror/i, "Não consegui me conectar agora. Verifique sua internet e tente novamente."],
  [/api key|api não conectada|api.*not.*configured|missing.*api|unauthorized/i, "A Lumi está com uma conexão indisponível no momento. Tente novamente em instantes."],
  [/rate limit|too many requests/i, "Recebi muitas solicitações agora. Aguarde um instante e tente novamente."],
];

export function getLumiErrorMessage(error: unknown, fallback: string): string {
  const message = error instanceof Error ? error.message : "";
  const friendly = FRIENDLY_ERRORS.find(([pattern]) => pattern.test(message));

  return friendly?.[1] ?? fallback;
}
