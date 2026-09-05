export const API_URL = "http://localhost:3000";
export const API_BASE = `${API_URL}/api/v1`;

const CHAVE_IDIOMA_CACHE = "idioma_preferido";

// Erro que carrega, além da mensagem genérica, os detalhes de validação por campo
// (quando o backend devolve { sucesso: false, mensagem, data: [{ campo, mensagem }] })
export class ErroApi extends Error {
  detalhes?: { campo: string; mensagem: string }[];

  constructor(mensagem: string, detalhes?: { campo: string; mensagem: string }[]) {
    super(mensagem);
    this.name = "ErroApi";
    this.detalhes = detalhes;
  }
}

export function obterToken(): string | null {
  return localStorage.getItem("token_sistema") || localStorage.getItem("token");
}

function obterIdiomaCache(): string {
  return localStorage.getItem(CHAVE_IDIOMA_CACHE) || "pt";
}

// Guarda localmente o idioma vindo da API, para usar como Accept-Language nas próximas chamadas
function cachearIdiomaSeExistir(data: unknown) {
  if (!data || typeof data !== "object") return;

  const possivelUsuario = data as Record<string, any>;
  const idioma = possivelUsuario.idioma ?? possivelUsuario.user?.idioma;

  if (typeof idioma === "string" && idioma) {
    localStorage.setItem(CHAVE_IDIOMA_CACHE, idioma);
  }
}

// Constrói uma mensagem legível a partir do array de erros de validação do Zod:
// [{ campo: "descricaoCurta", mensagem: "Too big..." }] -> "descricaoCurta: Too big..."
function construirMensagemDetalhada(mensagemBase: string, detalhes?: { campo: string; mensagem: string }[]): string {
  if (!detalhes || detalhes.length === 0) return mensagemBase;
  return detalhes.map((d) => `${d.campo}: ${d.mensagem}`).join(" | ");
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
    // O backend devolve os erros de validação Zod em `data`, um por campo
    const detalhes = Array.isArray(corpo?.data) ? corpo.data : undefined;
    const mensagemBase = corpo?.mensagem || "Erro ao comunicar com o servidor.";
    throw new ErroApi(construirMensagemDetalhada(mensagemBase, detalhes), detalhes);
  }

  cachearIdiomaSeExistir(corpo.data);

  return corpo.data;
}