import { useState, useMemo } from "react";
import { toast } from "sonner";
import { usePlataformasData } from "../../hooks/usePlataformasData";
import { useUsuario } from "../../components/usuarioContext";
import ModalConfirmacao from "../../components/modalConfirmacaoprops";
import {
  IconPlataforma,
  IconServer,
  IconDominio,
  IconRede,
  IconPesquisa,
} from "../../components/icons";
import PlataformaFormularioPage, {
  type TipoFormularioPlataforma,
} from "./formulario/page";
import DetalhesPlataforma from "./detalhes/page";
import BotaoAba, { type ComponenteIcone } from "../../components/plataformas/botaoAba";
import MenuAdicionar from "../../components/plataformas/menuAdicionar";
import AbaPlataformas from "./abas/abaPlataformas";
import AbaServidores from "./abas/abaServidores";
import AbaDominios from "./abas/abadominios";
import AbaTopologia from "./abas/abaTopologia";
import type {
  DadosItemEdicao,
  AoEditarItem,
  AoEliminarItem,
} from "../../types/plataformaTipos";

/* ========================================================================== */
/* Tipos                                                                      */
/* ========================================================================== */

type AbaPrincipal = "arvore" | "plataformas" | "servidores" | "dominios";

interface EstadoFormulario {
  aberto: boolean;
  tipo: TipoFormularioPlataforma;
  itemEdicao?: {
    tipo: TipoFormularioPlataforma;
    dados: DadosItemEdicao;
  } | null;
}

interface EstadoModalExclusao {
  aberto: boolean;
  tipo: TipoFormularioPlataforma;
  id: number;
  nome: string;
}

/* ========================================================================== */
/* Constantes                                                                 */
/* ========================================================================== */

const NOMES_RECURSO: Record<TipoFormularioPlataforma, string> = {
  plataforma: "Plataforma",
  servidor: "Servidor",
  dominio: "Domínio",
  subdominio: "Registo DNS",
};

const MENSAGENS_SUCESSO_EXCLUSAO: Record<TipoFormularioPlataforma, string> = {
  plataforma: "Plataforma eliminada com sucesso.",
  servidor: "Servidor eliminado com sucesso.",
  dominio: "Domínio eliminado com sucesso.",
  subdominio: "Registo DNS eliminado com sucesso.",
};

function textoContem(valor: string | null | undefined, termo: string): boolean {
  return Boolean(valor) && valor!.toLowerCase().includes(termo);
}

/* ========================================================================== */
/* Página                                                                     */
/* ========================================================================== */

export default function PlataformasPage() {
  const { usuarioLogado } = useUsuario();
  const ehAdmin = usuarioLogado?.perfil === "ADMIN";

  const {
    plataformas,
    arvore,
    servidores,
    dominios,
    subdominios,
    loading,
    carregarTodos,
    eliminarPlataforma,
    eliminarServidor,
    eliminarDominio,
    eliminarSubdominio,
  } = usePlataformasData();

  const [abaAtiva, setAbaAtiva] = useState<AbaPrincipal>("plataformas");
  const [busca, setBusca] = useState("");
  const [formularioAberto, setFormularioAberto] =
    useState<EstadoFormulario | null>(null);
  const [modalExclusao, setModalExclusao] =
    useState<EstadoModalExclusao | null>(null);
  const [plataformaSelecionadaId, setPlataformaSelecionadaId] = useState<
    number | null
  >(null);

  // Guarda-se só o id para os detalhes refletirem sempre os dados atualizados.
  const plataformaSelecionada =
    plataformaSelecionadaId !== null
      ? plataformas.find((p) => p.id === plataformaSelecionadaId) ?? null
      : null;

  /* ----------------------------- Abas ----------------------------------- */

  const abas: {
    id: AbaPrincipal;
    rotulo: string;
    Icone: ComponenteIcone;
    corIcone: string;
  }[] = [
    {
      id: "plataformas",
      rotulo: `Plataformas (${plataformas.length})`,
      Icone: IconPlataforma,
      corIcone: "text-blue-900",
    },
    {
      id: "servidores",
      rotulo: `Servidores (${servidores.length})`,
      Icone: IconServer,
      corIcone: "text-emerald-900",
    },
    {
      id: "dominios",
      rotulo: `Domínios & DNS (${dominios.length})`,
      Icone: IconDominio,
      corIcone: "text-indigo-900",
    },
    {
      id: "arvore",
      rotulo: "Topologia / Árvore",
      Icone: IconRede,
      corIcone: "text-amber-900",
    },
  ];

  /* ---------------------------- Filtros --------------------------------- */

  const termoBusca = busca.trim().toLowerCase();

  const plataformasFiltradas = useMemo(() => {
    if (!termoBusca) return plataformas;
    return plataformas.filter(
      (p) => textoContem(p.nome, termoBusca) || textoContem(p.tipo, termoBusca)
    );
  }, [plataformas, termoBusca]);

  const servidoresFiltrados = useMemo(() => {
    if (!termoBusca) return servidores;
    return servidores.filter(
      (s) =>
        textoContem(s.nome, termoBusca) ||
        textoContem(s.hostname, termoBusca) ||
        textoContem(s.ip, termoBusca) ||
        textoContem(s.sistemaOperativo, termoBusca)
    );
  }, [servidores, termoBusca]);

  const dominiosFiltrados = useMemo(() => {
    if (!termoBusca) return dominios;
    return dominios.filter((d) => textoContem(d.nome, termoBusca));
  }, [dominios, termoBusca]);

  /* ---------------------------- Ações ----------------------------------- */

  const abrirFormularioCriacao = (tipo: TipoFormularioPlataforma) =>
    setFormularioAberto({ aberto: true, tipo });

  const abrirFormularioEdicao: AoEditarItem = (tipo, dados) =>
    setFormularioAberto({ aberto: true, tipo, itemEdicao: { tipo, dados } });

  const abrirModalExclusao: AoEliminarItem = (tipo, id, nome) =>
    setModalExclusao({ aberto: true, tipo, id, nome });

  const handleConfirmarExclusao = async () => {
    if (!modalExclusao) return;

    const funcoesEliminar: Record<
      TipoFormularioPlataforma,
      (id: number) => Promise<unknown>
    > = {
      plataforma: eliminarPlataforma,
      servidor: eliminarServidor,
      dominio: eliminarDominio,
      subdominio: eliminarSubdominio,
    };

    try {
      await funcoesEliminar[modalExclusao.tipo](modalExclusao.id);
      toast.success(MENSAGENS_SUCESSO_EXCLUSAO[modalExclusao.tipo]);
    } catch (erro: unknown) {
      const mensagem =
        erro instanceof Error ? erro.message : "Erro ao eliminar recurso.";
      toast.error(mensagem);
    } finally {
      setModalExclusao(null);
    }
  };

  /* ------------------------------ Modal --------------------------------- */

  const modalExclusaoElemento = (
    <ModalConfirmacao
      aberto={Boolean(modalExclusao?.aberto)}
      perigoso
      titulo={`Eliminar ${
        modalExclusao ? NOMES_RECURSO[modalExclusao.tipo] : ""
      }`}
      mensagem={`Tens a certeza de que desejas eliminar "${modalExclusao?.nome}"? Esta ação é irreversível.`}
      textoConfirmar="Eliminar Definitivamente"
      onConfirmar={handleConfirmarExclusao}
      onCancelar={() => setModalExclusao(null)}
    />
  );

  /* ------------------------ Formulário em ecrã inteiro ------------------ */

  if (formularioAberto?.aberto) {
    return (
      <PlataformaFormularioPage
        tipoInicial={formularioAberto.tipo}
        itemEdicao={formularioAberto.itemEdicao}
        onVoltar={() => setFormularioAberto(null)}
        onSucesso={() => carregarTodos()}
      />
    );
  }

  /* ------------------------ Detalhes da plataforma ---------------------- */

  if (plataformaSelecionada) {
    return (
      <>
        <DetalhesPlataforma
          plataforma={plataformaSelecionada}
          plataformas={plataformas}
          servidores={servidores}
          dominios={dominios}
          subdominios={subdominios}
          ehAdmin={ehAdmin}
          aoVoltar={() => setPlataformaSelecionadaId(null)}
          aoEditar={abrirFormularioEdicao}
          aoEliminar={abrirModalExclusao}
        />
        {modalExclusaoElemento}
      </>
    );
  }

  /* ------------------------------ Lista --------------------------------- */

  return (
    <div className="space-y-6 pb-12">
      {/* ================= HEADER ================= */}
      <div className="bg-[#18357a] text-white p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs uppercase font-semibold text-blue-200/80 tracking-widest block mb-1">
            INFRAESTRUTURA & OPERAÇÕES
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Plataformas & Servidores
          </h2>
          <p className="text-sm text-blue-100/80 mt-1 max-w-xl">
            Gerencie provedores de nuvem, servidores virtuais, zonas DNS e
            domínios corporativos da Netline.
          </p>
        </div>

        {ehAdmin && <MenuAdicionar onSelecionar={abrirFormularioCriacao} />}
      </div>

      {/* ================= ABAS & BUSCA ================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {abas.map((aba) => (
            <BotaoAba
              key={aba.id}
              rotulo={aba.rotulo}
              Icone={aba.Icone}
              corIcone={aba.corIcone}
              ativa={abaAtiva === aba.id}
              onSelecionar={() => setAbaAtiva(aba.id)}
            />
          ))}
        </div>

        <div className="relative min-w-65">
          <input
            type="text"
            placeholder="Pesquisar por nome, IP, hostname..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
          />
          <IconPesquisa className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* ================= CONTEÚDO ================= */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-sm animate-pulse bg-white rounded-2xl border border-slate-100">
          A carregar infraestrutura de plataformas...
        </div>
      ) : (
        <>
          {abaAtiva === "plataformas" && (
            <AbaPlataformas
              plataformas={plataformasFiltradas}
              servidores={servidores}
              dominios={dominios}
              ehAdmin={ehAdmin}
              aoAbrirDetalhes={(plataforma) =>
                setPlataformaSelecionadaId(plataforma.id)
              }
              aoEditar={abrirFormularioEdicao}
              aoEliminar={abrirModalExclusao}
            />
          )}

          {abaAtiva === "servidores" && (
            <AbaServidores
              servidores={servidoresFiltrados}
              plataformas={plataformas}
              ehAdmin={ehAdmin}
              aoEditar={abrirFormularioEdicao}
              aoEliminar={abrirModalExclusao}
            />
          )}

          {abaAtiva === "dominios" && (
            <AbaDominios
              dominios={dominiosFiltrados}
              subdominios={subdominios}
              servidores={servidores}
              ehAdmin={ehAdmin}
              aoEditar={abrirFormularioEdicao}
              aoEliminar={abrirModalExclusao}
            />
          )}

          {abaAtiva === "arvore" && <AbaTopologia arvore={arvore} />}
        </>
      )}

      {modalExclusaoElemento}
    </div>
  );
}