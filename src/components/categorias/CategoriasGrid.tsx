import type { Categoria, Documento } from "../../hooks/useCategoriasData";
import CategoriaCard from "./CategoriaCard";

interface CategoriasGridProps {
  categorias: Categoria[];
  documentos: Documento[];
  onSelecionar: (cat: Categoria) => void;
}

function contarDocumentos(cat: Categoria, documentos: Documento[]) {
  return documentos.filter(
    (doc) =>
      doc.categoriaId === cat.id ||
      doc.categoria?.id === cat.id ||
      doc.categoria?.nome?.toLowerCase() === cat.nome.toLowerCase()
  ).length;
}

export default function CategoriasGrid({ categorias, documentos, onSelecionar }: CategoriasGridProps) {
  if (categorias.length === 0) {
    return <div className="col-span-full bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-400 text-xs">Nenhuma categoria encontrada.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {categorias.map((cat) => (
        <CategoriaCard key={cat.id} categoria={cat} totalDocs={contarDocumentos(cat, documentos)} onClick={() => onSelecionar(cat)} />
      ))}
    </div>
  );
}