import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

interface ModalConfirmacaoProps {
  aberto: boolean;
  titulo: string;
  mensagem: ReactNode;
  textoConfirmar?: string;
  textoCarregando?: string; // ex: "A eliminar..."
  perigoso?: boolean;
  // Pode devolver uma Promise: a janela mostra o carregamento e só fecha quando o caller a fechar
  onConfirmar: () => void | Promise<void>;
  onCancelar: () => void;
  carregando?: boolean; // para quem controla o carregamento por fora
}

const SELETOR_FOCAVEIS = 'button:not([disabled]), [href], input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])';

// Janela de confirmação acessível: role="alertdialog", Esc e clique fora cancelam, o foco fica
// preso lá dentro e volta ao botão de origem ao fechar; durante a ação os botões ficam desativados
export default function ModalConfirmacao({
  aberto,
  titulo,
  mensagem,
  textoConfirmar,
  textoCarregando,
  perigoso = false,
  onConfirmar,
  onCancelar,
  carregando: carregandoExterno = false,
}: ModalConfirmacaoProps) {
  const { t } = useTranslation();
  const [carregandoInterno, setCarregandoInterno] = useState(false);
  const carregando = carregandoExterno || carregandoInterno;
  const caixaRef = useRef<HTMLDivElement>(null);
  const cancelarRef = useRef<HTMLButtonElement>(null);
  const confirmarRef = useRef<HTMLButtonElement>(null);
  const idTitulo = useId();
  const idMensagem = useId();

  // Foco inicial: num pedido perigoso, em "Cancelar" (um Enter distraído não apaga nada)
  useEffect(() => {
    if (!aberto) return;
    const anterior = document.activeElement as HTMLElement | null;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    (perigoso ? cancelarRef : confirmarRef).current?.focus();
    return () => {
      document.body.style.overflow = overflowAnterior;
      anterior?.focus?.();
    };
  }, [aberto, perigoso]);

  if (!aberto) return null;

  const cancelar = () => {
    if (!carregando) onCancelar();
  };

  const confirmar = async () => {
    if (carregando) return; // impede o duplo clique
    const resultado = onConfirmar();
    if (resultado instanceof Promise) {
      setCarregandoInterno(true);
      try {
        await resultado;
      } finally {
        setCarregandoInterno(false);
      }
    }
  };

  const aoTeclar = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      cancelar();
      return;
    }
    if (e.key !== "Tab" || !caixaRef.current) return;
    const focaveis = [...caixaRef.current.querySelectorAll<HTMLElement>(SELETOR_FOCAVEIS)];
    if (focaveis.length === 0) return;
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primeiro.focus();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px] flex items-center justify-center z-[1100] p-4"
      onMouseDown={(e) => e.target === e.currentTarget && cancelar()}
      onKeyDown={aoTeclar}
    >
      <div
        ref={caixaRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        aria-describedby={idMensagem}
        aria-busy={carregando}
        className="bg-white rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start gap-3">
          {perigoso && (
            <span className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0" aria-hidden="true">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </span>
          )}
          <div className="min-w-0">
            <h2 id={idTitulo} className="text-base font-semibold text-slate-800">
              {titulo}
            </h2>
            <div id={idMensagem} className="text-sm text-slate-600 mt-1.5 break-words">
              {mensagem}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-6">
          <button
            ref={cancelarRef}
            type="button"
            onClick={cancelar}
            disabled={carregando}
            className="px-4 py-2.5 sm:py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("componentes.confirmacao.cancelar")}
          </button>
          <button
            ref={confirmarRef}
            type="button"
            onClick={confirmar}
            disabled={carregando}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-sm font-medium text-white rounded-lg transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-wait ${
              perigoso ? "bg-red-600 hover:bg-red-700" : "bg-netline-azul hover:bg-netline-azul-escuro"
            }`}
          >
            {carregando && (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
            )}
            {carregando
              ? (textoCarregando ?? t("componentes.confirmacao.aProcessar"))
              : (textoConfirmar ?? t("componentes.confirmacao.confirmar"))}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
