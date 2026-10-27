import { Secao, Campo } from "../../../components/secaoDetalhe";
import CartaoIndicador, { type CartaoIndicadorProps } from "../../../components/plataformas/cartaoIndicador";
import BotaoIconeCabecalho from "../../../components/plataformas/botaoIconeCabecalho";
import AbaDominios from "../abas/abaDominios";
import AbaImagens from "../abas/abaImagens";
import SegredoRevelavel from "../../../components/segredoRevelavel";
import LogotipoPlataforma from "../../../components/plataformas/logotipoPlataforma";
import CartaoServidor from "../../../components/plataformas/cartaoServidor";
import CartaoSistemaHospedado from "../../../components/plataformas/cartaoSistemaHospedado";
import { revelarTokenPlataforma } from "../../../hooks/usePlataformasData";
import {
  IconLinkExterno,
  IconCaneta,
  IconLixeira,
  IconServer,
  IconImagem,
  IconDominio,
  IconRede,
  IconSistemas,
  IconEstado,
} from "../../../components/icons";
import { ROTULOS_TIPO_PLATAFORMA } from "../../../types/plataformaConstantes";
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
  servidores: Servidor[];
  dominios: Dominio[];
  subdominios: Subdominio[];
  imagens: ImagemContainer[];
  ehAdmin: boolean;
  aoVoltar: () => void;
  aoEditar: AoEditarItem;
  aoEliminar: AoEliminarItem;
}

/* -------------------------------------------------------------------------- */
/*  Subcomponentes                                                            */
/* -------------------------------------------------------------------------- */


function formatarData(iso?: string) {
  return iso ? new Date(iso).toLocaleDateString("pt-PT") : "-";
}

/* -------------------------------------------------------------------------- */
/*  Página                                                                    */
/* -------------------------------------------------------------------------- */

export default function DetalhesPlataforma({
  plataforma,
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
  const ehGestaoDominio = plataforma.tipo === "GESTAO_DOMINIO";

  const servidoresDaPlataforma = servidores.filter((s) => s.plataformaId === plataforma.id);
  const dominiosDaPlataforma = dominios.filter((d) => d.plataformaId === plataforma.id);
  const imagensDaPlataforma = imagens.filter((i) => i.plataformaId === plataforma.id);
  const idsDominios = new Set(dominiosDaPlataforma.map((d) => d.id));
  const totalRegistosDns = subdominios.filter((s) => idsDominios.has(s.dominioId)).length;

  // Servidores: só a Cloud os aloja, e só se mostram se existirem. Uma cloud sem servidores
  // (ex: Vercel) é ela própria o alojamento; o que interessa são os sistemas lá hospedados.
  const mostraServidores = plataforma.tipo === "CLOUD_BASE_DADOS" && servidoresDaPlataforma.length > 0;
  // Registos antigos: servidores criados em containerização antes da regra existir
  const servidoresForaDoLugar = ehContainerizacao ? servidoresDaPlataforma : [];
  const sistemasHospedados = plataforma.sistemasHospedados ?? [];

  const indicadores: CartaoIndicadorProps[] = [
    ...(ehGestaoDominio
      ? [
          { valor: dominiosDaPlataforma.length, rotulo: "Domínios", Icone: IconDominio },
          { valor: totalRegistosDns, rotulo: "Registos DNS", Icone: IconRede },
        ]
      : [
          ...(ehContainerizacao
            ? [{ valor: imagensDaPlataforma.length, rotulo: "Imagens", Icone: IconImagem }]
            : []),
          ...(mostraServidores
            ? [{ valor: servidoresDaPlataforma.length, rotulo: "Servidores", Icone: IconServer }]
            : []),
          { valor: plataforma.totais?.sistemas ?? sistemasHospedados.length, rotulo: "Sistemas", Icone: IconSistemas },
        ]),
    // O estado fica num cartão, junto dos números, e não no cabeçalho
    {
      valor: plataforma.ativo ? "Ativa" : "Desativada",
      rotulo: "Estado",
      Icone: IconEstado,
      classeIcone: plataforma.ativo ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500",
    },
  ];
  // Número ímpar de cartões: abaixo de lg o último ocupa a linha toda, para não ficar sozinho a meio
  const ultimoIndicadorInteiro =
    indicadores.length % 2 === 1 ? "[&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1" : "";
  const colunasIndicadores: Record<number, string> = {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "xl:grid-cols-4", // a 1024px (com o menu lateral) 4 cartões ficam apertados
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ================= CABEÇALHO ================= */}
      <div className="bg-[#18357a] text-white rounded-2xl shadow-sm">
        <div className="p-5 sm:p-8 space-y-5">
          <button
            onClick={aoVoltar}
            className="text-xs font-semibold text-blue-100/80 hover:text-white transition-colors cursor-pointer"
          >
            ← Voltar às plataformas
          </button>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
            <div className="flex items-center gap-4 min-w-0 max-w-full">
              <LogotipoPlataforma nome={plataforma.nome} logotipo={plataforma.logotipo} tamanho="lg" />
              <div className="min-w-0">
                <span className="text-xs uppercase font-semibold text-blue-200/80 tracking-widest block mb-1">
                  {ROTULOS_TIPO_PLATAFORMA[plataforma.tipo]}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold break-words lg:truncate">{plataforma.nome}</h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {plataforma.urlPainel && (
                <BotaoIconeCabecalho rotulo="Abrir painel" Icone={IconLinkExterno} href={plataforma.urlPainel} />
              )}
              {ehAdmin && (
                <>
                  <BotaoIconeCabecalho
                    rotulo="Editar plataforma"
                    Icone={IconCaneta}
                    onClick={() => aoEditar("plataforma", plataforma)}
                  />
                  <BotaoIconeCabecalho
                    rotulo="Eliminar plataforma"
                    Icone={IconLixeira}
                    perigoso
                    onClick={() => aoEliminar("plataforma", plataforma.id, plataforma.nome)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= INDICADORES ================= */}
      <div className={`grid grid-cols-2 gap-3 sm:gap-4 ${ultimoIndicadorInteiro} ${colunasIndicadores[indicadores.length] ?? "lg:grid-cols-3"}`}>
        {indicadores.map((indicador) => (
          <CartaoIndicador key={indicador.rotulo} {...indicador} />
        ))}
      </div>

      {/* ================= ACESSO E CONFIGURAÇÃO ================= */}
      <Secao titulo="Acesso e configuração">
        <dl className="bg-white rounded-2xl border border-slate-200/70 shadow-xs p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Campo rotulo="Painel de controlo">
            {plataforma.urlPainel ? (
              <a
                href={plataforma.urlPainel}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-900 hover:underline break-all"
              >
                {plataforma.urlPainel}
              </a>
            ) : (
              <span className="text-slate-400 font-normal">Sem URL de painel</span>
            )}
          </Campo>
          <Campo rotulo="Utilizador">
            {plataforma.utilizador ? (
              <span className="font-mono">{plataforma.utilizador}</span>
            ) : (
              <span className="text-slate-400 font-normal">Não definido</span>
            )}
          </Campo>
          <Campo rotulo="Token">
            {plataforma.temToken ? (
              <SegredoRevelavel
                descricao={`token da plataforma ${plataforma.nome}`}
                obter={(tokenElevado) => revelarTokenPlataforma(plataforma.id, tokenElevado)}
              />
            ) : (
              <span className="text-slate-400 font-normal">Não definido</span>
            )}
          </Campo>
          {ehContainerizacao && (
            <>
              <Campo rotulo="URL do registry">
                <span className="font-mono break-all">{plataforma.registryUrl ?? "-"}</span>
              </Campo>
              <Campo rotulo="Namespace">
                <span className="font-mono">{plataforma.namespace ?? "-"}</span>
              </Campo>
            </>
          )}
          <Campo rotulo="Registada em">{formatarData(plataforma.criadoEm)}</Campo>
        </dl>
      </Secao>

      {/* ================= SERVIDORES (só se existirem) ================= */}
      {mostraServidores && (
        <Secao titulo={`Servidores (${servidoresDaPlataforma.length})`}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-4">
            {servidoresDaPlataforma.map((servidor) => (
              <CartaoServidor key={servidor.id} servidor={servidor} />
            ))}
          </div>
        </Secao>
      )}

      {servidoresForaDoLugar.length > 0 && (
        <Secao titulo={`Servidores a mover (${servidoresForaDoLugar.length})`}>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800">
            Plataformas de containerização são registos de imagens e não alojam servidores. Edite estes
            servidores e associe-os à plataforma Cloud onde realmente correm.
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-4">
            {servidoresForaDoLugar.map((servidor) => (
              <CartaoServidor key={servidor.id} servidor={servidor} />
            ))}
          </div>
        </Secao>
      )}

      {/* ======== SISTEMAS HOSPEDADOS (num registo: containerizados, correm das suas imagens) ======== */}
      {!ehGestaoDominio && (
        <Secao
          titulo={`${ehContainerizacao ? "Sistemas containerizados" : "Sistemas hospedados"} (${sistemasHospedados.length})`}
        >
          {sistemasHospedados.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-400 italic">
                {ehContainerizacao
                  ? "Nenhum sistema usa imagens deste registo. Escolha a imagem na infraestrutura do backend do sistema."
                  : "Nenhum sistema usa esta plataforma. Associe-a no formulário do sistema (frontend) ou na infraestrutura do backend."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-4">
              {sistemasHospedados.map((sistema) => (
                <CartaoSistemaHospedado key={sistema.id} sistema={sistema} />
              ))}
            </div>
          )}
        </Secao>
      )}

      {/* ================= IMAGENS (só containerização) ================= */}
      {ehContainerizacao && (
        <Secao titulo={`Imagens (${imagensDaPlataforma.length})`}>
          <div className="bg-white p-3 sm:p-5 rounded-2xl border border-slate-200/70 shadow-xs">
            <AbaImagens
              imagens={imagensDaPlataforma}
              ehAdmin={ehAdmin}
              aoEditar={aoEditar}
              aoEliminar={aoEliminar}
            />
          </div>
        </Secao>
      )}

      {/* ================= DOMÍNIOS (só gestão de domínio) ================= */}
      {ehGestaoDominio && (
        <Secao titulo="Domínios & DNS">
          <AbaDominios
            dominios={dominiosDaPlataforma}
            subdominios={subdominios}
            servidores={servidores}
            ehAdmin={ehAdmin}
            aoEditar={aoEditar}
            aoEliminar={aoEliminar}
          />
        </Secao>
      )}
    </div>
  );
}
