import React from "react";

interface HeaderDashboardProps {
  sidebarFechada: boolean;
  setSidebarFechada: (fechada: boolean) => void;
  usuario?: { nome: string; email?: string } | null;
}

export default function HeaderDashboard({
  sidebarFechada,
  setSidebarFechada,
  usuario,
}: HeaderDashboardProps) {
  // Pega as iniciais do nome para o avatar
  const nomeUsuario = usuario?.nome || "Usuário";
  const iniciais = nomeUsuario
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      {/* Canto Esquerdo: Botão Toggle + Campo do Repositório */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarFechada(!sidebarFechada)}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
          title={sidebarFechada ? "Expandir Menu" : "Recolher Menu"}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>

        {/* Campo com pill-shape parecido com a imagem de referência */}
        <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>Repositório Interno da Netline</span>
        </div>
      </div>

      {/* Canto Direito: Notificações + Perfil do Usuário */}
      <div className="flex items-center gap-4">
        
        {/* Avatar e Nome do Usuário */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-semibold flex items-center justify-center text-xs shadow-xs">
            {iniciais}
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:inline">
            {nomeUsuario}
          </span>
        </div>
      </div>
    </header>
  );
}