import { useState, useEffect } from "react";
import { fetchComToken } from "../utils/api";
import type { Documento, Categoria } from "../types/documento";
import { useCarregamento } from "./useCarregamento";
import i18n from "../lang/i18n";

export function useDocumentosData() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const { carregando: loading, aAtualizar, erro, executar } = useCarregamento(
    i18n.t("comum.erros.carregarDocumentos"),
  );

  const carregarDados = () =>
    executar(
      () => Promise.all([fetchComToken("/documentos"), fetchComToken("/categorias")]),
      ([docs, cats]) => {
        setDocumentos((Array.isArray(docs) ? docs : []).filter((d: Documento) => d.estado === "APROVADO"));
        setCategorias(Array.isArray(cats) ? cats : []);
      },
    );

  useEffect(() => {
    carregarDados();
  }, []);

  const criarDocumento = async (formData: FormData) => {
    await fetchComToken("/documentos", { method: "POST", body: formData });
    await carregarDados();
  };

  const editarDocumento = async (id: number, dados: { titulo: string; descricao: string; categoriaId: string }) => {
    await fetchComToken(`/documentos/${id}`, { method: "PATCH", body: JSON.stringify(dados) });
    await carregarDados();
  };

  const aprovarDocumento = async (id: number) => {
    await fetchComToken(`/documentos/${id}`, { method: "PATCH", body: JSON.stringify({ estado: "APROVADO" }) });
    await carregarDados();
  };

  const apagarDocumento = async (id: number) => {
    await fetchComToken(`/documentos/${id}`, { method: "DELETE" });
    await carregarDados();
  };

  return { documentos, categorias, loading, aAtualizar, erro, recarregar: carregarDados, criarDocumento, editarDocumento, aprovarDocumento, apagarDocumento };
}