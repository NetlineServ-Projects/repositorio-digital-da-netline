import { IconVoltar, IconCaneta, IconLixeira } from "../../components/icons";
import BotaoIconeCabecalho from "../../components/plataformas/botaoIconeCabecalho";
import type { Sistema } from "../../hooks/useSistemasData";

interface SistemaDetalheHeaderProps {
  sistema: Sistema;
  onVoltar: () => void;
  onEditar: () => void;
  onApagar: () => void;
  // Só quem criou o sistema (ou um ADMIN) o pode editar e eliminar
  podeGerir: boolean;
}

export default function SistemaDetalheHeader({
  sistema,
  onVoltar,
  onEditar,
  onApagar,
  podeGerir,
}: SistemaDetalheHeaderProps) {
  return (
    <div className="bg-[#18357a] text-white p-5 sm:p-8 rounded-2xl shadow-md flex flex-col gap-3">
      {/* Botão Voltar + Categoria + Editar/Apagar no Topo */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onVoltar}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors backdrop-blur-xs cursor-pointer shrink-0"
          >
            <IconVoltar />
            <span>Voltar</span>
          </button>

          <span className="text-[11px] font-bold tracking-wider text-blue-200/70 uppercase">
            Sistema da Netline
          </span>
        </div>

        {podeGerir && (
          <div className="flex items-center gap-2 shrink-0">
            <BotaoIconeCabecalho rotulo="Editar sistema" Icone={IconCaneta} onClick={onEditar} />
            <BotaoIconeCabecalho rotulo="Apagar sistema" Icone={IconLixeira} perigoso onClick={onApagar} />
          </div>
        )}
      </div>

      {/* Nome do Sistema */}
      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1 break-words">
        {sistema.nome}
      </h2>
      {sistema.criadoPor && (
        <p className="text-xs text-blue-100/80">Criado por {sistema.criadoPor.nome}</p>
      )}
    </div>
  );
}