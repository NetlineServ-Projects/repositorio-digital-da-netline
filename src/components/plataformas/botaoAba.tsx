import { useEffect, useRef, type ComponentType } from "react";

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
  const ref = useRef<HTMLButtonElement>(null);

  // Numa barra que desliza (ecrãs estreitos), o separador ativo fica sempre à vista.
  // Só se mexe no scroll horizontal da barra, para não deslocar a página.
  useEffect(() => {
    const botao = ref.current;
    const barra = botao?.parentElement;
    if (!ativa || !botao || !barra || barra.scrollWidth <= barra.clientWidth) return;
    const inicio = botao.offsetLeft - barra.offsetLeft;
    const fim = inicio + botao.offsetWidth;
    if (inicio < barra.scrollLeft) barra.scrollLeft = inicio - 4;
    else if (fim > barra.scrollLeft + barra.clientWidth) barra.scrollLeft = fim - barra.clientWidth + 4;
  }, [ativa]);

  return (
    <button
      ref={ref}
      onClick={onSelecionar}
      className={`shrink-0 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
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
