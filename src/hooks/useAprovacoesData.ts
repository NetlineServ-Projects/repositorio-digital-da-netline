import { useState, useEffect } from "react";
import { fetchComToken } from "../utils/api";
import { API_ENDPOINTS } from "../data/client/endpoint";
import type { Documento, Categoria } from "../types/documento";

export function useAprovacoesData() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarDados = async () => {
    setLoading(true);
    setErro(null);
    try {
      const [docs, cats] = await Promise.all([
        fetchComToken(API_ENDPOINTS.DOCUMENTOS),
        fetchComToken(API_ENDPOINTS.CATEGORIAS),
      ]);
      setDocumentos(docs);
      setCategorias(cats);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível carregar as solicitações.");
    } finally {
      setLoading(false);
    }
  };

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

  return { documentos, categorias, loading, erro, recarregar: carregarDados, alterarEstado };
}