import { useState } from "react";
import { useSistemasData, type Sistema } from "../../hooks/useSistemasData";
import type { Documento } from "../../types/documento";
import SistemasHeader from "../../components/sistemas/sistemasHeader";
import SistemasGrid from "../../components/sistemas/sistemasGrid";
import SistemaFormulario from "./formulario/page";
import SistemaDetalheHeader from "../../components/sistemas/sistemaDetalheHeader";
import SistemaFichaTecnica from "../../components/sistemas/sistemaFichaTecnica";
import AnexarDocumentoForm from "../../components/sistemas/anexarDocumentoForm";
import DocumentosDoSistemaTabela from "../../components/sistemas/documentosDoSistemaTabela";
import DocumentoModal from "../../components/documentoModal";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SistemasPage() {
  const { sistemas, documentos, categorias, loading, criarSistema, editarSistema, anexarDocumento, editarDocumento, apagarDocumento } = useSistemasData();
  const navigate = useNavigate();
  const [sistemaAtivo, setSistemaAtivo] = useState<Sistema | null>(null);
  const [formularioAberto, setFormularioAberto] = useState<"novo" | Sistema | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [enviandoDoc, setEnviandoDoc] = useState(false);
  const [busca, setBusca] = useState("");
  const [buscaDoc, setBuscaDoc] = useState("");
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [documentoEmEdicao, setDocumentoEmEdicao] = useState<Documento | null>(null);

  const handleSalvarSistema = async (dados: Record<string, unknown>) => {
    setSalvando(true);
    try {
      if (formularioAberto && formularioAberto !== "novo") {
        await editarSistema(formularioAberto.id, dados);
        // mantém o sistemaAtivo atualizado após editar, sem precisar voltar à lista
        setSistemaAtivo({ ...formularioAberto, ...dados } as Sistema);
      } else {
        await criarSistema(dados);
      }
      setFormularioAberto(null);
    } catch {
      toast.error(formularioAberto !== "novo" ? "Erro ao guardar as alterações." : "Erro ao registar o sistema.");
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

  if (!sistemaAtivo) {
    return (
      <div className="space-y-6">
        <SistemasHeader total={sistemas.length} busca={busca} onBuscaChange={setBusca} onNovoSistema={() => setFormularioAberto("novo")} />
        <SistemasGrid sistemas={sistemasFiltrados} documentos={documentos} onSelecionar={(sis) => { setSistemaAtivo(sis); setBuscaDoc(""); }} />
      </div>
    );
  }

  const sistema = sistemaAtivo;

  return (
    <div className="space-y-6">
      <SistemaDetalheHeader sistema={sistema} onVoltar={() => setSistemaAtivo(null)} onEditar={() => navigate(`/dashboard/sistemas/${sistema.id}/editar`)} />
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