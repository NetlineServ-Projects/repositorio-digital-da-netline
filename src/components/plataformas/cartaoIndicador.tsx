import type { ComponentType, ReactNode } from "react";

export interface CartaoIndicadorProps {
  valor: ReactNode;
  rotulo: string;
  Icone: ComponentType<{ className?: string }>;
  // Cor do quadrado do ícone (ex: verde para "Ativa"); por defeito o azul da marca
  classeIcone?: string;
  // Valor em texto (ex: "Em Desenvolvimento"): letra mais pequena, para não partir palavras
  valorTexto?: boolean;
}

// Cartão de indicador dos detalhes (plataforma, servidor): borda superior grossa no
// amarelo dourado da identidade visual da Netline, que complementa o azul dos cabeçalhos
export default function CartaoIndicador({
  valor,
  rotulo,
  Icone,
  classeIcone = "bg-blue-50 text-blue-900",
  valorTexto = false,
}: CartaoIndicadorProps) {
  return (
    <div className="bg-white rounded-2xl border-2 border-netline-dourado/25 border-t-[5px] border-t-netline-dourado shadow-xs p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4 min-w-0">
      <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${classeIcone}`}>
        <Icone className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div className="min-w-0">
        <p className={`${valorTexto ? "text-sm sm:text-base break-normal" : "text-xl sm:text-2xl break-words"} font-extrabold text-slate-800 leading-tight`}>{valor}</p>
        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1 sm:mt-1.5 truncate">{rotulo}</p>
      </div>
    </div>
  );
}
