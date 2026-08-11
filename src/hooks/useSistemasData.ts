import { useState, useEffect } from "react";
import { fetchComToken, API_URL } from "../utils/api";

export interface Documento {
  id: string | number;
  titulo?: string;
  nomeArquivo?: string;
  usuario?: { nome: string };
  tamanho?: string | number;
  dataSubmissao?: string;
  estado?: "PENDENTE" | "APROVADO" | "REJEITADO";
  sistemaId?: string | number;
  caminho?: string;
}

export interface Categoria {
  id: string | number;
  nome: string;
}

export interface Sistema {
  id: string | number;
  nome: string;
  desenvolvedores: string[];
  empresasClientes: string[];
  descricaoCurta?: string;
  descricaoLonga?: string;
  dataInicio?: string;
  dataEntrega?: string;
  status: "Em Produção" | "Em Desenvolvimento" | "Manutenção" | string;
  tecnologiasFrontend?: string[];
  tecnologiasBackend?: string[];
  tecnologiasInfraestrutura?: string[];
  repositorioUrl?: string;
  urlProducao?: string;
  responsavelTecnico?: string;
  versaoAtual?: string;
  totalDocumentos?: number;
}

export function useSistemasData() {
  const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDados = async () => {
    setLoading(true);
    try {
      const [sist, docs, cats] = await Promise.all([
        fetchComToken("/sistemas"),
        fetchComToken("/documentos"),
        fetchComToken("/categorias"),
      ]);
      setSistemas(Array.isArray(sist) ? sist : []);
      setDocumentos(Array.isArray(docs) ? docs : []);
      setCategorias(Array.isArray(cats) ? cats : []);
    } catch (error) {
      console.error("Erro ao carregar dados do servidor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const criarSistema = async (dados: Record<string, unknown>) => {
    await fetchComToken("/sistemas", {
      method: "POST",
      body: JSON.stringify(dados),
    });
    await fetchDados();
  };

  const anexarDocumento = async (formData: FormData) => {
    const token = localStorage.getItem("token_sistema");
    const resposta = await fetch(`${API_URL}/api/documentos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const corpo = await resposta.json();
    if (!resposta.ok) throw new Error(corpo?.mensagem || "Erro ao anexar o documento.");
    await fetchDados();
  };

  return { sistemas, documentos, categorias, loading, criarSistema, anexarDocumento, recarregar: fetchDados };
}