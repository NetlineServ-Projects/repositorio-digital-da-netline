import { IconVer, IconCaneta, IconLixeira } from "../icons";
import type { Documento } from "../../hooks/useCategoriasData";
import { obterUrlFicheiro, formatarTamanho } from "../../utils/documentos";
import { API_URL } from "../../utils/api";

interface DocumentosDaCategoriaTabelaProps {
  documentos: Documento[];
  onEditar: (doc: Documento) => void;
  onApagar: (id: string | number, nome: string) => void;
}

const rotuloEstado: Record<string, string> = { PENDENTE: "Pendente", APROVADO: "Aprovado", REJEITADO: "Rejeitado" };
const corEstado: Record<string, string> = {
  PENDENTE: "bg-amber-100 text-amber-700",
  APROVADO: "bg-emerald-100 text-emerald-700",
  REJEITADO: "bg-red-100 text-red-700",
};

export default function DocumentosDaCategoriaTabela({ documentos, onEditar, onApagar }: DocumentosDaCategoriaTabelaProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-400 uppercase text-xs border-b border-slate-100">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Documento</th>
              <th className="py-3.5 px-4 font-semibold">Submetido Por</th>
              <th className="py-3.5 px-4 font-semibold">Tamanho</th>
              <th className="py-3.5 px-4 font-semibold">Data</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documentos.length > 0 ? (
              documentos.map((doc) => {
                const nomeFormatado = doc.titulo || doc.nomeArquivo || "Ficheiro sem nome";
                const estado = doc.estado || "APROVADO";

                return (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <span className="truncate max-w-xs" title={nomeFormatado}>{nomeFormatado}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">{doc.usuario?.nome || "Sistema"}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">{formatarTamanho(doc.tamanho)}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {doc.dataSubmissao ? new Date(doc.dataSubmissao).toLocaleDateString("pt-PT") : "-"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${corEstado[estado]}`}>{rotuloEstado[estado]}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        {doc.caminho ? (
                          <a href={obterUrlFicheiro(doc.caminho, API_URL)} target="_blank" rel="noopener noreferrer" title="Abrir Documento" className="text-slate-500 hover:text-[#18357a] transition-colors p-1">
                            <IconVer className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-slate-300 p-1 cursor-not-allowed"><IconVer className="w-4 h-4" /></span>
                        )}
                        <button type="button" title="Editar Documento" onClick={() => onEditar(doc)} className="text-slate-500 hover:text-amber-600 transition-colors p-1">
                          <IconCaneta className="w-4 h-4" />
                        </button>
                        <button type="button" title="Apagar Documento" onClick={() => onApagar(doc.id, nomeFormatado)} className="text-slate-500 hover:text-red-600 transition-colors p-1">
                          <IconLixeira className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400 text-xs">Nenhum documento encontrado nesta categoria.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}