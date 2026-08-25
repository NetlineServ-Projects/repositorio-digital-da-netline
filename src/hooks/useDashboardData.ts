import { useState, useEffect, useCallback } from "react";
import { fetchComToken } from "../utils/api";

export interface UsuarioData {
  nome: string;
  email?: string;
  perfil?: string;
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
  usuario: string;
  acao: string;
  alvo: string | null;
  criadoEm: string;
}

export function useDashboardData() {
  const [usuario, setUsuario] = useState<UsuarioData | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [totalSistemas, setTotalSistemas] = useState(0);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscarDados = useCallback(async () => {
    setLoading(true);
    setErro(null);

    try {
      const [auth, docs, cats, sist, ativ] = await Promise.all([
        fetchComToken("/auth/me"),
        fetchComToken("/documentos"),
        fetchComToken("/categorias"),
        fetchComToken("/sistemas"),
        fetchComToken("/dashboard/atividades"),
      ]);

      setUsuario(auth);
      setDocumentos(docs);
      setTotalCategorias(cats.length);
      setTotalSistemas(sist.length);
      setAtividades(ativ);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    buscarDados();
  }, [buscarDados]);

  // Cálculos derivados
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
    totalDocumentos,
    pendentesAprovacao,
    totalAprovados,
    documentosRecentes,
    atividades,
    loading,
    erro,
    recarregar: buscarDados,
  };
}