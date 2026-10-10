import { IconCaneta, IconLixeira } from "../../components/icons";

interface AcoesItemProps {
  tituloEditar: string;
  tituloEliminar: string;
  compacto?: boolean;
  onEditar: () => void;
  onEliminar: () => void;
}

export default function AcoesItem({
  tituloEditar,
  tituloEliminar,
  compacto = false,
  onEditar,
  onEliminar,
}: AcoesItemProps) {
  const classeBotao = compacto ? "p-1" : "p-1.5 rounded-lg";
  const classeIcone = compacto ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        onClick={onEditar}
        className={`${classeBotao} text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer`}
        title={tituloEditar}
      >
        <IconCaneta className={classeIcone} />
      </button>
      <button
        onClick={onEliminar}
        className={`${classeBotao} text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer`}
        title={tituloEliminar}
      >
        <IconLixeira className={classeIcone} />
      </button>
    </div>
  );
}