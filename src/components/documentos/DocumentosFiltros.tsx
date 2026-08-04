import type { Categoria } from "../../hooks/useDocumentosData";

interface DocumentosFiltrosProps {
  busca: string;
  onBuscaChange: (v: string) => void;
  categoriaFiltro: string;
  onCategoriaChange: (v: string) => void;
  categorias: Categoria[];
  modoExibicao: "tabela" | "cards";
  onModoChange: (m: "tabela" | "cards") => void;
}

export default function DocumentosFiltros({
  busca,
  onBuscaChange,
  categoriaFiltro,
  onCategoriaChange,
  categorias,
  modoExibicao,
  onModoChange,
}: DocumentosFiltrosProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="w-full md:w-80 relative">
        <input
          type="text"
          placeholder="Pesquisar por título ou autor..."
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <select
          value={categoriaFiltro}
          onChange={(e) => onCategoriaChange(e.target.value)}
          className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
        >
          <option value="Todas">Todas as Categorias</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.nome}>{cat.nome}</option>
          ))}
        </select>

        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 ml-auto md:ml-0">
          <button onClick={() => onModoChange("tabela")} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${modoExibicao === "tabela" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
            Tabela
          </button>
          <button onClick={() => onModoChange("cards")} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${modoExibicao === "cards" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
            Grelha
          </button>
        </div>
      </div>
    </div>
  );
}