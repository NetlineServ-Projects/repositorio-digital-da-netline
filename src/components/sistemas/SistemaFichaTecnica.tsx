import { useMemo } from "react";
import type { Sistema } from "../../hooks/useSistemasData";

interface SistemaFichaTecnicaProps {
  sistema: Sistema;
}

function formatarData(dataStr?: string): string {
  if (!dataStr) return "-";
  const data = new Date(dataStr);
  return isNaN(data.getTime()) ? dataStr : data.toLocaleDateString("pt-PT");
}

function TechGroup({ title, items, colorClasses }: { title: string; items?: string[]; colorClasses: string }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
      <span className="font-semibold text-slate-500 min-w-[100px] text-xs">{title}:</span>
      <div className="flex flex-wrap gap-1.5">
        {items.map((tech, index) => (
          <span
            key={`${tech}-${index}`}
            className={`px-2.5 py-0.5 text-[11px] font-medium rounded-md border ${colorClasses}`}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SistemaFichaTecnica({ sistema }: SistemaFichaTecnicaProps) {
  const dataInicioFormatada = useMemo(() => formatarData(sistema.dataInicio), [sistema.dataInicio]);
  const dataEntregaFormatada = useMemo(() => formatarData(sistema.dataEntrega), [sistema.dataEntrega]);

  const temTechs =
    (sistema.tecnologiasFrontend?.length ?? 0) > 0 ||
    (sistema.tecnologiasBackend?.length ?? 0) > 0 ||
    (sistema.tecnologiasInfraestrutura?.length ?? 0) > 0;

  const temDescricao = Boolean(sistema.descricaoCurta || sistema.descricaoLonga);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden text-xs">
      
      {/* 1. SEÇÃO DE DESCRIÇÃO (Fundo levemente destacado) */}
      {temDescricao && (
        <div className="p-6 bg-slate-50/50 border-b border-slate-100 space-y-3">
          {sistema.descricaoCurta && (
            <p className="text-base font-semibold text-slate-800 leading-snug">
              {sistema.descricaoCurta}
            </p>
          )}
          
          {sistema.descricaoLonga && (
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
              <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider block mb-1">
                Sobre o Sistema / Objetivo
              </span>
              <p className="text-sm text-slate-800 leading-relaxed ">
                {sistema.descricaoLonga}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. GRELHA DE METADADOS (Sub-cards organizadas) */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Desenvolvedores */}
        <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Desenvolvedores
          </span>
          <p className="text-slate-800 font-medium leading-normal text-xs">
            {sistema.desenvolvedores?.length
              ? sistema.desenvolvedores.join(", ")
              : "Não especificado"}
          </p>
        </div>

        {/* Empresas Clientes */}
        <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Empresas Clientes
          </span>
          <p className="text-slate-800 font-medium leading-normal text-xs">
            {sistema.empresasClientes?.length
              ? sistema.empresasClientes.join(", ")
              : "Uso Interno"}
          </p>
        </div>

        {/* Datas do Projeto */}
        <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Datas do Projeto
          </span>
          <p className="text-slate-800 font-medium text-xs">
            <span className="text-slate-400 font-normal">Início:</span> {dataInicioFormatada}
            <span className="mx-2 text-slate-300">|</span>
            <span className="text-slate-400 font-normal">Entrega:</span> {dataEntregaFormatada}
          </p>
        </div>

        {/* Responsável Técnico */}
        {sistema.responsavelTecnico && (
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Responsável Técnico
            </span>
            <p className="text-slate-800 font-medium text-xs">{sistema.responsavelTecnico}</p>
          </div>
        )}

        {/* Versão Atual */}
        {sistema.versaoAtual && (
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Versão Atual
            </span>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-200/70 text-slate-700 border border-slate-300/50">
                {sistema.versaoAtual}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. TECNOLOGIAS */}
      {temTechs && (
        <div className="px-6 py-4 bg-slate-50/40 border-t border-slate-100 space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Tecnologias Utilizadas
          </span>

          <div className="space-y-3">
            <TechGroup
              title="Frontend"
              items={sistema.tecnologiasFrontend}
              colorClasses="bg-blue-50 text-blue-700 border-blue-200/70"
            />
            <TechGroup
              title="Backend"
              items={sistema.tecnologiasBackend}
              colorClasses="bg-emerald-50 text-emerald-700 border-emerald-200/70"
            />
            <TechGroup
              title="Infraestrutura"
              items={sistema.tecnologiasInfraestrutura}
              colorClasses="bg-purple-50 text-purple-700 border-purple-200/70"
            />
          </div>
        </div>
      )}

      {/* 4. BOTÕES DE AÇÃO */}
      {(sistema.repositorioUrl || sistema.urlProducao) && (
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3">
          {sistema.repositorioUrl && (
            <a
              href={sistema.repositorioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-lg border border-slate-200 shadow-2xs transition-all"
            >
              <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Ver Repositório
            </a>
          )}
          {sistema.urlProducao && (
            <a
              href={sistema.urlProducao}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-lg border border-blue-200/70 shadow-2xs transition-all"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Ambiente de Produção
            </a>
          )}
        </div>
      )}
    </div>
  );
}