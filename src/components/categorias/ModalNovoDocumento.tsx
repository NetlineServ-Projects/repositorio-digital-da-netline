import type { Categoria } from "../../hooks/useCategoriasData";

interface ModalNovoDocumentoProps {
  categoria: Categoria;
  titulo: string;
  onTituloChange: (v: string) => void;
  ficheiro: File | null;
  onFicheiroChange: (f: File | null) => void;
  enviando: boolean;
  onFechar: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ModalNovoDocumento({ categoria, titulo, onTituloChange, onFicheiroChange, enviando, onFechar, onSubmit }: ModalNovoDocumentoProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Adicionar Documento</h3>
            <p className="text-xs text-slate-500">Categoria: <strong className="text-[#18357a]">{categoria.nome}</strong></p>
          </div>
          <button onClick={onFechar} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Título do Documento</label>
            <input type="text" placeholder="Ex: Ata da Reunião de Julho" value={titulo} onChange={(e) => onTituloChange(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-900/20" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Ficheiro *</label>
            <input type="file" required onChange={(e) => onFicheiroChange(e.target.files?.[0] || null)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#18357a] hover:file:bg-blue-100 cursor-pointer" />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={onFechar} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors">Cancelar</button>
            <button type="submit" disabled={enviando} className="px-4 py-2 bg-[#18357a] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50">
              {enviando ? "A submeter..." : "Carregar Documento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}