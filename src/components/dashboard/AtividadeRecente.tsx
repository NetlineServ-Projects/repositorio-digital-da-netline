import { useTranslation } from "react-i18next";

export interface Atividade {
  id: string;
  usuario: string;
  acao: string;
  alvo: string | null;
  criadoEm: string;
}

interface AtividadeRecenteProps {
  atividades: Atividade[];
}

export default function AtividadeRecente({ atividades }: AtividadeRecenteProps) {
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4">{t("dashboard.atividadeRecente.titulo")}</h3>
      <div className="space-y-4">
        {atividades.length === 0 ? (
          <p className="text-slate-400 text-xs">{t("dashboard.atividadeRecente.semAtividade")}</p>
        ) : (
          atividades.map((item) => (
            <div key={item.id} className="flex items-start gap-3 text-xs">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
              <div className="flex-1">
                <p className="text-slate-700">
                  <strong className="text-slate-900">{item.usuario}</strong> {item.acao}{" "}
                  {item.alvo && <span className="italic text-slate-500">"{item.alvo}"</span>}
                </p>
                <span className="text-slate-400 text-[10px]">
                  {new Date(item.criadoEm).toLocaleString(i18n.language === "en" ? "en-GB" : "pt-PT")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}