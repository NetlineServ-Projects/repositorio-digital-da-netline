import { useTranslation } from "react-i18next";

interface AcoesRapidasProps {
  onNavegar: (aba: string) => void;
  ehAdmin?: boolean;
}

export default function AcoesRapidas({ onNavegar, ehAdmin = false }: AcoesRapidasProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-wrap gap-3 sm:gap-4 items-center justify-between">
      <span className="text-sm font-semibold text-slate-700">{t("dashboard.acoesRapidas.label")}</span>
      {/* No telemóvel os botões ficam numa grelha de 2 colunas com a mesma largura */}
      <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:flex-wrap sm:gap-3 sm:w-auto">
        {ehAdmin ? (
          <>
            <button onClick={() => onNavegar("aprovacoes")} className="px-3 sm:px-4 py-2.5 sm:py-2 bg-blue-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              {t("dashboard.acoesRapidas.gerirAprovacoes")}
            </button>
            <button onClick={() => onNavegar("categorias")} className="px-3 sm:px-4 py-2.5 sm:py-2 bg-blue-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              {t("dashboard.acoesRapidas.verCategorias")}
            </button>
            <button onClick={() => onNavegar("sistemas")} className="px-3 sm:px-4 py-2.5 sm:py-2 bg-blue-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              {t("dashboard.acoesRapidas.gerirSistemas")}
            </button>
            <button onClick={() => onNavegar("plataformas")} className="px-3 sm:px-4 py-2.5 sm:py-2 bg-blue-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              {t("dashboard.acoesRapidas.gerirPlataformas")}
            </button>
          </>
        ) : (
          <>
            <button onClick={() => onNavegar("documentos")} className="px-3 sm:px-4 py-2.5 sm:py-2 bg-blue-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              {t("dashboard.acoesRapidas.verDocumentos")}
            </button>
            <button onClick={() => onNavegar("categorias")} className="px-3 sm:px-4 py-2.5 sm:py-2 bg-blue-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              {t("dashboard.acoesRapidas.verCategorias")}
            </button>
            <button onClick={() => onNavegar("sistemas")} className="px-3 sm:px-4 py-2.5 sm:py-2 bg-blue-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              {t("dashboard.acoesRapidas.verSistemas")}
            </button>
            <button onClick={() => onNavegar("plataformas")} className="px-3 sm:px-4 py-2.5 sm:py-2 bg-blue-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
              {t("dashboard.acoesRapidas.verPlataformas")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}