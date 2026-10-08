import { useState, useEffect, useCallback } from "react";
import { fetchComToken } from "../utils/api";
import { API_ENDPOINTS } from "../data/client/endpoint";
import type { Plataforma, Servidor, Dominio, Subdominio } from "../types/plataforma";

export function usePlataformasData() {
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [arvore, setArvore] = useState<Plataforma[]>([]);
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [dominios, setDominios] = useState<Dominio[]>([]);
  const [subdominios, setSubdominios] = useState<Subdominio[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarTodos = useCallback(async () => {
    setLoading(true);
    try {
      const [platRes, arvoreRes, servRes, domRes, subRes] = await Promise.allSettled([
        fetchComToken(API_ENDPOINTS.PLATAFORMAS),
        fetchComToken(API_ENDPOINTS.PLATAFORMA_ARVORE),
        fetchComToken(API_ENDPOINTS.SERVIDORES),
        fetchComToken(API_ENDPOINTS.DOMINIOS),
        fetchComToken(API_ENDPOINTS.SUBDOMINIOS),
      ]);

      if (platRes.status === "fulfilled" && Array.isArray(platRes.value)) {
        setPlataformas(platRes.value);
      }
      if (arvoreRes.status === "fulfilled" && Array.isArray(arvoreRes.value)) {
        setArvore(arvoreRes.value);
      }
      if (servRes.status === "fulfilled" && Array.isArray(servRes.value)) {
        setServidores(servRes.value);
      }
      if (domRes.status === "fulfilled" && Array.isArray(domRes.value)) {
        setDominios(domRes.value);
      }
      if (subRes.status === "fulfilled" && Array.isArray(subRes.value)) {
        setSubdominios(subRes.value);
      }
    } catch (error) {
      console.error("Erro ao carregar dados de plataformas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarTodos();
  }, [carregarTodos]);

  // ==========================================
  // OPERAÇÕES: PLATAFORMA
  // ==========================================
  const criarPlataforma = async (dados: {
    nome: string;
    tipo: string;
    urlPainel?: string | null;
    ativo?: boolean;
  }) => {
    await fetchComToken(API_ENDPOINTS.PLATAFORMAS, {
      method: "POST",
      body: JSON.stringify(dados),
    });
    await carregarTodos();
  };

  const atualizarPlataforma = async (
    id: number | string,
    dados: Partial<{
      nome: string;
      tipo: string;
      urlPainel?: string | null;
      ativo?: boolean;
    }>
  ) => {
    await fetchComToken(API_ENDPOINTS.PLATAFORMA_BY_ID(id), {
      method: "PATCH",
      body: JSON.stringify(dados),
    });
    await carregarTodos();
  };

  const eliminarPlataforma = async (id: number | string) => {
    await fetchComToken(API_ENDPOINTS.PLATAFORMA_BY_ID(id), {
      method: "DELETE",
    });
    await carregarTodos();
  };

  // ==========================================
  // OPERAÇÕES: SERVIDOR
  // ==========================================
  const criarServidor = async (dados: Record<string, unknown>) => {
    await fetchComToken(API_ENDPOINTS.SERVIDORES, {
      method: "POST",
      body: JSON.stringify(dados),
    });
    await carregarTodos();
  };

  const atualizarServidor = async (
    id: number | string,
    dados: Record<string, unknown>
  ) => {
    await fetchComToken(API_ENDPOINTS.SERVIDOR_BY_ID(id), {
      method: "PATCH",
      body: JSON.stringify(dados),
    });
    await carregarTodos();
  };

  const eliminarServidor = async (id: number | string) => {
    await fetchComToken(API_ENDPOINTS.SERVIDOR_BY_ID(id), {
      method: "DELETE",
    });
    await carregarTodos();
  };

  const revelarPasswordServidor = async (
    id: number | string,
    tokenElevado?: string
  ): Promise<string> => {
    const headers: Record<string, string> = {};
    if (tokenElevado) {
      headers["x-token-elevado"] = tokenElevado;
    }
    const res = await fetchComToken(API_ENDPOINTS.SERVIDOR_PASSWORD(id), {
      headers,
    });
    return (res as { password?: string })?.password || "";
  };

  // ==========================================
  // OPERAÇÕES: DOMÍNIO
  // ==========================================
  const criarDominio = async (dados: {
    nome: string;
    dataExpiracao: string;
    plataformaId: number;
  }) => {
    await fetchComToken(API_ENDPOINTS.DOMINIOS, {
      method: "POST",
      body: JSON.stringify(dados),
    });
    await carregarTodos();
  };

  const atualizarDominio = async (
    id: number | string,
    dados: Partial<{
      nome: string;
      dataExpiracao: string;
      plataformaId: number;
    }>
  ) => {
    await fetchComToken(API_ENDPOINTS.DOMINIO_BY_ID(id), {
      method: "PATCH",
      body: JSON.stringify(dados),
    });
    await carregarTodos();
  };

  const eliminarDominio = async (id: number | string) => {
    await fetchComToken(API_ENDPOINTS.DOMINIO_BY_ID(id), {
      method: "DELETE",
    });
    await carregarTodos();
  };

  // ==========================================
  // OPERAÇÕES: SUBDOMÍNIO (REGISTO DNS)
  // ==========================================
  const criarSubdominio = async (dados: {
    dominioId: number;
    nome: string;
    tipoDns: string;
    servidorId?: number | null;
    destino?: string | null;
  }) => {
    await fetchComToken(API_ENDPOINTS.SUBDOMINIOS, {
      method: "POST",
      body: JSON.stringify(dados),
    });
    await carregarTodos();
  };

  const atualizarSubdominio = async (
    id: number | string,
    dados: Partial<{
      dominioId: number;
      nome: string;
      tipoDns: string;
      servidorId?: number | null;
      destino?: string | null;
    }>
  ) => {
    await fetchComToken(API_ENDPOINTS.SUBDOMINIO_BY_ID(id), {
      method: "PATCH",
      body: JSON.stringify(dados),
    });
    await carregarTodos();
  };

  const eliminarSubdominio = async (id: number | string) => {
    await fetchComToken(API_ENDPOINTS.SUBDOMINIO_BY_ID(id), {
      method: "DELETE",
    });
    await carregarTodos();
  };

  return {
    plataformas,
    arvore,
    servidores,
    dominios,
    subdominios,
    loading,
    carregarTodos,
    criarPlataforma,
    atualizarPlataforma,
    eliminarPlataforma,
    criarServidor,
    atualizarServidor,
    eliminarServidor,
    revelarPasswordServidor,
    criarDominio,
    atualizarDominio,
    eliminarDominio,
    criarSubdominio,
    atualizarSubdominio,
    eliminarSubdominio,
  };
}

