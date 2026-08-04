import { IconSistema, IconVer } from "../icons";
import type { Sistema, Documento } from "../../hooks/useSistemasData";

function renderBadgeStatus(status: string) {
  switch (status) {
    case "Em Produção": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Manutenção": return "bg-amber-100 text-amber-800 border-amber-200";
    default: return "bg-blue-100 text-blue-800 border-blue-200";
  }
}

interface SistemaCardProps {
  sistema: Sistema;
  documentos: Documento[];
  onVerDetalhes: () => void;
}

export default function SistemaCard({ sistema, documentos, onVerDetalhes }: SistemaCardProps) {
  const totalDocs = sistema.totalDocumentos ?? documentos.filter((d) => Number(d.sistemaId) === Number(sistema.id)).length;
  const devs = Array.isArray(sistema.desenvolvedores) ? sistema.desenvolvedores : [];
  const clientes = Array.isArray(sistema.empresasClientes) ? sistema.empresasClientes : [];
  const techs = [
    ...(sistema.tecnologiasFrontend || []),
    ...(sistema.tecnologiasBackend || []),
    ...(sistema.tecnologiasInfraestrutura || []),
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg"><IconSistema className="w-5 h-5 text-blue-900" /></div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${renderBadgeStatus(sistema.status)}`}>
            {sistema.status || "Em Desenvolvimento"}
          </span>
        </div>

        <h3 className="font-bold text-slate-800 text-base">{sistema.nome}</h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sistema.descricaoCurta || sistema.descricaoLonga || "Sem descrição disponível."}</p>

        {clientes.length > 0 && (
          <div className="mt-3">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Clientes / Empresas:</span>
            <div className="flex flex-wrap gap-1">
              {clientes.map((c, i) => <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-medium rounded border border-emerald-200">{c}</span>)}
            </div>
          </div>
        )}

        {devs.length > 0 && (
          <div className="mt-3">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Equipa Dev:</span>
            <p className="text-xs font-medium text-slate-700">{devs.join(", ")}</p>
          </div>
        )}

        {techs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {techs.map((tech, idx) => <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] rounded-md font-medium border border-slate-200">{tech}</span>)}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Ficheiros: <strong className="text-slate-700">{totalDocs}</strong></span>
        <button onClick={onVerDetalhes} className="flex items-center gap-1.5 py-1.5 px-3 bg-slate-50 hover:bg-blue-900 hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200 hover:border-blue-900">
          <IconVer />
          <span>Ver detalhes</span>
        </button>
      </div>
    </div>
  );
}