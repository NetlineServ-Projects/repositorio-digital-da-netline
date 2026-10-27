import { useState, useRef, useEffect } from "react";
import type { TipoFormularioPlataforma } from "../../pages/Plataformas/formulario/page";

const OPCOES_ADICIONAR: { tipo: TipoFormularioPlataforma; rotulo: string }[] = [
  { tipo: "plataforma", rotulo: "Plataforma" },
  { tipo: "servidor", rotulo: "Servidor" },
  { tipo: "dominio", rotulo: "Domínio" },
  { tipo: "imagem", rotulo: "Imagem de Container" }
];

interface MenuAdicionarProps {
  onSelecionar: (tipo: TipoFormularioPlataforma) => void;
}

export default function MenuAdicionar({ onSelecionar }: MenuAdicionarProps) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;

    const aoClicarFora = (evento: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(evento.target as Node)
      ) {
        setAberto(false);
      }
    };
    const aoPressionarTecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAberto(false);
    };

    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoPressionarTecla);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoPressionarTecla);
    };
  }, [aberto]);

  const handleSelecionar = (tipo: TipoFormularioPlataforma) => {
    setAberto(false);
    onSelecionar(tipo);
  };

  return (
    // No telemóvel é a única ação do cabeçalho: ocupa a largura toda
    <div className="relative w-full sm:w-auto" ref={containerRef}>
      <button
        onClick={() => setAberto((valorAtual) => !valorAtual)}
        aria-haspopup="menu"
        aria-expanded={aberto}
        className="bg-white text-[#18357a] hover:bg-slate-100 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap w-full sm:w-auto flex items-center justify-center gap-2"
      >
        <span>+ Adicionar</span>
        <span
          className={`text-[10px] transition-transform ${
            aberto ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {aberto && (
        <div
          role="menu"
          className="absolute left-0 right-0 sm:left-auto mt-2 sm:w-48 bg-white rounded-xl border border-slate-100 shadow-lg py-1.5 z-20"
        >
          {OPCOES_ADICIONAR.map((opcao) => (
            <button
              key={opcao.tipo}
              role="menuitem"
              onClick={() => handleSelecionar(opcao.tipo)}
              className="w-full text-left px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#18357a] transition-colors cursor-pointer"
            >
              {opcao.rotulo}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}