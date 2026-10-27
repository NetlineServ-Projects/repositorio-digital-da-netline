import { useCallback, useEffect, useState } from "react";
import { fetchComToken } from "../utils/api";
import { API_ENDPOINTS } from "../data/client/endpoint";

export type TipoNotificacao =
  | "DOCUMENTO_SUBMETIDO"
  | "DOCUMENTO_APROVADO"
  | "DOCUMENTO_REJEITADO"
  | "DOMINIO_A_EXPIRAR"
  | "DOMINIO_EXPIRADO";

export interface Notificacao {
  id: number;
  tipo: TipoNotificacao;
  referencia: string; // título do documento ou nome do domínio
  mensagem: string | null; // motivo da rejeição
  dataLimite: string | null; // data de expiração do domínio
  lida: boolean;
  criadoEm: string;
  documentoId: number | null;
  dominioId: number | null;
}

// O sino pergunta quantas há por ler a cada minuto; a lista só se carrega ao abrir
const INTERVALO_CONTAGEM_MS = 60_000;

export function useNotificacoes() {
  const [naoLidas, setNaoLidas] = useState(0);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const atualizarContagem = useCallback(async () => {
    try {
      const resposta = await fetchComToken(API_ENDPOINTS.NOTIFICACOES_CONTAGEM);
      setNaoLidas(resposta?.naoLidas ?? 0);
    } catch {
      // Falhas da contagem não incomodam o utilizador: tenta-se de novo no próximo minuto
    }
  }, []);

  useEffect(() => {
    atualizarContagem();
    const intervalo = setInterval(() => {
      // Num separador escondido não vale a pena perguntar
      if (document.visibilityState === "visible") atualizarContagem();
    }, INTERVALO_CONTAGEM_MS);
    return () => clearInterval(intervalo);
  }, [atualizarContagem]);

  const carregarLista = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const resposta = await fetchComToken(API_ENDPOINTS.NOTIFICACOES);
      setNotificacoes(resposta?.notificacoes ?? []);
      setNaoLidas(resposta?.naoLidas ?? 0);
    } catch (e) {
      setErro(e instanceof Error ? e.message : null);
    } finally {
      setCarregando(false);
    }
  }, []);

  const marcarComoLida = useCallback(async (id: number) => {
    setNotificacoes((lista) => lista.map((n) => (n.id === id ? { ...n, lida: true } : n)));
    setNaoLidas((n) => Math.max(n - 1, 0));
    try {
      await fetchComToken(API_ENDPOINTS.NOTIFICACAO_LIDA(id), { method: "PATCH" });
    } catch {
      atualizarContagem();
    }
  }, [atualizarContagem]);

  const marcarTodasComoLidas = useCallback(async () => {
    setNotificacoes((lista) => lista.map((n) => ({ ...n, lida: true })));
    setNaoLidas(0);
    try {
      await fetchComToken(API_ENDPOINTS.NOTIFICACOES_LIDAS, { method: "PATCH" });
    } catch {
      atualizarContagem();
    }
  }, [atualizarContagem]);

  return {
    naoLidas,
    notificacoes,
    carregando,
    erro,
    carregarLista,
    marcarComoLida,
    marcarTodasComoLidas,
  };
}
