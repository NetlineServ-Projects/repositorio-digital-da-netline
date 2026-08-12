import type { Sistema } from "../../hooks/useSistemasData";

function formatarData(dataStr?: string) {
  if (!dataStr) return "-";
  const data = new Date(dataStr);
  return isNaN(data.getTime()) ? dataStr : data.toLocaleDateString("pt-PT");
}

interface SistemaFichaTecnicaProps {
  sistema: Sistema;
}

export default function SistemaFichaTecnica({ sistema }: SistemaFichaTecnicaProps) {
  const temTechs =
    (sistema.tecnologiasFrontend?.length ?? 0) > 0 ||
    (sistema.tecnologiasBackend?.length ?? 0) > 0 ||
    (sistema.tecnologiasInfraestrutura?.length ?? 0) > 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden text-xs">
      {/* Informações Principais */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Desenvolvedores
          </span>
          <p className="text-slate-800 font-medium leading-relaxed">
            {sistema.desenvolvedores?.length
              ? sistema.desenvolvedores.join(", ")
              : "Não especificado"}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Empresas Clientes
          </span>
          <p className="text-slate-800 font-medium leading-relaxed">
            {sistema.empresasClientes?.length
              ? sistema.empresasClientes.join(", ")
              : "Uso Interno"}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Datas do Projeto
          </span>
          <p className="text-slate-800 font-medium">
            <span className="text-slate-500">Início:</span> {formatarData(sistema.dataInicio)}
            <span className="mx-1.5 text-slate-300">|</span>
            <span className="text-slate-500">Entrega:</span> {formatarData(sistema.dataEntrega)}
          </p>
        </div>

        {sistema.responsavelTecnico && (
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Responsável Técnico
            </span>
            <p className="text-slate-800 font-medium">{sistema.responsavelTecnico}</p>
          </div>
        )}

        {sistema.versaoAtual && (
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Versão Atual
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {sistema.versaoAtual}
            </span>
          </div>
        )}
      </div>

      {/* Seção de Tecnologias */}
      {temTechs && (
        <div className="px-5 py-4 bg-slate-50/60 border-t border-slate-100 space-y-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Tecnologias Utilizadas
          </span>

          <div className="space-y-2.5">
            {/* Frontend */}
            {sistema.tecnologiasFrontend && sistema.tecnologiasFrontend.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <span className="font-semibold text-slate-500 min-w-[90px]">Frontend:</span>
                <div className="flex flex-wrap gap-1.5">
                  {sistema.tecnologiasFrontend.map((t, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-medium rounded-md border border-blue-200/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Backend */}
            {sistema.tecnologiasBackend && sistema.tecnologiasBackend.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <span className="font-semibold text-slate-500 min-w-[90px]">Backend:</span>
                <div className="flex flex-wrap gap-1.5">
                  {sistema.tecnologiasBackend.map((t, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-medium rounded-md border border-emerald-200/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Infraestrutura */}
            {sistema.tecnologiasInfraestrutura && sistema.tecnologiasInfraestrutura.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <span className="font-semibold text-slate-500 min-w-[90px]">Infraestrutura:</span>
                <div className="flex flex-wrap gap-1.5">
                  {sistema.tecnologiasInfraestrutura.map((t, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-[11px] font-medium rounded-md border border-purple-200/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bar de Hiperligações e Ações */}
      {(sistema.repositorioUrl || sistema.urlProducao) && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3">
          {sistema.repositorioUrl && (
            <a
              href={sistema.repositorioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Repositório
              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          )}
          {sistema.urlProducao && (
            <a
              href={sistema.urlProducao}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-900 bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg border border-blue-200/70 shadow-2xs transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Produção
              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}