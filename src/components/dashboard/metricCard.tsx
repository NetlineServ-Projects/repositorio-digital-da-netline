interface MetricCardProps {
  titulo: string;
  valor: number;
  icone: React.ReactNode;
  corBorda: string;
  corIcone: string;
}

export default function MetricCard({ titulo, valor, icone, corBorda, corIcone }: MetricCardProps) {
  return (
    // Quando os cartões são estreitos (telemóvel e 6 por linha em xl) o ícone fica por cima do texto
    <div className={`bg-white p-4 sm:p-6 rounded-xl border border-slate-100 border-t-4 ${corBorda} shadow-sm hover:shadow-md transition-shadow flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between xl:flex-col-reverse xl:items-start xl:p-5 2xl:flex-row 2xl:items-center 2xl:p-6`}>
      <div className="min-w-0">
        <h4 className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider wrap-break-word">{titulo}</h4>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">{valor}</p>
      </div>
      <div className={`p-2 sm:p-3 shrink-0 bg-blue-50 ${corIcone} rounded-xl border border-blue-100/50 flex items-center justify-center`}>
        {icone}
      </div>
    </div>
  );
}