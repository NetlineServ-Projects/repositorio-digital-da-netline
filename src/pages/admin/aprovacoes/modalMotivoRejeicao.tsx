import { useState, useEffect } from "react";

interface ModalMotivoRejeicaoProps {
  aberto: boolean;
  onConfirmar: (motivo: string) => void;
  onCancelar: () => void;
}

export default function ModalMotivoRejeicao({ aberto, onConfirmar, onCancelar }: ModalMotivoRejeicaoProps) {
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    if (aberto) setMotivo("");
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
        <div>
          <h2 className="font-bold text-slate-800 text-lg">Rejeitar Documento</h2>
          <p className="text-sm text-slate-500 mt-1">Podes indicar o motivo da rejeição (opcional).</p>
        </div>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          rows={3}
          placeholder="Motivo da rejeição..."
          autoFocus
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
        />
        <div className="flex gap-3">
          <button onClick={onCancelar} className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-sm font-semibold rounded-lg transition-colors">Cancelar</button>
          <button onClick={() => onConfirmar(motivo)} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors">Confirmar Rejeição</button>
        </div>
      </div>
    </div>
  );
}