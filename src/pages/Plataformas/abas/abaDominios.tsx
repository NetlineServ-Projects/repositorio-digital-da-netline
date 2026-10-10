import AcoesItem from "../../../components/plataformas/acoesItem";
import EstadoVazio from "../../../components/plataformas/estadoVazio";
import type { AoEditarItem, AoEliminarItem } from "../../../types/plataformaTipos";
import type {
  Servidor,
  Dominio,
  Subdominio,
} from "../../../types/plataforma";

interface AbaDominiosProps {
  dominios: Dominio[];
  subdominios: Subdominio[];
  servidores: Servidor[];
  ehAdmin: boolean;
  aoEditar: AoEditarItem;
  aoEliminar: AoEliminarItem;
}

export default function AbaDominios({
  dominios,
  subdominios,
  servidores,
  ehAdmin,
  aoEditar,
  aoEliminar,
}: AbaDominiosProps) {
  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500">
        Gerenciamento de domínios corporativos e apontamentos de registos DNS
        (A, CNAME, etc.)
      </p>

      {dominios.length === 0 ? (
        <EstadoVazio mensagem="Nenhum domínio cadastrado." />
      ) : (
        <div className="space-y-5">
          {dominios.map((dominio) => {
            const subdominiosDoDominio = subdominios.filter(
              (s) => s.dominioId === dominio.id
            );

            const dataExpiracaoFormatada = dominio.dataExpiracao
              ? new Date(dominio.dataExpiracao).toLocaleDateString("pt-PT")
              : "-";

            return (
              <div
                key={dominio.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden"
              >
                {/* Cabeçalho do domínio */}
                <div className="p-5 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      DOMÍNIO PRINCIPAL
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <h3 className="text-base font-extrabold text-slate-800">
                        {dominio.nome}
                      </h3>
                      <span className="text-[11px] font-medium px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                        Expira em: {dataExpiracaoFormatada}
                      </span>
                    </div>
                  </div>

                  {ehAdmin && (
                    <AcoesItem
                      tituloEditar="Editar domínio"
                      tituloEliminar="Eliminar domínio"
                      onEditar={() => aoEditar("dominio", dominio)}
                      onEliminar={() =>
                        aoEliminar("dominio", dominio.id, dominio.nome)
                      }
                    />
                  )}
                </div>

                {/* Registos DNS do domínio */}
                <div className="p-5">
                  {subdominiosDoDominio.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      Nenhum registo ou subdomínio configurado neste domínio.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 pb-2">
                          <tr>
                            <th className="py-2">Registo / Subdomínio</th>
                            <th className="py-2">Tipo DNS</th>
                            <th className="py-2">Destino / Apontamento</th>
                            {ehAdmin && (
                              <th className="py-2 text-right">Ação</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {subdominiosDoDominio.map((subdominio) => {
                            const nomeCompleto =
                              subdominio.nome === "@"
                                ? dominio.nome
                                : `${subdominio.nome}.${dominio.nome}`;

                            const servidorDestino = servidores.find(
                              (s) => s.id === subdominio.servidorId
                            );

                            return (
                              <tr
                                key={subdominio.id}
                                className="hover:bg-slate-50/50"
                              >
                                <td className="py-2.5 font-bold text-slate-800">
                                  {nomeCompleto}
                                  <span className="text-slate-400 font-normal ml-1">
                                    ({subdominio.nome})
                                  </span>
                                </td>
                                <td className="py-2.5">
                                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-mono font-bold rounded text-[11px]">
                                    {subdominio.tipoDns}
                                  </span>
                                </td>
                                <td className="py-2.5 font-mono text-slate-600">
                                  {servidorDestino ? (
                                    <span className="text-emerald-700 font-medium">
                                      {servidorDestino.nome} (
                                      {servidorDestino.ip ||
                                        servidorDestino.hostname}
                                      )
                                    </span>
                                  ) : (
                                    subdominio.destino || "-"
                                  )}
                                </td>
                                {ehAdmin && (
                                  <td className="py-2.5 text-right">
                                    <AcoesItem
                                      compacto
                                      tituloEditar="Editar registo"
                                      tituloEliminar="Eliminar registo"
                                      onEditar={() =>
                                        aoEditar("subdominio", subdominio)
                                      }
                                      onEliminar={() =>
                                        aoEliminar(
                                          "subdominio",
                                          subdominio.id,
                                          nomeCompleto
                                        )
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
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}