import { IconVoltar, IconCaneta, IconLixeira } from "../icons";
import type { Sistema } from "../../hooks/useSistemasData";

interface SistemaDetalheHeaderProps {
  sistema: Sistema;
  onVoltar: () => void;
  onEditar: () => void;
  onApagar: () => void;
}

export default function SistemaDetalheHeader({
  sistema,
  onVoltar,
  onEditar,
  onApagar,
}: SistemaDetalheHeaderProps) {
  return (
    <div className="bg-[#18357a] text-white p-8 rounded-2xl shadow-md flex flex-col gap-3">
      {/* Botão Voltar + Categoria + Editar/Apagar no Topo */}
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

        <div className="flex items-center gap-2">
          <button
            onClick={onEditar}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-semibold text-white transition-colors flex items-center gap-1.5 backdrop-blur-xs cursor-pointer"
          >
            <IconCaneta className="w-3.5 h-3.5" />
            <span>Editar Sistema</span>
          </button>

          <button
            onClick={onApagar}
            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 rounded-lg text-xs font-semibold text-red-200 transition-colors flex items-center gap-1.5 backdrop-blur-xs cursor-pointer"
          >
            <IconLixeira className="w-3.5 h-3.5" />
            <span>Apagar</span>
          </button>
        </div>
      </div>

      {/* Nome do Sistema */}
      <h2 className="text-3xl font-bold text-white tracking-tight mt-1">
        {sistema.nome}
      </h2>
    </div>
  );
}