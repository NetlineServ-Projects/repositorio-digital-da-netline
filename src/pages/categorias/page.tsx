import { useState } from "react";
import { useDocumentosData } from "../../hooks/useDocumentosData";
import SearchInput from "../../components/searchInput";
import ViewToggle from "../../components/viewToggle";
import DocumentoRow from "../../components/documentoRow";
import DocumentoCard from "../../components/documentoCard";
import DocumentoModal from "../../components/documentoModal";
import { IconVer, IconPasta,IconSetaDireita } from "../../components/icons";
import { obterUrlFicheiro } from "../../utils/documentos";
import { API_URL } from "../../utils/api";
import type { Documento, Categoria } from "../../types/documento";

export default function CategoriasPage() {
  const {
    documentos,
    categorias,
    loading,
    erro,
    recarregar,
    criarDocumento,
    editarDocumento,
    apagarDocumento,
  } = useDocumentosData();

  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria | null>(null);
  const [buscaCategoria, setBuscaCategoria] = useState("");
  const [buscaDoc, setBuscaDoc] = useState("");
  const [modoExibicao, setModoExibicao] = useState<"tabela" | "cards">(
    "tabela",
  );
  const [modalAberto, setModalAberto] = useState(false);
  const [documentoEmEdicao, setDocumentoEmEdicao] = useState<Documento | null>(
    null,
  );

  const abrirCriar = () => {
    setDocumentoEmEdicao(null);
    setModalAberto(true);
  };

  const abrirEditar = (doc: Documento) => {
    setDocumentoEmEdicao(doc);
    setModalAberto(true);
  };

  const handleSalvar = async (dados: {
    titulo: string;
    descricao: string;
    categoriaId: string;
    ficheiro?: File;
  }) => {
    if (documentoEmEdicao) {
      await editarDocumento(documentoEmEdicao.id, {
        titulo: dados.titulo,
        descricao: dados.descricao,
        categoriaId: dados.categoriaId,
      });
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
    if (!window.confirm("Tem a certeza que deseja apagar este documento?"))
      return;
    try {
      await apagarDocumento(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao apagar documento.");
    }
  };

  const categoriasFiltradas = categorias.filter((cat) =>
    cat.nome.toLowerCase().includes(buscaCategoria.toLowerCase()),
  );
  const contarDocumentos = (categoriaId: number) =>
    documentos.filter((d) => d.categoria?.id === categoriaId).length;

  const documentosDaCategoria = categoriaAtiva
    ? documentos
        .filter((doc) => doc.categoria?.id === categoriaAtiva.id)
        .filter((doc) => {
          const nomeDoc = doc.titulo || doc.nomeArquivo || "";
          const autorDoc = doc.usuario?.nome || "";
          return (
            nomeDoc.toLowerCase().includes(buscaDoc.toLowerCase()) ||
            autorDoc.toLowerCase().includes(buscaDoc.toLowerCase())
          );
        })
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-slate-500 font-medium animate-pulse text-sm">
          A carregar categorias...
        </p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center space-y-3">
        <p className="text-red-600 text-sm font-medium">{erro}</p>
        <button
          onClick={recarregar}
          className="px-4 py-2 bg-[#18357a] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!categoriaAtiva) {
    return (
      <div className="space-y-6">
        <div className="bg-[#18357a] text-white p-6 md:p-8 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">
            Repositório
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Categorias
          </h1>
          <p className="text-sm text-blue-100/80 mt-1">
            {categorias.length} categorias disponíveis
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <SearchInput
            value={buscaCategoria}
            onChange={setBuscaCategoria}
            placeholder="Pesquisar categoria..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriasFiltradas.map((cat) => {
            const totalDocs = contarDocumentos(cat.id);
            const temDocs = totalDocs > 0;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setCategoriaAtiva(cat);
                  setBuscaDoc("");
                }}
                className="group flex flex-col justify-between text-left bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-200 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="p-2.5 bg-blue-50 text-[#18357a] rounded-xl border border-blue-100">
                      <IconPasta className="w-5 h-5" />
                    </div>

                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        temDocs
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                          : "bg-slate-100 text-slate-400 border border-slate-200/60"
                      }`}
                    >
                      {totalDocs} {totalDocs === 1 ? "documento" : "documentos"}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">
                    {cat.nome}
                  </h3>

                  {cat.descricao && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {cat.descricao}
                    </p>
                  )}
                </div>

                {/* Rodapé com indicador de navegação */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span>Aceder categoria</span>
                  <IconSetaDireita/>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#18357a] text-white p-6 md:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setCategoriaAtiva(null)}
            className="text-xs text-blue-200 hover:text-white font-medium mb-2"
          >
            ← Voltar às Categorias
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            {categoriaAtiva.nome}
          </h1>
          <p className="text-sm text-blue-100/80 mt-1">
            {documentosDaCategoria.length} documento(s) nesta categoria
          </p>
        </div>
        <button
          onClick={abrirCriar}
          className="px-4 py-2.5 bg-white text-[#18357a] text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors self-start md:self-auto"
        >
          + Novo Documento
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-80 relative">
          <SearchInput
            value={buscaDoc}
            onChange={setBuscaDoc}
            placeholder="Pesquisar documento nesta categoria..."
          />
        </div>
        <ViewToggle modo={modoExibicao} onChange={setModoExibicao} />
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
                  <th className="py-3.5 px-4 font-semibold text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documentosDaCategoria.length > 0 ? (
                  documentosDaCategoria.map((doc) => (
                    <DocumentoRow
                      key={doc.id}
                      doc={doc}
                      acoes={
                        <>
                          <a
                            href={obterUrlFicheiro(doc.caminho, API_URL)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-200/60"
                            title="Ver documento"
                          >
                            <IconVer />
                          </a>
                          <button
                            onClick={() => abrirEditar(doc)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#18357a] text-xs font-semibold rounded-lg transition-colors border border-blue-100"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleApagar(doc.id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 text-xs font-semibold rounded-lg transition-colors"
                          >
                            Apagar
                          </button>
                        </>
                      }
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      Nenhum documento nesta categoria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentosDaCategoria.length > 0 ? (
            documentosDaCategoria.map((doc) => (
              <DocumentoCard
                key={doc.id}
                doc={doc}
                acoes={
                  <>
                    <a
                      href={obterUrlFicheiro(doc.caminho, API_URL)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-200/60"
                      title="Ver"
                    >
                      <IconVer />
                    </a>
                    <button
                      onClick={() => abrirEditar(doc)}
                      className="px-2.5 py-1 text-xs text-[#18357a] font-semibold hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleApagar(doc.id)}
                      className="px-2.5 py-1 text-xs text-rose-600 font-semibold hover:bg-rose-50 rounded-lg transition-colors border border-rose-200/60"
                    >
                      Apagar
                    </button>
                  </>
                }
              />
            ))
          ) : (
            <div className="col-span-full bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-400">
              Nenhum documento nesta categoria.
            </div>
          )}
        </div>
      )}

      <DocumentoModal
        aberto={modalAberto}
        documento={documentoEmEdicao}
        categorias={categorias}
        categoriaIdPredefinida={categoriaAtiva.id}
        onSalvar={handleSalvar}
        onFechar={() => setModalAberto(false)}
      />
    </div>
  );
}
