import { useState, useEffect } from "react";
import type { Documento, Categoria } from "../types/documento";

interface DocumentoModalProps {
  aberto: boolean;
  documento: Documento | null; // null = criar novo
  categorias: Categoria[];
  categoriaIdPredefinida?: number;
  onSalvar: (dados: { titulo: string; descricao: string; categoriaId: string; ficheiro?: File }) => Promise<void>;
  onFechar: () => void;
}

export default function DocumentoModal({ aberto, documento, categorias,categoriaIdPredefinida, onSalvar, onFechar }: DocumentoModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [ficheiro, setFicheiro] = useState<File | null>(null);
  const [salvando, setSalvando] = useState(false);

  const ehEdicao = documento !== null;

  useEffect(() => {
    if (aberto) {
      setTitulo(documento?.titulo || "");
      setDescricao(documento?.descricao || "");
      setCategoriaId(documento?.categoria?.id ? String(documento.categoria.id) 
      :categoriaIdPredefinida ?String(categoriaIdPredefinida) 
      : "");
      setFicheiro(null);
    }
  }, [aberto, documento,categoriaIdPredefinida]);

  if (!aberto) return null;

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      await onSalvar({ titulo, descricao, categoriaId, ficheiro: ficheiro ?? undefined });
      onFechar();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao guardar documento.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
        <h2 className="font-bold text-slate-800 text-lg">{ehEdicao ? "Editar Documento" : "Novo Documento"}</h2>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">Título</label>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">Descrição</label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">Categoria</label>
          <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20">
            <option value="">Sem Categoria</option>
            {categorias.map((cat) => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
          </select>
        </div>

        {!ehEdicao && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase">Ficheiro</label>
            <input type="file" onChange={(e) => setFicheiro(e.target.files?.[0] || null)} className="w-full text-sm text-slate-600" />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button onClick={onFechar} className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-sm font-semibold rounded-lg transition-colors">Cancelar</button>
          <button onClick={handleSalvar} disabled={salvando} className="flex-1 py-2.5 bg-[#18357a] hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
            {salvando ? "A guardar..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}