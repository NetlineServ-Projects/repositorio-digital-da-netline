import type { Documento } from "../../hooks/useDocumentosData";
import DocumentoLinha from "./DocumentoLinha";

interface DocumentosTabelaProps {
  documentos: Documento[];
  onAprovar: (id: number) => void;
  onEditar: (doc: Documento) => void;
  onApagar: (id: number) => void;
}

export default function DocumentosTabela({ documentos, onAprovar, onEditar, onApagar }: DocumentosTabelaProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-400 uppercase text-xs border-b border-slate-100">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Documento</th>
              <th className="py-3.5 px-4 font-semibold">Categoria</th>
              <th className="py-3.5 px-4 font-semibold">Criado Por</th>
              <th className="py-3.5 px-4 font-semibold">Data</th>
              <th className="py-3.5 px-4 font-semibold">Tamanho</th>
              <th className="py-3.5 px-4 font-semibold text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documentos.length > 0 ? (
              documentos.map((doc) => (
                <DocumentoLinha key={doc.id} doc={doc} onAprovar={onAprovar} onEditar={onEditar} onApagar={onApagar} />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">Nenhum documento encontrado no repositório.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}