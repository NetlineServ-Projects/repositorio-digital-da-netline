import { useState, useEffect, useCallback } from "react";
import { fetchComToken } from "../utils/api";
import i18n from "../lang/i18n";
import { API_ENDPOINTS } from "../data/client/endpoint";

export interface UsuarioData {
  id?: number;
  nome: string;
  email?: string;
  perfil?: string;
  cargo?: string;
  departamento?: string;
  numero?: string;
  fotografia?: string | null;
  temaEscuro?: boolean;
}

export interface Documento {
  id: string | number;
  titulo?: string;
  nomeArquivo?: string;
  usuario?: { nome: string };
  dataSubmissao?: string;
  estado?: "PENDENTE" | "APROVADO" | "REJEITADO";
  categoria?: { nome: string };
}

export interface Atividade {
  id: string;
  usuario: { id: number; nome: string; perfil?: string };
  acao: string;
  documento?: { id: string | number; titulo: string } | null;
  criadoEm: string;
  sistema: { id: number; nome: string } | null; 
}

// Um valor por secção: null enquanto carrega, ou a mensagem de erro dessa secção.
// Cada pedido é independente: se as atividades falharem, os números aparecem na mesma.
type Secao<T> = { dados: T; erro: string | null };

const mensagem = (r: PromiseSettledResult<unknown>, padrao: string) =>
  r.status === "rejected" ? (r.reason instanceof Error ? r.reason.message : padrao) : null;

const lista = <T,>(r: PromiseSettledResult<unknown>): T[] =>
  r.status === "fulfilled" && Array.isArray(r.value) ? (r.value as T[]) : [];

export function useDashboardData(ehAdmin: boolean) {
  const [carregando, setCarregando] = useState(true);
  const [documentos, setDocumentos] = useState<Secao<Documento[]>>({ dados: [], erro: null });
  const [totais, setTotais] = useState({ categorias: 0, sistemas: 0, plataformas: 0 });
  const [atividades, setAtividades] = useState<Secao<Atividade[]>>({ dados: [], erro: null });

  const buscarDados = useCallback(async () => {
    const [docs, cats, sist, plat, ativ] = await Promise.allSettled([
      fetchComToken(API_ENDPOINTS.DOCUMENTOS),
      fetchComToken(API_ENDPOINTS.CATEGORIAS),
      fetchComToken(API_ENDPOINTS.SISTEMAS),
      fetchComToken(API_ENDPOINTS.PLATAFORMAS),
      fetchComToken(API_ENDPOINTS.ATIVIDADES_RECENTES),
    ]);

    setDocumentos({ dados: lista<Documento>(docs), erro: mensagem(docs, i18n.t("comum.erros.carregarDocumentos")) });
    setTotais({
      categorias: lista(cats).length,
      sistemas: lista(sist).length,
      plataformas: lista(plat).length,
    });
    setAtividades({ dados: lista<Atividade>(ativ), erro: mensagem(ativ, i18n.t("comum.erros.carregarAtividades")) });
    setCarregando(false);
  }, []);

  useEffect(() => {
    buscarDados();
  }, [buscarDados]);

  const docs = documentos.dados;
  const documentosVisiveis = ehAdmin ? docs : docs.filter((d) => d.estado === "APROVADO");

  return {
    carregando,
    totalCategorias: totais.categorias,
    totalSistemas: totais.sistemas,
    totalPlataformas: totais.plataformas,
    totalDocumentos: documentosVisiveis.length,
    pendentesAprovacao: docs.filter((d) => d.estado === "PENDENTE").length,
    totalAprovados: docs.filter((d) => d.estado === "APROVADO").length,
    // O backend já os devolve do mais recente para o mais antigo
    documentosRecentes: documentosVisiveis.slice(0, 5),
    erroDocumentos: documentos.erro,
    atividades: atividades.dados,
    erroAtividades: atividades.erro,
    recarregar: buscarDados,
  };
}
