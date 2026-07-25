import React, { useState, useEffect } from "react";
import { IconPasta, IconVer, IconCaneta, IconLixeira } from "../components/icons";

interface Documento {
  id: string | number;
  titulo?: string;
  nome?: string;
  autor?: string;
  usuario?: { nome: string };
  tamanho?: string;
  caminho?: string;
  createdAt?: string;
  dataUpload?: string;
  status?: "Pendente" | "Aprovado" | "Rejeitado" | "Lixeira" | string;
  categoriaId?: string | number;
  categoria?: {
    id: string | number;
    nome: string;
  };
}

interface Categoria {
  id: string | number;
  nome: string;
  descricao: string;
}

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de navegação e filtros
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria | null>(null);
  const [busca, setBusca] = useState("");
  const [buscaDoc, setBuscaDoc] = useState("");

  // Estados para Upload
  const [modalDocAberto, setModalDocAberto] = useState(false);
  const [enviandoDoc, setEnviandoDoc] = useState(false);
  const [tituloDoc, setTituloDoc] = useState("");
  const [ficheiro, setFicheiro] = useState<File | null>(null);

  // Estados para Edição
  const [docParaEditar, setDocParaEditar] = useState<Documento | null>(null);
  const [novoTituloEdit, setNovoTituloEdit] = useState("");
  const [salvandoEdit, setSalvandoEdit] = useState(false);

  // Carrega categorias e documentos dinamicamente da API
  const fetchDados = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("token_sistema");
      const headers = { Authorization: `Bearer ${token}` };

      const [resCats, resDocs] = await Promise.all([
        fetch("http://localhost:3000/api/categorias", { headers }),
        fetch("http://localhost:3000/api/documentos", { headers }),
      ]);

      if (resCats.ok) {
        const dadosCats = await resCats.json();
        setCategorias(dadosCats);
      }

      if (resDocs.ok) {
        const dadosDocs = await resDocs.json();
        setDocumentos(dadosDocs);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do servidor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  // Submissão do novo documento
  const handleUploadDocumento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ficheiro || !categoriaAtiva) return;

    setEnviandoDoc(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("token_sistema");
      const formData = new FormData();
      formData.append("ficheiro", ficheiro);
      formData.append("titulo", tituloDoc || ficheiro.name);
      formData.append("categoriaId", String(categoriaAtiva.id));

      const res = await fetch("http://localhost:3000/api/documentos", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Erro ao carregar o documento.");

      setTituloDoc("");
      setFicheiro(null);
      setModalDocAberto(false);
      await fetchDados();
    } catch (err: any) {
      alert(err.message || "Falha ao enviar documento.");
    } finally {
      setEnviandoDoc(false);
    }
  };

  // Editar Documento
  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docParaEditar) return;

    setSalvandoEdit(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("token_sistema");
      const res = await fetch(`http://localhost:3000/api/documentos/${docParaEditar.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ titulo: novoTituloEdit }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar o documento.");

      setDocParaEditar(null);
      await fetchDados();
    } catch (err: any) {
      alert(err.message || "Falha ao atualizar documento.");
    } finally {
      setSalvandoEdit(false);
    }
  };

  // Mover para a Lixeira (Atualiza o status para "Lixeira")
  const handleMoverParaLixeira = async (id: string | number, nomeDoc: string) => {
    if (!confirm(`Deseja mover o documento "${nomeDoc}" para a Lixeira?`)) return;

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("token_sistema");
      
      // Atualiza o status do documento para Lixeira
      const res = await fetch(`http://localhost:3000/api/documentos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Lixeira" }),
      });

      if (!res.ok) throw new Error("Erro ao mover documento para a lixeira.");

      // Atualiza a vista para remover o documento da categoria atual
      await fetchDados();
    } catch (err: any) {
      alert(err.message || "Falha ao mover para a lixeira.");
    }
  };

  const contarDocumentosDaCategoria = (cat: Categoria) => {
    // Apenas conta documentos que NÃO estejam na lixeira
    return documentos.filter(
      (doc) =>
        doc.status !== "Lixeira" &&
        (doc.categoriaId === cat.id ||
          doc.categoria?.id === cat.id ||
          doc.categoria?.nome?.toLowerCase() === cat.nome.toLowerCase())
    ).length;
  };

  const categoriasFiltradas = categorias.filter(
    (cat) =>
      cat.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (cat.descricao && cat.descricao.toLowerCase().includes(busca.toLowerCase()))
  );

  // Documentos da categoria ativa que NÃO estão na lixeira
  const documentosDaCategoria = categoriaAtiva
    ? documentos
        .filter((doc) => doc.status !== "Lixeira")
        .filter(
          (doc) =>
            doc.categoriaId === categoriaAtiva.id ||
            doc.categoria?.id === categoriaAtiva.id ||
            doc.categoria?.nome?.toLowerCase() === categoriaAtiva.nome.toLowerCase()
        )
        .filter((doc) => {
          const nomeDoc = doc.titulo || doc.nome || "";
          const autorDoc = doc.autor || doc.usuario?.nome || "";
          return (
            nomeDoc.toLowerCase().includes(buscaDoc.toLowerCase()) ||
            autorDoc.toLowerCase().includes(buscaDoc.toLowerCase())
          );
        })
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <p className="text-slate-500 font-medium text-sm animate-pulse">
          A carregar dados do repositório...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* VISTA 1: LISTA DE CATEGORIAS */}
      {!categoriaAtiva ? (
        <>
          <div className="bg-[#18357a] text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">
                Organização do Repositório
              </p>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Categorias de Documentos
              </h1>
              <p className="text-xs text-blue-100/90 mt-1">
                Explore as divisões pré-definidas e veja os ficheiros organizados no sistema
              </p>
            </div>

            <div className="bg-white/10 text-white font-semibold text-xs px-3 py-2 rounded-lg border border-white/10 backdrop-blur-sm self-start md:self-auto">
              Total: {categorias.length} categorias
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Pesquisar categoria..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {categoriasFiltradas.length > 0 ? (
              categoriasFiltradas.map((cat) => {
                const totalDocs = contarDocumentosDaCategoria(cat);

                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setCategoriaAtiva(cat);
                      setBuscaDoc("");
                    }}
                    className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg group-hover:bg-[#18357a] group-hover:text-white transition-colors">
                          <IconPasta className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
                          {totalDocs} {totalDocs === 1 ? "documento" : "documentos"}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-base group-hover:text-[#18357a] transition-colors truncate" title={cat.nome}>
                        {cat.nome}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {cat.descricao || "Sem descrição cadastrada."}
                      </p>
                    </div>

                    <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between text-slate-500 group-hover:text-[#18357a] text-xs font-semibold">
                      <span>Aceder pasta</span>
                      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-400 text-xs">
                Nenhuma categoria encontrada.
              </div>
            )}
          </div>
        </>
      ) : (
        /* VISTA 2: DOCUMENTOS DA CATEGORIA SELECIONADA */
        <div className="space-y-6">
          <div className="bg-[#18357a] text-white p-6 md:p-7 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={() => setCategoriaAtiva(null)}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 backdrop-blur-sm border border-white/10 shrink-0"
              >
                ← Voltar às Categorias
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <IconPasta className="w-6 h-6 text-blue-200" />
                  <h1 className="text-2xl font-extrabold text-white">
                    {categoriaAtiva.nome}
                  </h1>
                </div>
                <p className="text-sm font-medium text-blue-100 mt-1 bg-white/10 px-3 py-1 rounded-md inline-block backdrop-blur-sm border border-white/10">
                  {categoriaAtiva.descricao || "Ficheiros guardados nesta categoria"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <div className="bg-white/10 text-white font-medium text-xs px-3 py-2.5 rounded-lg border border-white/10 backdrop-blur-sm">
                Total: <strong className="text-white">{documentosDaCategoria.length} ficheiro(s)</strong>
              </div>
              <button
                type="button"
                onClick={() => setModalDocAberto(true)}
                className="bg-white text-[#18357a] hover:bg-blue-50 transition-colors font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>+</span> Novo Documento
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Pesquisar documento nesta categoria..."
                value={buscaDoc}
                onChange={(e) => setBuscaDoc(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Tabela de Documentos */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-400 uppercase text-xs border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Documento</th>
                    <th className="py-3.5 px-4 font-semibold">Submetido Por</th>
                    <th className="py-3.5 px-4 font-semibold">Tamanho</th>
                    <th className="py-3.5 px-4 font-semibold">Data</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documentosDaCategoria.length > 0 ? (
                    documentosDaCategoria.map((doc) => {
                      const nomeFormatado = doc.titulo || doc.nome || "Ficheiro sem nome";
                      const autorFormatado = doc.autor || doc.usuario?.nome || "Sistema";
                      const dataFormatada = doc.dataUpload || (doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("pt-PT") : "-");
                      const statusFormatado = doc.status || "Aprovado";

                      return (
                        <tr
                          key={doc.id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2.5">
                            <svg
                              className="w-4 h-4 text-[#18357a] shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span className="truncate max-w-xs" title={nomeFormatado}>
                              {nomeFormatado}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">
                            {autorFormatado}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-500">
                            {doc.tamanho || "N/D"}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-500">
                            {dataFormatada}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                statusFormatado === "Aprovado"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : statusFormatado === "Pendente"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {statusFormatado}
                            </span>
                          </td>
                          
                          {/* Coluna de Ações */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              {/* Ver / Abrir */}
                              {doc.caminho ? (
                                <a
                                  href={`http://localhost:3000/${doc.caminho.replace(/^\//, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Abrir Documento"
                                  className="text-slate-500 hover:text-[#18357a] transition-colors p-1"
                                >
                                  <IconVer className="w-4 h-4" />
                                </a>
                              ) : (
                                <span className="text-slate-300 p-1 cursor-not-allowed">
                                  <IconVer className="w-4 h-4" />
                                </span>
                              )}

                              {/* Editar */}
                              <button
                                type="button"
                                title="Editar Documento"
                                onClick={() => {
                                  setDocParaEditar(doc);
                                  setNovoTituloEdit(doc.titulo || doc.nome || "");
                                }}
                                className="text-slate-500 hover:text-amber-600 transition-colors p-1"
                              >
                                <IconCaneta className="w-4 h-4" />
                              </button>

                              {/* Mover para Lixeira */}
                              <button
                                type="button"
                                title="Mover para a Lixeira"
                                onClick={() => handleMoverParaLixeira(doc.id, nomeFormatado)}
                                className="text-slate-500 hover:text-red-600 transition-colors p-1"
                              >
                                <IconLixeira className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-slate-400 text-xs"
                      >
                        Nenhum documento encontrado nesta categoria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Adicionar Novo Documento */}
      {modalDocAberto && categoriaAtiva && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-800">Adicionar Documento</h3>
                <p className="text-xs text-slate-500">
                  Categoria: <strong className="text-[#18357a]">{categoriaAtiva.nome}</strong>
                </p>
              </div>
              <button
                onClick={() => setModalDocAberto(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadDocumento} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Título do Documento
                </label>
                <input
                  type="text"
                  placeholder="Ex: Ata da Reunião de Julho"
                  value={tituloDoc}
                  onChange={(e) => setTituloDoc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Ficheiro *
                </label>
                <input
                  type="file"
                  required
                  onChange={(e) => setFicheiro(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#18357a] hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalDocAberto(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enviandoDoc}
                  className="px-4 py-2 bg-[#18357a] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {enviandoDoc ? "A submeter..." : "Carregar Documento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Editar Documento */}
      {docParaEditar && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-800">Editar Documento</h3>
              <button
                onClick={() => setDocParaEditar(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarEdicao} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Título do Documento
                </label>
                <input
                  type="text"
                  required
                  value={novoTituloEdit}
                  onChange={(e) => setNovoTituloEdit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDocParaEditar(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoEdit}
                  className="px-4 py-2 bg-[#18357a] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {salvandoEdit ? "A guardar..." : "Guardar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}