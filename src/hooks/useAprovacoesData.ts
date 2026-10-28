import { useState, useEffect } from "react";
import { fetchComToken } from "../utils/api";
import { API_ENDPOINTS } from "../data/client/endpoint";
import type { Documento, Categoria } from "../types/documento";
import { useCarregamento } from "./useCarregamento";
import i18n from "../lang/i18n";

export function useAprovacoesData() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const { carregando: loading, aAtualizar, erro, executar } = useCarregamento(
    i18n.t("comum.erros.carregarSolicitacoes"),
  );

  const carregarDados = () =>
    executar(
      () => Promise.all([fetchComToken(API_ENDPOINTS.DOCUMENTOS), fetchComToken(API_ENDPOINTS.CATEGORIAS)]),
      ([docs, cats]) => {
        setDocumentos(Array.isArray(docs) ? docs : []);
        setCategorias(Array.isArray(cats) ? cats : []);
      },
    );

  useEffect(() => {
    carregarDados();
  }, []);

  const alterarEstado = async (id: number, novoEstado: "APROVADO" | "REJEITADO", motivo?: string) => {
    const body: Record<string, string> = { estado: novoEstado };
    if (novoEstado === "REJEITADO" && motivo) body.motivo = motivo;

    // antes: `/api/documentos/${id}` — duplicava o /api e não batia com a rota real
    await fetchComToken(API_ENDPOINTS.DOCUMENTO_BY_ID(id), {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    await carregarDados();
  };

  return { documentos, categorias, loading, aAtualizar, erro, recarregar: carregarDados, alterarEstado };
}