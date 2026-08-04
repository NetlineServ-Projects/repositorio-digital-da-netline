import type { Documento } from "../../hooks/useDashboardData";

interface DocumentosRecentesProps {
  documentos: Documento[];
  onVerTodos: () => void;
}

const rotuloEstado: Record<string, string> = {
  PENDENTE: "Pendente",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
};

const corEstado: Record<string, string> = {
  PENDENTE: "bg-amber-100 text-amber-700",
  APROVADO: "bg-emerald-100 text-emerald-700",
  REJEITADO: "bg-red-100 text-red-700",
};

export default function DocumentosRecentes({ documentos, onVerTodos }: DocumentosRecentesProps) {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">Documentos Recentes</h3>
        <button onClick={onVerTodos} className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
          Ver Todos
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-400 uppercase text-xs">
            <tr>
              <th className="py-3 px-4 font-semibold">Nome</th>
              <th className="py-3 px-4 font-semibold">Categoria</th>
              <th className="py-3 px-4 font-semibold">Data</th>
              <th className="py-3 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documentos.length > 0 ? (
              documentos.map((doc) => {
                const estado = doc.estado || "APROVADO";
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-800 truncate max-w-xs" title={doc.titulo}>
                      {doc.titulo || doc.nomeArquivo || "Documento sem nome"}
                    </td>
                    <td className="py-3 px-4">{doc.categoria?.nome || "Geral"}</td>
                    <td className="py-3 px-4 text-xs">
                      {doc.dataSubmissao ? new Date(doc.dataSubmissao).toLocaleDateString("pt-PT") : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${corEstado[estado]}`}>
                        {rotuloEstado[estado]}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-slate-400 text-xs">
                  Nenhum documento registado no repositório.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}