import { useState, useEffect, useCallback } from "react";
import { fetchComToken } from "../utils/api";

export interface UsuarioData {
  nome: string;
  email?: string;
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

export function useDashboardData() {
  const [usuario, setUsuario] = useState<UsuarioData | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [totalSistemas, setTotalSistemas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscarDados = useCallback(async () => {
    setLoading(true);
    setErro(null);

    try {
      const [auth, docs, cats, sist] = await Promise.all([
        fetchComToken("/auth/me"),
        fetchComToken("/documentos"),
        fetchComToken("/categorias"),
        fetchComToken("/sistemas"),
      ]);

      setUsuario(auth);
      setDocumentos(docs);
      setTotalCategorias(cats.length);
      setTotalSistemas(sist.length);
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
  const totalDocumentos = documentos.length;
  const pendentesAprovacao = documentos.filter((d) => d.estado === "PENDENTE").length;
  const totalAprovados = documentos.filter((d) => d.estado === "APROVADO").length;
  const documentosRecentes = [...documentos].reverse().slice(0, 5);

  return {
    usuario,
    documentos,
    totalCategorias,
    totalSistemas,
    totalDocumentos,
    pendentesAprovacao,
    totalAprovados,
    documentosRecentes,
    loading,
    erro,
    recarregar: buscarDados,
  };
}