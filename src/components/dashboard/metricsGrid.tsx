import MetricCard from "./metricCard";
import {
  IconDocumento,
  IconRelogio,
  IconAprovado,
  IconSistemas,
  IconPasta,
  IconPlataforma,
} from "../icons";

interface metricsGridProps {
  totalDocumentos: number;
  pendentesAprovacao?: number;
  totalAprovados: number;
  totalSistemas: number;
  totalPlataformas?: number;
  totalCategorias: number;
  ehAdmin?: boolean;
}

export default function metricsGrid({
  totalDocumentos,
  pendentesAprovacao,
  totalAprovados,
  totalSistemas,
  totalPlataformas = 0,
  totalCategorias,
  ehAdmin = false,
}: metricsGridProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${
        ehAdmin ? "xl:grid-cols-6" : "xl:grid-cols-5"
      } gap-6`}
    >
      <MetricCard
        titulo="Total de Documentos"
        valor={totalDocumentos}
        icone={<IconDocumento className="w-6 h-6" />}
        corBorda="border-t-blue-500"
        corIcone="text-blue-600"
      />
      {ehAdmin && (
        <MetricCard
          titulo="Pendentes de Aprovação"
          valor={pendentesAprovacao ?? 0}
          icone={<IconRelogio className="w-6 h-6" />}
          corBorda="border-t-amber-500"
          corIcone="text-amber-600"
        />
      )}
      <MetricCard
        titulo="Aprovados"
        valor={totalAprovados}
        icone={<IconAprovado className="w-6 h-6" />}
        corBorda="border-t-emerald-500"
        corIcone="text-emerald-600"
      />
      <MetricCard
        titulo="Total de Sistemas"
        valor={totalSistemas}
        icone={<IconSistemas className="w-6 h-6" />}
        corBorda="border-t-indigo-600"
        corIcone="text-blue-900"
      />
      <MetricCard
        titulo="Plataformas"
        valor={totalPlataformas}
        icone={<IconPlataforma className="w-6 h-6" />}
        corBorda="border-t-purple-600"
        corIcone="text-purple-700"
      />
      <MetricCard
        titulo="Categorias"
        valor={totalCategorias}
        icone={<IconPasta className="w-6 h-6" />}
        corBorda="border-t-cyan-700"
        corIcone="text-cyan-800"
      />
    </div>
  );
}