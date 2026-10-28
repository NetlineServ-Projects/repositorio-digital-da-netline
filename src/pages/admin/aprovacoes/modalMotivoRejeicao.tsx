import { useState, useId } from "react";
import { useTranslation } from "react-i18next";

interface ModalMotivoRejeicaoProps {
  aberto: boolean;
  // Se devolver uma Promise, os botões ficam desativados até terminar (sem rejeições a dobrar)
  onConfirmar: (motivo: string) => void | Promise<void>;
  onCancelar: () => void;
}

export default function ModalMotivoRejeicao({ aberto, onConfirmar, onCancelar }: ModalMotivoRejeicaoProps) {
  const { t } = useTranslation();
  const [motivo, setMotivo] = useState("");
  const [aEnviar, setAEnviar] = useState(false);
  const idTitulo = useId();
  const idCampo = useId();

  // Cada vez que abre, começa limpa (reposto no render, sem efeito)
  const [abertoAntes, setAbertoAntes] = useState(aberto);
  if (aberto !== abertoAntes) {
    setAbertoAntes(aberto);
    if (aberto) {
      setMotivo("");
      setAEnviar(false);
    }
  }

  if (!aberto) return null;

  const cancelar = () => {
    if (!aEnviar) onCancelar();
  };

  const confirmar = async () => {
    if (aEnviar) return;
    const resultado = onConfirmar(motivo.trim());
    if (resultado instanceof Promise) {
      setAEnviar(true);
      try {
        await resultado;
      } finally {
        setAEnviar(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && cancelar()}
      onKeyDown={(e) => e.key === "Escape" && cancelar()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        aria-busy={aEnviar}
        className="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4"
      >
        <div>
          <h2 id={idTitulo} className="font-bold text-slate-800 text-lg">{t("admin.aprovacoes.modalRejeicao.titulo")}</h2>
          <p className="text-sm text-slate-500 mt-1">
            {t("admin.aprovacoes.modalRejeicao.descricao")}
          </p>
        </div>
        <label htmlFor={idCampo} className="sr-only">{t("admin.aprovacoes.modalRejeicao.motivo")}</label>
        <textarea
          id={idCampo}
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          rows={3}
          placeholder={t("admin.aprovacoes.modalRejeicao.placeholder")}
          autoFocus
          disabled={aEnviar}
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 disabled:opacity-60"
        />
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={cancelar}
            disabled={aEnviar}
            className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {t("componentes.confirmacao.cancelar")}
          </button>
          <button
            type="button"
            onClick={confirmar}
            disabled={aEnviar}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-70 disabled:cursor-wait"
          >
            {aEnviar && (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
            )}
            {aEnviar ? t("admin.aprovacoes.modalRejeicao.aRejeitar") : t("admin.aprovacoes.modalRejeicao.confirmar")}
          </button>
        </div>
      </div>
    </div>
  );
}
