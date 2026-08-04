import type { Sistema, Documento } from "../../hooks/useSistemasData";
import SistemaCard from "./SistemaCard";

interface SistemasGridProps {
  sistemas: Sistema[];
  documentos: Documento[];
  onSelecionar: (sistema: Sistema) => void;
}

export default function SistemasGrid({ sistemas, documentos, onSelecionar }: SistemasGridProps) {
  if (sistemas.length === 0) {
    return <div className="col-span-full bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-400 text-sm">Nenhum sistema encontrado com os termos pesquisados.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sistemas.map((sis) => (
        <SistemaCard key={sis.id} sistema={sis} documentos={documentos} onVerDetalhes={() => onSelecionar(sis)} />
      ))}
    </div>
  );
}