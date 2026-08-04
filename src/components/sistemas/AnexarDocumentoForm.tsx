import { useState } from "react";
import type { Categoria } from "../../hooks/useSistemasData";

interface AnexarDocumentoFormProps {
  categorias: Categoria[];
  enviando: boolean;
  onSubmit: (ficheiro: File, categoriaId: string) => Promise<void>;
}

export default function AnexarDocumentoForm({ categorias, enviando, onSubmit }: AnexarDocumentoFormProps) {
  const [ficheiro, setFicheiro] = useState<File | null>(null);
  const [categoriaId, setCategoriaId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ficheiro) return alert("Selecione um ficheiro primeiro!");
    if (!categoriaId) return alert("Selecione uma categoria!");

    await onSubmit(ficheiro, categoriaId);
    setFicheiro(null);
    setCategoriaId("");
    const fileInput = document.getElementById("input-file-doc") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
      <h3 className="font-bold text-slate-800 text-sm">Anexar Novo Ficheiro</h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-wrap">
        <input
          id="input-file-doc"
          type="file"
          onChange={(e) => setFicheiro(e.target.files?.[0] || null)}
          className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 cursor-pointer"
        />
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
        >
          <option value="">Selecione a categoria...</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
        <button type="submit" disabled={!ficheiro || enviando} className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50">
          {enviando ? "A Anexar..." : "Anexar Ficheiro"}
        </button>
      </form>
    </div>
  );
}