import { useState, useEffect } from "react";
import { fetchComToken, API_URL } from "../utils/api";

export interface Documento {
  id: number;
  titulo: string;
  descricao?: string;
  nomeArquivo: string;
  caminho: string;
  tipoArquivo: string;
  tamanho: string | number;
  estado?: "PENDENTE" | "APROVADO" | "REJEITADO";
  dataSubmissao?: string;
  usuario?: { nome: string };
  categoria?: { id?: number; nome: string };
}

export interface Categoria {
  id: number;
  nome: string;
}

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
        fetchComToken("/api/documentos"),
        fetchComToken("/api/categorias"),
      ]);
      setDocumentos(docs);
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
    const token = localStorage.getItem("token_sistema");
    const resposta = await fetch(`${API_URL}/api/documentos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const corpo = await resposta.json();
    if (!resposta.ok) throw new Error(corpo?.mensagem || "Erro ao criar documento.");
    await carregarDados();
  };

  const editarDocumento = async (id: number, dados: { titulo: string; descricao: string; categoriaId: string }) => {
    await fetchComToken(`/api/documentos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(dados),
    });
    await carregarDados();
  };

  const aprovarDocumento = async (id: number) => {
    await fetchComToken(`/api/documentos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ estado: "APROVADO" }),
    });
    await carregarDados();
  };

  const apagarDocumento = async (id: number) => {
    await fetchComToken(`/api/documentos/${id}`, { method: "DELETE" });
    await carregarDados();
  };

  return {
    documentos,
    categorias,
    loading,
    erro,
    recarregar: carregarDados,
    criarDocumento,
    editarDocumento,
    aprovarDocumento,
    apagarDocumento,
  };
}