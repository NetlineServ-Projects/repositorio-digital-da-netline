import { useState, useMemo, useRef, useEffect } from "react";
import { toast } from "sonner";
import { usePlataformasData } from "../../hooks/usePlataformasData";
import { useUsuario } from "../../components/usuarioContext";
import ModalConfirmacao from "../../components/modalConfirmacaoprops";
import BotaoAba, {
  type ComponenteIcone,
} from "../../components/plataformas/botaoAba";
import MenuAdicionar from "../../components/plataformas/menuAdicionar";
import {
  IconPlataforma,
  IconServer,
  IconDominio,
  IconRede,
  IconPesquisa,
  IconImagem,
} from "../../components/icons";
import PlataformaFormularioPage, {
  type TipoFormularioPlataforma,
} from "./formulario/page";
import DetalhesPlataforma from "./detalhes/page";
import AbaPlataformas from "./abas/abaPlataformas";
import AbaServidores from "./abas/abaServidores";
import AbaDominios from "./abas/abaDominios";
import AbaImagens from "./abas/abaImagens";
import AbaTopologia from "./abas/abaTopologia";
import type {
  DadosItemEdicao,
  AoEditarItem,
  AoEliminarItem,
} from "../../types/plataformaTipos";

/* ========================================================================== */
/* Tipos                                                                      */
/* ========================================================================== */

type AbaPrincipal =
  | "plataformas"
  | "servidores"
  | "dominios"
  | "imagens"
  | "arvore";

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
  imagem: "Imagem",
};

const MENSAGENS_SUCESSO_EXCLUSAO: Record<TipoFormularioPlataforma, string> = {
  plataforma: "Plataforma eliminada com sucesso.",
  servidor: "Servidor eliminado com sucesso.",
  dominio: "Domínio eliminado com sucesso.",
  subdominio: "Registo DNS eliminado com sucesso.",
  imagem: "Imagem eliminada com sucesso.",
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
    imagens,
    loading,
    carregarTodos,
    eliminarPlataforma,
    eliminarServidor,
    eliminarDominio,
    eliminarSubdominio,
    eliminarImagem,
  } = usePlataformasData();

  const [abaAtiva, setAbaAtiva] = useState<AbaPrincipal>("plataformas");
  const [busca, setBusca] = useState("");
  
  // Estados para os filtros avançados por aba (com base nos formulários)
  const [filtroTipoPlataforma, setFiltroTipoPlataforma] = useState("");
  const [filtroSoServidor, setFiltroSoServidor] = useState("");
  const [filtroCloudServidor, setFiltroCloudServidor] = useState("");
  const [filtroEstadoServidor, setFiltroEstadoServidor] = useState("");
  const [filtroDominioBase, setFiltroDominioBase] = useState("");
  const [filtroTipoDns, setFiltroTipoDns] = useState("");
  const [filtroOrigemImagem, setFiltroOrigemImagem] = useState("");
  const [filtroVisibilidadeImagem, setFiltroVisibilidadeImagem] = useState("");

  // Controlo dos dropdowns customizados com pesquisa interna
  const [dropdownAberto, setDropdownAberto] = useState<string | null>(null);
  const [buscaDropdown, setBuscaDropdown] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownAberto(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [formularioAberto, setFormularioAberto] =
    useState<EstadoFormulario | null>(null);
  const [modalExclusao, setModalExclusao] =
    useState<EstadoModalExclusao | null>(null);
  const [plataformaSelecionadaId, setPlataformaSelecionadaId] = useState<
    number | null
  >(null);

  const plataformaSelecionada =
    plataformaSelecionadaId !== null
      ? (plataformas.find((p) => p.id === plataformaSelecionadaId) ?? null)
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
      id: "imagens",
      rotulo: `Imagens (${imagens.length})`,
      Icone: IconImagem,
      corIcone: "text-violet-900",
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
    return plataformas.filter((p) => {
      const matchBusca =
        !termoBusca ||
        textoContem(p.nome, termoBusca) ||
        textoContem(p.tipo, termoBusca);
      
      const matchTipo =
        !filtroTipoPlataforma || p.tipo === filtroTipoPlataforma;

      return matchBusca && matchTipo;
    });
  }, [plataformas, termoBusca, filtroTipoPlataforma]);

  const servidoresFiltrados = useMemo(() => {
    return servidores.filter((s) => {
      const matchBusca =
        !termoBusca ||
        textoContem(s.nome, termoBusca) ||
        textoContem(s.hostname, termoBusca) ||
        textoContem(s.ip, termoBusca) ||
        textoContem(s.sistemaOperativo, termoBusca);

      const matchSo = !filtroSoServidor || s.sistemaOperativo === filtroSoServidor;
      const matchCloud = !filtroCloudServidor || s.cloud === filtroCloudServidor;
      const matchEstado = !filtroEstadoServidor || s.estado === filtroEstadoServidor;

      return matchBusca && matchSo && matchCloud && matchEstado;
    });
  }, [servidores, termoBusca, filtroSoServidor, filtroCloudServidor, filtroEstadoServidor]);

  const dominiosFiltrados = useMemo(() => {
    return dominios.filter((d) => {
      const matchBusca = !termoBusca || textoContem(d.nome, termoBusca);
      const matchBase = !filtroDominioBase || String(d.id) === filtroDominioBase;
      return matchBusca && matchBase;
    });
  }, [dominios, termoBusca, filtroDominioBase]);

  const imagensFiltradas = useMemo(() => {
    return imagens.filter((i) => {
      const matchBusca =
        !termoBusca ||
        textoContem(i.nome, termoBusca) ||
        textoContem(i.tag, termoBusca);

      const matchOrigem = !filtroOrigemImagem || i.origem === filtroOrigemImagem;
      const matchVisibilidade = !filtroVisibilidadeImagem || i.visibilidade === filtroVisibilidadeImagem;

      return matchBusca && matchOrigem && matchVisibilidade;
    });
  }, [imagens, termoBusca, filtroOrigemImagem, filtroVisibilidadeImagem]);

  const limparFiltros = () => {
    setBusca("");
    setFiltroTipoPlataforma("");
    setFiltroSoServidor("");
    setFiltroCloudServidor("");
    setFiltroEstadoServidor("");
    setFiltroDominioBase("");
    setFiltroTipoDns("");
    setFiltroOrigemImagem("");
    setFiltroVisibilidadeImagem("");
    setBuscaDropdown("");
  };

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
      imagem: eliminarImagem,
    };

    try {
      await funcoesEliminar[modalExclusao.tipo](modalExclusao.id);
      toast.success(MENSAGENS_SUCESSO_EXCLUSAO[modalExclusao.tipo]);

      if (
        modalExclusao.tipo === "plataforma" &&
        modalExclusao.id === plataformaSelecionadaId
      ) {
        setPlataformaSelecionadaId(null);
      }
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
          imagens={imagens}
          ehAdmin={ehAdmin}
          aoVoltar={() => setPlataformaSelecionadaId(null)}
          aoEditar={abrirFormularioEdicao}
          aoEliminar={abrirModalExclusao}
        />
        {modalExclusaoElemento}
      </>
    );
  }

  // Componente Auxiliar para Dropdown Moderno com Pesquisa Interna
  const renderDropdownFiltro = (
    id: string,
    rotulo: string,
    valorAtual: string,
    onSelecionar: (val: string) => void,
    opcoes: { valor: string; rotulo: string }[]
  ) => {
    const isOpen = dropdownAberto === id;
    const opcoesFiltradas = opcoes.filter((op) =>
      op.rotulo.toLowerCase().includes(buscaDropdown.toLowerCase())
    );
    const itemSelecionadoObj = opcoes.find((o) => o.valor === valorAtual);

    return (
      <div className="relative" ref={dropdownRef}>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          {rotulo}
        </label>
        <div
          onClick={() => {
            setDropdownAberto(isOpen ? null : id);
            setBuscaDropdown("");
          }}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 cursor-pointer flex items-center justify-between shadow-sm hover:border-slate-300 transition-colors"
        >
          <span className={!valorAtual ? "text-slate-400" : "text-slate-800 font-medium"}>
            {itemSelecionadoObj ? itemSelecionadoObj.rotulo : `Todos os ${rotulo}s`}
          </span>
          <span className="text-slate-400 text-xs">↕</span>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2 space-y-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={buscaDropdown}
                onChange={(e) => setBuscaDropdown(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900/20"
                autoFocus
              />
              <IconPesquisa className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              <div
                onClick={() => {
                  onSelecionar("");
                  setDropdownAberto(null);
                }}
                className="px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Todos
              </div>
              {opcoesFiltradas.map((op) => (
                <div
                  key={op.valor}
                  onClick={() => {
                    onSelecionar(op.valor);
                    setDropdownAberto(null);
                  }}
                  className={`px-2.5 py-1.5 text-xs rounded-lg cursor-pointer flex items-center justify-between ${
                    valorAtual === op.valor ? "bg-blue-50 text-blue-900 font-semibold" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{op.rotulo}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

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

      {/* ================= ABAS ================= */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto w-fit">
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

      {/* ================= LAYOUT PRINCIPAL (CONTEÚDO À ESQUERDA, FILTROS À DIREITA) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* COLUNA ESQUERDA (3 colunas): PESQUISA E CONTEÚDO */}
        <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
          
          {/* BARRA DE PESQUISA SUPERIOR */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Pesquisar por nome, IP, hostname..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800 shadow-sm transition-all"
            />
            <IconPesquisa className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {busca && (
              <button
                type="button"
                onClick={() => setBusca("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold px-1.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors"
                title="Limpar pesquisa"
              >
                ✕
              </button>
            )}
          </div>

          {/* CONTEÚDO DAS ABAS */}
          {loading ? (
            <div className="p-16 text-center text-slate-400 text-sm animate-pulse bg-white rounded-2xl border border-slate-100 shadow-sm">
              A carregar infraestrutura de plataformas...
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              {abaAtiva === "plataformas" && (
                <AbaPlataformas
                  plataformas={plataformasFiltradas}
                  servidores={servidores}
                  dominios={dominios}
                  imagens={imagens}
                  aoAbrirDetalhes={(plataforma) =>
                    setPlataformaSelecionadaId(plataforma.id)
                  }
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

              {abaAtiva === "imagens" && (
                <AbaImagens
                  imagens={imagensFiltradas}
                  ehAdmin={ehAdmin}
                  aoEditar={abrirFormularioEdicao}
                  aoEliminar={abrirModalExclusao}
                />
              )}

              {abaAtiva === "arvore" && <AbaTopologia arvore={arvore} />}
            </div>
          )}
        </div>

        {/* COLUNA DIREITA (1 coluna): CARD DE FILTROS FIXO */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6 order-1 lg:order-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs uppercase font-bold text-slate-700 tracking-wider">
              Filtros
            </span>
            <button
              type="button"
              onClick={limparFiltros}
              className="text-xs text-slate-400 hover:text-red-600 font-medium transition-colors flex items-center gap-1"
            >
              ✕ Limpar
            </button>
          </div>

          {/* Filtros para Plataformas */}
          {abaAtiva === "plataformas" && (
            <div className="space-y-4">
              {renderDropdownFiltro(
                "tipoPlataforma",
                "Tipo",
                filtroTipoPlataforma,
                setFiltroTipoPlataforma,
                [
                  { valor: "CONTAINERIZACAO", rotulo: "Containerização & Nuvem" },
                  { valor: "CLOUD_BASE_DADOS", rotulo: "Cloud Base de Dados" },
                  { valor: "GESTAO_DOMINIO", rotulo: "Gestão de Domínio & DNS" },
                ]
              )}
            </div>
          )}

          {/* Filtros para Servidores */}
          {abaAtiva === "servidores" && (
            <div className="space-y-4">
              {renderDropdownFiltro(
                "soServidor",
                "Sistema Operativo",
                filtroSoServidor,
                setFiltroSoServidor,
                Array.from(new Set(servidores.map((s) => s.sistemaOperativo).filter(Boolean))).map((so) => ({
                  valor: so,
                  rotulo: so,
                }))
              )}
              {renderDropdownFiltro(
                "cloudServidor",
                "Provedor Cloud",
                filtroCloudServidor,
                setFiltroCloudServidor,
                Array.from(new Set(servidores.map((s) => s.cloud).filter(Boolean))).map((c) => ({
                  valor: c!,
                  rotulo: c!,
                }))
              )}
              {renderDropdownFiltro(
                "estadoServidor",
                "Estado",
                filtroEstadoServidor,
                setFiltroEstadoServidor,
                [
                  { valor: "ATIVO", rotulo: "Ativo" },
                  { valor: "INATIVO", rotulo: "Inativo" },
                ]
              )}
            </div>
          )}

          {/* Filtros para Domínios & DNS */}
          {abaAtiva === "dominios" && (
            <div className="space-y-4">
              {renderDropdownFiltro(
                "dominioBase",
                "Domínio Base",
                filtroDominioBase,
                setFiltroDominioBase,
                dominios.map((d) => ({
                  valor: String(d.id),
                  rotulo: d.nome,
                }))
              )}
            </div>
          )}

          {/* Filtros para Imagens */}
          {abaAtiva === "imagens" && (
            <div className="space-y-4">
              {renderDropdownFiltro(
                "origemImagem",
                "Origem",
                filtroOrigemImagem,
                setFiltroOrigemImagem,
                [
                  { valor: "PROPRIA", rotulo: "Própria / Interna" },
                  { valor: "EXTERNA", rotulo: "Externa" },
                ]
              )}
              {renderDropdownFiltro(
                "visibilidadeImagem",
                "Visibilidade",
                filtroVisibilidadeImagem,
                setFiltroVisibilidadeImagem,
                [
                  { valor: "PRIVADA", rotulo: "Privada" },
                  { valor: "PUBLICA", rotulo: "Pública" },
                ]
              )}
            </div>
          )}

          {abaAtiva === "arvore" && (
            <p className="text-xs text-slate-400 italic">
              Sem filtros para a topologia em árvore.
            </p>
          )}
        </div>

      </div>

      {modalExclusaoElemento}
    </div>
  );
}