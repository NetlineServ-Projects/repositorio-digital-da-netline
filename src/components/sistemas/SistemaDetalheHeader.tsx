import { IconVoltar, IconCaneta } from "../icons";
import type { Sistema } from "../../hooks/useSistemasData";

function renderBadgeStatus(status: string) {
  switch (status) {
    case "Em Produção":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    case "Manutenção":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    default:
      return "bg-sky-500/20 text-sky-300 border-sky-500/30";
  }
}

interface SistemaDetalheHeaderProps {
  sistema: Sistema;
  onVoltar: () => void;
  onEditar: () => void;
}

export default function SistemaDetalheHeader({
  sistema,
  onVoltar,
  onEditar,
}: SistemaDetalheHeaderProps) {
  return (
    <div className="bg-[#18357a] text-white p-8 rounded-2xl shadow-md flex flex-col gap-3">
      {/* Botão Voltar + Categoria + Editar no Topo */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onVoltar}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors backdrop-blur-xs cursor-pointer"
          >
            <IconVoltar />
            <span>Voltar</span>
          </button>

          <span className="text-[11px] font-bold tracking-wider text-blue-200/70 uppercase">
            Sistema da Netline
          </span>
        </div>

        <button
          onClick={onEditar}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-semibold text-white transition-colors flex items-center gap-1.5 backdrop-blur-xs cursor-pointer"
        >
          <IconCaneta className="w-3.5 h-3.5" />
          <span>Editar Sistema</span>
        </button>
      </div>

      {/* Nome do Sistema e Badge de Status Acolhado Abaixo */}
      <div className="flex flex-col items-start gap-2 mt-1">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          {sistema.nome}
        </h2>

        <span
          className={`text-xs font-semibold px-3 py-0.5 rounded-full border ${renderBadgeStatus(sistema.status)}`}
        >
          {sistema.status}
        </span>
      </div>
    </div>
  );
}