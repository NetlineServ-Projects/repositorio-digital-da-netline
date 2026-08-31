import { useState, useEffect } from "react";
import { fetchComToken } from "../utils/api";
import type { Documento, Categoria } from "../types/documento";

export type { Documento, Categoria };

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
  tecnologias?: string[]; // calculado: junção de frontend + backend + infraestrutura
  repositorioUrl?: string;
  urlProducao?: string;
  responsavelTecnico?: string;
  versaoAtual?: string;
  totalDocumentos?: number;
}

function comTecnologiasCombinadas(sis: Sistema): Sistema {
  return {
    ...sis,
    tecnologias: [
      ...(sis.tecnologiasFrontend || []),
      ...(sis.tecnologiasBackend || []),
      ...(sis.tecnologiasInfraestrutura || []),
    ],
  };
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
      setSistemas(Array.isArray(sist) ? sist.map(comTecnologiasCombinadas) : []);
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
    await fetchComToken("/sistemas", { method: "POST", body: JSON.stringify(dados) });
    await fetchDados();
  };

  const editarSistema = async (id: string | number, dados: Record<string, unknown>) => {
    await fetchComToken(`/sistemas/${id}`, { method: "PATCH", body: JSON.stringify(dados) });
    await fetchDados();
  };

  const anexarDocumento = async (formData: FormData) => {
    await fetchComToken("/documentos", { method: "POST", body: formData });
    await fetchDados();
  };

  const editarDocumento = async (id: number, dados: { titulo: string; descricao: string; categoriaId: string }) => {
    await fetchComToken(`/documentos/${id}`, { method: "PATCH", body: JSON.stringify(dados) });
    await fetchDados();
  };

  const apagarDocumento = async (id: number) => {
    await fetchComToken(`/documentos/${id}`, { method: "DELETE" });
    await fetchDados();
  };

  return { sistemas, documentos, categorias, loading, criarSistema, editarSistema, anexarDocumento, editarDocumento, apagarDocumento, recarregar: fetchDados };
}