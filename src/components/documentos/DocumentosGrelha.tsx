import type { Documento } from "../../hooks/useDocumentosData";
import DocumentoCard from "./DocumentoCard";

interface DocumentosGrelhaProps {
  documentos: Documento[];
  onAprovar: (id: number) => void;
  onEditar: (doc: Documento) => void;
  onApagar: (id: number) => void;
}

export default function DocumentosGrelha({ documentos, onAprovar, onEditar, onApagar }: DocumentosGrelhaProps) {
  if (documentos.length === 0) {
    return (
      <div className="col-span-full bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-400">
        Nenhum documento encontrado.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documentos.map((doc) => (
        <DocumentoCard key={doc.id} doc={doc} onAprovar={onAprovar} onEditar={onEditar} onApagar={onApagar} />
      ))}
    </div>
  );
}