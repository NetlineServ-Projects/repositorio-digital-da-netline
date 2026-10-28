import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

// Estados partilhados pelas páginas: a carregar, erro e lista vazia, com o mesmo aspeto
// em toda a aplicação

export function EstadoCarregando({ mensagem, linhas = 3 }: { mensagem?: string; linhas?: number }) {
  const { t } = useTranslation();
  mensagem ??= t("comum.estados.carregando");
  return (
    <div role="status" aria-live="polite" className="bg-white rounded-2xl border border-slate-200/70 shadow-xs p-6 space-y-4">
      <span className="sr-only">{mensagem}</span>
      <div className="h-4 w-1/3 bg-slate-100 rounded animate-pulse" aria-hidden="true" />
      {Array.from({ length: linhas }, (_, i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse" aria-hidden="true">
          <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-slate-100 rounded" style={{ width: `${85 - i * 12}%` }} />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
        </div>
      ))}
      <p className="text-xs text-slate-400" aria-hidden="true">{mensagem}</p>
    </div>
  );
}

export function EstadoErro({
  mensagem,
  onTentarNovamente,
  titulo,
}: {
  mensagem: string;
  onTentarNovamente?: () => void;
  titulo?: string;
}) {
  const { t } = useTranslation();
  return (
    <div role="alert" className="bg-white rounded-2xl border border-rose-100 shadow-xs p-8 flex flex-col items-center text-center gap-3">
      <span className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center" aria-hidden="true">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-800">{titulo ?? t("comum.estados.erroTitulo")}</p>
        <p className="text-xs text-slate-500 mt-1 max-w-md break-words">{mensagem}</p>
      </div>
      {onTentarNovamente && (
        <button
          type="button"
          onClick={onTentarNovamente}
          className="px-4 py-2 text-xs font-semibold text-white bg-netline-azul hover:bg-netline-azul-escuro rounded-lg transition-colors cursor-pointer"
        >
          {t("comum.tentarNovamente")}
        </button>
      )}
    </div>
  );
}

export function EstadoVazio({
  mensagem,
  descricao,
  acao,
}: {
  mensagem: string;
  descricao?: string;
  acao?: ReactNode; // ex: botão "Novo documento"
}) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 flex flex-col items-center text-center gap-3">
      <span className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center" aria-hidden="true">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-600">{mensagem}</p>
        {descricao && <p className="text-xs text-slate-400 mt-1 max-w-md">{descricao}</p>}
      </div>
      {acao}
    </div>
  );
}

// Indicador discreto de que uma recarga está a correr por trás (os dados continuam no ecrã)
export function IndicadorAtualizar({ ativo }: { ativo: boolean }) {
  const { t } = useTranslation();
  if (!ativo) return null;
  return (
    <span role="status" className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
      <span className="w-3 h-3 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin" aria-hidden="true" />
      {t("comum.estados.aAtualizar")}
    </span>
  );
}
