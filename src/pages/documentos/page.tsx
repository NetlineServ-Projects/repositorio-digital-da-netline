import { useState } from "react";
import { useDocumentosData } from "../../hooks/useDocumentosData";
import SearchInput from "../../components/searchInput";
import ViewToggle from "../../components/viewToggle";
import DocumentoRow from "../../components/documentoRow";
import DocumentoCard from "../../components/documentoCard";
import DocumentoModal from "../../components/documentoModal";
import { IconVer } from "../../components/icons";
import { obterUrlFicheiro } from "../../utils/documentos";
import { API_URL } from "../../utils/api";
import type { Documento } from "../../types/documento";

export default function DocumentosPage() {
  const { documentos, categorias, loading, erro, recarregar, criarDocumento, editarDocumento, apagarDocumento } = useDocumentosData();

  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [modoExibicao, setModoExibicao] = useState<"tabela" | "cards">("tabela");
  const [modalAberto, setModalAberto] = useState(false);
  const [documentoEmEdicao, setDocumentoEmEdicao] = useState<Documento | null>(null);

  const abrirCriar = () => {
    setDocumentoEmEdicao(null);
    setModalAberto(true);
  };

  const abrirEditar = (doc: Documento) => {
    setDocumentoEmEdicao(doc);
    setModalAberto(true);
  };

  const handleSalvar = async (dados: { titulo: string; descricao: string; categoriaId: string; ficheiro?: File }) => {
    if (documentoEmEdicao) {
      await editarDocumento(documentoEmEdicao.id, { titulo: dados.titulo, descricao: dados.descricao, categoriaId: dados.categoriaId });
    } else {
      const formData = new FormData();
      formData.append("titulo", dados.titulo);
      formData.append("descricao", dados.descricao);
      formData.append("categoriaId", dados.categoriaId);
      if (dados.ficheiro) formData.append("ficheiro", dados.ficheiro);
      await criarDocumento(formData);
    }
  };

  const handleApagar = async (id: number) => {
    if (!window.confirm("Tem a certeza que deseja apagar este documento?")) return;
    try {
      await apagarDocumento(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao apagar documento.");
    }
  };

  const documentosFiltrados = documentos.filter((doc) => {
    const nomeDoc = doc.titulo || doc.nomeArquivo || "";
    const autorDoc = doc.usuario?.nome || "";
    const catDoc = doc.categoria?.nome || "";
    const atendeBusca = nomeDoc.toLowerCase().includes(busca.toLowerCase()) || autorDoc.toLowerCase().includes(busca.toLowerCase());
    const atendeCategoria = categoriaFiltro === "Todas" || catDoc.toLowerCase() === categoriaFiltro.toLowerCase();
    return atendeBusca && atendeCategoria;
  });

  if (loading) {
    return <div className="flex items-center justify-center p-12"><p className="text-slate-500 font-medium animate-pulse text-sm">A carregar documentos...</p></div>;
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
      <div className="bg-[#18357a] text-white p-6 md:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">Repositório</p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Documentos</h1>
          <p className="text-sm text-blue-100/80 mt-1">Consulte e gira os documentos publicados</p>
        </div>
        <button onClick={abrirCriar} className="px-4 py-2.5 bg-white text-[#18357a] text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors self-start md:self-auto">
          + Novo Documento
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-80 relative">
          <SearchInput value={busca} onChange={setBusca} placeholder="Pesquisar por documento ou autor..." />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)} className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900/20">
            <option value="Todas">Todas as Categorias</option>
            {categorias.map((cat) => <option key={cat.id} value={cat.nome}>{cat.nome}</option>)}
          </select>
          <ViewToggle modo={modoExibicao} onChange={setModoExibicao} />
        </div>
      </div>

      {modoExibicao === "tabela" ? (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase text-xs border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Documento</th>
                  <th className="py-3.5 px-4 font-semibold">Categoria</th>
                  <th className="py-3.5 px-4 font-semibold">Submetido Por</th>
                  <th className="py-3.5 px-4 font-semibold">Data</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documentosFiltrados.length > 0 ? (
                  documentosFiltrados.map((doc) => (
                    <DocumentoRow
                      key={doc.id}
                      doc={doc}
                      acoes={
                        <>
                          <a href={obterUrlFicheiro(doc.caminho, API_URL)} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-200/60" title="Ver documento">
                            <IconVer />
                          </a>
                          <button onClick={() => abrirEditar(doc)} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#18357a] text-xs font-semibold rounded-lg transition-colors border border-blue-100">Editar</button>
                          <button onClick={() => handleApagar(doc.id)} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 text-xs font-semibold rounded-lg transition-colors">Apagar</button>
                        </>
                      }
                    />
                  ))
                ) : (
                  <tr><td colSpan={6} className="text-center py-8 text-slate-400">Nenhum documento encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentosFiltrados.length > 0 ? (
            documentosFiltrados.map((doc) => (
              <DocumentoCard
                key={doc.id}
                doc={doc}
                acoes={
                  <>
                    <a href={obterUrlFicheiro(doc.caminho, API_URL)} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-200/60" title="Ver">
                      <IconVer />
                    </a>
                    <button onClick={() => abrirEditar(doc)} className="px-2.5 py-1 text-xs text-[#18357a] font-semibold hover:bg-blue-50 rounded-lg transition-colors border border-blue-100">Editar</button>
                    <button onClick={() => handleApagar(doc.id)} className="px-2.5 py-1 text-xs text-rose-600 font-semibold hover:bg-rose-50 rounded-lg transition-colors border border-rose-200/60">Apagar</button>
                  </>
                }
              />
            ))
          ) : (
            <div className="col-span-full bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-400">Nenhum documento encontrado.</div>
          )}
        </div>
      )}

      <DocumentoModal
        aberto={modalAberto}
        documento={documentoEmEdicao}
        categorias={categorias}
        onSalvar={handleSalvar}
        onFechar={() => setModalAberto(false)}
      />
    </div>
  );
}