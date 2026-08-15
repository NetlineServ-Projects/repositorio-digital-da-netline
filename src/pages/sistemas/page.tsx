import { useState } from "react";
import { useSistemasData, type Sistema } from "../../hooks/useSistemasData";
import type { Documento } from "../../types/documento";
import SistemasHeader from "../../components/sistemas/sistemasHeader";
import SistemasGrid from "../../components/sistemas/sistemasGrid";
import SistemaFormulario from "../../components/sistemas/sistemaFormulario";
import SistemaDetalheHeader from "../../components/sistemas/sistemaDetalheHeader";
import SistemaFichaTecnica from "../../components/sistemas/sistemaFichaTecnica";
import AnexarDocumentoForm from "../../components/sistemas/anexarDocumentoForm";
import DocumentosDoSistemaTabela from "../../components/sistemas/documentosDoSistemaTabela";
import DocumentoModal from "../../components/documentoModal";
import { toast } from "sonner";


export default function SistemasPage() {
  const { sistemas, documentos, categorias, loading, criarSistema, anexarDocumento, editarDocumento, apagarDocumento } = useSistemasData();

  const [sistemaAtivo, setSistemaAtivo] = useState<Sistema | null>(null);
  const [criandoSistema, setCriandoSistema] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [enviandoDoc, setEnviandoDoc] = useState(false);
  const [busca, setBusca] = useState("");
  const [buscaDoc, setBuscaDoc] = useState("");
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [documentoEmEdicao, setDocumentoEmEdicao] = useState<Documento | null>(null);

  const handleCriarSistema = async (dados: Record<string, unknown>) => {
    setSalvando(true);
    try {
      await criarSistema(dados);
      setCriandoSistema(false);
    } catch {
      toast.error("Erro ao registar o sistema.");
    } finally {
      setSalvando(false);
    }
  };

  const handleAnexar = async (dados: { ficheiro: File; categoriaId: string; titulo: string; descricao: string }) => {
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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao anexar o documento.");
    } finally {
      setEnviandoDoc(false);
    }
  };

  const abrirEditar = (doc: Documento) => {
    setDocumentoEmEdicao(doc);
    setModalEditarAberto(true);
  };

  const handleSalvarEdicao = async (dados: { titulo: string; descricao: string; categoriaId: string }) => {
    if (!documentoEmEdicao) return;
    await editarDocumento(documentoEmEdicao.id, dados);
  };

  const handleApagarDoc = async (id: number) => {
    if (!window.confirm("Tem a certeza que deseja apagar este documento?")) return;
    try {
      await apagarDocumento(id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao apagar documento.");
    }
  };

  const sistemasFiltrados = sistemas.filter(
    (sis) =>
      sis.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (sis.descricaoCurta && sis.descricaoCurta.toLowerCase().includes(busca.toLowerCase())) ||
      (sis.desenvolvedores || []).some((d) => d.toLowerCase().includes(busca.toLowerCase())) ||
      (sis.empresasClientes || []).some((c) => c.toLowerCase().includes(busca.toLowerCase()))
  );

  const documentosDoSistema = sistemaAtivo
    ? documentos
        .filter((doc) => Number(doc.sistemaId) === Number(sistemaAtivo.id))
        .filter((doc) => (doc.titulo || doc.nomeArquivo || "").toLowerCase().includes(buscaDoc.toLowerCase()))
    : [];

  if (loading) {
    return <div className="flex justify-center items-center p-12"><p className="text-slate-500 text-sm animate-pulse">A carregar sistemas...</p></div>;
  }

  if (criandoSistema) {
    return <SistemaFormulario salvando={salvando} onCancelar={() => setCriandoSistema(false)} onSubmit={handleCriarSistema} />;
  }

  if (!sistemaAtivo) {
    return (
      <div className="space-y-6">
        <SistemasHeader total={sistemas.length} busca={busca} onBuscaChange={setBusca} onNovoSistema={() => setCriandoSistema(true)} />
        <SistemasGrid sistemas={sistemasFiltrados} documentos={documentos} onSelecionar={(sis) => { setSistemaAtivo(sis); setBuscaDoc(""); }} />
      </div>
    );
  }

  const sistema = sistemaAtivo;

  return (
    <div className="space-y-6">
      <SistemaDetalheHeader sistema={sistema} onVoltar={() => setSistemaAtivo(null)} />
      <SistemaFichaTecnica sistema={sistemaAtivo} />
      <AnexarDocumentoForm categorias={categorias.filter((c) => !c.sensivel)} enviando={enviandoDoc} onSubmit={handleAnexar} />
      <DocumentosDoSistemaTabela
        documentos={documentosDoSistema}
        busca={buscaDoc}
        onBuscaChange={setBuscaDoc}
        onEditar={abrirEditar}
        onApagar={handleApagarDoc}
      />

      <DocumentoModal
        aberto={modalEditarAberto}
        documento={documentoEmEdicao}
        categorias={categorias.filter((c) => !c.sensivel)}
        onSalvar={handleSalvarEdicao}
        onFechar={() => setModalEditarAberto(false)}
      />
    </div>
  );
}