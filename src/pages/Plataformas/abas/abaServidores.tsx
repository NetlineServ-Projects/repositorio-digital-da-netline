import AcoesItem from "../../../components/plataformas/acoesItem";
import EstadoVazio from "../../../components/plataformas/estadoVazio";
import type { AoEditarItem, AoEliminarItem } from "../../../types/plataformaTipos";
import type { Plataforma, Servidor } from "../../../types/plataforma";

interface AbaServidoresProps {
  servidores: Servidor[];
  plataformas: Plataforma[];
  ehAdmin: boolean;
  aoEditar: AoEditarItem;
  aoEliminar: AoEliminarItem;
}

export default function AbaServidores({
  servidores,
  plataformas,
  ehAdmin,
  aoEditar,
  aoEliminar,
}: AbaServidoresProps) {
  if (servidores.length === 0) {
    return <EstadoVazio mensagem="Nenhum servidor cadastrado." />;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-5 py-3.5">Servidor</th>
              <th className="px-5 py-3.5">Endereço IP</th>
              <th className="px-5 py-3.5">Recursos (CPU / RAM / Disco)</th>
              <th className="px-5 py-3.5">Sistema Operativo</th>
              <th className="px-5 py-3.5">Plataforma</th>
              {ehAdmin && <th className="px-5 py-3.5 text-right">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {servidores.map((servidor) => {
              const nomePlataforma =
                servidor.plataforma?.nome ??
                plataformas.find((p) => p.id === servidor.plataformaId)?.nome ??
                "-";

              return (
                <tr
                  key={servidor.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-slate-800 text-sm">
                      {servidor.nome}
                    </p>
                    <p className="text-slate-400 font-mono text-[11px]">
                      {servidor.hostname}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-600">
                    {servidor.ip || "Protegido"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-800">
                      {servidor.numeroCpu} vCPU
                    </span>
                    {" • "}
                    <span>
                      {servidor.memoriaRam} {servidor.memoriaRamUnidade ?? "GB"}{" "}
                      RAM
                    </span>
                    {" • "}
                    <span>
                      {servidor.disco} {servidor.discoUnidade ?? "GB"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-800">
                      {servidor.sistemaOperativo}
                    </p>
                    {servidor.versaoSo && (
                      <p className="text-slate-400 text-[11px]">
                        {servidor.versaoSo}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                      {nomePlataforma}
                    </span>
                  </td>
                  {ehAdmin && (
                    <td className="px-5 py-3.5 text-right">
                      <AcoesItem
                        tituloEditar="Editar servidor"
                        tituloEliminar="Eliminar servidor"
                        onEditar={() => aoEditar("servidor", servidor)}
                        onEliminar={() =>
                          aoEliminar("servidor", servidor.id, servidor.nome)
                        }
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}