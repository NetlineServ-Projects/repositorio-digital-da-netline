import { useOutletContext, useNavigate } from "react-router-dom";
import MetricsGrid from "../components/dashboard/metricsGrid";
import HeroBanner from "../components/dashboard/heroBanner";
import AcoesRapidas from "../components/dashboard/acoesRapidas";
import DocumentosRecentes from "../components/dashboard/documentosRecentes";
import AtividadeRecente from "../components/dashboard/atividadeRecente";
import type { Atividade } from "../components/dashboard/atividadeRecente";

interface DashboardContext {
  usuario: { nome: string; perfil?: string } | null;
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
    usuario, ehAdmin, totalCategorias, totalSistemas, totalDocumentos,
    pendentesAprovacao, totalAprovados, documentosRecentes,
    atividades,
  } = useOutletContext<DashboardContext>();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <HeroBanner totalDocumentos={totalDocumentos} totalSistemas={totalSistemas} onVerDocumentos={() => navigate("/dashboard/documentos")} />
      <MetricsGrid
        totalDocumentos={totalDocumentos}
        pendentesAprovacao={pendentesAprovacao}
        totalAprovados={totalAprovados}
        totalSistemas={totalSistemas}
        totalCategorias={totalCategorias}
        ehAdmin={ehAdmin}
      />
      <AcoesRapidas ehAdmin={ehAdmin} onNavegar={(aba: string) => navigate(`/dashboard/${aba}`)} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DocumentosRecentes documentos={documentosRecentes} onVerTodos={() => navigate("/dashboard/documentos")} ehAdmin={ehAdmin} />
        <AtividadeRecente atividades={ehAdmin ? atividades : atividades.filter((a) => a.usuario === usuario?.nome)} />
      </div>
    </div>
  );
}