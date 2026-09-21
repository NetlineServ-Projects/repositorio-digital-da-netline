import { useState, useEffect } from "react";
import { fetchComToken } from "../utils/api";
import type { Documento, Categoria } from "../types/documento";

export type { Documento, Categoria };

export const TOKEN_ELEVADO_DURACAO_MS = 3 * 60 * 1000; // 3 minutos, sincronizado com o backend (authService)

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

export type TipoCredencial =
  | "ENV_VARIAVEIS"
  | "CREDENCIAIS_BD"
  | "CHAVE_TOKEN_API"
  | "CHAVE_SSH"
  | "CERTIFICADO_SSL"
  | "CREDENCIAIS_DNS"
  | "ACESSO_CONSOLA_CLOUD"
  | "CREDENCIAIS_CICD"
  | "CONFIGURACAO_VPN_FIREWALL"
  | "CREDENCIAIS_SMTP"
  | "BACKUP_ACESSO"
  | "OUTRO";

export interface Credencial {
  id: number;
  tipo: TipoCredencial;
  label: string;
  valor?: string; // só vem preenchido no GET; nunca em respostas de criação/edição
}

export interface SistemaInfraestrutura {
  id: number;
  ipServidor: string | null;
  cloudProvedor: string | null;
  credenciais: Credencial[];
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

  // =======================================
  // Infraestrutura encriptada (reautenticação necessária)
  // =======================================

  // Confirma a password e devolve o token elevado (válido 15 min).
  // Não recarrega `sistemas` — não altera a listagem geral.
  const reautenticar = async (senha: string): Promise<{ tokenElevado: string; expiraEm: string }> => {
    return fetchComToken("/auth/reautenticar", {
      method: "POST",
      body: JSON.stringify({ senha }),
    });
  };

  const buscarInfraestrutura = async (
    sistemaId: string | number,
    tokenElevado: string
  ): Promise<SistemaInfraestrutura | null> => {
    return fetchComToken(`/sistemas/${sistemaId}/infraestrutura`, {
      headers: { "x-token-elevado": tokenElevado },
    });
  };

  const salvarInfraestrutura = async (
    sistemaId: string | number,
    dados: { ipServidor?: string; cloudProvedor?: string },
    tokenElevado: string
  ) => {
    return fetchComToken(`/sistemas/${sistemaId}/infraestrutura`, {
      method: "PUT",
      body: JSON.stringify(dados),
      headers: { "x-token-elevado": tokenElevado },
    });
  };

  const adicionarCredencial = async (
    sistemaId: string | number,
    dados: { tipo: TipoCredencial; label: string; valor: string },
    tokenElevado: string
  ) => {
    return fetchComToken(`/sistemas/${sistemaId}/infraestrutura/credenciais`, {
      method: "POST",
      body: JSON.stringify(dados),
      headers: { "x-token-elevado": tokenElevado },
    });
  };

  const atualizarCredencial = async (
    credencialId: number,
    dados: Partial<{ tipo: TipoCredencial; label: string; valor: string }>,
    tokenElevado: string
  ) => {
    return fetchComToken(`/sistemas/infraestrutura/credenciais/${credencialId}`, {
      method: "PATCH",
      body: JSON.stringify(dados),
      headers: { "x-token-elevado": tokenElevado },
    });
  };

  const apagarCredencial = async (credencialId: number, tokenElevado: string) => {
    return fetchComToken(`/sistemas/infraestrutura/credenciais/${credencialId}`, {
      method: "DELETE",
      headers: { "x-token-elevado": tokenElevado },
    });
  };

  return {
    sistemas,
    documentos,
    categorias,
    loading,
    criarSistema,
    editarSistema,
    anexarDocumento,
    editarDocumento,
    apagarDocumento,
    recarregar: fetchDados,
    // infraestrutura
    reautenticar,
    buscarInfraestrutura,
    salvarInfraestrutura,
    adicionarCredencial,
    atualizarCredencial,
    apagarCredencial,
  };
}