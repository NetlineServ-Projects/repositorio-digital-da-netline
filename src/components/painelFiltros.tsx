import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface PainelFiltrosProps {
  children: ReactNode;
  ativos?: number; // quantos filtros estão aplicados (mostra-se no botão)
  // A partir de que largura os filtros ficam sempre abertos: "md" (768px) ou "lg" (1024px)
  abertoDesde?: "md" | "lg";
  className?: string;
}

// Em ecrãs pequenos os filtros ficam recolhidos atrás de um botão "Filtros",
// para não ocuparem o ecrã inteiro antes da lista; nos maiores ficam sempre visíveis
export default function PainelFiltros({ children, ativos = 0, abertoDesde = "md", className = "" }: PainelFiltrosProps) {
  const { t } = useTranslation();
  const [aberto, setAberto] = useState(false);
  const esconderBotao = abertoDesde === "lg" ? "lg:hidden" : "md:hidden";
  const mostrarSempre = abertoDesde === "lg" ? "lg:block" : "md:block";

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        className={`${esconderBotao} w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer`}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
          </svg>
          {t("componentes.filtros.titulo")}
          {ativos > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-netline-dourado/15 text-[#8a5f0e] text-[10px] font-bold">{ativos}</span>
          )}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${aberto ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`${aberto ? "block mt-3" : "hidden"} ${mostrarSempre} ${abertoDesde === "lg" ? "lg:mt-0" : "md:mt-0"}`}>
        {children}
      </div>
    </div>
  );
}
