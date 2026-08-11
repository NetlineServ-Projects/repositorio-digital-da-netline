import { useState, useEffect } from "react";
import { fetchComToken } from "../utils/api";
import { API_ENDPOINTS } from "../data/client/endpoint";
import type { Documento } from "../types/documento";

interface AtualizacaoDocumento {
  titulo?: string;
  descricao?: string;
  categoriaId?: number;
  estado?: "APROVADO" | "REJEITADO";
  motivo?: string;
}

export function useDocumentoDetalhe(id: string | number) {
  const [documento, setDocumento] = useState<Documento | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const doc = await fetchComToken(API_ENDPOINTS.DOCUMENTO_BY_ID(id));
      setDocumento(doc);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível carregar o documento.");
    } finally {
      setLoading(false);
    }
  };

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

  return { documento, loading, erro, recarregar: carregar, atualizar, alterarEstado };
}