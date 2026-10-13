import AbaServidores from "../abas/abaServidores";
import AbaDominios from "../abas/abaDominios";
import AbaImagens from "../abas/abaImagens";

import {
  IconLinkExterno,
  IconCaneta,
  IconLixeira,
} from "../../../components/icons";
import {
  ROTULOS_TIPO_PLATAFORMA,
  ROTULOS_FORNECEDOR_CONTAINER,
} from "../../../types/plataformaConstantes";
import type {
  AoEditarItem,
  AoEliminarItem,
} from "../../../types/plataformaTipos";
import type {
  Plataforma,
  Servidor,
  Dominio,
  Subdominio,
  ImagemContainer,
} from "../../../types/plataforma";

interface DetalhesPlataformaProps {
  plataforma: Plataforma;
  plataformas: Plataforma[];
  servidores: Servidor[];
  dominios: Dominio[];
  subdominios: Subdominio[];
  imagens: ImagemContainer[];
  ehAdmin: boolean;
  aoVoltar: () => void;
  aoEditar: AoEditarItem;
  aoEliminar: AoEliminarItem;
}

const BASE_CARTAO =
  "bg-white/90 backdrop-blur-md rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 p-5 border border-blue-100/80 relative overflow-hidden min-w-0 group";

function CartaoIndicador({
  valor,
  rotulo,
}: {
  valor: number | string;
  rotulo: string;
}) {
  return (
    <div className={BASE_CARTAO}>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-900 rounded-r" />
      <div className="pl-2">
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-none">
          {valor}
        </p>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-2">
          {rotulo}
        </p>
      </div>
    </div>
  );
}
function CartaoEstado({ ativo }: { ativo: boolean }) {
  return (
    <div className={`${BASE_CARTAO} flex items-center`}>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-900 rounded-r" />
      <p
        className={`pl-2 text-xl font-bold ${
          ativo ? "text-slate-800" : "text-slate-500"
        }`}
      >
        {ativo ? "Plataforma ativa" : "Plataforma desativada"}
      </p>
    </div>
  );
}
function CartaoPainel({ url }: { url?: string | null }) {
  return (
    <div className={`${BASE_CARTAO} flex items-center justify-between gap-4`}>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-900 rounded-r" />
      <div className="min-w-0 flex-1 pl-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Painel de Controlo
        </p>
        <p
          className="text-sm font-semibold text-slate-700 truncate mt-1"
          title={url ?? undefined}
        >
          {url ?? "Sem URL de painel"}
        </p>
      </div>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir painel da plataforma"
          title="Abrir painel"
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-900 hover:bg-blue-900 hover:text-white transition-all duration-200 shadow-xs"
        >
          <IconLinkExterno className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}

function CampoRegistry({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="bg-slate-50/70 hover:bg-slate-50 p-3.5 rounded-xl border border-slate-100 min-w-0 transition-colors">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        {rotulo}
      </p>
      <p
        className="text-sm font-semibold text-slate-800 mt-1 truncate"
        title={valor}
      >
        {valor}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Página                                                                    */
/* -------------------------------------------------------------------------- */

export default function DetalhesPlataforma({
  plataforma,
  plataformas,
  servidores,
  dominios,
  subdominios,
  imagens,
  ehAdmin,
  aoVoltar,
  aoEditar,
  aoEliminar,
}: DetalhesPlataformaProps) {
  const ehContainerizacao = plataforma.tipo === "CONTAINERIZACAO";
  const ehCloud = plataforma.tipo === "CLOUD_BASE_DADOS";
  const ehGestaoDominio = plataforma.tipo === "GESTAO_DOMINIO";

  const servidoresDaPlataforma = servidores.filter(
    (s) => s.plataformaId === plataforma.id,
  );
  const dominiosDaPlataforma = dominios.filter(
    (d) => d.plataformaId === plataforma.id,
  );
  const imagensDaPlataforma = imagens.filter(
    (i) => i.plataformaId === plataforma.id,
  );

  const idsDominiosDaPlataforma = new Set(
    dominiosDaPlataforma.map((d) => d.id),
  );
  const totalRegistosDns = subdominios.filter((s) =>
    idsDominiosDaPlataforma.has(s.dominioId),
  ).length;

  const indicadores: { valor: number | string; rotulo: string }[] = [];

  if (ehContainerizacao) {
    indicadores.push(
      { valor: imagensDaPlataforma.length, rotulo: "Imagens registradas" },
      {
        valor: imagensDaPlataforma.filter((i) => i.ativo).length,
        rotulo: "Imagens ativas",
      },
    );
  }
  if (ehCloud) {
    indicadores.push({
      valor: servidoresDaPlataforma.length,
      rotulo: "Servidores",
    });
  }
  if (ehGestaoDominio) {
    indicadores.push(
      { valor: dominiosDaPlataforma.length, rotulo: "Domínios" },
      { valor: totalRegistosDns, rotulo: "Registos DNS" },
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* ================= HEADER ================= */}
      <div className="bg-[#18357a] text-white p-6 sm:p-8 rounded-2xl shadow-sm space-y-5">
        <button
          onClick={aoVoltar}
          className="text-xs font-semibold text-blue-100/80 hover:text-white transition-colors cursor-pointer"
        >
          ← Voltar às plataformas
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs uppercase font-semibold text-blue-200/80 tracking-widest block mb-1">
              {ROTULOS_TIPO_PLATAFORMA[plataforma.tipo]}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold">
              {plataforma.nome}
            </h2>
          </div>

          {ehAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => aoEditar("plataforma", plataforma)}
                aria-label="Editar plataforma"
                title="Editar plataforma"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <IconCaneta className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  aoEliminar("plataforma", plataforma.id, plataforma.nome)
                }
                aria-label="Eliminar plataforma"
                title="Eliminar plataforma"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-red-500 transition-colors cursor-pointer"
              >
                <IconLixeira className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= INDICADORES ================= */}
      {(() => {
        const totalCartoes = indicadores.length + 2; // + Estado + Painel
        const grelha =
          totalCartoes >= 4
            ? "sm:grid-cols-2 lg:grid-cols-4 max-w-7xl"
            : totalCartoes === 3
              ? "sm:grid-cols-3 max-w-5xl"
              : "sm:grid-cols-2 max-w-3xl";

        return (
          <div className={`grid grid-cols-1 gap-4 mx-auto w-full ${grelha}`}>
            <CartaoEstado ativo={plataforma.ativo} />
            {indicadores.map((indicador) => (
              <CartaoIndicador key={indicador.rotulo} {...indicador} />
            ))}
            <CartaoPainel url={plataforma.urlPainel} />
          </div>
        );
      })()}

      {/* ================= REGISTRY (só containerização) ================= */}
      {ehContainerizacao && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Registry
          </h3>
          <div className="bg-white p-5 rounded-2xl border border-blue-100/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <CampoRegistry
              rotulo="Fornecedor"
              valor={
                plataforma.fornecedorContainer
                  ? ROTULOS_FORNECEDOR_CONTAINER[plataforma.fornecedorContainer]
                  : "-"
              }
            />
            <CampoRegistry
              rotulo="URL do registry"
              valor={plataforma.registryUrl ?? "-"}
            />
            <CampoRegistry
              rotulo="Namespace"
              valor={plataforma.namespace ?? "-"}
            />
            <CampoRegistry
              rotulo="Utilizador"
              valor={plataforma.registryUtilizador ?? "-"}
            />
            <CampoRegistry
              rotulo="Token"
              valor={plataforma.temTokenRegistry ? "Definido" : "Não definido"}
            />
          </div>
        </section>
      )}

      {/* ================= IMAGENS (só containerização) ================= */}
      {ehContainerizacao && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Imagens
          </h3>
          <div className="bg-white p-6 rounded-2xl border border-blue-100/80 shadow-xs">
            <AbaImagens
              imagens={imagensDaPlataforma}
              ehAdmin={ehAdmin}
              aoEditar={aoEditar}
              aoEliminar={aoEliminar}
            />
          </div>
        </section>
      )}

      {/* ================= SERVIDORES (só cloud) ================= */}
      {ehCloud && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Servidores
          </h3>
          <div className="bg-white p-6 rounded-2xl border border-blue-100/80 shadow-xs">
            <AbaServidores
              servidores={servidoresDaPlataforma}
              plataformas={plataformas}
              ehAdmin={ehAdmin}
              aoEditar={aoEditar}
              aoEliminar={aoEliminar}
            />
          </div>
        </section>
      )}

      {/* ================= DOMÍNIOS (só gestão de domínio) ================= */}
      {ehGestaoDominio && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Domínios & DNS
          </h3>
          <div className="bg-white p-6 rounded-2xl border border-blue-100/80 shadow-xs">
            <AbaDominios
              dominios={dominiosDaPlataforma}
              subdominios={subdominios}
              servidores={servidores}
              ehAdmin={ehAdmin}
              aoEditar={aoEditar}
              aoEliminar={aoEliminar}
            />
          </div>
        </section>
      )}
    </div>
  );
}
