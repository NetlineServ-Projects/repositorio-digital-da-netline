import React, { useState } from "react";
import { IconPasta} from "../components/icons";

interface Documento {
  id: string | number;
  nome: string;
  autor: string;
  tamanho: string;
  dataUpload: string;
  status: "Pendente" | "Aprovado" | "Rejeitado";
}

interface Categoria {
  id: string | number;
  nome: string;
  descricao: string;
  totalDocumentos: number;
}

export default function Categorias() {
  // Lista de Categorias
  const [categorias] = useState<Categoria[]>([
    {
      id: "1",
      nome: "Relatórios",
      descricao: "Relatórios de desempenho, auditorias e balanços periódicos.",
      totalDocumentos: 12,
    },
    {
      id: "2",
      nome: "Documentação",
      descricao: "Manuais internos, procedimentos operacionais e diretrizes.",
      totalDocumentos: 8,
    },
    {
      id: "3",
      nome: "Finanças",
      descricao: "Propostas de orçamento, faturas, recibos e relatórios financeiros.",
      totalDocumentos: 15,
    },
    {
      id: "4",
      nome: "Recursos Humanos",
      descricao: "Contratos de trabalho, folhas de ponto e políticas da empresa.",
      totalDocumentos: 6,
    },
  ]);

  // Mock de Documentos vinculados por Categoria
  const [documentosPorCategoria] = useState<Record<string, Documento[]>>({
    Relatórios: [
      {
        id: "101",
        nome: "Relatorio_Anual_Netline_2025.pdf",
        autor: "Elisa Nhamuanzo",
        tamanho: "2.4 MB",
        dataUpload: "21/07/2026",
        status: "Pendente",
      },
      {
        id: "102",
        nome: "Relatorio_Auditoria_Q1.pdf",
        autor: "Carlos Machava",
        tamanho: "3.1 MB",
        dataUpload: "15/06/2026",
        status: "Aprovado",
      },
    ],
    Documentação: [
      {
        id: "201",
        nome: "Manual_de_Procedimentos.docx",
        autor: "Kevin Silva",
        tamanho: "1.1 MB",
        dataUpload: "20/07/2026",
        status: "Aprovado",
      },
      {
        id: "202",
        nome: "Politica_de_Seguranca_Redes.pdf",
        autor: "Elisa Nhamuanzo",
        tamanho: "850 KB",
        dataUpload: "10/05/2026",
        status: "Aprovado",
      },
    ],
    Finanças: [
      {
        id: "301",
        nome: "Proposta_Orcamento_Q3.pdf",
        autor: "Marta Cossa",
        tamanho: "1.8 MB",
        dataUpload: "18/07/2026",
        status: "Rejeitado",
      },
      {
        id: "302",
        nome: "Balancete_Trimestral.xlsx",
        autor: "Marta Cossa",
        tamanho: "2.0 MB",
        dataUpload: "01/07/2026",
        status: "Aprovado",
      },
    ],
    "Recursos Humanos": [
      {
        id: "401",
        nome: "Regulamento_Interno_2026.pdf",
        autor: "RH Netline",
        tamanho: "1.5 MB",
        dataUpload: "12/01/2026",
        status: "Aprovado",
      },
    ],
  });

  // Estados de navegação e filtros
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria | null>(null);
  const [busca, setBusca] = useState("");
  const [buscaDoc, setBuscaDoc] = useState("");

  // Categorias filtradas na pesquisa
  const categoriasFiltradas = categorias.filter(
    (cat) =>
      cat.nome.toLowerCase().includes(busca.toLowerCase()) ||
      cat.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  // Documentos da categoria selecionada
  const documentosDaCategoria = categoriaAtiva
    ? (documentosPorCategoria[categoriaAtiva.nome] || []).filter((doc) =>
        doc.nome.toLowerCase().includes(buscaDoc.toLowerCase()) ||
        doc.autor.toLowerCase().includes(buscaDoc.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      {/* VISTA 1: LISTA DE CATEGORIAS */}
      {!categoriaAtiva ? (
        <>
          {/* Cabeçalho */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Categorias de Documentos
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Explore as categorias e veja os ficheiros guardados no repositório
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              Total de Categorias:{" "}
              <span className="text-blue-900 font-bold">{categorias.length}</span>
            </div>
          </div>

          {/* Pesquisa por Categoria */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Pesquisar categoria..."
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
          </div>

          {/* Grelha de Categorias */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriasFiltradas.length > 0 ? (
              categoriasFiltradas.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg">
                        <IconPasta className="w-6 h-6 text-blue-900" />
                      </div>
                      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
                        {cat.totalDocumentos}{" "}
                        {cat.totalDocumentos === 1 ? "documento" : "documentos"}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-base">{cat.nome}</h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {cat.descricao}
                    </p>
                  </div>

                  {/* Botão de Ver Documentos */}
                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setCategoriaAtiva(cat);
                        setBuscaDoc("");
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-50 hover:bg-blue-900 hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200 hover:border-blue-900"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span>Ver Documentos</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-400">
                Nenhuma categoria encontrada.
              </div>
            )}
          </div>
        </>
      ) : (
        /* VISTA 2: LISTAGEM DIRETA DOS DOCUMENTOS DA CATEGORIA SELECIONADA */
        <div className="space-y-6">
          {/* Topo com botão de Voltar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCategoriaAtiva(null)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              >
                ← Voltar às Categorias
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <IconPasta className="w-5 h-5 text-blue-900" />
                  <h2 className="text-xl font-bold text-slate-800">
                    {categoriaAtiva.nome}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {categoriaAtiva.descricao}
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              Total: <span className="text-blue-900 font-bold">{documentosDaCategoria.length} ficheiros</span>
            </span>
          </div>

          {/* Barra de Pesquisa de Ficheiros */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Pesquisar documento nesta categoria..."
                value={buscaDoc}
                onChange={(e) => setBuscaDoc(e.target.value)}
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documentosDaCategoria.length > 0 ? (
                    documentosDaCategoria.map((doc) => {
                      const ext = doc.nome.split(".").pop() || "doc";
                      return (
                        <tr
                          key={doc.id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                            <span className="p-2 bg-blue-50 text-blue-900 rounded-lg text-xs font-bold uppercase">
                              {ext}
                            </span>
                            <span className="truncate max-w-xs" title={doc.nome}>
                              {doc.nome}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-medium">
                            {doc.autor}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-500">
                            {doc.tamanho}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-500">
                            {doc.dataUpload}
                          </td>
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
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-8 text-slate-400 text-sm"
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
    </div>
  );
}