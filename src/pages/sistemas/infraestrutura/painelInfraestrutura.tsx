import { useState, useEffect, useCallback } from "react";
import type {
  SistemaInfraestrutura,
  ComponenteSistema,
} from "../../../hooks/useSistemasData";
import type { ComponenteInfraestruturaProps } from "../../../types/infraestrutura";
import CardInfraestrutura from "./cardInfraestrutura";
import { useClickFora } from "../../../hooks/useClickFora";

type Props = ComponenteInfraestruturaProps & {
  onAbrirFormulario: (componente: ComponenteSistema) => void;
};

const OPCOES_MENU: { componente: ComponenteSistema; texto: string }[] = [
  { componente: "FRONTEND", texto: "Configurar Frontend" },
  { componente: "BACKEND", texto: "Configurar Backend" },
];

export default function PainelInfraestrutura({
  sistemaId,
  ambiente,
  tokenElevado,
  ehAdmin,
  servidores,
  plataformas,
  api,
  tratarErro,
  onAbrirFormulario,
}: Props) {
  // Desestruturado para a dependência do useCallback ser estável
  const { buscarInfraestrutura } = api;

  const [carregando, setCarregando] = useState(true);
  const [infraFront, setInfraFront] = useState<SistemaInfraestrutura | null>(null);
  const [infraBack, setInfraBack] = useState<SistemaInfraestrutura | null>(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const fecharMenu = useCallback(() => setMenuAberto(false), []);
  const menuRef = useClickFora<HTMLDivElement>(fecharMenu);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const [front, back] = await Promise.all([
        buscarInfraestrutura(sistemaId, ambiente, "FRONTEND", tokenElevado),
        buscarInfraestrutura(sistemaId, ambiente, "BACKEND", tokenElevado),
      ]);
      setInfraFront(front);
      setInfraBack(back);
    } catch (err) {
      tratarErro(err, "Erro ao carregar infraestrutura.");
    } finally {
      setCarregando(false);
    }
  }, [sistemaId, ambiente, tokenElevado, buscarInfraestrutura, tratarErro]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const abrir = (componente: ComponenteSistema) => {
    setMenuAberto(false);
    onAbrirFormulario(componente);
  };

  const cartoes: { titulo: string; componente: ComponenteSistema; infra: SistemaInfraestrutura | null }[] = [
    { titulo: "Frontend", componente: "FRONTEND", infra: infraFront },
    { titulo: "Backend", componente: "BACKEND", infra: infraBack },
  ];

  return (
    <div className="space-y-6">
      {ehAdmin && (
        <div className="flex justify-end">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuAberto((a) => !a)}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>Adicionar Informação à infraestrutura</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform ${menuAberto ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuAberto && (
              <div className="absolute right-0 z-20 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg p-1 space-y-1">
                {OPCOES_MENU.map((o) => (
                  <button
                    key={o.componente}
                    type="button"
                    onClick={() => abrir(o.componente)}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer"
                  >
                    {o.texto}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {carregando ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center">
          <p className="text-slate-500 text-xs animate-pulse">A carregar informações...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cartoes.map((c) => (
            <CardInfraestrutura
              key={c.componente}
              titulo={c.titulo}
              infra={c.infra}
              servidores={servidores}
              plataformas={plataformas}
              ehAdmin={ehAdmin}
              onEditar={() => onAbrirFormulario(c.componente)}
            />
          ))}
        </div>
      )}
    </div>
  );
}