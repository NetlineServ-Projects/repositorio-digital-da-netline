import type { Categoria, Documento } from "../../hooks/useDocumentosData";
import { formatarTamanho } from "../../utils/documentos";

interface DocumentoModalProps {
  docEdicao: Documento | null;
  categorias: Categoria[];
  titulo: string;
  onTituloChange: (v: string) => void;
  descricao: string;
  onDescricaoChange: (v: string) => void;
  categoriaId: string;
  onCategoriaIdChange: (v: string) => void;
  arquivoSelecionado: File | null;
  onArquivoChange: (f: File | null) => void;
  salvando: boolean;
  onFechar: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function DocumentoModal({
  docEdicao,
  categorias,
  titulo,
  onTituloChange,
  descricao,
  onDescricaoChange,
  categoriaId,
  onCategoriaIdChange,
  arquivoSelecionado,
  onArquivoChange,
  salvando,
  onFechar,
  onSubmit,
}: DocumentoModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="font-bold text-lg text-slate-800">{docEdicao ? "Editar Documento" : "Adicionar Novo Documento"}</h3>
          <button onClick={onFechar} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-sm">
          {!docEdicao && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Ficheiro *</label>
              <input
                type="file"
                required
                onChange={(e) => onArquivoChange(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#18357a] hover:file:bg-blue-100 cursor-pointer"
              />
              {arquivoSelecionado && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Selecionado: <strong className="text-slate-600">{arquivoSelecionado.name}</strong> ({formatarTamanho(arquivoSelecionado.size)})
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Título do Documento *</label>
            <input type="text" required placeholder="Ex: Regulamento Interno de Segurança" value={titulo} onChange={(e) => onTituloChange(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Descrição</label>
            <textarea rows={2} placeholder="Resumo breve do conteúdo do documento..." value={descricao} onChange={(e) => onDescricaoChange(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Categoria *</label>
            <select required value={categoriaId} onChange={(e) => onCategoriaIdChange(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20">
              <option value="">Selecione uma categoria...</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={onFechar} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors">Cancelar</button>
            <button type="submit" disabled={salvando} className="px-4 py-2 bg-[#18357a] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50">
              {salvando ? "A Guardar..." : docEdicao ? "Atualizar Documento" : "Registar Documento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}