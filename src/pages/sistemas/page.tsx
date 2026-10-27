import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  useNavigate,
  useParams,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { toast } from "sonner";
import { useSistemasData, podeGerirSistema, type Sistema } from "../../hooks/useSistemasData";
import type { Documento } from "../../types/documento";
import SistemasHeader from "./sistemasHeader";
import SistemasGrid from "./sistemasGrid";
import SistemaFormulario from "./formulario/page";
import SistemaDetalheHeader from "./sistemaDetalheHeader";
import SistemaFichaTecnica from "./sistemaFichaTecnica";
import AnexarDocumentoForm from "./anexarDocumentoForm";
import DocumentosDoSistemaTabela from "./documentosDoSistemaTabela";
import FilterSelect from "../../components/filterSelect";
import PainelFiltros from "../../components/painelFiltros";
import InfraestruturaTab from "./infraestrutura/infraestruturaTab";
import { useAcessoInfraestruturaOpcional } from "./infraestrutura/acessoInfraestrutura";
import { rotuloStatus } from "../../utils/status";

interface DashboardContext {
  usuario: { id?: number; nome: string; perfil?: string } | null;
}

type Aba = "geral" | "documentos" | "infraestrutura";

export default function SistemasPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { usuario } = useOutletContext<DashboardContext>();
  const ehAdmin = usuario?.perfil === "ADMIN";

  // Só existe na página de um sistema (não na lista)
  const acesso = useAcessoInfraestruturaOpcional();

  const {
    sistemas,
    documentos,
    categorias,
    loading,
    criarSistema,
    editarSistema,
    apagarSistema,
    anexarDocumento,
    apagarDocumento,
  } = useSistemasData();

  // Estados de controlo da página
  const [sistemaAtivo, setSistemaAtivo] = useState<Sistema | null>(null);
  const [formularioAberto, setFormularioAberto] = useState<
    "novo" | Sistema | null
  >(null);
  const [salvando, setSalvando] = useState(false);
  const [enviandoDoc, setEnviandoDoc] = useState(false);

  // A aba ativa vive no endereço: ?aba=documentos | ?aba=infraestrutura
  const [searchParams, setSearchParams] = useSearchParams();
  const parametroAba = searchParams.get("aba");
  const abaAtiva: Aba =
    parametroAba === "documentos" || parametroAba === "infraestrutura"
      ? parametroAba
      : "geral";

  // Sair da aba Infraestrutura bloqueia o acesso; voltar exige nova palavra-passe
  const mudarAba = (aba: Aba) => {
    if (abaAtiva === "infraestrutura" && aba !== "infraestrutura") {
      acesso?.bloquear();
    }
    setSearchParams(aba === "geral" ? {} : { aba }, { replace: true });
  };

  // Com as abas em scroll horizontal, mantém a aba ativa à vista (ex.: ao abrir ?aba=infraestrutura)
  const abasRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const barra = abasRef.current;
    const ativa = barra?.querySelector<HTMLElement>("[aria-current=page]");
    if (barra && ativa) barra.scrollLeft = ativa.offsetLeft - (barra.clientWidth - ativa.offsetWidth) / 2;
  }, [abaAtiva, sistemaAtivo]);

  // Estados de busca
  const [busca, setBusca] = useState("");
  const [buscaDoc, setBuscaDoc] = useState("");

  // Estados dos filtros avançados
  const [statusFiltro, setStatusFiltro] = useState<string[]>([]);
  const [clienteFiltro, setClienteFiltro] = useState<string[]>([]);
  const [tecnologiaFiltro, setTecnologiaFiltro] = useState<string[]>([]);

  // Sincroniza sistemaAtivo com o :id da URL
  useEffect(() => {
    if (!id) {
      setSistemaAtivo(null);
      return;
    }
    const encontrado = sistemas.find((s) => String(s.id) === id);
    if (encontrado) setSistemaAtivo(encontrado);
  }, [id, sistemas]);

  // Categorias não sensíveis reutilizadas
  const categoriasPublicas = useMemo(
    () => categorias.filter((c) => !c.sensivel),
    [categorias],
  );

  // Opções dinâmicas derivadas dos dados de sistemas
  const opcoesStatus = useMemo(() => {
    const todosStatus = sistemas
      .map((s) => s.status)
      .filter((st): st is string => Boolean(st));
    return Array.from(new Set(todosStatus))
      .sort()
      .map((st) => ({
        valor: st,
        label: rotuloStatus(st),
      }));
  }, [sistemas]);

  const opcoesClientes = useMemo(() => {
    const todosClientes = sistemas.flatMap((s) => s.empresasClientes || []);
    return Array.from(new Set(todosClientes))
      .sort()
      .map((c) => ({ valor: c, label: c }));
  }, [sistemas]);

  const opcoesTecnologias = useMemo(() => {
    const todasTecs = sistemas.flatMap((s) => s.tecnologias || []);
    return Array.from(new Set(todasTecs))
      .sort()
      .map((t) => ({ valor: t, label: t }));
  }, [sistemas]);

  const limparFiltrosSistemas = useCallback(() => {
    setBusca("");
    setStatusFiltro([]);
    setClienteFiltro([]);
    setTecnologiaFiltro([]);
  }, []);

  const handleSalvarSistema = async (dados: Record<string, unknown>) => {
    setSalvando(true);
    try {
      if (formularioAberto && formularioAberto !== "novo") {
        await editarSistema(formularioAberto.id, dados);
        toast.success("Sistema atualizado com sucesso!");
      } else {
        await criarSistema(dados);
        toast.success("Sistema registado com sucesso!");
      }
      setFormularioAberto(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao guardar o sistema.",
      );
    } finally {
      setSalvando(false);
    }
  };

  const handleAnexar = async (dados: {
    ficheiro: File;
    categoriaId: string;
    titulo: string;
    descricao: string;
  }) => {
    if (!sistemaAtivo) return;
    setEnviandoDoc(true);
    try {
      const formData = new FormData();
      formData.append("ficheiro", dados.ficheiro);
      formData.append("categoriaId", dados.categoriaId);
      formData.append("sistemaId", String(sistemaAtivo.id));
      formData.append("titulo", dados.titulo);
      formData.append("descricao", dados.descricao);

      await anexarDocumento(formData);
      // Segue o mesmo fluxo da aba Documentos: só os ADMIN publicam de imediato
      toast.success(
        ehAdmin
          ? "Documento publicado no sistema."
          : "Documento enviado para aprovação. Será notificado quando for revisto.",
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao anexar o documento.",
      );
    } finally {
      setEnviandoDoc(false);
    }
  };

  const abrirEditarDocumento = (doc: Documento) => {
    navigate(`/dashboard/documentos/${doc.id}/editar`);
  };

  const handleApagarDoc = (docId: number) => {
    toast("Tem a certeza que deseja apagar este documento?", {
      description: "Esta ação não pode ser desfeita.",
      action: {
        label: "Apagar",
        onClick: async () => {
          try {
            await apagarDocumento(docId);
            toast.success("Documento removido.");
          } catch (err) {
            toast.error(
              err instanceof Error ? err.message : "Erro ao apagar documento.",
            );
          }
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {},
      },
    });
  };

  const handleApagarSistema = (sistema: Sistema) => {
    toast(`Apagar o sistema "${sistema.nome}"?`, {
      description:
        "Apaga também a infraestrutura, as credenciais e os subdomínios deste sistema. Os documentos ficam, sem sistema associado.",
      action: {
        label: "Apagar",
        onClick: async () => {
          try {
            await apagarSistema(sistema.id);
            toast.success("Sistema apagado.");
            navigate("/dashboard/sistemas");
          } catch (err) {
            toast.error(
              err instanceof Error ? err.message : "Erro ao apagar o sistema.",
            );
          }
        },
      },
      cancel: { label: "Cancelar", onClick: () => {} },
    });
  };

  const sistemasFiltrados = useMemo(() => {
    const termoBusca = busca.trim().toLowerCase();

    return sistemas.filter((sis) => {
      const atendeBusca =
        !termoBusca ||
        sis.nome.toLowerCase().includes(termoBusca) ||
        (sis.descricaoCurta &&
          sis.descricaoCurta.toLowerCase().includes(termoBusca)) ||
        (sis.desenvolvedores || []).some((d) =>
          d.toLowerCase().includes(termoBusca),
        ) ||
        (sis.empresasClientes || []).some((c) =>
          c.toLowerCase().includes(termoBusca),
        );

      const atendeStatus =
        statusFiltro.length === 0 || statusFiltro.includes(sis.status);

      const atendeCliente =
        clienteFiltro.length === 0 ||
        (sis.empresasClientes || []).some((c) => clienteFiltro.includes(c));

      const atendeTecnologia =
        tecnologiaFiltro.length === 0 ||
        (sis.tecnologias || []).some((t) => tecnologiaFiltro.includes(t));

      return atendeBusca && atendeStatus && atendeCliente && atendeTecnologia;
    });
  }, [sistemas, busca, statusFiltro, clienteFiltro, tecnologiaFiltro]);

  const documentosDoSistema = useMemo(() => {
    if (!sistemaAtivo) return [];
    const termoBuscaDoc = buscaDoc.trim().toLowerCase();

    return documentos
      .filter((doc) => Number(doc.sistemaId) === Number(sistemaAtivo.id))
      .filter(
        (doc) =>
          !termoBuscaDoc ||
          (doc.titulo || doc.nomeArquivo || "")
            .toLowerCase()
            .includes(termoBuscaDoc),
      );
  }, [documentos, sistemaAtivo, buscaDoc]);

  const possuiFiltrosAtivos =
    busca !== "" ||
    statusFiltro.length > 0 ||
    clienteFiltro.length > 0 ||
    tecnologiaFiltro.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <p className="text-slate-500 text-sm animate-pulse">
          A carregar sistemas...
        </p>
      </div>
    );
  }

  // Um :id na URL que não corresponde a nenhum sistema (apagado, ou link errado)
  if (id && !sistemas.some((s) => String(s.id) === id)) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm text-center space-y-3">
        <p className="text-slate-700 font-semibold">Sistema não encontrado.</p>
        <p className="text-sm text-slate-500">
          O sistema pode ter sido apagado ou o link está incorreto.
        </p>
        <button
          onClick={() => navigate("/dashboard/sistemas")}
          className="text-sm text-[#18357a] font-semibold hover:underline cursor-pointer"
        >
          Voltar aos Sistemas
        </button>
      </div>
    );
  }

  // Vista 1: Formulário de Criação/Edição de Sistema
  if (formularioAberto) {
    return (
      <SistemaFormulario
        sistemaExistente={formularioAberto === "novo" ? null : formularioAberto}
        salvando={salvando}
        onCancelar={() => setFormularioAberto(null)}
        onSubmit={handleSalvarSistema}
      />
    );
  }

  // Vista 2: Lista Principal de Sistemas (Grelha e Filtros)
  if (!sistemaAtivo) {
    return (
      <div className="space-y-6">
        <SistemasHeader
          total={sistemas.length}
          onNovoSistema={() => setFormularioAberto("novo")}
        />

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              placeholder="Pesquisar por nome, descrição, equipa ou cliente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-4 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800 placeholder-slate-400 transition-all"
            />
          </div>

          <PainelFiltros ativos={statusFiltro.length + clienteFiltro.length + tecnologiaFiltro.length}>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <FilterSelect
              label="Status"
              placeholder="Todos os Status"
              opcoes={opcoesStatus}
              selecionados={statusFiltro}
              onChange={setStatusFiltro}
            />

            <FilterSelect
              label="Cliente / Empresa"
              placeholder="Todos os Clientes"
              opcoes={opcoesClientes}
              selecionados={clienteFiltro}
              onChange={setClienteFiltro}
            />

            <FilterSelect
              label="Tecnologia"
              placeholder="Todas as Tecnologias"
              opcoes={opcoesTecnologias}
              selecionados={tecnologiaFiltro}
              onChange={setTecnologiaFiltro}
            />
          </div>
          </PainelFiltros>

          {possuiFiltrosAtivos && (
            <div className="flex justify-end pt-1">
              <button
                onClick={limparFiltrosSistemas}
                className="inline-flex items-center gap-1 text-xs text-rose-600 font-semibold hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors border border-rose-100 cursor-pointer"
              >
                ✕ Limpar filtros
              </button>
            </div>
          )}
        </div>

        <SistemasGrid
          sistemas={sistemasFiltrados}
          documentos={documentos}
          onSelecionar={(sis) => {
            setBuscaDoc("");
            navigate(`/dashboard/sistemas/${sis.id}`);
          }}
        />
      </div>
    );
  }

  // Vista 3: Detalhes do Sistema Selecionado (Com Tabs para Organização)
  return (
    <div className="space-y-6">
      <SistemaDetalheHeader
        sistema={sistemaAtivo}
        onVoltar={() => navigate("/dashboard/sistemas")}
        onEditar={() => setFormularioAberto(sistemaAtivo)}
        onApagar={() => handleApagarSistema(sistemaAtivo)}
        podeGerir={podeGerirSistema(sistemaAtivo, usuario)}
      />

      {/* Navegação por Separadores (Tabs): uma só linha, com scroll horizontal nos ecrãs pequenos */}
      <div className="border-b border-slate-200 flex gap-6 text-sm font-medium overflow-x-auto whitespace-nowrap [scrollbar-width:none] relative" ref={abasRef}>
        <button
          onClick={() => mudarAba("geral")}
          aria-current={abaAtiva === "geral" ? "page" : undefined}
          className={`pb-3 shrink-0 transition-colors relative cursor-pointer ${
            abaAtiva === "geral"
              ? "text-blue-900 font-semibold border-b-2 border-blue-900"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Visão Geral & Ficha Técnica
        </button>
        <button
          onClick={() => mudarAba("documentos")}
          aria-current={abaAtiva === "documentos" ? "page" : undefined}
          className={`pb-3 shrink-0 transition-colors relative flex items-center gap-2 cursor-pointer ${
            abaAtiva === "documentos"
              ? "text-blue-900 font-semibold border-b-2 border-blue-900"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Documentos do Sistema
          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-normal">
            {documentosDoSistema.length}
          </span>
        </button>
        <button
          onClick={() => mudarAba("infraestrutura")}
          aria-current={abaAtiva === "infraestrutura" ? "page" : undefined}
          className={`pb-3 shrink-0 transition-colors relative cursor-pointer ${
            abaAtiva === "infraestrutura"
              ? "text-blue-900 font-semibold border-b-2 border-blue-900"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Infraestrutura & Credenciais
        </button>
      </div>

      {/* Conteúdo Alternável pelas Tabs */}
      {abaAtiva === "geral" ? (
        <SistemaFichaTecnica sistema={sistemaAtivo} />
      ) : abaAtiva === "documentos" ? (
        <div className="space-y-6">
          <AnexarDocumentoForm
            categorias={categoriasPublicas}
            enviando={enviandoDoc}
            onSubmit={handleAnexar}
          />

          <DocumentosDoSistemaTabela
            documentos={documentosDoSistema}
            categorias={categoriasPublicas}
            busca={buscaDoc}
            onBuscaChange={setBuscaDoc}
            onEditar={abrirEditarDocumento}
            onApagar={handleApagarDoc}
            ehAdmin={ehAdmin}
          />
        </div>
      ) : (
        <InfraestruturaTab sistema={sistemaAtivo} ehAdmin={ehAdmin} />
      )}
    </div>
  );
}