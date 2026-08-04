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
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
      <div>
        <span className="font-bold text-slate-600 uppercase tracking-wider block mb-1">
          Desenvolvedores:
        </span>
        <p className="text-slate-900 font-medium">
          {sistema.desenvolvedores?.length
            ? sistema.desenvolvedores.join(", ")
            : "Não especificado"}
        </p>
      </div>

      <div>
        <span className="font-bold text-slate-600 uppercase tracking-wider block mb-1">
          Empresas Clientes:
        </span>
        <p className="text-slate-900 font-medium">
          {sistema.empresasClientes?.length
            ? sistema.empresasClientes.join(", ")
            : "Uso Interno"}
        </p>
      </div>

      <div>
        <span className="font-bold text-slate-600 uppercase tracking-wider block mb-1">
          Datas do Projeto:
        </span>
        <p className="text-slate-900 font-medium">
          Início: {formatarData(sistema.dataInicio)} | Entrega: {formatarData(sistema.dataEntrega)}
        </p>
      </div>

      {sistema.responsavelTecnico && (
        <div>
          <span className="font-bold text-slate-600 uppercase tracking-wider block mb-1">
            Responsável Técnico:
          </span>
          <p className="text-slate-900 font-medium">{sistema.responsavelTecnico}</p>
        </div>
      )}

      {sistema.versaoAtual && (
        <div>
          <span className="font-bold text-slate-600 uppercase tracking-wider block mb-1">
            Versão Atual:
          </span>
          <p className="text-slate-900 font-medium">{sistema.versaoAtual}</p>
        </div>
      )}

      {/* Seção de Tecnologias Divididas por Categoria */}
      {temTechs && (
        <div className="md:col-span-3 pt-2 border-t border-slate-100 flex flex-col gap-3">
          <span className="font-bold text-slate-600 uppercase tracking-wider block">
            Tecnologias Utilizadas:
          </span>

          <div className="flex flex-col gap-2">
            {/* Frontend */}
            {sistema.tecnologiasFrontend && sistema.tecnologiasFrontend.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500 w-24">Frontend:</span>
                <div className="flex flex-wrap gap-1.5">
                  {sistema.tecnologiasFrontend.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-blue-50 text-blue-700 font-medium rounded-md border border-blue-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Backend */}
            {sistema.tecnologiasBackend && sistema.tecnologiasBackend.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500 w-24">Backend:</span>
                <div className="flex flex-wrap gap-1.5">
                  {sistema.tecnologiasBackend.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-medium rounded-md border border-emerald-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Infraestrutura / BD */}
            {sistema.tecnologiasInfraestrutura && sistema.tecnologiasInfraestrutura.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500 w-24">Infraestrutura:</span>
                <div className="flex flex-wrap gap-1.5">
                  {sistema.tecnologiasInfraestrutura.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-purple-50 text-purple-700 font-medium rounded-md border border-purple-200"
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

      {(sistema.repositorioUrl || sistema.urlProducao) && (
        <div className="md:col-span-3 flex gap-4 pt-2">
          {sistema.repositorioUrl && (
            <a
              href={sistema.repositorioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline font-semibold flex items-center gap-1"
            >
              Repositório →
            </a>
          )}
          {sistema.urlProducao && (
            <a
              href={sistema.urlProducao}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline font-semibold flex items-center gap-1"
            >
              Produção →
            </a>
          )}
        </div>
      )}
    </div>
  );
}