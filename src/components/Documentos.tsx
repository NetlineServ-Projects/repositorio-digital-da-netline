import React, { useState, useEffect } from "react";
import {
  IconDownload,
  IconVer,
  IconCaneta,
  IconLixeira,
} from "../components/icons";

interface Documento {
  id: number;
  titulo: string;
  descricao?: string;
  nomeArquivo: string;
  caminho: string;
  tipoArquivo: string;
  tamanho: string | number;
  status?: "PENDENTE" | "APROVADO";
  dataSubmissao?: string;
  createdAt?: string;
  usuario?: {
    nome: string;
  };
  categoria?: {
    nome: string;
  };
}

interface Categoria {
  id: number;
  nome: string;
}

interface DocumentosProps {
  categoriaInicial?: string;
}

// Helper: URL base das APIs/Ficheiros
const API_URL = "http://localhost:3000";

const obterUrlFicheiro = (caminho: string) => {
  if (!caminho) return "#";
  if (caminho.startsWith("http")) return caminho;
  return `${API_URL}/${caminho.replace(/^\/+/, "")}`;
};

// Helper: Formatar Extensão
const formatarExtensao = (tipo?: string, nomeArquivo?: string) => {
  const t = (tipo || "").toLowerCase();

  if (t.includes("pdf")) return "PDF";
  if (t.includes("word") || t.includes("processingml") || t.includes("doc"))
    return "DOCX";
  if (t.includes("excel") || t.includes("spreadsheetml") || t.includes("xls"))
    return "XLSX";
  if (
    t.includes("image") ||
    t.includes("png") ||
    t.includes("jpeg") ||
    t.includes("jpg")
  )
    return "PNG";
  if (t.includes("zip") || t.includes("rar")) return "ZIP";

  if (nomeArquivo && nomeArquivo.includes(".")) {
    const ext = nomeArquivo.split(".").pop();
    if (ext && ext.length <= 5) return ext.toUpperCase();
  }

  return "DOC";
};

// Helper: Nome para exibição
const obterNomeExibicao = (doc: Documento) => {
  if (doc.titulo && doc.titulo.trim() !== "") return doc.titulo;
  if (doc.nomeArquivo && doc.nomeArquivo.trim() !== "") return doc.nomeArquivo;
  return "Documento sem título";
};

// Helper: Formatação de Tamanho
const formatarTamanho = (bytes?: string | number) => {
  if (!bytes) return "N/A";
  const num = Number(bytes);
  if (isNaN(num)) return "N/A";
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
};

export default function Documentos({
  categoriaInicial = "Todas",
}: DocumentosProps) {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  // Controle dos Modais
  const [modalAberto, setModalAberto] = useState(false);
  const [docEdicao, setDocEdicao] = useState<Documento | null>(null);
  const [salvando, setSalvando] = useState(false);

  // Estados do Formulário
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(
    null
  );

  // Filtros
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState(categoriaInicial);
  const [modoExibicao, setModoExibicao] = useState<"tabela" | "cards">(
    "tabela"
  );

  useEffect(() => {
    setCategoriaFiltro(categoriaInicial);
  }, [categoriaInicial]);

  // Fetch de dados do Backend
  const carregarDados = async () => {
    setLoading(true);
    setErro(null);

    try {
      const token = localStorage.getItem("token_sistema");
      const headers = { Authorization: `Bearer ${token}` };

      const [resDocs, resCats] = await Promise.all([
        fetch(`${API_URL}/api/documentos`, { headers }),
        fetch(`${API_URL}/api/categorias`, { headers }),
      ]);

      if (!resDocs.ok) throw new Error("Erro ao carregar documentos.");

      const dadosDocs = await resDocs.json();
      setDocumentos(dadosDocs);

      if (resCats.ok) {
        const dadosCats = await resCats.json();
        setCategorias(dadosCats);
      }
    } catch (err) {
      console.error("Erro no carregamento:", err);
      setErro("Não foi possível carregar os documentos do repositório.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Abrir Modal para Edição
  const handleAbrirEditar = (doc: Documento) => {
    setDocEdicao(doc);
    setTitulo(doc.titulo || "");
    setDescricao(doc.descricao || "");
    setCategoriaId(doc.categoria?.nome ? String(doc.categoria.nome) : "");
    setArquivoSelecionado(null);
    setModalAberto(true);
  };

  // Reset do Formulário ao Fechar
  const handleFecharModal = () => {
    setModalAberto(false);
    setDocEdicao(null);
    setTitulo("");
    setDescricao("");
    setCategoriaId("");
    setArquivoSelecionado(null);
  };

  // Envio do formulário (Criação e Edição)
  const handleSalvarDocumento = async (e: React.FormEvent) => {
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
      const token = localStorage.getItem("token_sistema");
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descricao", descricao);
      formData.append("categoriaId", categoriaId);
      if (arquivoSelecionado) {
        formData.append("ficheiro", arquivoSelecionado);
      }

      const url = docEdicao
        ? `${API_URL}/api/documentos/${docEdicao.id}`
        : `${API_URL}/api/documentos`;

      const method = docEdicao ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const erroJson = await res.json().catch(() => null);
        throw new Error(
          erroJson?.mensagem || erroJson?.error || "Erro ao guardar o documento."
        );
      }

      handleFecharModal();
      await carregarDados();
    } catch (err: any) {
      console.error("Erro na gravação:", err);
      alert(err.message || "Falha ao processar requisição.");
    } finally {
      setSalvando(false);
    }
  };

  // Ações Rápidas
  const handleAprovarDocumento = async (id: number) => {
    try {
      const token = localStorage.getItem("token_sistema");
      const res = await fetch(`${API_URL}/api/documentos/${id}/aprovar`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) carregarDados();
    } catch (err) {
      console.error("Erro ao aprovar:", err);
    }
  };

  const handleMoverParaLixeira = async (id: number) => {
    if (!confirm("Tem a certeza que deseja mover este documento para a lixeira?")) return;

    try {
      const token = localStorage.getItem("token_sistema");
      const res = await fetch(`${API_URL}/api/documentos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) carregarDados();
    } catch (err) {
      console.error("Erro ao eliminar:", err);
    }
  };

  // Filtragem local
  const documentosFiltrados = documentos.filter((doc) => {
    const tituloDoc = doc.titulo || doc.nomeArquivo || "";
    const autorDoc = doc.usuario?.nome || "";
    const catDoc = doc.categoria?.nome || "";

    const atendeBusca =
      tituloDoc.toLowerCase().includes(busca.toLowerCase()) ||
      autorDoc.toLowerCase().includes(busca.toLowerCase());

    const atendeCategoria =
      categoriaFiltro === "Todas" ||
      catDoc.toLowerCase() === categoriaFiltro.toLowerCase();

    return atendeBusca && atendeCategoria;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-slate-500 font-medium animate-pulse text-sm">
          Carregando repositório de documentos...
        </p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center space-y-3">
        <p className="text-red-600 text-sm font-medium">{erro}</p>
        <button
          onClick={carregarDados}
          className="px-4 py-2 bg-[#18357a] text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-[#18357a] text-white p-6 md:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">
            Repositório Digital
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Documentos
          </h1>
          <p className="text-sm text-blue-100/80 mt-1">
            Consulta e download dos ficheiros oficiais da Netline
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="bg-white/10 text-white font-medium text-xs px-3 py-2.5 rounded-lg border border-white/10 backdrop-blur-sm">
            Total: {documentos.length}
          </div>
          <button
            type="button"
            onClick={() => {
              setDocEdicao(null);
              setModalAberto(true);
            }}
            className="bg-white text-[#18357a] hover:bg-blue-50 transition-colors font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>+</span> Novo Documento
          </button>
        </div>
      </div>

      {/* Pesquisa e Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Pesquisar por título ou autor..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-3"
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

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          >
            <option value="Todas">Todas as Categorias</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.nome}>
                {cat.nome}
              </option>
            ))}
          </select>

          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 ml-auto md:ml-0">
            <button
              onClick={() => setModoExibicao("tabela")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                modoExibicao === "tabela"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Tabela
            </button>
            <button
              onClick={() => setModoExibicao("cards")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                modoExibicao === "cards"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Grelha
            </button>
          </div>
        </div>
      </div>

      {/* Visualização Tabela */}
      {modoExibicao === "tabela" ? (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase text-xs border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Documento</th>
                  <th className="py-3.5 px-4 font-semibold">Categoria</th>
                  <th className="py-3.5 px-4 font-semibold">Criado Por</th>
                  <th className="py-3.5 px-4 font-semibold">Data</th>
                  <th className="py-3.5 px-4 font-semibold">Tamanho</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documentosFiltrados.length > 0 ? (
                  documentosFiltrados.map((doc) => {
                    const ext = formatarExtensao(doc.tipoArquivo, doc.nomeArquivo);
                    const nomeExibicao = obterNomeExibicao(doc);
                    const dataExibicao = doc.dataSubmissao || doc.createdAt;
                    const pendente = doc.status === "PENDENTE";

                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 text-slate-800 flex items-center gap-3">
                          <span className="p-2 bg-blue-50 text-[#18357a] rounded-lg text-[11px] font-extrabold uppercase min-w-[42px] text-center shrink-0 border border-blue-100/50">
                            {ext}
                          </span>
                          <div className="flex flex-col truncate max-w-xs md:max-w-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-800 text-sm truncate" title={nomeExibicao}>
                                {nomeExibicao}
                              </span>
                              {pendente && (
                                <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-1.5 py-0.5 rounded font-semibold">
                                  Pendente
                                </span>
                              )}
                            </div>
                            {doc.descricao && (
                              <span className="text-xs text-slate-400 font-normal truncate" title={doc.descricao}>
                                {doc.descricao}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">{doc.categoria?.nome || "Sem Categoria"}</td>
                        <td className="py-3.5 px-4">{doc.usuario?.nome || "Sistema"}</td>
                        <td className="py-3.5 px-4 text-xs">
                          {dataExibicao ? new Date(dataExibicao).toLocaleDateString("pt-PT") : "N/A"}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">{formatarTamanho(doc.tamanho)}</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {pendente && (
                              <button
                                onClick={() => handleAprovarDocumento(doc.id)}
                                className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
                              >
                                Aprovar
                              </button>
                            )}
                            <a
                              href={obterUrlFicheiro(doc.caminho)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-200/60"
                              title="Visualizar"
                            >
                              <IconVer />
                            </a>
                            <a
                              href={obterUrlFicheiro(doc.caminho)}
                              download={doc.nomeArquivo || doc.titulo}
                              className="p-2 bg-blue-50 hover:bg-blue-100 text-[#18357a] rounded-lg transition-colors border border-blue-100"
                              title="Baixar"
                            >
                              <IconDownload />
                            </a>
                            <button
                              onClick={() => handleAbrirEditar(doc)}
                              className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors border border-amber-200/60"
                              title="Editar"
                            >
                              <IconCaneta />
                            </button>
                            <button
                              onClick={() => handleMoverParaLixeira(doc.id)}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-100"
                              title="Mover para lixeira"
                            >
                              <IconLixeira />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      Nenhum documento encontrado no repositório.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Visualização Grelha (Cards Corrigida) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentosFiltrados.length > 0 ? (
            documentosFiltrados.map((doc) => {
              const ext = formatarExtensao(doc.tipoArquivo, doc.nomeArquivo);
              const nomeExibicao = obterNomeExibicao(doc);
              const dataExibicao = doc.dataSubmissao || doc.createdAt;
              const pendente = doc.status === "PENDENTE";

              return (
                <div
                  key={doc.id}
                  className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <span className="p-2.5 bg-blue-50 text-[#18357a] rounded-xl text-xs font-extrabold uppercase shrink-0 border border-blue-100/50">
                        {ext}
                      </span>
                      {pendente && (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-2 py-0.5 rounded font-semibold">
                          Pendente
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-800 text-base line-clamp-1" title={nomeExibicao}>
                        {nomeExibicao}
                      </h3>
                      {doc.descricao && (
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1" title={doc.descricao}>
                          {doc.descricao}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Cat: <strong className="text-slate-600">{doc.categoria?.nome || "Sem Categoria"}</strong></span>
                      <span>{formatarTamanho(doc.tamanho)}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Por: <strong className="text-slate-600">{doc.usuario?.nome || "Sistema"}</strong></span>
                      <span>{dataExibicao ? new Date(dataExibicao).toLocaleDateString("pt-PT") : "N/A"}</span>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-2">
                      {pendente && (
                        <button
                          onClick={() => handleAprovarDocumento(doc.id)}
                          className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold"
                        >
                          Aprovar
                        </button>
                      )}
                      <a
                        href={obterUrlFicheiro(doc.caminho)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-200/60"
                        title="Visualizar"
                      >
                        <IconVer />
                      </a>
                      <a
                        href={obterUrlFicheiro(doc.caminho)}
                        download={doc.nomeArquivo || doc.titulo}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-[#18357a] rounded-lg transition-colors border border-blue-100"
                        title="Baixar"
                      >
                        <IconDownload />
                      </a>
                      <button
                        onClick={() => handleAbrirEditar(doc)}
                        className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors border border-amber-200/60"
                        title="Editar"
                      >
                        <IconCaneta />
                      </button>
                      <button
                        onClick={() => handleMoverParaLixeira(doc.id)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-100"
                        title="Mover para lixeira"
                      >
                        <IconLixeira />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-400">
              Nenhum documento encontrado.
            </div>
          )}
        </div>
      )}

      {/* Modal de Registo / Edição */}
      {modalAberto && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-800">
                {docEdicao ? "Editar Documento" : "Adicionar Novo Documento"}
              </h3>
              <button
                onClick={handleFecharModal}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarDocumento} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Ficheiro {docEdicao ? "(Opcional para substituição)" : "*"}
                </label>
                <input
                  type="file"
                  required={!docEdicao}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setArquivoSelecionado(e.target.files[0]);
                    }
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#18357a] hover:file:bg-blue-100 cursor-pointer"
                />
                {arquivoSelecionado && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Selecionado: <strong className="text-slate-600">{arquivoSelecionado.name}</strong> ({formatarTamanho(arquivoSelecionado.size)})
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Título do Documento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Regulamento Interno de Segurança"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Descrição
                </label>
                <textarea
                  rows={2}
                  placeholder="Resumo breve do conteúdo do documento..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Categoria *
                </label>
                <select
                  required
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                >
                  <option value="">Selecione uma categoria...</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleFecharModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="px-4 py-2 bg-[#18357a] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {salvando ? "A Guardar..." : docEdicao ? "Atualizar Documento" : "Registar Documento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}