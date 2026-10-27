import type { ComponentType, ReactNode } from "react";

interface CartaoInfraProps {
  titulo: string;
  subtitulo?: string;
  Icone: ComponentType<{ className?: string }>;
  classeIcone?: string;
  acao?: ReactNode;
  children: ReactNode;
}

// Cartão de uma peça da infraestrutura (endereço, backend, frontend)
export default function CartaoInfra({
  titulo,
  subtitulo,
  Icone,
  classeIcone = "bg-blue-50 text-blue-900",
  acao,
  children,
}: CartaoInfraProps) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200/70 shadow-xs p-5 flex flex-col gap-4 min-w-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${classeIcone}`}>
            <Icone className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-800">{titulo}</h3>
            {subtitulo && <p className="text-[11px] text-slate-400">{subtitulo}</p>}
          </div>
        </div>
        {acao}
      </div>
      <div className="flex-1">{children}</div>
    </section>
  );
}

// Par rótulo/valor em linha, para dentro de um CartaoInfra
export function LinhaInfra({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2 first:pt-0 last:pb-0">
      <dt className="text-xs text-slate-500 shrink-0">{rotulo}</dt>
      <dd className="text-sm font-semibold text-slate-800 text-right break-all min-w-0">{children}</dd>
    </div>
  );
}

export function BotaoAcaoInfra({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs font-semibold text-blue-900 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
    >
      {children}
    </button>
  );
}
