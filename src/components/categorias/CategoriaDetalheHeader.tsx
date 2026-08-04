import { IconPasta } from "../icons";
import type { Categoria } from "../../hooks/useCategoriasData";

interface CategoriaDetalheHeaderProps {
  categoria: Categoria;
  totalDocs: number;
  onVoltar: () => void;
  onNovoDocumento: () => void;
}

export default function CategoriaDetalheHeader({ categoria, totalDocs, onVoltar, onNovoDocumento }: CategoriaDetalheHeaderProps) {
  return (
    <div className="bg-[#18357a] text-white p-6 md:p-7 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <button onClick={onVoltar} className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 backdrop-blur-sm border border-white/10 shrink-0">
          ← Voltar às Categorias
        </button>
        <div>
          <div className="flex items-center gap-2">
            <IconPasta className="w-6 h-6 text-blue-200" />
            <h1 className="text-2xl font-extrabold text-white">{categoria.nome}</h1>
          </div>
          <p className="text-sm font-medium text-blue-100 mt-1 bg-white/10 px-3 py-1 rounded-md inline-block backdrop-blur-sm border border-white/10">
            {categoria.descricao || "Ficheiros guardados nesta categoria"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-start md:self-auto">
        <div className="bg-white/10 text-white font-medium text-xs px-3 py-2.5 rounded-lg border border-white/10 backdrop-blur-sm">
          Total: <strong className="text-white">{totalDocs} ficheiro(s)</strong>
        </div>
        <button type="button" onClick={onNovoDocumento} className="bg-white text-[#18357a] hover:bg-blue-50 transition-colors font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0">
          <span>+</span> Novo Documento
        </button>
      </div>
    </div>
  );
}