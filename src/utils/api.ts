export const API_URL = "http://localhost:3000";

export function obterToken(): string | null {
  return localStorage.getItem("token_sistema") || localStorage.getItem("token");
}

export async function fetchComToken(endpoint: string, options: RequestInit = {}) {
  const token = obterToken();

  const resposta = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const corpo = await resposta.json();

  if (!resposta.ok) {
    throw new Error(corpo?.mensagem || "Erro ao comunicar com o servidor.");
  }

  return corpo.data; // já devolve só o "data", sem precisar repetir .data em todo lado
}