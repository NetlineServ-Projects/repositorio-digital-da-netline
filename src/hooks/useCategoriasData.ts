import { useState, useEffect } from "react";
import { fetchComToken, API_URL } from "../utils/api";

export interface Documento {
  id: string | number;
  titulo?: string;
  nomeArquivo?: string;
  usuario?: { nome: string };
  tamanho?: string | number;
  caminho?: string;
  dataSubmissao?: string;
  estado?: "PENDENTE" | "APROVADO" | "REJEITADO";
  categoriaId?: string | number;
  categoria?: { id: string | number; nome: string };
}

export interface Categoria {
  id: string | number;
  nome: string;
  descricao: string;
}

export function useCategoriasData() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDados = async () => {
    setLoading(true);
    try {
      const [cats, docs] = await Promise.all([
        fetchComToken("/api/categorias"),
        fetchComToken("/api/documentos"),
      ]);
      setCategorias(cats);
      setDocumentos(docs);
    } catch (error) {
      console.error("Erro ao carregar dados do servidor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const uploadDocumento = async (formData: FormData) => {
    const token = localStorage.getItem("token_sistema");
    const resposta = await fetch(`${API_URL}/api/documentos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const corpo = await resposta.json();
    if (!resposta.ok) throw new Error(corpo?.mensagem || "Erro ao carregar o documento.");
    await fetchDados();
  };

  const editarTituloDocumento = async (id: string | number, titulo: string) => {
    await fetchComToken(`/api/documentos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ titulo }),
    });
    await fetchDados();
  };

  const apagarDocumento = async (id: string | number) => {
    await fetchComToken(`/api/documentos/${id}`, { method: "DELETE" });
    await fetchDados();
  };

  return { categorias, documentos, loading, fetchDados, uploadDocumento, editarTituloDocumento, apagarDocumento };
}