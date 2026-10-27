import type { ComponentType } from "react";
import type { Sistema } from "../../hooks/useSistemasData";
import BotaoLerTexto from "./botaoLerTexto";
import CartaoIndicador, { type CartaoIndicadorProps } from "../../components/plataformas/cartaoIndicador";
import { Secao, Painel, Campo, TextoVazio } from "../../components/secaoDetalhe";
import {
  IconLinkExterno,
  IconEstado,
  IconVersao,
  IconCalendario,
  IconRepositorio,
  IconDominio,
} from "../../components/icons";
import { rotuloStatus } from "../../utils/status";

interface SistemaFichaTecnicaProps {
  sistema: Sistema;
}

function formatarData(dataStr?: string | null): string | null {
  if (!dataStr) return null;
  const data = new Date(dataStr);
  return isNaN(data.getTime()) ? dataStr : data.toLocaleDateString("pt-PT");
}

// Cor do ícone do cartão "Estado", conforme a fase do sistema
const CLASSE_ICONE_STATUS: Record<string, string> = {
  EM_PRODUCAO: "bg-emerald-50 text-emerald-700",
  MANUTENCAO: "bg-amber-50 text-amber-700",
  EM_DESENVOLVIMENTO: "bg-sky-50 text-sky-700",
};

const GRUPOS_TECNOLOGIA: {
  titulo: string;
  campo: "tecnologiasFrontend" | "tecnologiasBackend" | "tecnologiasInfraestrutura";
  classe: string;
}[] = [
  { titulo: "Frontend", campo: "tecnologiasFrontend", classe: "bg-blue-50 text-blue-800 border-blue-200/70" },
  { titulo: "Backend", campo: "tecnologiasBackend", classe: "bg-emerald-50 text-emerald-800 border-emerald-200/70" },
  { titulo: "Infraestrutura", campo: "tecnologiasInfraestrutura", classe: "bg-purple-50 text-purple-800 border-purple-200/70" },
];

function iniciais(nome: string) {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

// Endereço sem "https://" e sem a barra final, para caber numa linha
function enderecoCurto(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function LinkAcesso({
  href,
  rotulo,
  Icone,
  classeIcone,
}: {
  href: string;
  rotulo: string;
  Icone: ComponentType<{ className?: string }>;
  classeIcone: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 py-3 px-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors group"
    >
      <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${classeIcone}`}>
        <Icone className="w-4 h-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">{rotulo}</span>
        <span className="block text-sm font-medium text-slate-700 truncate group-hover:text-blue-900">
          {enderecoCurto(href)}
        </span>
      </span>
      <IconLinkExterno className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-900 shrink-0" />
    </a>
  );
}

export default function SistemaFichaTecnica({ sistema }: SistemaFichaTecnicaProps) {
  const dataInicio = formatarData(sistema.dataInicio);
  const dataEntrega = formatarData(sistema.dataEntrega);

  const urlProducao = sistema.urlsAmbientes?.find((u) => u.ambiente === "PRODUCAO")?.url;
  const urlTestes = sistema.urlsAmbientes?.find((u) => u.ambiente === "TESTES")?.url;
  const temAcessos = Boolean(sistema.repositorioUrl || urlProducao || urlTestes);

  const gruposComTecnologias = GRUPOS_TECNOLOGIA.filter((g) => (sistema[g.campo]?.length ?? 0) > 0);
  const desenvolvedores = sistema.desenvolvedores ?? [];
  const clientes = sistema.empresasClientes ?? [];

  const indicadores: CartaoIndicadorProps[] = [
    {
      // Nos telemóveis os cartões ficam 2 a 2: letra um pouco menor para o valor caber
      valor: <span className="max-sm:text-xs">{rotuloStatus(sistema.status)}</span>,
      rotulo: "Estado",
      valorTexto: true,
      Icone: IconEstado,
      classeIcone: CLASSE_ICONE_STATUS[sistema.status] ?? "bg-sky-50 text-sky-700",
    },
    { valor: sistema.versaoAtual || "—", rotulo: "Versão atual", Icone: IconVersao },
    { valor: <span className="max-sm:text-base">{dataInicio ?? "—"}</span>, rotulo: "Início", Icone: IconCalendario },
    { valor: <span className="max-sm:text-base">{dataEntrega ?? "—"}</span>, rotulo: "Entrega", Icone: IconCalendario },
  ];

  return (
    <div className="space-y-8">
      {/* ================= INDICADORES ================= */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {indicadores.map((indicador) => (
          <CartaoIndicador key={indicador.rotulo} {...indicador} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ================= COLUNA PRINCIPAL ================= */}
        <div className="lg:col-span-2 space-y-6">
          <Secao
            titulo="Sobre o sistema"
            acao={sistema.descricaoLonga ? <BotaoLerTexto texto={sistema.descricaoLonga} /> : undefined}
          >
            <Painel className="space-y-3">
              {sistema.descricaoCurta || sistema.descricaoLonga ? (
                <>
                  {sistema.descricaoCurta && (
                    <p className="text-base font-semibold text-slate-800 leading-snug">{sistema.descricaoCurta}</p>
                  )}
                  {sistema.descricaoLonga && (
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {sistema.descricaoLonga}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm">
                  <TextoVazio>Este sistema ainda não tem descrição.</TextoVazio>
                </p>
              )}
            </Painel>
          </Secao>

          <Secao titulo="Tecnologias">
            <Painel>
              {gruposComTecnologias.length === 0 ? (
                <p className="text-sm">
                  <TextoVazio>Sem tecnologias registadas.</TextoVazio>
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {gruposComTecnologias.map((grupo) => (
                    <div key={grupo.campo} className="space-y-2.5">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{grupo.titulo}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {sistema[grupo.campo]?.map((tech, i) => (
                          <span
                            key={`${tech}-${i}`}
                            className={`px-2.5 py-1 text-xs font-medium rounded-md border ${grupo.classe}`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Painel>
          </Secao>
        </div>

        {/* ================= COLUNA LATERAL ================= */}
        <div className="space-y-6">
          <Secao titulo="Equipa e cliente">
            <Painel>
              <dl className="space-y-5">
                <Campo rotulo="Responsável técnico">
                  {sistema.responsavelTecnico || <TextoVazio>Não definido</TextoVazio>}
                </Campo>

                <div>
                  <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Desenvolvedores{desenvolvedores.length > 0 && ` (${desenvolvedores.length})`}
                  </dt>
                  <dd className="mt-2">
                    {desenvolvedores.length === 0 ? (
                      <span className="text-sm">
                        <TextoVazio>Não especificado</TextoVazio>
                      </span>
                    ) : (
                      <ul className="space-y-2">
                        {desenvolvedores.map((nome) => (
                          <li key={nome} className="flex items-center gap-2.5 min-w-0">
                            <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-900 text-[10px] font-bold flex items-center justify-center shrink-0">
                              {iniciais(nome)}
                            </span>
                            <span className="text-sm font-medium text-slate-700 truncate">{nome}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Clientes</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {clientes.length === 0 ? (
                      <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-600">
                        Uso interno
                      </span>
                    ) : (
                      clientes.map((cliente) => (
                        <span
                          key={cliente}
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#d99b26]/10 text-[#8a5f0e] border border-[#d99b26]/25"
                        >
                          {cliente}
                        </span>
                      ))
                    )}
                  </dd>
                </div>

                {sistema.criadoPor && <Campo rotulo="Registado por">{sistema.criadoPor.nome}</Campo>}
              </dl>
            </Painel>
          </Secao>

          <Secao titulo="Acessos e ambientes">
            <Painel className="py-2">
              {temAcessos ? (
                <div className="divide-y divide-slate-100">
                  {urlProducao && (
                    <LinkAcesso
                      href={urlProducao}
                      rotulo="Produção"
                      Icone={IconDominio}
                      classeIcone="bg-emerald-50 text-emerald-700"
                    />
                  )}
                  {urlTestes && (
                    <LinkAcesso href={urlTestes} rotulo="Testes" Icone={IconDominio} classeIcone="bg-sky-50 text-sky-700" />
                  )}
                  {sistema.repositorioUrl && (
                    <LinkAcesso
                      href={sistema.repositorioUrl}
                      rotulo="Repositório"
                      Icone={IconRepositorio}
                      classeIcone="bg-slate-100 text-slate-700"
                    />
                  )}
                </div>
              ) : (
                <p className="text-sm py-3">
                  <TextoVazio>Sem endereços nem repositório registados.</TextoVazio>
                </p>
              )}
            </Painel>
          </Secao>
        </div>
      </div>
    </div>
  );
}
