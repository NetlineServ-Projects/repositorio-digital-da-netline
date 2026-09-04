import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useSistemasData, type Sistema } from "../../hooks/useSistemasData";
import type { Documento } from "../../types/documento";

import SistemasHeader from "../../components/sistemas/sistemasHeader";
import SistemasGrid from "../../components/sistemas/sistemasGrid";
import SistemaFormulario from "./formulario/page";
import SistemaDetalheHeader from "../../components/sistemas/sistemaDetalheHeader";
import SistemaFichaTecnica from "../../components/sistemas/sistemaFichaTecnica";
import AnexarDocumentoForm from "../../components/sistemas/anexarDocumentoForm";
import DocumentosDoSistemaTabela from "../../components/sistemas/documentosDoSistemaTabela";
import FilterSelect from "../../components/filterSelect";

export default function SistemasPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  const {
    sistemas,
    documentos,
    categorias,
    loading,
    criarSistema,
    editarSistema,
    anexarDocumento,
    apagarDocumento,
  } = useSistemasData();

  // Estados de controlo da página e modais
  const [sistemaAtivo, setSistemaAtivo] = useState<Sistema | null>(null);
  const [formularioAberto, setFormularioAberto] = useState<"novo" | Sistema | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [enviandoDoc, setEnviandoDoc] = useState(false);

  // Estados de busca
  const [busca, setBusca] = useState("");
  const [buscaDoc, setBuscaDoc] = useState("");

  // Estados dos filtros avançados
  const [statusFiltro, setStatusFiltro] = useState<string[]>([]);
  const [clienteFiltro, setClienteFiltro] = useState<string[]>([]);
  const [tecnologiaFiltro, setTecnologiaFiltro] = useState<string[]>([]);

  // Sincroniza sistemaAtivo com o :id da URL assim que a lista de sistemas carrega
  useEffect(() => {
    if (!id) {
      setSistemaAtivo(null);
      return;
    }
    const encontrado = sistemas.find((s) => String(s.id) === id);
    if (encontrado) setSistemaAtivo(encontrado);
  }, [id, sistemas]);

  // Categorias não sensíveis reutilizadas nos formulários de documentos
  const categoriasPublicas = useMemo(
    () => categorias.filter((c) => !c.sensivel),
    [categorias]
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
        label: st.replace(/_/g, " "),
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

  // Ações de reset de filtros
  const limparFiltrosSistemas = useCallback(() => {
    setBusca("");
    setStatusFiltro([]);
    setClienteFiltro([]);
    setTecnologiaFiltro([]);
  }, []);

  // Handlers para o ciclo de vida do Sistema
  const handleSalvarSistema = async (dados: Record<string, unknown>) => {
    setSalvando(true);
    try {
      if (formularioAberto && formularioAberto !== "novo") {
        await editarSistema(formularioAberto.id, dados);
        setSistemaAtivo((prev) => (prev ? ({ ...prev, ...dados } as Sistema) : null));
        toast.success("Sistema atualizado com sucesso!");
      } else {
        await criarSistema(dados);
        toast.success("Sistema registado com sucesso!");
      }
      setFormularioAberto(null);
    } catch {
      toast.error(
        formularioAberto !== "novo"
          ? "Erro ao guardar as alterações do sistema."
          : "Erro ao registar o sistema."
      );
    } finally {
      setSalvando(false);
    }
  };

  // Handlers para os documentos
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
      toast.success("Documento anexado com sucesso!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao anexar o documento.");
    } finally {
      setEnviandoDoc(false);
    }
  };

  // Edição de documento agora navega para a página partilhada de edição
  const abrirEditarDocumento = (doc: Documento) => {
    navigate(`/dashboard/documentos/${doc.id}/editar`);
  };

  // Confirmação interativa direta via Sonner Toast
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
              err instanceof Error ? err.message : "Erro ao apagar documento."
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

  // Lógica de filtragem dos Sistemas
  const sistemasFiltrados = useMemo(() => {
    const termoBusca = busca.trim().toLowerCase();

    return sistemas.filter((sis) => {
      const atendeBusca =
        !termoBusca ||
        sis.nome.toLowerCase().includes(termoBusca) ||
        (sis.descricaoCurta && sis.descricaoCurta.toLowerCase().includes(termoBusca)) ||
        (sis.desenvolvedores || []).some((d) => d.toLowerCase().includes(termoBusca)) ||
        (sis.empresasClientes || []).some((c) => c.toLowerCase().includes(termoBusca));

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

  // Documentos associados ao sistema ativo
  const documentosDoSistema = useMemo(() => {
    if (!sistemaAtivo) return [];
    const termoBuscaDoc = buscaDoc.trim().toLowerCase();

    return documentos
      .filter((doc) => Number(doc.sistemaId) === Number(sistemaAtivo.id))
      .filter((doc) =>
        !termoBuscaDoc ||
        (doc.titulo || doc.nomeArquivo || "").toLowerCase().includes(termoBuscaDoc)
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
        <p className="text-slate-500 text-sm animate-pulse">A carregar sistemas...</p>
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

        {/* Caixas de Pesquisa e Filtros Customizados */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              placeholder="Pesquisar por título ou autor..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-4 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800 placeholder-slate-400 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

          {possuiFiltrosAtivos && (
            <div className="flex justify-end pt-1">
              <button
                onClick={limparFiltrosSistemas}
                className="inline-flex items-center gap-1 text-xs text-rose-600 font-semibold hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors border border-rose-100"
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

  // Vista 3: Detalhes do Sistema Selecionado
  return (
    <div className="space-y-6">
      <SistemaDetalheHeader
        sistema={sistemaAtivo}
        onVoltar={() => navigate("/dashboard/sistemas")}
        onEditar={() => navigate(`/dashboard/sistemas/${sistemaAtivo.id}/editar`)}
      />

      <SistemaFichaTecnica sistema={sistemaAtivo} />

      <AnexarDocumentoForm
        categorias={categoriasPublicas}
        enviando={enviandoDoc}
        onSubmit={handleAnexar}
      />

      <DocumentosDoSistemaTabela
        documentos={documentosDoSistema}
        categorias={categorias.filter((c) => !c.sensivel)}
        busca={buscaDoc}
        onBuscaChange={setBuscaDoc}
        onEditar={abrirEditarDocumento}
        onApagar={handleApagarDoc}
      />
    </div>
  );
}