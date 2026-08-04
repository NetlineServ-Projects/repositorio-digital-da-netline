interface ModalEditarDocumentoProps {
  titulo: string;
  onTituloChange: (v: string) => void;
  salvando: boolean;
  onFechar: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ModalEditarDocumento({ titulo, onTituloChange, salvando, onFechar, onSubmit }: ModalEditarDocumentoProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="font-bold text-lg text-slate-800">Editar Documento</h3>
          <button onClick={onFechar} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Título do Documento</label>
            <input type="text" required value={titulo} onChange={(e) => onTituloChange(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-900/20" />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={onFechar} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors">Cancelar</button>
            <button type="submit" disabled={salvando} className="px-4 py-2 bg-[#18357a] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50">
              {salvando ? "A guardar..." : "Guardar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}