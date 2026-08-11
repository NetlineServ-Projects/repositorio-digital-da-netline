import { useState } from "react";
import { useSistemasData, type Sistema } from "../hooks/useSistemasData";
import SistemasHeader from "./sistemas/sistemasHeader";
import SistemasGrid from "./sistemas/sistemasGrid";
import SistemaFormulario from "./sistemas/sistemaFormulario";
import SistemaDetalheHeader from "./sistemas/sistemaDetalheHeader";
import SistemaFichaTecnica from "./sistemas/sistemaFichaTecnica";
import AnexarDocumentoForm from "./sistemas/anexarDocumentoForm";
import DocumentosDoSistemaTabela from "./sistemas/documentosDoSistemaTabela";

export default function Sistemas() {
  const { sistemas, documentos, categorias, loading, criarSistema, anexarDocumento } = useSistemasData();

  const [sistemaAtivo, setSistemaAtivo] = useState<Sistema | null>(null);
  const [criandoSistema, setCriandoSistema] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [enviandoDoc, setEnviandoDoc] = useState(false);
  const [busca, setBusca] = useState("");
  const [buscaDoc, setBuscaDoc] = useState("");

  const handleCriarSistema = async (dados: Record<string, unknown>) => {
    setSalvando(true);
    try {
      await criarSistema(dados);
      setCriandoSistema(false);
    } catch {
      alert("Erro ao registar o sistema.");
    } finally {
      setSalvando(false);
    }
  };

  const handleAnexar = async (ficheiro: File, categoriaId: string) => {
    if (!sistemaAtivo) return;
    setEnviandoDoc(true);
    try {
      const formData = new FormData();
      formData.append("ficheiro", ficheiro);
      formData.append("categoriaId", categoriaId);
      formData.append("sistemaId", String(sistemaAtivo.id));
      formData.append("titulo", ficheiro.name);
      await anexarDocumento(formData);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao anexar o documento.");
    } finally {
      setEnviandoDoc(false);
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
      <AnexarDocumentoForm categorias={categorias} enviando={enviandoDoc} onSubmit={handleAnexar} />
      <DocumentosDoSistemaTabela documentos={documentosDoSistema} busca={buscaDoc} onBuscaChange={setBuscaDoc} />
    </div>
  );
}