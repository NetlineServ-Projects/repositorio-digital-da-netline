import { IconSistema, IconVoltar } from "../icons";
import type { Sistema } from "../../hooks/useSistemasData";

// Cores de badge adaptadas para fundo escuro
function renderBadgeStatus(status: string) {
  switch (status) {
    case "Em Produção": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    case "Manutenção": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    default: return "bg-sky-500/20 text-sky-300 border-sky-500/30";
  }
}

interface SistemaDetalheHeaderProps {
  sistema: Sistema;
  onVoltar: () => void;
}

export default function SistemaDetalheHeader({ sistema, onVoltar }: SistemaDetalheHeaderProps) {
  return (
    <div className="bg-blue-950 p-6 rounded-xl text-white shadow-sm flex flex-col gap-5">
      {/* Linha Superior: Botão Voltar, Ícone, Título e Badge */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onVoltar} 
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors backdrop-blur-sm"
          >
            <IconVoltar />
            <span>Voltar</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-lg backdrop-blur-sm">
              <IconSistema className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {sistema.nome}
            </h2>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${renderBadgeStatus(sistema.status)}`}>
              {sistema.status}
            </span>
          </div>
        </div>
      </div>

      {/* Descrição Curta (Subtítulo) */}
      {sistema.descricaoCurta && (
        <p className="text-xs font-medium text-slate-200 pl-1 max-w-4xl">
          {sistema.descricaoCurta}
        </p>
      )}

      {/* Descrição Longa com fundo suave e borda translúcida refinada */}
      {sistema.descricaoLonga ? (
        <div className="bg-white/5 border border-white/10 p-4 rounded-lg backdrop-blur-sm max-w-5xl">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
            Sobre o Sistema / Objetivo:
          </span>
          <p className="text-xs text-slate-100 leading-relaxed">
            {sistema.descricaoLonga}
          </p>
        </div>
      ) : (
        !sistema.descricaoCurta && (
          <p className="text-xs text-slate-300 italic pl-1">Sem descrição detalhada.</p>
        )
      )}
    </div>
  );
}