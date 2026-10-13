import { IconCaneta, IconLixeira } from "../icons";

interface IconeProps {
  className?: string;
}

function IconeOlho({ className }: IconeProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

interface AcoesItemProps {
  tituloVer?: string;
  tituloEditar?: string;
  tituloEliminar?: string;
  compacto?: boolean;
  onVer?: () => void;
  onEditar?: () => void;
  onEliminar?: () => void;
}

export default function AcoesItem({
  tituloVer,
  tituloEditar,
  tituloEliminar,
  compacto = false,
  onVer,
  onEditar,
  onEliminar,
}: AcoesItemProps) {
  // Modo compacto (linhas de tabela densas): sem borda. Restantes: botões com borda.
  const classeBase = compacto
    ? "p-1 text-slate-500"
    : "p-1.5 rounded-lg  bg-white text-slate-500";
  const classeIcone = compacto ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <div className="inline-flex items-center gap-1.5">
      {onVer && (
        <button
          onClick={onVer}
          className={`${classeBase} hover:text-[#18357a] hover:border-[#18357a]/30 hover:bg-slate-50 transition-colors cursor-pointer`}
          title={tituloVer}
          aria-label={tituloVer}
        >
          <IconeOlho className={classeIcone} />
        </button>
      )}
      {onEditar && (
        <button
          onClick={onEditar}
          className={`${classeBase} hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer`}
          title={tituloEditar}
          aria-label={tituloEditar}
        >
          <IconCaneta className={classeIcone} />
        </button>
      )}
      {onEliminar && (
        <button
          onClick={onEliminar}
          className={`${classeBase} hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer`}
          title={tituloEliminar}
          aria-label={tituloEliminar}
        >
          <IconLixeira className={classeIcone} />
        </button>
      )}
    </div>
  );
}