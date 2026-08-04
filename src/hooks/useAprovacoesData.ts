import { useState, useEffect } from "react";
import { fetchComToken } from "../utils/api";

export interface Documento {
  id: number;
  titulo: string;
  descricao?: string;
  nomeArquivo: string;
  caminho: string;
  tipoArquivo: string;
  tamanho: string | number;
  estado: "PENDENTE" | "APROVADO" | "REJEITADO";
  dataSubmissao?: string;
  usuario?: { nome: string };
  categoria?: { id: number; nome: string };
}

export interface Categoria {
  id: number;
  nome: string;
}

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
        fetchComToken("/api/documentos"),
        fetchComToken("/api/categorias"),
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

    await fetchComToken(`/api/documentos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    await carregarDados();
  };

  return { documentos, categorias, loading, erro, recarregar: carregarDados, alterarEstado };
}