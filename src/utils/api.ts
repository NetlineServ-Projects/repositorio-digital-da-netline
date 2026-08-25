export const API_URL = "http://localhost:3000";
export const API_BASE = `${API_URL}/api/v1`;

const CHAVE_IDIOMA_CACHE = "idioma_preferido";

export function obterToken(): string | null {
  return localStorage.getItem("token_sistema") || localStorage.getItem("token");
}

function obterIdiomaCache(): string {
  return localStorage.getItem(CHAVE_IDIOMA_CACHE) || "pt";
}

// Guarda localmente o idioma vindo da API, para usar como Accept-Language nas próximas chamadas
function cachearIdiomaSeExistir(data: unknown) {
  if (!data || typeof data !== "object") return;

  // Cobre tanto { idioma: "en" } (ex: /auth/me) quanto { user: { idioma: "en" } } (ex: /auth/login)
  const possivelUsuario = data as Record<string, any>;
  const idioma = possivelUsuario.idioma ?? possivelUsuario.user?.idioma;

  if (typeof idioma === "string" && idioma) {
    localStorage.setItem(CHAVE_IDIOMA_CACHE, idioma);
  }
}

export async function fetchComToken(endpoint: string, options: RequestInit = {}) {
  const token = obterToken();
  const ehFormData = options.body instanceof FormData;

  const resposta = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...(!ehFormData && { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
      "Accept-Language": obterIdiomaCache(),
      ...options.headers,
    },
  });

  const corpo = await resposta.json();

  if (!resposta.ok) {
    throw new Error(corpo?.mensagem || "Erro ao comunicar com o servidor.");
  }

  cachearIdiomaSeExistir(corpo.data);

  return corpo.data;
}