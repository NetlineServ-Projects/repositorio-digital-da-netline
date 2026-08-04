import { IconPasta } from "../icons";
import type { Categoria } from "../../hooks/useCategoriasData";

interface CategoriaCardProps {
  categoria: Categoria;
  totalDocs: number;
  onClick: () => void;
}

export default function CategoriaCard({ categoria, totalDocs, onClick }: CategoriaCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg group-hover:bg-[#18357a] group-hover:text-white transition-colors">
            <IconPasta className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
            {totalDocs} {totalDocs === 1 ? "documento" : "documentos"}
          </span>
        </div>
        <h3 className="font-bold text-slate-800 text-base group-hover:text-[#18357a] transition-colors truncate" title={categoria.nome}>
          {categoria.nome}
        </h3>
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
          {categoria.descricao || "Sem descrição cadastrada."}
        </p>
      </div>
      <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between text-slate-500 group-hover:text-[#18357a] text-xs font-semibold">
        <span>Aceder pasta</span>
        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </div>
  );
}