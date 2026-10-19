import type { KeyboardEvent, MouseEvent } from "react";
import AcoesItem from "../../../components/plataformas/acoesItem";
import EstadoVazio from "../../../components/plataformas/estadoVazio";
import type { ComponenteIcone } from "../../../components/plataformas/botaoAba";
import {
  IconImagem,
  IconDatabase,
  IconDominio,
} from "../../../components/icons";
import { ROTULOS_TIPO_PLATAFORMA } from "../../../types/plataformaConstantes";
import type {
  Plataforma,
  Servidor,
  Dominio,
  ImagemContainer,
  TipoPlataforma,
} from "../../../types/plataforma";

/* -------------------------------------------------------------------------- */
/*  Configuração por tipo                                                     */
/*  Cada tipo define o seu ícone e as métricas que fazem sentido mostrar.     */
/*                                                                            */
/*  Tipado com Record<TipoPlataforma, ...>: se um dia adicionar um tipo novo, */
/*  o TypeScript obriga a configurá-lo aqui.                                  */
/* -------------------------------------------------------------------------- */

type Metrica = "servidores" | "dominios" | "imagens";

interface ConfigTipo {
  Icone: ComponenteIcone;
  metricas: Metrica[];
}

const CONFIG_POR_TIPO: Record<TipoPlataforma, ConfigTipo> = {
  CONTAINERIZACAO: {
    Icone: IconImagem,
    metricas: ["imagens"],
  },
  CLOUD_BASE_DADOS: {
    Icone: IconDatabase,
    metricas: ["servidores"],
  },
  GESTAO_DOMINIO: {
    Icone: IconDominio,
    metricas: ["dominios"],
  },
};

const ROTULOS_METRICA: Record<Metrica, string> = {
  servidores: "Servidores",
  dominios: "Domínios",
  imagens: "Imagens",
};

/* -------------------------------------------------------------------------- */
/*  Subcomponentes                                                            */
/* -------------------------------------------------------------------------- */

function BlocoMetrica({ valor, rotulo }: { valor: number; rotulo: string }) {
  return (
    <div className="bg-slate-50/80 rounded-xl p-3 text-center flex flex-col items-center justify-center">
      <span className="text-base font-extrabold text-slate-800">{valor}</span>
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
        {rotulo}
      </span>
    </div>
  );
}

interface CartaoPlataformaProps {
  plataforma: Plataforma;
  totais: Record<Metrica, number>;
  aoAbrirDetalhes: (plataforma: Plataforma) => void;
}

function CartaoPlataforma({
  plataforma,
  totais,
  aoAbrirDetalhes,
}: CartaoPlataformaProps) {
  const { Icone, metricas } = CONFIG_POR_TIPO[plataforma.tipo];
  const inativa = !plataforma.ativo;

  const abrirDetalhes = () => aoAbrirDetalhes(plataforma);

  const aoPressionarTecla = (e: KeyboardEvent<HTMLDivElement>) => {
    // Ignora teclas vindas dos botões internos.
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrirDetalhes();
    }
  };

  const impedirPropagacao = (e: MouseEvent) => e.stopPropagation();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={abrirDetalhes}
      onKeyDown={aoPressionarTecla}
      aria-label={`Ver detalhes da plataforma ${plataforma.nome}`}
      className="bg-white rounded-2xl border border-slate-100 border-l-4 border-l-blue-900 p-5 shadow-xs hover:shadow-md transition-all flex flex-col gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900/40"
    >
      {/* Topo: cresce e empurra métricas e rodapé para o fundo,
          assim todos os cartões ficam alinhados. */}
      <div className={`flex-1 space-y-3 ${inativa ? "opacity-60" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-sm font-bold text-slate-800 leading-snug line-clamp-2"
            title={plataforma.nome}
          >
            {plataforma.nome}
          </h3>
          <div className="p-2 rounded-xl bg-slate-50 text-slate-400 shrink-0">
            <Icone className="w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-100/60">
            {ROTULOS_TIPO_PLATAFORMA[plataforma.tipo]}
          </span>
          {inativa && (
            <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
              Inativa
            </span>
          )}
        </div>
      </div>

      {/* Métricas: só as que fazem sentido para este tipo */}
      {metricas.length > 0 && (
        <div
          className={`grid gap-2 ${
            metricas.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {metricas.map((m) => (
            <BlocoMetrica key={m} valor={totais[m]} rotulo={ROTULOS_METRICA[m]} />
          ))}
        </div>
      )}

      {/* Rodapé: só "Ver". Editar e eliminar ficam na página de detalhes. */}
      <div
        className="flex items-center justify-end pt-2 border-t border-slate-100"
        onClick={impedirPropagacao}
      >
        <AcoesItem
          tituloVer="Ver detalhes da plataforma"
          onVer={abrirDetalhes}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Aba                                                                       */
/* -------------------------------------------------------------------------- */

interface AbaPlataformasProps {
  plataformas: Plataforma[];
  servidores: Servidor[];
  dominios: Dominio[];
  imagens: ImagemContainer[];
  aoAbrirDetalhes: (plataforma: Plataforma) => void;
}

export default function AbaPlataformas({
  plataformas,
  servidores,
  dominios,
  imagens,
  aoAbrirDetalhes,
}: AbaPlataformasProps) {
  if (plataformas.length === 0) {
    return <EstadoVazio mensagem="Nenhuma plataforma cadastrada." />;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
      {plataformas.map((plataforma) => {
        const totais: Record<Metrica, number> = {
          servidores:
            plataforma.totais?.servidores ??
            servidores.filter((s) => s.plataformaId === plataforma.id).length,
          dominios:
            plataforma.totais?.dominios ??
            dominios.filter((d) => d.plataformaId === plataforma.id).length,
          imagens:
            plataforma.totais?.imagens ??
            imagens.filter((i) => i.plataformaId === plataforma.id).length,
        };

        return (
          <CartaoPlataforma
            key={plataforma.id}
            plataforma={plataforma}
            totais={totais}
            aoAbrirDetalhes={aoAbrirDetalhes}
          />
        );
      })}
    </div>
  );
}