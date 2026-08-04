import { useState } from "react";
import { useCategoriasData, type Categoria, type Documento } from "../hooks/useCategoriasData";
import CategoriasHeader from "./categorias/CategoriasHeader";
import CategoriasGrid from "./categorias/CategoriasGrid";
import CategoriaDetalheHeader from "./categorias/CategoriaDetalheHeader";
import DocumentosDaCategoriaTabela from "./categorias/DocumentosDaCategoriaTabela";
import ModalNovoDocumento from "./categorias/ModalNovoDocumento";
import ModalEditarDocumento from "./categorias/ModalEditarDocumento";

export default function Categorias() {
  const { categorias, documentos, loading, uploadDocumento, editarTituloDocumento, apagarDocumento } = useCategoriasData();

  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria | null>(null);
  const [busca, setBusca] = useState("");
  const [buscaDoc, setBuscaDoc] = useState("");

  const [modalDocAberto, setModalDocAberto] = useState(false);
  const [enviandoDoc, setEnviandoDoc] = useState(false);
  const [tituloDoc, setTituloDoc] = useState("");
  const [ficheiro, setFicheiro] = useState<File | null>(null);

  const [docParaEditar, setDocParaEditar] = useState<Documento | null>(null);
  const [novoTituloEdit, setNovoTituloEdit] = useState("");
  const [salvandoEdit, setSalvandoEdit] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ficheiro || !categoriaAtiva) return;

    setEnviandoDoc(true);
    try {
      const formData = new FormData();
      formData.append("ficheiro", ficheiro);
      formData.append("titulo", tituloDoc || ficheiro.name);
      formData.append("categoriaId", String(categoriaAtiva.id));
      await uploadDocumento(formData);
      setTituloDoc("");
      setFicheiro(null);
      setModalDocAberto(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Falha ao enviar documento.");
    } finally {
      setEnviandoDoc(false);
    }
  };

  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docParaEditar) return;

    setSalvandoEdit(true);
    try {
      await editarTituloDocumento(docParaEditar.id, novoTituloEdit);
      setDocParaEditar(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Falha ao atualizar documento.");
    } finally {
      setSalvandoEdit(false);
    }
  };

  const handleApagar = async (id: string | number, nomeDoc: string) => {
    if (!confirm(`Deseja apagar definitivamente o documento "${nomeDoc}"?`)) return;
    try {
      await apagarDocumento(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Falha ao apagar. Apenas administradores podem apagar documentos.");
    }
  };

  const categoriasFiltradas = categorias.filter(
    (cat) => cat.nome.toLowerCase().includes(busca.toLowerCase()) || (cat.descricao && cat.descricao.toLowerCase().includes(busca.toLowerCase()))
  );

  const documentosDaCategoria = categoriaAtiva
    ? documentos
        .filter((doc) => doc.categoriaId === categoriaAtiva.id || doc.categoria?.id === categoriaAtiva.id || doc.categoria?.nome?.toLowerCase() === categoriaAtiva.nome.toLowerCase())
        .filter((doc) => {
          const nomeDoc = doc.titulo || doc.nomeArquivo || "";
          const autorDoc = doc.usuario?.nome || "";
          return nomeDoc.toLowerCase().includes(buscaDoc.toLowerCase()) || autorDoc.toLowerCase().includes(buscaDoc.toLowerCase());
        })
    : [];

  if (loading) {
    return <div className="flex justify-center items-center p-12"><p className="text-slate-500 font-medium text-sm animate-pulse">A carregar dados do repositório...</p></div>;
  }

  return (
    <div className="space-y-6">
      {!categoriaAtiva ? (
        <>
          <CategoriasHeader total={categorias.length} busca={busca} onBuscaChange={setBusca} />
          <CategoriasGrid categorias={categoriasFiltradas} documentos={documentos} onSelecionar={(cat) => { setCategoriaAtiva(cat); setBuscaDoc(""); }} />
        </>
      ) : (
        <div className="space-y-6">
          <CategoriaDetalheHeader
            categoria={categoriaAtiva}
            totalDocs={documentosDaCategoria.length}
            onVoltar={() => setCategoriaAtiva(null)}
            onNovoDocumento={() => setModalDocAberto(true)}
          />

          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Pesquisar documento nesta categoria..."
                value={buscaDoc}
                onChange={(e) => setBuscaDoc(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
              />
            </div>
          </div>

          <DocumentosDaCategoriaTabela
            documentos={documentosDaCategoria}
            onEditar={(doc) => { setDocParaEditar(doc); setNovoTituloEdit(doc.titulo || doc.nomeArquivo || ""); }}
            onApagar={handleApagar}
          />
        </div>
      )}

      {modalDocAberto && categoriaAtiva && (
        <ModalNovoDocumento
          categoria={categoriaAtiva}
          titulo={tituloDoc}
          onTituloChange={setTituloDoc}
          ficheiro={ficheiro}
          onFicheiroChange={setFicheiro}
          enviando={enviandoDoc}
          onFechar={() => setModalDocAberto(false)}
          onSubmit={handleUpload}
        />
      )}

      {docParaEditar && (
        <ModalEditarDocumento
          titulo={novoTituloEdit}
          onTituloChange={setNovoTituloEdit}
          salvando={salvandoEdit}
          onFechar={() => setDocParaEditar(null)}
          onSubmit={handleSalvarEdicao}
        />
      )}
    </div>
  );
}