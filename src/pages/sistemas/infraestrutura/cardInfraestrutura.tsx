import type { ReactNode } from "react";
import type {
  SistemaInfraestrutura,
  OpcaoHospedagem,
} from "../../../hooks/useSistemasData";
import { labelTipo } from "./constantes";

function Campo({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div>
      <span className="text-slate-400 block text-[11px]">{rotulo}</span>
      <span className="font-semibold text-slate-800">{children}</span>
    </div>
  );
}

interface Props {
  titulo: string;
  infra: SistemaInfraestrutura | null;
  servidores: OpcaoHospedagem[];
  plataformas: OpcaoHospedagem[];
  ehAdmin: boolean;
  onEditar: () => void;
}

// Cartão só de leitura: nunca mostra o valor das credenciais
export default function CardInfraestrutura({
  titulo,
  infra,
  servidores,
  plataformas,
  ehAdmin,
  onEditar,
}: Props) {
  const servidor = servidores.find(
    (s) => String(s.id) === String(infra?.servidorId ?? infra?.servidor?.id),
  );
  const plataforma = plataformas.find(
    (p) => String(p.id) === String(infra?.plataformaId ?? infra?.plataforma?.id),
  );
  const credenciais = infra?.credenciais ?? [];
  const endereco = infra?.subdominio
    ? (infra.subdominio.nomeCompleto ?? infra.subdominio.nome)
    : infra?.url;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden border-t-4 border-t-blue-900 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{titulo}</h3>
        {ehAdmin && (
          <button
            type="button"
            onClick={onEditar}
            className="text-xs font-semibold text-blue-900 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            Editar
          </button>
        )}
      </div>

      {!infra ? (
        <p className="text-xs text-slate-400 italic py-4 text-center">
          Nenhuma informação registada para o {titulo.toLowerCase()}.
        </p>
      ) : (
        <div className="space-y-3 text-xs">
          <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-3">
            <span className="text-blue-900/70 block text-[11px] font-medium">
              {infra.subdominio ? "Subdomínio" : "Endereço"}
            </span>
            <span className="font-mono font-semibold text-blue-900 break-all">
              {endereco || "—"}
            </span>
            {infra.subdominio && (
              <span className="ml-2 text-[10px] text-slate-500">
                ({infra.subdominio.tipoDns})
              </span>
            )}
          </div>

          {plataforma && <Campo rotulo="Plataforma">{plataforma.nome}</Campo>}
          {servidor && <Campo rotulo="Servidor">{servidor.nome}</Campo>}
          {!plataforma && !servidor && <Campo rotulo="Hospedagem">Não especificada</Campo>}

          <div className="pt-2 border-t border-slate-100">
            <span className="text-slate-700 font-semibold block mb-2">
              Credenciais ({credenciais.length})
            </span>
            {credenciais.length === 0 ? (
              <p className="text-slate-400 italic text-[11px]">Sem credenciais.</p>
            ) : (
              <div className="space-y-2">
                {credenciais.map((c) => (
                  <div
                    key={c.id}
                    className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center justify-between gap-2"
                  >
                    <span className="font-medium text-slate-800 truncate">{c.label}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {labelTipo(c.tipo)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}