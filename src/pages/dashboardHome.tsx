import { useOutletContext, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MetricsGrid from "../components/dashboard/metricsGrid";
import HeroBanner from "../components/dashboard/heroBanner";
import AcoesRapidas from "../components/dashboard/acoesRapidas";
import DocumentosRecentes from "../components/dashboard/documentosRecentes";
import AtividadeRecente from "../components/dashboard/atividadeRecente";
import { useDashboardData } from "../hooks/useDashboardData";
import { EstadoErro } from "../components/estados";

interface DashboardContext {
  usuario: { nome: string; perfil?: string; id?: number } | null;
  ehAdmin: boolean;
}

export default function DashboardHome() {
  const { t } = useTranslation();
  const { usuario, ehAdmin } = useOutletContext<DashboardContext>();
  const {
    carregando,
    totalCategorias,
    totalSistemas,
    totalPlataformas,
    totalDocumentos,
    pendentesAprovacao,
    totalAprovados,
    documentosRecentes,
    erroDocumentos,
    atividades,
    erroAtividades,
    recarregar,
  } = useDashboardData(ehAdmin);
  const navigate = useNavigate();
  // Enquanto carrega, as métricas mostram um esqueleto em vez de um "0" que não é verdade
  const valor = (n: number) => (carregando ? null : n);

  const atividadesVisiveis = ehAdmin
    ? atividades
    : atividades.filter((a) => !a.usuario.id || a.usuario.id === usuario?.id);

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      {/* Banner Principal */}
      <HeroBanner
        totalDocumentos={carregando ? 0 : totalDocumentos}
        totalSistemas={carregando ? 0 : totalSistemas}
        onVerDocumentos={() => navigate("/dashboard/documentos")}
      />

      {/* Métricas e Estatísticas */}
      <MetricsGrid
        totalDocumentos={valor(totalDocumentos)}
        pendentesAprovacao={valor(pendentesAprovacao)}
        totalAprovados={valor(totalAprovados)}
        totalSistemas={valor(totalSistemas)}
        totalPlataformas={valor(totalPlataformas)}
        totalCategorias={valor(totalCategorias)}
        ehAdmin={ehAdmin}
      />

      {/* Ações Rápidas */}
      <AcoesRapidas
        ehAdmin={ehAdmin}
        onNavegar={(aba: string) => navigate(`/dashboard/${aba}`)}
      />

      {/* Secção de Documentos e Atividades em Lista Vertical no Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Cada secção falha sozinha: um erro nas atividades não esconde os documentos */}
        {erroDocumentos ? (
          <div className="lg:col-span-2">
            <EstadoErro titulo={t("dashboard.documentosRecentes.indisponivel")} mensagem={erroDocumentos} onTentarNovamente={recarregar} />
          </div>
        ) : (
          <DocumentosRecentes
            documentos={documentosRecentes}
            onVerTodos={() => navigate("/dashboard/documentos")}
            ehAdmin={ehAdmin}
          />
        )}
        {erroAtividades ? (
          <EstadoErro titulo={t("dashboard.atividadeRecente.indisponivel")} mensagem={erroAtividades} onTentarNovamente={recarregar} />
        ) : (
          <AtividadeRecente atividades={atividadesVisiveis} ehAdmin={ehAdmin} />
        )}
      </div>
    </div>
  );
}