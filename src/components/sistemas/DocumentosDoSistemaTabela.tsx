import { IconPasta } from "../icons";
import type { Documento } from "../../hooks/useSistemasData";
import { formatarTamanho } from "../../utils/documentos";

const rotuloEstado: Record<string, string> = { PENDENTE: "Pendente", APROVADO: "Aprovado", REJEITADO: "Rejeitado" };
const corEstado: Record<string, string> = { PENDENTE: "bg-amber-100 text-amber-700", APROVADO: "bg-emerald-100 text-emerald-700", REJEITADO: "bg-red-100 text-red-700" };

interface DocumentosDoSistemaTabelaProps {
  documentos: Documento[];
  busca: string;
  onBuscaChange: (v: string) => void;
}

export default function DocumentosDoSistemaTabela({ documentos, busca, onBuscaChange }: DocumentosDoSistemaTabelaProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-sm">Documentos do Sistema ({documentos.length})</h3>
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
            <th className="py-3.5 px-4 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {documentos.length > 0 ? (
            documentos.map((doc) => {
              const estado = doc.estado || "APROVADO";
              return (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                    <IconPasta className="text-blue-900" />
                    <span>{doc.titulo || doc.nomeArquivo || "Ficheiro sem nome"}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs">{doc.usuario?.nome || "Sistema"}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{formatarTamanho(doc.tamanho)}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{doc.dataSubmissao ? new Date(doc.dataSubmissao).toLocaleDateString("pt-PT") : "-"}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${corEstado[estado]}`}>{rotuloEstado[estado]}</span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr><td colSpan={5} className="text-center py-8 text-slate-400 text-xs">Nenhum documento encontrado para este sistema.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}