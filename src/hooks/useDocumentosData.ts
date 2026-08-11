import { useState, useEffect } from "react";
import { fetchComToken } from "../utils/api";
import type { Documento, Categoria } from "../types/documento";

export function useDocumentosData() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarDados = async () => {
    setLoading(true);
    setErro(null);
    try {
      const [docs, cats] = await Promise.all([
        fetchComToken("/documentos"),
        fetchComToken("/categorias"),
      ]);
      setDocumentos(docs.filter((d: Documento) => d.estado === "APROVADO"));
      setCategorias(cats);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível carregar os documentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const criarDocumento = async (formData: FormData) => {
    await fetchComToken("/documentos", { method: "POST", body: formData });
    await carregarDados();
  };

  const editarDocumento = async (id: number, dados: { titulo: string; descricao: string; categoriaId: string }) => {
    await fetchComToken(`/documentos/${id}`, { method: "PATCH", body: JSON.stringify(dados) });
    await carregarDados();
  };

  const aprovarDocumento = async (id: number) => {
    await fetchComToken(`/documentos/${id}`, { method: "PATCH", body: JSON.stringify({ estado: "APROVADO" }) });
    await carregarDados();
  };

  const apagarDocumento = async (id: number) => {
    await fetchComToken(`/documentos/${id}`, { method: "DELETE" });
    await carregarDados();
  };

  return { documentos, categorias, loading, erro, recarregar: carregarDados, criarDocumento, editarDocumento, aprovarDocumento, apagarDocumento };
}