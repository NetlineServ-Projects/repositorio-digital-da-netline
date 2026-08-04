import { useState, useEffect } from "react";
import { useDocumentosData, type Documento } from "../hooks/useDocumentosData";
import DocumentosHeader from "./documentos/DocumentosHeader";
import DocumentosFiltros from "./documentos/DocumentosFiltros";
import DocumentosTabela from "./documentos/DocumentosTabela";
import DocumentosGrelha from "./documentos/DocumentosGrelha";
import DocumentoModal from "./documentos/DocumentoModal";

interface DocumentosProps {
  categoriaInicial?: string;
}

export default function Documentos({ categoriaInicial = "Todas" }: DocumentosProps) {
  const {
    documentos,
    categorias,
    loading,
    erro,
    recarregar,
    criarDocumento,
    editarDocumento,
    aprovarDocumento,
    apagarDocumento,
  } = useDocumentosData();

  const [modalAberto, setModalAberto] = useState(false);
  const [docEdicao, setDocEdicao] = useState<Documento | null>(null);
  const [salvando, setSalvando] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);

  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState(categoriaInicial);
  const [modoExibicao, setModoExibicao] = useState<"tabela" | "cards">("tabela");

  useEffect(() => {
    setCategoriaFiltro(categoriaInicial);
  }, [categoriaInicial]);

  const abrirEditar = (doc: Documento) => {
    setDocEdicao(doc);
    setTitulo(doc.titulo || "");
    setDescricao(doc.descricao || "");
    const catEncontrada = categorias.find((c) => c.nome === doc.categoria?.nome);
    setCategoriaId(String(doc.categoria?.id || catEncontrada?.id || ""));
    setArquivoSelecionado(null);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setDocEdicao(null);
    setTitulo("");
    setDescricao("");
    setCategoriaId("");
    setArquivoSelecionado(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!docEdicao && !arquivoSelecionado) {
      alert("Por favor, selecione um ficheiro do seu computador.");
      return;
    }
    if (!categoriaId) {
      alert("Por favor, selecione uma categoria.");
      return;
    }

    setSalvando(true);
    try {
      if (docEdicao) {
        await editarDocumento(docEdicao.id, { titulo, descricao, categoriaId });
      } else {
        const formData = new FormData();
        formData.append("titulo", titulo);
        formData.append("descricao", descricao);
        formData.append("categoriaId", categoriaId);
        if (arquivoSelecionado) formData.append("ficheiro", arquivoSelecionado);
        await criarDocumento(formData);
      }
      fecharModal();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Falha ao processar requisição.");
    } finally {
      setSalvando(false);
    }
  };

  const handleApagar = async (id: number) => {
    if (!confirm("Tem a certeza que deseja apagar este documento definitivamente?")) return;
    try {
      await apagarDocumento(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao apagar documento.");
    }
  };

  const documentosFiltrados = documentos.filter((doc) => {
    const tituloDoc = doc.titulo || doc.nomeArquivo || "";
    const autorDoc = doc.usuario?.nome || "";
    const catDoc = doc.categoria?.nome || "";
    const atendeBusca = tituloDoc.toLowerCase().includes(busca.toLowerCase()) || autorDoc.toLowerCase().includes(busca.toLowerCase());
    const atendeCategoria = categoriaFiltro === "Todas" || catDoc.toLowerCase() === categoriaFiltro.toLowerCase();
    return atendeBusca && atendeCategoria;
  });

  if (loading) {
    return <div className="flex items-center justify-center p-12"><p className="text-slate-500 font-medium animate-pulse text-sm">Carregando repositório de documentos...</p></div>;
  }

  if (erro) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center space-y-3">
        <p className="text-red-600 text-sm font-medium">{erro}</p>
        <button onClick={recarregar} className="px-4 py-2 bg-[#18357a] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors">Tentar Novamente</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DocumentosHeader total={documentos.length} onNovoDocumento={() => { setDocEdicao(null); setModalAberto(true); }} />

      <DocumentosFiltros
        busca={busca}
        onBuscaChange={setBusca}
        categoriaFiltro={categoriaFiltro}
        onCategoriaChange={setCategoriaFiltro}
        categorias={categorias}
        modoExibicao={modoExibicao}
        onModoChange={setModoExibicao}
      />

      {modoExibicao === "tabela" ? (
        <DocumentosTabela documentos={documentosFiltrados} onAprovar={aprovarDocumento} onEditar={abrirEditar} onApagar={handleApagar} />
      ) : (
        <DocumentosGrelha documentos={documentosFiltrados} onAprovar={aprovarDocumento} onEditar={abrirEditar} onApagar={handleApagar} />
      )}

      {modalAberto && (
        <DocumentoModal
          docEdicao={docEdicao}
          categorias={categorias}
          titulo={titulo}
          onTituloChange={setTitulo}
          descricao={descricao}
          onDescricaoChange={setDescricao}
          categoriaId={categoriaId}
          onCategoriaIdChange={setCategoriaId}
          arquivoSelecionado={arquivoSelecionado}
          onArquivoChange={setArquivoSelecionado}
          salvando={salvando}
          onFechar={fecharModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}