import { useState, useRef, useEffect } from "react";

interface Option {
  valor: string;
  label: string;
}

interface FilterSelectProps {
  label?: string;
  placeholder?: string;
  opcoes: Option[];
  selecionados: string[]; // Suporta seleção múltipla ou única via Array
  onChange: (valores: string[]) => void;
  comBusca?: boolean;
}

export default function FilterSelect({
  label,
  placeholder = "Selecionar...",
  opcoes,
  selecionados,
  onChange,
  comBusca = true,
}: FilterSelectProps) {
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const opcoesFiltradas = opcoes.filter((op) =>
    op.label.toLowerCase().includes(busca.toLowerCase())
  );

  const toggleOpcao = (valor: string) => {
    if (selecionados.includes(valor)) {
      onChange(selecionados.filter((v) => v !== valor));
    } else {
      onChange([...selecionados, valor]);
    }
  };

  // Texto amigável de exibição do botão
  const textoExibicao =
    selecionados.length === 0
      ? placeholder
      : selecionados.length === 1
      ? opcoes.find((o) => o.valor === selecionados[0])?.label || placeholder
      : `${selecionados.length} selecionados`;

  return (
    <div className="flex flex-col gap-1.5 w-full relative" ref={containerRef}>
      {label && <label className="text-xs font-semibold text-slate-500">{label}</label>}

      {/* Botão Principal do Select */}
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 hover:bg-slate-100/80 transition-all focus:outline-none focus:ring-2 focus:ring-[#18357a]/20"
      >
        <span className={`truncate ${selecionados.length === 0 ? "text-slate-400" : "font-medium text-slate-700"}`}>
          {textoExibicao}
        </span>
        {/* Ícone de Dupla Seta */}
        <svg className="w-4 h-4 text-slate-400 shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      </button>

      {/* Menu Suspenso (Dropdown) */}
      {aberto && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2 space-y-2">
          {/* Campo de Pesquisa Interno */}
          {comBusca && (
            <div className="relative">
              <svg className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Pesquisar..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 focus:outline-none focus:bg-white focus:border-slate-300"
              />
            </div>
          )}

          {/* Lista de Opções com Checkbox */}
          <div className="max-h-48 overflow-y-auto space-y-0.5">
            {opcoesFiltradas.length > 0 ? (
              opcoesFiltradas.map((op) => {
                const marcado = selecionados.includes(op.valor);
                return (
                  <label
                    key={op.valor}
                    onClick={() => toggleOpcao(op.valor)}
                    className={`flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg cursor-pointer transition-colors ${
                      marcado ? "bg-[#d99b26]/10 text-[#d99b26] font-medium" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={marcado}
                      readOnly
                      className="rounded border-slate-300 text-[#d99b26] focus:ring-[#d99b26]"
                    />
                    <span className="truncate">{op.label}</span>
                  </label>
                );
              })
            ) : (
              <p className="p-2 text-xs text-center text-slate-400">Sem opções disponíveis</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}