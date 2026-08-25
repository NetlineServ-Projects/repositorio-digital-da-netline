interface AcoesRapidasProps {
  onNavegar: (aba: string) => void;
  ehAdmin?: boolean;
}

export default function AcoesRapidas({ onNavegar, ehAdmin = false }: AcoesRapidasProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
      <span className="text-sm font-semibold text-slate-700">Ações Rápidas:</span>
      <div className="flex flex-wrap gap-3">
        {ehAdmin ? (
          <>
            <button onClick={() => onNavegar("aprovacoes")} className="px-4 py-2 bg-blue-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              Gerir Aprovações
            </button>
            <button onClick={() => onNavegar("categorias")} className="px-4 py-2 bg-blue-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              Ver Categorias
            </button>
            <button onClick={() => onNavegar("sistemas")} className="px-4 py-2 bg-blue-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              Gerir Sistemas
            </button>
          </>
        ) : (
          <>
            <button onClick={() => onNavegar("documentos")} className="px-4 py-2 bg-blue-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              Ver Documentos
            </button>
            <button onClick={() => onNavegar("categorias")} className="px-4 py-2 bg-blue-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              Ver Categorias
            </button>
            <button onClick={() => onNavegar("sistemas")} className="px-4 py-2 bg-blue-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              Ver Sistemas
            </button>
          </>
        )}
      </div>
    </div>
  );
}