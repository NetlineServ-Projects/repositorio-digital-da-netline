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
        <div className="space-y-6">
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
                className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                {/* Cabeçalho do Domínio com Destaque Visual */}
                <div className="px-6 py-4 bg-linear-to-r from-slate-50 via-blue-50/30 to-slate-50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Domínio Principal
                      </span>
                      <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
                        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                          {dominio.nome}
                        </h3>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100/60">
                          Expira em: {dataExpiracaoFormatada}
                        </span>
                      </div>
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

                {/* Lista de Registos DNS em formato de linhas modernas */}
                <div className="p-6">
                  {subdominiosDoDominio.length === 0 ? (
                    <div className="text-center py-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-xs text-slate-400 italic">
                        Nenhum registo ou subdomínio configurado neste domínio.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-12 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">
                        <div className="col-span-4">Registo / Subdomínio</div>
                        <div className="col-span-2">Tipo DNS</div>
                        <div className="col-span-5">Destino / Apontamento</div>
                        {ehAdmin && <div className="col-span-1 text-right">Ação</div>}
                      </div>

                      <div className="divide-y divide-slate-100">
                        {subdominiosDoDominio.map((subdominio) => {
                          const nomeCompleto =
                            subdominio.nome === "@"
                              ? dominio.nome
                              : `${subdominio.nome}.${dominio.nome}`;

                          const servidorDestino = servidores.find(
                            (s) => s.id === subdominio.servidorId
                          );

                          return (
                            <div
                              key={subdominio.id}
                              className="grid grid-cols-12 items-center py-3 px-3 rounded-xl hover:bg-slate-50/80 transition-colors text-xs"
                            >
                              <div className="col-span-4">
                                <span className="font-bold text-slate-800">
                                  {nomeCompleto}
                                </span>
                                <span className="text-slate-400 font-normal ml-1 text-[11px]">
                                  ({subdominio.nome})
                                </span>
                              </div>

                              <div className="col-span-2">
                                <span className="px-2 py-1 bg-blue-50 text-blue-800 font-mono font-bold rounded-md text-[10px] border border-blue-100">
                                  {subdominio.tipoDns}
                                </span>
                              </div>

                              <div className="col-span-5 font-mono text-slate-600 truncate pr-2">
                                {servidorDestino ? (
                                  <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                    {servidorDestino.nome} (
                                    {servidorDestino.ip ||
                                      servidorDestino.hostname}
                                    )
                                  </span>
                                ) : (
                                  subdominio.destino || "-"
                                )}
                              </div>

                              {ehAdmin && (
                                <div className="col-span-1 text-right">
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
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
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