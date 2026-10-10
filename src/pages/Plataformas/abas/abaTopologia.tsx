import EstadoVazio from "../../../components/plataformas/estadoVazio";
import { IconPlataforma } from "../../../components/icons";
import type { Plataforma } from "../../../types/plataforma";

interface AbaTopologiaProps {
  arvore: Plataforma[];
}

export default function AbaTopologia({ arvore }: AbaTopologiaProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Visualização hierárquica completa dos provedores, servidores conectados
        e serviços.
      </p>

      {arvore.length === 0 ? (
        <EstadoVazio mensagem="Nenhuma árvore de infraestrutura disponível no momento." />
      ) : (
        <div className="space-y-4">
          {arvore.map((plataforma) => (
            <div
              key={plataforma.id}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-[#18357a] rounded-xl font-bold">
                    <IconPlataforma className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">
                      {plataforma.nome}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Tipo: {plataforma.tipo}
                    </span>
                  </div>
                </div>

                {plataforma.urlPainel && (
                  <a
                    href={plataforma.urlPainel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    Abrir Painel ↗
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-blue-100">
                {plataforma.dominios && plataforma.dominios.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Domínios & DNS Vinculados
                    </span>
                    <div className="space-y-1.5">
                      {plataforma.dominios.map((dominio) => (
                        <div
                          key={dominio.id}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs"
                        >
                          <p className="font-bold text-slate-800">
                            {dominio.nome}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Subdomínios / Registos:{" "}
                            {dominio.subdominios?.length || 0}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {plataforma.servidores && plataforma.servidores.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Servidores Hospedados
                    </span>
                    <div className="space-y-1.5">
                      {plataforma.servidores.map((servidor) => (
                        <div
                          key={servidor.id}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">
                              {servidor.nome}
                            </span>
                            <span className="font-mono text-[11px] text-slate-500">
                              {servidor.ip || servidor.hostname}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {servidor.numeroCpu} vCPU • {servidor.memoriaRam}{" "}
                            {servidor.memoriaRamUnidade ?? "GB"} RAM •{" "}
                            {servidor.disco} {servidor.discoUnidade ?? "GB"}{" "}
                            Disco
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}