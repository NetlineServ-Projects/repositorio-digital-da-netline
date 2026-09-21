import { useState } from "react";

interface ReautenticacaoModalProps {
  aberto: boolean;
  enviando: boolean;
  erro?: string | null;
  onConfirmar: (senha: string) => void;
  onCancelar: () => void;
}

export default function ReautenticacaoModal({
  aberto,
  enviando,
  erro,
  onConfirmar,
  onCancelar,
}: ReautenticacaoModalProps) {
  const [senha, setSenha] = useState("");

  if (!aberto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senha) return;
    onConfirmar(senha);
    setSenha("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Confirme a sua password
          </h2>
          <p className="text-xs text-slate-500 mt-1">
           Por segurança, precisa de reautenticar-se para aceder aos dados de
           infraestrutura deste sistema. Esta confirmação é válida por 3 minutos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            autoFocus
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="A sua password"
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
          />

          {erro && <p className="text-xs text-rose-600">{erro}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onCancelar}
              disabled={enviando}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando || !senha}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {enviando ? "A confirmar..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}