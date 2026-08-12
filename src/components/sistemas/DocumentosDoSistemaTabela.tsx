import { IconPasta, IconDownload } from "../icons";
import type { Documento } from "../../hooks/useSistemasData";
import { formatarTamanho, obterUrlFicheiro } from "../../utils/documentos";
import { API_URL } from "../../utils/api";

interface DocumentosDoSistemaTabelaProps {
  documentos: Documento[];
  busca: string;
  onBuscaChange: (v: string) => void;
  onEditar: (doc: Documento) => void;
  onApagar: (id: number) => void;
}

export default function DocumentosDoSistemaTabela({
  documentos,
  busca,
  onBuscaChange,
  onEditar,
  onApagar,
}: DocumentosDoSistemaTabelaProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-sm">
          Documentos do Sistema ({documentos.length})
        </h3>
        <div className="w-64 relative">
          <input
            type="text"
            placeholder="Pesquisar ficheiro..."
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            className="w-full pl-3 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          />
        </div>
      </div>
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-slate-400 uppercase text-xs border-b border-slate-100">
          <tr>
            <th className="py-3.5 px-4 font-semibold">Documento</th>
            <th className="py-3.5 px-4 font-semibold">Autor</th>
            <th className="py-3.5 px-4 font-semibold">Tamanho</th>
            <th className="py-3.5 px-4 font-semibold">Data</th>
            <th className="py-3.5 px-4 font-semibold text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {documentos.length > 0 ? (
            documentos.map((doc) => (
              <tr
                key={doc.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                  <IconPasta className="text-blue-900" />
                  <span>
                    {doc.titulo || doc.nomeArquivo || "Ficheiro sem nome"}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs">
                  {doc.usuario?.nome || "Sistema"}
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-500">
                  {formatarTamanho(doc.tamanho)}
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-500">
                  {doc.dataSubmissao
                    ? new Date(doc.dataSubmissao).toLocaleDateString("pt-PT")
                    : "-"}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={obterUrlFicheiro(doc.caminho, API_URL)}
                      download={doc.nomeArquivo}
                      className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg transition-colors border border-blue-100"
                      title="Baixar ficheiro"
                    >
                      <IconDownload />
                    </a>
                    <button
                      onClick={() => onEditar(doc)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-semibold rounded-lg transition-colors border border-blue-100"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onApagar(doc.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Apagar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="text-center py-8 text-slate-400 text-xs"
              >
                Nenhum documento encontrado para este sistema.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
