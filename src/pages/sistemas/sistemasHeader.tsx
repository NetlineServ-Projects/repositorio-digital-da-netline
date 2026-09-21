interface SistemasHeaderProps {
  total: number;
  onNovoSistema: () => void;
}

export default function SistemasHeader({ total, onNovoSistema }: SistemasHeaderProps) {
  return (
    <div className="bg-[#1e3a8a] p-6 rounded-xl text-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
          Gestão de Sistemas
        </span>
        <h2 className="text-2xl font-bold text-white">
          Sistemas Desenvolvidos
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Consulte os projetos, equipas envolvidas, clientes e documentações técnicas
        </p>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <div className="text-xs font-medium text-slate-200 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
          Total: <span className="font-bold text-white">{total}</span>
        </div>

        <button
          onClick={onNovoSistema}
          className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>+ Novo Sistema</span>
        </button>
      </div>
    </div>
  );
}