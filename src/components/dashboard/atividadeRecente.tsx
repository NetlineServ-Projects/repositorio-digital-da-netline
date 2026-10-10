import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

export interface Atividade {
  id: string;
  usuario: { id: number; nome: string; perfil?: string };
  acao: string;
  documento?: { id: string | number; titulo: string } | null;
  sistema?: { id: string | number; nome: string } | null;
  criadoEm: string;
}

interface AtividadeRecenteProps {
  atividades: Atividade[];
  ehAdmin?: boolean;
}

export default function AtividadeRecente({
  atividades,
  ehAdmin = false,
}: AtividadeRecenteProps) {
  const { t, i18n } = useTranslation();
  const [filtroPerfil, setFiltroPerfil] = useState<"TODOS" | "ADMIN" | "FUNCIONARIO">("TODOS");

  const atividadesFiltradas = useMemo(() => {
    if (!ehAdmin || filtroPerfil === "TODOS") {
      return atividades;
    }
    return atividades.filter((item) => {
      const perfilItem = item.usuario.perfil?.toUpperCase();
      if (filtroPerfil === "ADMIN") return perfilItem === "ADMIN";
      if (filtroPerfil === "FUNCIONARIO") return perfilItem !== "ADMIN";
      return true;
    });
  }, [atividades, ehAdmin, filtroPerfil]);

  const obterCorAcao = (acao: string) => {
    const acaoLower = acao.toLowerCase();
    if (acaoLower.includes("aprov") || acaoLower.includes("cri") || acaoLower.includes("cadastr") || acaoLower.includes("sucess")) {
      return "bg-emerald-500";
    }
    if (acaoLower.includes("rejeit") || acaoLower.includes("elimin") || acaoLower.includes("apag") || acaoLower.includes("remov")) {
      return "bg-rose-500";
    }
    if (acaoLower.includes("edit") || acaoLower.includes("atualiz") || acaoLower.includes("alter")) {
      return "bg-amber-500";
    }
    return "bg-blue-600";
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-120">
      {/* Cabeçalho fixo no topo do card */}
      <div className="flex-none mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              {ehAdmin
                ? t("dashboard.atividadeRecente.titulo", "Atividades Recentes do Sistema")
                : t("dashboard.atividadeRecente.minhasAtividades", "Minhas Atividades")}
            </h3>
            <p className="text-[11px] text-slate-400">
              {ehAdmin
                ? "Ações de todos os funcionários e administradores"
                : "Apenas as ações realizadas pela sua conta"}
            </p>
          </div>

          {/* Filtros para Administrador */}
          {ehAdmin && (
            <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-[11px]">
              <button
                type="button"
                onClick={() => setFiltroPerfil("TODOS")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  filtroPerfil === "TODOS"
                    ? "bg-white text-slate-800 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setFiltroPerfil("FUNCIONARIO")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  filtroPerfil === "FUNCIONARIO"
                    ? "bg-white text-slate-800 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Funcionários
              </button>
              <button
                type="button"
                onClick={() => setFiltroPerfil("ADMIN")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  filtroPerfil === "ADMIN"
                    ? "bg-white text-slate-800 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Admins
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Atividades com Scroll Interno */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {atividadesFiltradas.length === 0 ? (
          <p className="text-slate-400 text-xs py-8 text-center italic">
            {t("dashboard.atividadeRecente.semAtividade", "Sem atividade recente.")}
          </p>
        ) : (
          atividadesFiltradas.map((item) => {
            const alvo = item.documento?.titulo ?? item.sistema?.nome;
            const ehItemAdmin = item.usuario.perfil === "ADMIN";

            return (
              <div key={item.id} className="flex items-start gap-3 text-xs">
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${obterCorAcao(item.acao)}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 leading-snug">
                    <strong className="text-slate-900 font-bold">
                      {item.usuario.nome}
                    </strong>
                    {ehAdmin && (
                      <span
                        className={`ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                          ehItemAdmin
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {ehItemAdmin ? "Admin" : "Funcionário"}
                      </span>
                    )}{" "}
                    <span className="text-slate-600">{item.acao}</span>{" "}
                    {alvo && (
                      <span className="font-semibold text-slate-800 italic">
                        "{alvo}"
                      </span>
                    )}
                  </p>
                  <span className="text-slate-400 text-[10px] block mt-0.5">
                    {new Date(item.criadoEm).toLocaleString(
                      i18n.language === "en" ? "en-GB" : "pt-PT"
                    )}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}