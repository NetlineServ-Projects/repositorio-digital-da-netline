import AcoesItem from "../../../components/plataformas/acoesItem";
import EstadoVazio from "../../../components/plataformas/estadoVazio";
import { ROTULOS_TIPO_PLATAFORMA } from "../../../types/plataformaConstantes";
import type { AoEditarItem, AoEliminarItem } from "../../../types/plataformaTipos";
import type {
  Plataforma,
  Servidor,
  Dominio,
} from "../../../types/plataforma";

interface AbaPlataformasProps {
  plataformas: Plataforma[];
  servidores: Servidor[];
  dominios: Dominio[];
  ehAdmin: boolean;
  aoAbrirDetalhes: (plataforma: Plataforma) => void;
  aoEditar: AoEditarItem;
  aoEliminar: AoEliminarItem;
}

export default function AbaPlataformas({
  plataformas,
  servidores,
  dominios,
  ehAdmin,
  aoAbrirDetalhes,
  aoEditar,
  aoEliminar,
}: AbaPlataformasProps) {
  if (plataformas.length === 0) {
    return <EstadoVazio mensagem="Nenhuma plataforma cadastrada." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {plataformas.map((plataforma) => {
        const totalServidores =
          plataforma._count?.servidores ??
          servidores.filter((s) => s.plataformaId === plataforma.id).length;

        const totalDominios =
          plataforma._count?.dominios ??
          dominios.filter((d) => d.plataformaId === plataforma.id).length;

        return (
          <div
            key={plataforma.id}
            role="button"
            tabIndex={0}
            onClick={() => aoAbrirDetalhes(plataforma)}
            onKeyDown={(evento) => {
              if (evento.key === "Enter") aoAbrirDetalhes(plataforma);
            }}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between gap-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border bg-slate-100 text-slate-700 border-slate-200">
                    {ROTULOS_TIPO_PLATAFORMA[plataforma.tipo]}
                  </span>
                  <h3 className="text-base font-bold text-slate-800 mt-2">
                    {plataforma.nome}
                  </h3>
                </div>
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    plataforma.ativo ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                  title={plataforma.ativo ? "Ativa" : "Inativa"}
                />
              </div>

              {plataforma.urlPainel && (
                <a
                  href={plataforma.urlPainel}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(evento) => evento.stopPropagation()}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium truncate"
                >
                  🔗 {plataforma.urlPainel}
                </a>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                <div>
                  Servidores:{" "}
                  <span className="font-bold text-slate-800">
                    {totalServidores}
                  </span>
                </div>
                <div>
                  Domínios:{" "}
                  <span className="font-bold text-slate-800">
                    {totalDominios}
                  </span>
                </div>
              </div>
            </div>

            {ehAdmin && (
              <div
                className="flex items-center justify-end pt-2 border-t border-slate-100"
                onClick={(evento) => evento.stopPropagation()}
              >
                <AcoesItem
                  tituloEditar="Editar plataforma"
                  tituloEliminar="Eliminar plataforma"
                  onEditar={() => aoEditar("plataforma", plataforma)}
                  onEliminar={() =>
                    aoEliminar("plataforma", plataforma.id, plataforma.nome)
                  }
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}