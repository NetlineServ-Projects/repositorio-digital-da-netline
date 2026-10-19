import { useState, useEffect } from "react";
import { fetchComToken } from "../utils/api";
import { API_ENDPOINTS } from "../data/client/endpoint";
import type { Documento, Categoria } from "../types/documento";

export type { Documento, Categoria };

export const TOKEN_ELEVADO_DURACAO_MS = 3 * 60 * 1000; // 3 minutos, sincronizado com o backend (authService)

// Opção de um dropdown (servidor, plataforma, domínio...)
export interface OpcaoHospedagem {
  id: number;
  nome: string;
  tipo?: string;
}

export const TIPOS_DNS = [
  "A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV", "CAA",
  "PTR", "SOA", "DS", "DNSKEY", "RRSIG", "TLSA", "SSHFP", "OUTRO",
] as const;

export type TipoDns = (typeof TIPOS_DNS)[number];

export interface SubdominioInfra {
  id: number;
  nomeCompleto?: string;
  dominioId?: number;
  nome: string;
  tipoDns: TipoDns;
  destino: string | null;
  dominio?: { id: number; nome: string };
}

// Tem de coincidir com o enum TipoAmbiente do schema.prisma
export type TipoAmbiente = "PRODUCAO" | "TESTES";

export interface PlataformaResumo {
  id: number;
  nome: string;
  tipo?: string;
  fornecedor?: string;
  logotipo?: string | null;
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
  tecnologias?: string[]; // calculado: junção de frontend + backend + infraestrutura
  repositorioUrl?: string;
  urlProducao?: string;
  urlTestes?: string | null;
  plataformaFrontendId?: number | null;
  plataformaFrontend?: PlataformaResumo | null;
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

// Infraestrutura do backend de um sistema, num ambiente
export interface SistemaInfraestrutura {
  id: number;
  ambiente: TipoAmbiente;
  url?: string | null;
  plataformaId?: number | null;
  plataforma?: PlataformaResumo | null;
  servidorId?: number | null;
  servidor?: { id: number; nome: string; hostname?: string } | null;
  imagemId?: number | null;
  imagem?: { id: number; nome: string; tag: string } | null;
  subdominio?: SubdominioInfra | null;
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

const cabecalhoElevado = (tokenElevado: string) => ({
  "x-token-elevado": tokenElevado,
});

// =======================================
// Listas para dropdowns
// =======================================

export const listarServidores = async (): Promise<OpcaoHospedagem[]> => {
  const resposta = await fetchComToken(API_ENDPOINTS.SERVIDORES);
  return Array.isArray(resposta) ? resposta : [];
};

export const listarPlataformas = async (): Promise<OpcaoHospedagem[]> => {
  const resposta = await fetchComToken(API_ENDPOINTS.PLATAFORMAS);
  return Array.isArray(resposta) ? resposta : [];
};

export const listarDominios = async (): Promise<OpcaoHospedagem[]> => {
  const resposta = await fetchComToken(API_ENDPOINTS.DOMINIOS);
  return Array.isArray(resposta) ? resposta : [];
};

// =======================================
// Infraestrutura encriptada, por ambiente (reautenticação necessária).
// São funções soltas: quem as chama obtém o token elevado com comAcesso().
// =======================================

// Confirma a password e devolve o token elevado (válido 3 min)
export const reautenticar = (
  senha: string,
): Promise<{ tokenElevado: string; expiraEm: string }> =>
  fetchComToken("/auth/reautenticar", {
    method: "POST",
    body: JSON.stringify({ senha }),
  });

export const buscarInfraestrutura = (
  sistemaId: string | number,
  ambiente: TipoAmbiente,
  tokenElevado: string,
): Promise<SistemaInfraestrutura | null> =>
  fetchComToken(API_ENDPOINTS.SISTEMA_INFRAESTRUTURA(sistemaId, ambiente), {
    headers: cabecalhoElevado(tokenElevado),
  });

export const salvarInfraestrutura = (
  sistemaId: string | number,
  ambiente: TipoAmbiente,
  dados: Record<string, unknown>,
  tokenElevado: string,
) =>
  fetchComToken(API_ENDPOINTS.SISTEMA_INFRAESTRUTURA(sistemaId, ambiente), {
    method: "PUT",
    body: JSON.stringify(dados),
    headers: cabecalhoElevado(tokenElevado),
  });

export const adicionarCredencial = (
  sistemaId: string | number,
  ambiente: TipoAmbiente,
  dados: { tipo: TipoCredencial; label: string; valor: string },
  tokenElevado: string,
) =>
  fetchComToken(API_ENDPOINTS.SISTEMA_CREDENCIAIS(sistemaId, ambiente), {
    method: "POST",
    body: JSON.stringify(dados),
    headers: cabecalhoElevado(tokenElevado),
  });

export const atualizarCredencial = (
  sistemaId: string | number,
  ambiente: TipoAmbiente,
  credencialId: number,
  dados: Partial<{ tipo: TipoCredencial; label: string; valor: string }>,
  tokenElevado: string,
) =>
  fetchComToken(
    API_ENDPOINTS.SISTEMA_CREDENCIAL(sistemaId, ambiente, credencialId),
    {
      method: "PATCH",
      body: JSON.stringify(dados),
      headers: cabecalhoElevado(tokenElevado),
    },
  );

export const apagarCredencial = (
  sistemaId: string | number,
  ambiente: TipoAmbiente,
  credencialId: number,
  tokenElevado: string,
) =>
  fetchComToken(
    API_ENDPOINTS.SISTEMA_CREDENCIAL(sistemaId, ambiente, credencialId),
    {
      method: "DELETE",
      headers: cabecalhoElevado(tokenElevado),
    },
  );

// =======================================
// Hook da página de sistemas
// =======================================

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

  const apagarSistema = async (id: string | number) => {
    await fetchComToken(`/sistemas/${id}`, { method: "DELETE" });
    await fetchDados();
  };

  const anexarDocumento = async (formData: FormData) => {
    await fetchComToken("/documentos", { method: "POST", body: formData });
    await fetchDados();
  };

  const editarDocumento = async (
    id: number,
    dados: { titulo: string; descricao: string; categoriaId: string },
  ) => {
    await fetchComToken(`/documentos/${id}`, { method: "PATCH", body: JSON.stringify(dados) });
    await fetchDados();
  };

  const apagarDocumento = async (id: number) => {
    await fetchComToken(`/documentos/${id}`, { method: "DELETE" });
    await fetchDados();
  };

  // Atualiza a lista sem mostrar o ecrã de carregamento
  const recarregarSistemas = async () => {
    const sist = await fetchComToken("/sistemas");
    setSistemas(Array.isArray(sist) ? sist.map(comTecnologiasCombinadas) : []);
  };

  return {
    sistemas,
    documentos,
    categorias,
    loading,
    criarSistema,
    editarSistema,
    apagarSistema,
    anexarDocumento,
    editarDocumento,
    apagarDocumento,
    recarregar: fetchDados,
    recarregarSistemas,
  };
}