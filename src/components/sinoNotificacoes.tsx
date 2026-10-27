import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IconSino } from "./icons";
import { useNotificacoes, type Notificacao } from "../hooks/useNotificacoes";

// Para onde leva cada notificação (null = não abre nada; o conteúdo fica no próprio painel)
function destino(n: Notificacao): string | null {
  switch (n.tipo) {
    case "DOCUMENTO_SUBMETIDO":
      return n.documentoId ? `/dashboard/aprovacoes/details/${n.documentoId}` : "/dashboard/aprovacoes";
    case "DOCUMENTO_APROVADO":
      return n.documentoId ? `/dashboard/documentos/${n.documentoId}` : null;
    case "DOMINIO_A_EXPIRAR":
    case "DOMINIO_EXPIRADO":
      return "/dashboard/plataformas?aba=dominios";
    default:
      return null;
  }
}

const COR_TIPO: Record<Notificacao["tipo"], string> = {
  DOCUMENTO_SUBMETIDO: "bg-blue-500",
  DOCUMENTO_APROVADO: "bg-emerald-500",
  DOCUMENTO_REJEITADO: "bg-rose-500",
  DOMINIO_A_EXPIRAR: "bg-amber-500",
  DOMINIO_EXPIRADO: "bg-red-600",
};

export default function SinoNotificacoes() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const {
    naoLidas,
    notificacoes,
    carregando,
    erro,
    carregarLista,
    marcarComoLida,
    marcarTodasComoLidas,
  } = useNotificacoes();
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const aoClicarFora = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setAberto(false);
    };
    const aoPressionarTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoPressionarTecla);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoPressionarTecla);
    };
  }, [aberto]);

  const alternar = () => {
    if (!aberto) carregarLista();
    setAberto(!aberto);
  };

  const formatarData = (iso: string) =>
    new Date(iso).toLocaleDateString(i18n.language === "en" ? "en-GB" : "pt-PT");

  const abrirNotificacao = (n: Notificacao) => {
    if (!n.lida) marcarComoLida(n.id);
    const caminho = destino(n);
    if (caminho) {
      setAberto(false);
      navigate(caminho);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={alternar}
        aria-haspopup="dialog"
        aria-expanded={aberto}
        aria-label={naoLidas > 0 ? t("notificacoes.porLer", { count: naoLidas }) : t("notificacoes.abrir")}
        title={t("notificacoes.titulo")}
        className="relative p-2.5 sm:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
      >
        <IconSino className="w-5 h-5" />
        {naoLidas > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
            {naoLidas > 99 ? "99+" : naoLidas}
          </span>
        )}
      </button>

      {aberto && (
        <div
          role="dialog"
          aria-label={t("notificacoes.titulo")}
          className="fixed inset-x-4 top-16 mt-1 sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-2 sm:w-96 bg-white rounded-xl border border-slate-200 shadow-lg z-30 overflow-hidden"
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-800">{t("notificacoes.titulo")}</p>
            {naoLidas > 0 && (
              <button
                onClick={marcarTodasComoLidas}
                className="text-xs font-semibold text-blue-900 hover:underline cursor-pointer"
              >
                {t("notificacoes.marcarTodas")}
              </button>
            )}
          </div>

          <div className="max-h-[min(28rem,70vh)] overflow-y-auto">
            {carregando && notificacoes.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-slate-400 animate-pulse">…</p>
            ) : erro ? (
              <div className="px-4 py-6 text-center space-y-2">
                <p className="text-xs text-red-600">{t("notificacoes.erro")}</p>
                <button onClick={carregarLista} className="text-xs font-semibold text-blue-900 hover:underline cursor-pointer">
                  {t("comum.tentarNovamente")}
                </button>
              </div>
            ) : notificacoes.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-slate-400">{t("notificacoes.vazio")}</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {notificacoes.map((n) => (
                  <li key={n.id}>
                    <button
                      onClick={() => abrirNotificacao(n)}
                      className={`w-full text-left px-4 py-3 flex gap-3 transition-colors cursor-pointer hover:bg-slate-50 ${
                        n.lida ? "" : "bg-blue-50/60"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.lida ? "bg-slate-300" : COR_TIPO[n.tipo]}`}
                      />
                      <span className="min-w-0 flex-1 space-y-1">
                        <span className={`block text-xs ${n.lida ? "text-slate-600" : "text-slate-800 font-semibold"}`}>
                          {t(`notificacoes.tipos.${n.tipo}`, {
                            referencia: n.referencia,
                            data: n.dataLimite ? formatarData(n.dataLimite) : "",
                          })}
                        </span>
                        {n.tipo === "DOCUMENTO_REJEITADO" && n.mensagem && (
                          <span className="block text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-md px-2 py-1.5 whitespace-pre-wrap">
                            <strong>{t("notificacoes.motivo")}:</strong> {n.mensagem}
                          </span>
                        )}
                        <span className="block text-[10px] text-slate-400">{formatarData(n.criadoEm)}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
