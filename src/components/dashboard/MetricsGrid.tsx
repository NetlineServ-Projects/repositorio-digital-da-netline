import MetricCard from "./MetricCard";
import { IconDocumento, IconRelogio, IconAprovado, IconSistemas, IconPasta } from "../icons";

interface MetricsGridProps {
  totalDocumentos: number;
  pendentesAprovacao: number;
  totalAprovados: number;
  totalSistemas: number;
  totalCategorias: number;
}

export default function MetricsGrid({
  totalDocumentos,
  pendentesAprovacao,
  totalAprovados,
  totalSistemas,
  totalCategorias,
}: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <MetricCard titulo="Total de Documentos" valor={totalDocumentos} icone={<IconDocumento className="w-6 h-6" />} corBorda="border-t-blue-500" corIcone="text-blue-600" />
      <MetricCard titulo="Pendentes de Aprovação" valor={pendentesAprovacao} icone={<IconRelogio className="w-6 h-6" />} corBorda="border-t-amber-500" corIcone="text-amber-600" />
      <MetricCard titulo="Aprovados" valor={totalAprovados} icone={<IconAprovado className="w-6 h-6" />} corBorda="border-t-emerald-500" corIcone="text-emerald-600" />
      <MetricCard titulo="Total de Sistemas" valor={totalSistemas} icone={<IconSistemas className="w-6 h-6" />} corBorda="border-t-indigo-600" corIcone="text-blue-900" />
      <MetricCard titulo="Categorias" valor={totalCategorias} icone={<IconPasta className="w-6 h-6" />} corBorda="border-t-cyan-700" corIcone="text-cyan-800" />
    </div>
  );
}