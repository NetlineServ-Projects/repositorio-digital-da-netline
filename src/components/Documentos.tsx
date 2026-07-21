import React, { useState, useEffect } from "react";

// Interface alinhada com o modelo da base de dados (Prisma)
interface Documento {
  id: string | number;
  titulo: string;
  nomeArquivo?: string;
  tamanho?: string;
  createdAt: string;
  usuario?: {
    nome: string;
  };
  categoria?: {
    nome: string;
  };
}

interface Categoria {
  id: string | number;
  nome: string;
}

interface DocumentosProps {
  categoriaInicial?: string;
}

export default function Documentos({ categoriaInicial = "Todas" }: DocumentosProps) {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  // Filtros
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState(categoriaInicial);
  const [modoExibicao, setModoExibicao] = useState<"tabela" | "cards">("tabela");

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

      // Buscar Documentos e Categorias em paralelo
      const [resDocs, resCats] = await Promise.all([
        fetch("http://localhost:3000/api/documentos", { headers }),
        fetch("http://localhost:3000/api/categorias", { headers }),
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
          className="px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Repositório de Documentos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Consulta e download dos ficheiros oficiais da Netline
          </p>
        </div>
        <div className="bg-blue-50 text-blue-900 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100">
          Total: {documentos.length} Documentos
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros */}
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
          {/* Dropdown de Categorias */}
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

          {/* Alternar Visualização */}
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
                  <th className="py-3.5 px-4 font-semibold">Autor / Criado Por</th>
                  <th className="py-3.5 px-4 font-semibold">Data de Criação</th>
                  <th className="py-3.5 px-4 font-semibold">Tamanho</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documentosFiltrados.length > 0 ? (
                  documentosFiltrados.map((doc) => {
                    const ext = doc.nomeArquivo?.split(".").pop() || "doc";
                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                          <span className="p-2 bg-blue-50 text-blue-800 rounded-lg text-xs font-bold uppercase">
                            {ext}
                          </span>
                          <span className="truncate max-w-xs">
                            {doc.titulo || doc.nomeArquivo}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">{doc.categoria?.nome || "Sem Categoria"}</td>
                        <td className="py-3.5 px-4">{doc.usuario?.nome || "Sistema"}</td>
                        <td className="py-3.5 px-4 text-xs">
                          {new Date(doc.createdAt).toLocaleDateString("pt-PT")}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">
                          {doc.tamanho || "N/A"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button className="px-3 py-1.5 bg-blue-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors shadow-sm">
                            Baixar
                          </button>
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
        /* Visualização Grelha */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentosFiltrados.length > 0 ? (
            documentosFiltrados.map((doc) => {
              const ext = doc.nomeArquivo?.split(".").pop() || "doc";
              return (
                <div
                  key={doc.id}
                  className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="p-2 bg-blue-50 text-blue-800 rounded-lg text-xs font-bold uppercase">
                        {ext}
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        {doc.categoria?.nome || "Geral"}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm truncate">
                      {doc.titulo || doc.nomeArquivo}
                    </h4>
                    <p className="text-xs text-slate-400 mt-2">
                      Criado por: <span className="text-slate-600 font-medium">{doc.usuario?.nome || "Sistema"}</span>
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>{new Date(doc.createdAt).toLocaleDateString("pt-PT")}</span>
                    <button className="text-blue-900 font-semibold hover:underline">
                      Baixar Ficheiro
                    </button>
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
    </div>
  );
}