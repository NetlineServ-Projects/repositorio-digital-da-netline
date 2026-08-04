interface MetricCardProps {
  titulo: string;
  valor: number;
  icone: React.ReactNode;
  corBorda: string;
  corIcone: string;
}

export default function MetricCard({ titulo, valor, icone, corBorda, corIcone }: MetricCardProps) {
  return (
    <div className={`bg-white p-6 rounded-xl border border-slate-100 border-t-4 ${corBorda} shadow-sm hover:shadow-md transition-shadow flex items-center justify-between`}>
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{titulo}</h4>
        <p className="text-3xl font-extrabold text-slate-800 mt-1">{valor}</p>
      </div>
      <div className={`p-3 bg-blue-50 ${corIcone} rounded-xl border border-blue-100/50 flex items-center justify-center`}>
        {icone}
      </div>
    </div>
  );
}