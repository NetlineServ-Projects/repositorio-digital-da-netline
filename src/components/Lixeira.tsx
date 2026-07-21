import React, { useState, useEffect } from "react";

export interface DocumentoLixeira {
  id: string;
  titulo: string;
  categoria: string;
  tamanho: string;
  autor: string;
  dataEliminacao: string; // Formato ISO: "YYYY-MM-DDTHH:mm:ss"
}

export default function Lixeira() {
  // Estado com mock de dados iniciais (substituir pela chamada da API)
  const [documentosExcluidos, setDocumentosExcluidos] = useState<DocumentoLixeira[]>([
    {
      id: "doc-101",
      titulo: "Relatorio_Atividades_Q1_2026.pdf",
      categoria: "Relatórios",
      tamanho: "2.4 MB",
      autor: "Elisa Nhamuanzo",
      dataEliminacao: "2026-07-05T10:30:00", // Eliminado há ~16 dias (faltam ~14)
    },
    {
      id: "doc-102",
      titulo: "Manual_Boas_Vindas_Kevin.pdf",
      categoria: "Recursos Humanos",
      tamanho: "1.1 MB",
      autor: "Elisa Nhamuanzo",
      dataEliminacao: "2026-06-25T14:15:00", // Eliminado há ~26 dias (faltam ~4)
    },
    {
      id: "doc-103",
      titulo: "Proposta_Comercial_Draft.docx",
      categoria: "Contratos",
      tamanho: "540 KB",
      autor: "Mário Silva",
      dataEliminacao: "2026-07-20T09:00:00", // Eliminado ontem (faltam 29 dias)
    },
  ]);

  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "info"; texto: string } | null>(null);

  // Função para calcular os dias restantes até completar 30 dias
  const calcularDiasRestantes = (dataEliminacaoStr: string): number => {
    const dataEliminacao = new Date(dataEliminacaoStr);
    const dataLimite = new Date(dataEliminacao);
    dataLimite.setDate(dataLimite.getDate() + 30); // Adiciona 30 dias

    const hoje = new Date();
    const diferencaTempo = dataLimite.getTime() - hoje.getTime();
    const diasRestantes = Math.ceil(diferencaTempo / (1000 * 3600 * 24));

    return diasRestantes > 0 ? diasRestantes : 0;
  };

  // Restaurar documento
  const restaurarDocumento = (id: string, titulo: string) => {
    // Aqui faria o chamado para a API/Backend: UPDATE documentos SET deleted_at = NULL WHERE id = id
    setDocumentosExcluidos((prev) => prev.filter((doc) => doc.id !== id));
    exibirMensagem("sucesso", `O documento "${titulo}" foi restaurado com sucesso!`);
  };

  // Excluir permanentemente antes dos 30 dias
  const excluirPermanente = (id: string, titulo: string) => {
    if (confirm(`Tem certeza que deseja apagar "${titulo}" definitivamente? Esta ação não pode ser desfeita.`)) {
      // Aqui faria o chamado para a API/Backend: DELETE FROM documentos WHERE id = id
      setDocumentosExcluidos((prev) => prev.filter((doc) => doc.id !== id));
      exibirMensagem("info", `Documento "${titulo}" excluído definitivamente.`);
    }
  };

  // Esvaziar toda a lixeira
  const esvaziarLixeira = () => {
    if (confirm("Tem certeza que deseja apagar TODOS os itens da lixeira definitivamente?")) {
      setDocumentosExcluidos([]);
      exibirMensagem("info", "A lixeira foi esvaziada completamente.");
    }
  };

  const exibirMensagem = (tipo: "sucesso" | "info", texto: string) => {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem(null), 3500);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
      {/* Cabeçalho */}
      <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Lixeira do Repositório
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-0.5">
            Os itens descartados são mantidos por até 30 dias antes de serem apagados definitivamente.
          </p>
        </div>

        {documentosExcluidos.length > 0 && (
          <button
            onClick={esvaziarLixeira}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg text-sm transition-colors border border-red-200 self-start sm:self-auto"
          >
            Esvaziar Lixeira
          </button>
        )}
      </div>

      {/* Alerta / Mensagem de Feedback */}
      {mensagem && (
        <div
          className={`mb-6 p-3 rounded-lg text-xs font-semibold flex items-center justify-between ${
            mensagem.tipo === "sucesso"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          <span>{mensagem.texto}</span>
        </div>
      )}

      {/* Tabela de Documentos */}
      {documentosExcluidos.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-semibold">
                <th className="py-3 px-4">Documento</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Tamanho</th>
                <th className="py-3 px-4">Exclusão Definitiva em</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {documentosExcluidos.map((doc) => {
                const diasRestantes = calcularDiasRestantes(doc.dataEliminacao);

                return (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Nome do Documento */}
                    <td className="py-4 px-4 font-medium text-slate-800">
                      <div>{doc.titulo}</div>
                      <span className="text-xs text-slate-400 font-normal">Por: {doc.autor}</span>
                    </td>

                    {/* Categoria */}
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs">
                        {doc.categoria}
                      </span>
                    </td>

                    {/* Tamanho */}
                    <td className="py-4 px-4 text-slate-500 text-xs">{doc.tamanho}</td>

                    {/* Prazo Restante */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          diasRestantes <= 5
                            ? "bg-red-50 text-red-600 border border-red-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {diasRestantes === 0
                          ? "Expira hoje"
                          : `${diasRestantes} ${diasRestantes === 1 ? "dia" : "dias"}`}
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => restaurarDocumento(doc.id, doc.titulo)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded-lg text-xs transition-colors border border-emerald-200"
                        title="Restaurar para o repositório"
                      >
                        Restaurar
                      </button>
                      <button
                        onClick={() => excluirPermanente(doc.id, doc.titulo)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-medium rounded-lg text-xs transition-colors border border-slate-200"
                        title="Eliminar permanentemente"
                      >
                        Apagar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Estado Vazio */
        <div className="py-16 text-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✓
          </div>
          <h3 className="text-base font-bold text-slate-700">A lixeira está vazia</h3>
          <p className="text-xs text-slate-400 mt-1">
            Nenhum documento descartado recentemente no repositório.
          </p>
        </div>
      )}
    </div>
  );
}