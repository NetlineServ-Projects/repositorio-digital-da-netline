import { useOutletContext, useNavigate } from "react-router-dom";
import MetricsGrid from "../components/dashboard/metricsGrid";
import HeroBanner from "../components/dashboard/heroBanner";
import AcoesRapidas from "../components/dashboard/acoesRapidas";
import DocumentosRecentes from "../components/dashboard/documentosRecentes";
import AtividadeRecente from "../components/dashboard/atividadeRecente";
import type { Atividade } from "../components/dashboard/atividadeRecente";

interface DashboardContext {
  usuario: { nome: string; perfil?: string; id?: number } | null;
  ehAdmin: boolean;
  totalCategorias: number;
  totalSistemas: number;
  totalDocumentos: number;
  pendentesAprovacao: number;
  totalAprovados: number;
  documentosRecentes: any[];
  atividades: Atividade[];
}

export default function DashboardHome() {
  const {
    usuario,
    ehAdmin,
    totalCategorias,
    totalSistemas,
    totalDocumentos,
    pendentesAprovacao,
    totalAprovados,
    documentosRecentes,
    atividades,
  } = useOutletContext<DashboardContext>();
  const navigate = useNavigate();

  const atividadesVisiveis = ehAdmin
    ? atividades
    : atividades.filter((a) => a.usuario.id === usuario?.id);

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      {/* Banner Principal */}
      <HeroBanner
        totalDocumentos={totalDocumentos}
        totalSistemas={totalSistemas}
        onVerDocumentos={() => navigate("/dashboard/documentos")}
      />

      {/* Métricas e Estatísticas */}
      <MetricsGrid
        totalDocumentos={totalDocumentos}
        pendentesAprovacao={pendentesAprovacao}
        totalAprovados={totalAprovados}
        totalSistemas={totalSistemas}
        totalCategorias={totalCategorias}
        ehAdmin={ehAdmin}
      />

      {/* Ações Rápidas */}
      <AcoesRapidas
        ehAdmin={ehAdmin}
        onNavegar={(aba: string) => navigate(`/dashboard/${aba}`)}
      />

      {/* Secção de Documentos e Atividades em Lista Vertical no Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <DocumentosRecentes
          documentos={documentosRecentes}
          onVerTodos={() => navigate("/dashboard/documentos")}
          ehAdmin={ehAdmin}
        />
        <AtividadeRecente atividades={atividadesVisiveis} />
      </div>
    </div>
  );
}