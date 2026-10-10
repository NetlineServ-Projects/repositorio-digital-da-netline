import type { ComponentType } from "react";

export type ComponenteIcone = ComponentType<{ className?: string }>;

interface BotaoAbaProps {
  rotulo: string;
  Icone: ComponenteIcone;
  corIcone: string;
  ativa: boolean;
  onSelecionar: () => void;
}

export default function BotaoAba({
  rotulo,
  Icone,
  corIcone,
  ativa,
  onSelecionar,
}: BotaoAbaProps) {
  return (
    <button
      onClick={onSelecionar}
      className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
        ativa
          ? "bg-white text-slate-800 shadow-xs"
          : "text-slate-600 hover:text-slate-800"
      }`}
    >
      <Icone className={`w-4 h-4 ${corIcone}`} />
      <span>{rotulo}</span>
    </button>
  );
}