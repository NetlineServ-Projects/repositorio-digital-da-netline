import type { ComponentType } from "react";

interface BotaoIconeCabecalhoProps {
  rotulo: string; // aparece como dica (title) e para leitores de ecrã
  Icone: ComponentType<{ className?: string }>;
  onClick?: () => void;
  href?: string; // link externo (abre noutro separador)
  perigoso?: boolean;
}

// Ação só com ícone, para os cabeçalhos azuis dos detalhes (plataforma, servidor)
export default function BotaoIconeCabecalho({
  rotulo,
  Icone,
  onClick,
  href,
  perigoso = false,
}: BotaoIconeCabecalhoProps) {
  const classe = `w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
    perigoso
      ? "bg-white/10 text-red-200 hover:bg-red-500 hover:text-white"
      : "bg-white/10 text-white hover:bg-white/20"
  }`;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" title={rotulo} aria-label={rotulo} className={classe}>
        <Icone className="w-4 h-4" />
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} title={rotulo} aria-label={rotulo} className={classe}>
      <Icone className="w-4 h-4" />
    </button>
  );
}
