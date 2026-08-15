// components/modalConfirmacao.tsx
interface ModalConfirmacaoProps {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  perigoso?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ModalConfirmacao({
  aberto,
  titulo,
  mensagem,
  textoConfirmar = "Confirmar",
  perigoso = false,
  onConfirmar,
  onCancelar,
}: ModalConfirmacaoProps) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">{titulo}</h2>
        <p className="text-sm text-slate-600 mb-6">{mensagem}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancelar}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors cursor-pointer ${
              perigoso ? "bg-red-600 hover:bg-red-700" : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}