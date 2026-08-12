import { useState } from "react";
import type { Categoria } from "../../hooks/useSistemasData";

interface AnexarDocumentoFormProps {
  categorias: Categoria[];
  enviando: boolean;
  onSubmit: (dados: { ficheiro: File; categoriaId: string; titulo: string; descricao: string }) => Promise<void>;
}

export default function AnexarDocumentoForm({ categorias, enviando, onSubmit }: AnexarDocumentoFormProps) {
  const [ficheiro, setFicheiro] = useState<File | null>(null);
  const [categoriaId, setCategoriaId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ficheiro) return alert("Selecione um ficheiro primeiro!");
    if (!categoriaId) return alert("Selecione uma categoria!");

    await onSubmit({ ficheiro, categoriaId, titulo: titulo || ficheiro.name, descricao });

    setFicheiro(null);
    setCategoriaId("");
    setTitulo("");
    setDescricao("");
    const fileInput = document.getElementById("input-file-doc") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4 max-w-2xl">
      <h3 className="font-bold text-slate-800 text-sm">Anexar Novo Ficheiro</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Linha 1: Seleção de Ficheiro e Categoria */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <input
            id="input-file-doc"
            type="file"
            onChange={(e) => setFicheiro(e.target.files?.[0] || null)}
            className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 cursor-pointer"
          />
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          >
            <option value="">Selecione a categoria...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        {/* Linha 2: Título e Descrição */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Título (opcional)"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />
          <input
            type="text"
            placeholder="Descrição (opcional)"
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
            className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {enviando ? "A Anexar..." : "Anexar Ficheiro"}
          </button>
        </div>
      </form>
    </div>
  );
}