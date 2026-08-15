import { useOutletContext, useNavigate } from "react-router-dom";
import MetricsGrid from "../components/dashboard/metricsGrid"; // ajusta ao import real que tinhas
import HeroBanner from "../components/dashboard/heroBanner";
import AcoesRapidas from "../components/dashboard/acoesRapidas";
import DocumentosRecentes from "../components/dashboard/documentosRecentes";
import AtividadeRecente from "../components/dashboard/atividadeRecente";
import type { Atividade } from "../components/dashboard/atividadeRecente";

interface DashboardContext {
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
    totalCategorias, totalSistemas, totalDocumentos,
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
      />
      <AcoesRapidas onNavegar={(aba: string) => navigate(`/dashboard/${aba}`)} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DocumentosRecentes documentos={documentosRecentes} onVerTodos={() => navigate("/dashboard/documentos")} />
        <AtividadeRecente atividades={atividades} />
      </div>
    </div>
  );
}