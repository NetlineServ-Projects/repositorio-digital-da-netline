import AcoesItem from "../../../components/plataformas/acoesItem";
import EstadoVazio from "../../../components/plataformas/estadoVazio";
import type {
  AoEditarItem,
  AoEliminarItem,
} from "../../../types/plataformaTipos";
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
          <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-5 py-4">Servidor</th>
              <th className="px-5 py-4">Endereço IP</th>
              <th className="px-5 py-4">Recursos (CPU / RAM / Disco)</th>
              <th className="px-5 py-4">Sistema Operativo</th>
              <th className="px-5 py-4">Localização</th>
              <th className="px-5 py-4">Plataforma</th>
              <th className="px-5 py-4 text-right">Ações</th>
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
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center font-bold text-xs shrink-0">
                        SRV
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">
                          {servidor.nome}
                        </p>
                        <p className="text-slate-400 font-mono text-[11px]">
                          {servidor.hostname}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 font-mono text-slate-600">
                    {servidor.ip || "Protegido"}
                  </td>

                  <td className="px-5 py-4">
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

                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-800">
                      {servidor.sistemaOperativo}
                    </p>
                    {servidor.versaoSo && (
                      <p className="text-slate-400 text-[11px]">
                        {servidor.versaoSo}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-800">
                      {servidor.regiao || "-"}
                    </p>
                    {servidor.cloud && (
                      <p className="text-slate-400 text-[11px]">
                        {servidor.cloud}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                      {nomePlataforma}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    {ehAdmin ? (
                      <AcoesItem
                        tituloEditar="Editar servidor"
                        tituloEliminar="Eliminar servidor"
                        onEditar={() => aoEditar("servidor", servidor)}
                        onEliminar={() =>
                          aoEliminar("servidor", servidor.id, servidor.nome)
                        }
                      />
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
