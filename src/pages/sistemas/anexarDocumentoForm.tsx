import { useState } from "react";
import type { Categoria } from "../../hooks/useSistemasData";
import { toast } from "sonner";
import SelectPesquisavel from "../../components/selectPesquisavel";
import { useTranslation } from "react-i18next";

interface AnexarDocumentoFormProps {
  categorias: Categoria[];
  enviando: boolean;
  onSubmit: (dados: { ficheiro: File; categoriaId: string; titulo: string; descricao: string }) => Promise<void>;
}

export default function AnexarDocumentoForm({ categorias, enviando, onSubmit }: AnexarDocumentoFormProps) {
  const { t } = useTranslation();
  const [ficheiro, setFicheiro] = useState<File | null>(null);
  const [categoriaId, setCategoriaId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ficheiro) return toast.error(t("sistemas.anexar.erroSemFicheiro"));
    if (!categoriaId) return toast.error(t("sistemas.anexar.erroSemCategoria"));

    await onSubmit({ ficheiro, categoriaId, titulo: titulo || ficheiro.name, descricao });

    setFicheiro(null);
    setCategoriaId("");
    setTitulo("");
    setDescricao("");
    const fileInput = document.getElementById("input-file-doc") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-sm space-y-4 max-w-2xl">
      <h3 className="font-bold text-slate-800 text-sm">{t("sistemas.anexar.titulo")}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Linha 1: Seleção de Ficheiro e Categoria */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <input
            id="input-file-doc"
            type="file"
            onChange={(e) => setFicheiro(e.target.files?.[0] || null)}
            className="w-full min-w-0 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 cursor-pointer"
          />
          <SelectPesquisavel
            aria-label={t("sistemas.anexar.categoriaAria")}
            tamanho="sm"
            valor={categoriaId}
            onChange={setCategoriaId}
            opcaoVazia={t("sistemas.anexar.selecioneCategoria")}
            opcoes={categorias.map((c) => ({ valor: String(c.id), label: c.nome }))}
          />
        </div>

        {/* Linha 2: Título e Descrição */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder={t("sistemas.anexar.tituloPlaceholder")}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />
          <input
            type="text"
            placeholder={t("sistemas.anexar.descricaoPlaceholder")}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />
        </div>

        {/* Botão de Submissão */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={!ficheiro || enviando}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {enviando ? t("sistemas.anexar.aAnexar") : t("sistemas.anexar.anexar")}
          </button>
        </div>
      </form>
    </div>
  );
}