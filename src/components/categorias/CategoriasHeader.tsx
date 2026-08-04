interface CategoriasHeaderProps {
  total: number;
  busca: string;
  onBuscaChange: (v: string) => void;
}

export default function CategoriasHeader({ total, busca, onBuscaChange }: CategoriasHeaderProps) {
  return (
    <>
      <div className="bg-[#18357a] text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">Organização do Repositório</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Categorias de Documentos</h1>
          <p className="text-xs text-blue-100/90 mt-1">Explore as divisões pré-definidas e veja os ficheiros organizados no sistema</p>
        </div>
        <div className="bg-white/10 text-white font-semibold text-xs px-3 py-2 rounded-lg border border-white/10 backdrop-blur-sm self-start md:self-auto">
          Total: {total} categorias
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Pesquisar categoria..."
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
          />
        </div>
      </div>
    </>
  );
}