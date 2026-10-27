import type { ReactNode } from "react";

// Padrão das páginas de detalhe (plataforma, servidor, sistema): título pequeno em
// maiúsculas por cima, conteúdo num cartão branco por baixo
export function Secao({
  titulo,
  acao,
  children,
  className = "",
}: {
  titulo: string;
  acao?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between gap-3 px-1 h-8">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{titulo}</h3>
        {acao}
      </div>
      {children}
    </section>
  );
}

export function Painel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/70 shadow-xs p-5 ${className}`}>
      {children}
    </div>
  );
}

// Par rótulo/valor dentro de um <dl>
export function Campo({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{rotulo}</dt>
      <dd className="text-sm font-semibold text-slate-800 mt-1 break-words">{children}</dd>
    </div>
  );
}

export function TextoVazio({ children }: { children: ReactNode }) {
  return <span className="text-slate-400 font-normal italic">{children}</span>;
}
