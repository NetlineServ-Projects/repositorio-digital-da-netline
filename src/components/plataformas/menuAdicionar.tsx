import { useState, useRef, useEffect } from "react";
import type { TipoFormularioPlataforma } from "../../pages/Plataformas/formulario/page";

const OPCOES_ADICIONAR: { tipo: TipoFormularioPlataforma; rotulo: string }[] = [
  { tipo: "plataforma", rotulo: "Plataforma" },
  { tipo: "servidor", rotulo: "Servidor" },
  { tipo: "dominio", rotulo: "Domínio" },
  { tipo: "subdominio", rotulo: "Registo DNS" },
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
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setAberto((valorAtual) => !valorAtual)}
        aria-haspopup="menu"
        aria-expanded={aberto}
        className="bg-white text-[#18357a] hover:bg-slate-100 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2"
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
          className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-100 shadow-lg py-1.5 z-20"
        >
          {OPCOES_ADICIONAR.map((opcao) => (
            <button
              key={opcao.tipo}
              role="menuitem"
              onClick={() => handleSelecionar(opcao.tipo)}
              className="w-full text-left px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#18357a] transition-colors cursor-pointer"
            >
              {opcao.rotulo}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}