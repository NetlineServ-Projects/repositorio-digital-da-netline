import { useState, useEffect } from "react";

interface DocumentoAprovacao {
  id: string | number;
  nome: string;
  categoria: string;
  autor: string;
  tamanho: string;
  dataUpload: string;
  status: "Pendente" | "Aprovado" | "Rejeitado";
}

interface Categoria {
  id: string | number;
  nome: string;
}

export default function Aprovacoes() {
  // Mock inicial de solicitações para aprovação
  const [documentos, setDocumentos] = useState<DocumentoAprovacao[]>([
    {
      id: "1",
      nome: "Relatorio_Anual_Netline_2025.pdf",
      categoria: "Relatórios",
      autor: "Elisa Nhamuanzo",
      tamanho: "2.4 MB",
      dataUpload: "21/07/2026",
      status: "Pendente",
    },
    {
      id: "2",
      nome: "Manual_de_Procedimentos.docx",
      categoria: "Documentação",
      autor: "Kevin Silva",
      tamanho: "1.1 MB",
      dataUpload: "20/07/2026",
      status: "Aprovado",
    },
    {
      id: "3",
      nome: "Proposta_Orcamento_Q3.pdf",
      categoria: "Finanças",
      autor: "Marta Cossa",
      tamanho: "1.8 MB",
      dataUpload: "18/07/2026",
      status: "Rejeitado",
    },
  ]);

  const [categorias, setCategorias] = useState<Categoria[]>([]);


  // Filtros de controle
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [statusFiltro, setStatusFiltro] = useState<string>("Pendente"); // Default focado nos Pendentes
  const [modoExibicao, setModoExibicao] = useState<"tabela" | "cards">("tabela");

  // Buscar categorias da API
  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const token = localStorage.getItem("token_sistema");
        const res = await fetch("http://localhost:3000/api/categorias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const dados = await res.json();
          setCategorias(dados);
        }
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
      }
    };
    carregarCategorias();
  }, []);

  // Lógica de Aprovar / Rejeitar
  const handleAlterarStatus = (id: string | number, novoStatus: "Aprovado" | "Rejeitado") => {
    setDocumentos((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, status: novoStatus } : doc
      )
    );
  };

  // Filtragem dos documentos
  const documentosFiltrados = documentos.filter((doc) => {
    const atendeBusca =
      doc.nome.toLowerCase().includes(busca.toLowerCase()) ||
      doc.autor.toLowerCase().includes(busca.toLowerCase());

    const atendeCategoria =
      categoriaFiltro === "Todas" ||
      doc.categoria.toLowerCase() === categoriaFiltro.toLowerCase();

    const atendeStatus =
      statusFiltro === "Todos" || doc.status === statusFiltro;

    return atendeBusca && atendeCategoria && atendeStatus;
  });

  const totalPendentes = documentos.filter((d) => d.status === "Pendente").length;

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Aba */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Painel de Aprovações
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Analise, aprove ou rejeite submissões feitas pelos funcionários
          </p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 text-amber-800 px-3.5 py-1.5 rounded-lg text-xs font-bold border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>{totalPendentes} Solicitacões Pendentes</span>
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Input de Busca */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Pesquisar por documento ou funcionário..."
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

        {/* Dropdowns e Controles */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Filtro por Status */}
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          >
            <option value="Pendente">Apenas Pendentes</option>
            <option value="Aprovado">Apenas Aprovados</option>
            <option value="Rejeitado">Apenas Rejeitados</option>
            <option value="Todos">Todos os Status</option>
          </select>

          {/* Filtro por Categoria */}
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          >
            <option value="Todas">Todas as Categorias</option>
            {categorias.length > 0 ? (
              categorias.map((cat) => (
                <option key={cat.id} value={cat.nome}>
                  {cat.nome}
                </option>
              ))
            ) : (
              <>
                <option value="Relatórios">Relatórios</option>
                <option value="Documentação">Documentação</option>
                <option value="Finanças">Finanças</option>
              </>
            )}
          </select>

          {/* Botões Mudar Modo de Exibição */}
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

      {/* Conteúdo: Tabela ou Cards */}
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
                  <th className="py-3.5 px-4 font-semibold text-right">Ação do Gestor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documentosFiltrados.length > 0 ? (
                  documentosFiltrados.map((doc) => {
                    const ext = doc.nome.split(".").pop() || "doc";
                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                          <span className="p-2 bg-blue-50 text-blue-800 rounded-lg text-xs font-bold uppercase">
                            {ext}
                          </span>
                          <span className="truncate max-w-xs" title={doc.nome}>
                            {doc.nome}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">{doc.categoria}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">{doc.autor}</td>
                        <td className="py-3.5 px-4 text-xs">{doc.dataUpload}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              doc.status === "Aprovado"
                                ? "bg-emerald-100 text-emerald-700"
                                : doc.status === "Pendente"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          {doc.status === "Pendente" ? (
                            <>
                              <button
                                onClick={() => handleAlterarStatus(doc.id, "Aprovado")}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                              >
                                Aprovar
                              </button>
                              <button
                                onClick={() => handleAlterarStatus(doc.id, "Rejeitado")}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors"
                              >
                                Rejeitar
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              Processado
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      Nenhuma solicitação encontrada com os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Visualização em Cards/Grelha */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentosFiltrados.length > 0 ? (
            documentosFiltrados.map((doc) => {
              const ext = doc.nome.split(".").pop() || "doc";
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
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          doc.status === "Aprovado"
                            ? "bg-emerald-100 text-emerald-700"
                            : doc.status === "Pendente"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm truncate" title={doc.nome}>
                      {doc.nome}
                    </h4>
                    <p className="text-xs text-slate-400 mt-2">
                      Submetido por: <span className="text-slate-700 font-medium">{doc.autor}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Categoria: <span className="text-slate-600">{doc.categoria}</span>
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{doc.dataUpload}</span>
                    {doc.status === "Pendente" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAlterarStatus(doc.id, "Rejeitado")}
                          className="px-2.5 py-1 text-xs text-red-600 font-semibold hover:bg-red-50 rounded transition-colors"
                        >
                          Rejeitar
                        </button>
                        <button
                          onClick={() => handleAlterarStatus(doc.id, "Aprovado")}
                          className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                          Aprovar
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Concluído</span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-400">
              Nenhuma solicitação encontrada.
            </div>
          )}
        </div>
      )}
    </div>
  );
}