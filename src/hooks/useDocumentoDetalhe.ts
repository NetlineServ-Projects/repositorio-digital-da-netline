import { useState, useEffect } from "react";
import { fetchComToken } from "../utils/api";
import { API_ENDPOINTS } from "../data/client/endpoint";
import type { Documento } from "../types/documento";
import { useCarregamento } from "./useCarregamento";
import i18n from "../lang/i18n";

interface AtualizacaoDocumento {
  titulo?: string;
  descricao?: string;
  categoriaId?: number;
  estado?: "APROVADO" | "REJEITADO";
  motivo?: string;
}

export function useDocumentoDetalhe(id: string | number) {
  const [documento, setDocumento] = useState<Documento | null>(null);
  const { carregando: loading, aAtualizar, erro, executar } = useCarregamento(
    i18n.t("comum.erros.carregarDocumento"),
  );

  const carregar = () =>
    executar(() => fetchComToken(API_ENDPOINTS.DOCUMENTO_BY_ID(id)), setDocumento);

  useEffect(() => {
    carregar();
  }, [id]);

  const atualizar = async (dados: AtualizacaoDocumento) => {
    await fetchComToken(API_ENDPOINTS.DOCUMENTO_BY_ID(id), {
      method: "PATCH",
      body: JSON.stringify(dados),
    });
    await carregar();
  };

  const alterarEstado = async (novoEstado: "APROVADO" | "REJEITADO", motivo?: string) => {
    await atualizar({ estado: novoEstado, ...(motivo && { motivo }) });
  };

  return { documento, loading, aAtualizar, erro, recarregar: carregar, atualizar, alterarEstado };
}