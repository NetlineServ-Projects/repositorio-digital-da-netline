export const API_URL = "http://localhost:3000";
export const API_BASE = `${API_URL}/api/v1`;

export function obterToken(): string | null {
  return localStorage.getItem("token_sistema") || localStorage.getItem("token");
}

export async function fetchComToken(endpoint: string, options: RequestInit = {}) {
  const token = obterToken();
  const ehFormData = options.body instanceof FormData;

  const resposta = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...(!ehFormData && { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const corpo = await resposta.json();

  if (!resposta.ok) {
    throw new Error(corpo?.mensagem || "Erro ao comunicar com o servidor.");
  }

  return corpo.data;
}