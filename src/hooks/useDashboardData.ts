import { useState, useEffect, useCallback } from "react";
import { fetchComToken } from "../utils/api";
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

export function useDashboardData() {
  const [usuario, setUsuario] = useState<UsuarioData | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [totalSistemas, setTotalSistemas] = useState(0);
  const [totalPlataformas, setTotalPlataformas] = useState(0);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscarDados = useCallback(async () => {
    setLoading(true);
    setErro(null);

    try {
      const [auth, docs, cats, sist, plat, ativ] = await Promise.all([
        fetchComToken(API_ENDPOINTS.PERFIL),
        fetchComToken(API_ENDPOINTS.DOCUMENTOS),
        fetchComToken(API_ENDPOINTS.CATEGORIAS),
        fetchComToken(API_ENDPOINTS.SISTEMAS),
        fetchComToken(API_ENDPOINTS.PLATAFORMAS).catch(() => []),
        fetchComToken(API_ENDPOINTS.ATIVIDADES_RECENTES),
      ]);

      setUsuario(auth);
      setDocumentos(Array.isArray(docs) ? docs : []);
      setTotalCategorias(Array.isArray(cats) ? cats.length : 0);
      setTotalSistemas(Array.isArray(sist) ? sist.length : 0);
      setTotalPlataformas(Array.isArray(plat) ? plat.length : 0);
      setAtividades(Array.isArray(ativ) ? ativ : []);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    buscarDados();
  }, [buscarDados]);

  const ehAdmin = usuario?.perfil === "ADMIN";
  const documentosVisiveis = ehAdmin ? documentos : documentos.filter((d) => d.estado === "APROVADO");

  const totalDocumentos = documentosVisiveis.length;
  const pendentesAprovacao = documentos.filter((d) => d.estado === "PENDENTE").length;
  const totalAprovados = documentos.filter((d) => d.estado === "APROVADO").length;
  const documentosRecentes = [...documentosVisiveis].reverse().slice(0, 5);

  return {
    usuario,
    documentos,
    totalCategorias,
    totalSistemas,
    totalPlataformas,
    totalDocumentos,
    pendentesAprovacao,
    totalAprovados,
    documentosRecentes,
    atividades,
    ehAdmin,
    loading,
    erro,
    recarregar: buscarDados,
  };
}