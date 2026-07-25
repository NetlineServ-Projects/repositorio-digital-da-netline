import React, { useState, useEffect } from "react";

export interface DocumentoLixeira {
  id: string | number;
  titulo?: string;
  nome?: string;
  categoriaId?: string | number;
  categoria?: {
    id: string | number;
    nome: string;
  };
  tamanho?: string | number;
  autor?: string;
  usuario?: { nome: string };
  status?: string;
  estado?: string;
  updatedAt?: string;
  dataEliminacao?: string;
}

export default function Lixeira() {
  const [documentosExcluidos, setDocumentosExcluidos] = useState<DocumentoLixeira[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "info"; texto: string } | null>(null);

  // Formata bytes para KB, MB, GB de forma legível
  const formatarTamanho = (bytes?: string | number): string => {
    if (!bytes) return "N/D";
    const numBytes = Number(bytes);
    if (isNaN(numBytes) || numBytes === 0) return "0 B";

    const k = 1024;
    const tamanhos = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(numBytes) / Math.log(k));

    return `${parseFloat((numBytes / Math.pow(k, i)).toFixed(1))} ${tamanhos[i]}`;
  };

  // Busca os documentos na API
  const fetchLixeira = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("token_sistema");
      const res = await fetch("http://localhost:3000/api/documentos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const todosDocumentos: DocumentoLixeira[] = await res.json();
        
        // Filtra os documentos cuja propriedade "estado" ou "status" seja "LIXEIRA"
        const apenasLixeira = todosDocumentos.filter((doc) => {
          const estadoDoc = (doc.estado || doc.status || "").toString().toUpperCase();
          return estadoDoc === "LIXEIRA";
        });
        
        setDocumentosExcluidos(apenasLixeira);
      }
    } catch (error) {
      console.error("Erro ao carregar itens da lixeira:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLixeira();
  }, []);

  // Calcula os dias restantes até completar 30 dias na lixeira
  const calcularDiasRestantes = (dataStr?: string): number => {
    if (!dataStr) return 30;
    const dataEliminacao = new Date(dataStr);
    const dataLimite = new Date(dataEliminacao);
    dataLimite.setDate(dataLimite.getDate() + 30);

    const hoje = new Date();
    const diferencaTempo = dataLimite.getTime() - hoje.getTime();
    const diasRestantes = Math.ceil(diferencaTempo / (1000 * 3600 * 24));

    return diasRestantes > 0 ? diasRestantes : 0;
  };

  // Restaurar documento para o repositório (atualiza estado para APROVADO)
  const restaurarDocumento = async (id: string | number, titulo: string) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("token_sistema");
      const res = await fetch(`http://localhost:3000/api/documentos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Envia 'estado' alinhado ao Schema do Prisma e Controller
        body: JSON.stringify({ estado: "APROVADO" }),
      });

      if (!res.ok) throw new Error("Erro ao restaurar o documento.");

      setDocumentosExcluidos((prev) => prev.filter((doc) => doc.id !== id));
      exibirMensagem("sucesso", `O documento "${titulo}" foi restaurado com sucesso!`);
    } catch (err: any) {
      alert(err.message || "Falha ao restaurar documento.");
    }
  };

  // Excluir permanentemente da base de dados
  const excluirPermanente = async (id: string | number, titulo: string) => {
    if (!confirm(`Tem certeza que deseja apagar "${titulo}" definitivamente? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("token_sistema");
      const res = await fetch(`http://localhost:3000/api/documentos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao eliminar o documento.");

      setDocumentosExcluidos((prev) => prev.filter((doc) => doc.id !== id));
      exibirMensagem("info", `Documento "${titulo}" excluído definitivamente.`);
    } catch (err: any) {
      alert(err.message || "Falha ao eliminar o documento.");
    }
  };

  // Esvaziar toda a lixeira
  const esvaziarLixeira = async () => {
    if (!confirm("Tem certeza que deseja apagar TODOS os itens da lixeira definitivamente?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("token_sistema");
      
      await Promise.all(
        documentosExcluidos.map((doc) =>
          fetch(`http://localhost:3000/api/documentos/${doc.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      setDocumentosExcluidos([]);
      exibirMensagem("info", "A lixeira foi esvaziada completamente.");
    } catch (err: any) {
      alert("Ocorreu um erro ao tentar esvaziar a lixeira.");
    }
  };

  const exibirMensagem = (tipo: "sucesso" | "info", texto: string) => {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem(null), 3500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <p className="text-slate-500 font-medium text-sm animate-pulse">
          A carregar itens da lixeira...
        </p>
      </div>
    );
  }

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
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg text-sm transition-colors border border-red-200 self-start sm:self-auto cursor-pointer"
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
                const tituloDoc = doc.titulo || doc.nome || "Documento sem nome";
                const autorDoc = doc.autor || doc.usuario?.nome || "Sistema";
                const categoriaDoc = doc.categoria?.nome || "Geral";
                const dataExclusao = doc.dataEliminacao || doc.updatedAt;
                const diasRestantes = calcularDiasRestantes(dataExclusao);

                return (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Nome do Documento */}
                    <td className="py-4 px-4 font-medium text-slate-800">
                      <div className="truncate max-w-xs" title={tituloDoc}>{tituloDoc}</div>
                      <span className="text-xs text-slate-400 font-normal">Por: {autorDoc}</span>
                    </td>

                    {/* Categoria */}
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs">
                        {categoriaDoc}
                      </span>
                    </td>

                    {/* Tamanho Formatado (KB, MB) */}
                    <td className="py-4 px-4 text-slate-500 text-xs">
                      {formatarTamanho(doc.tamanho)}
                    </td>

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
                    <td className="py-4 px-4 text-right space-x-2 shrink-0">
                      <button
                        onClick={() => restaurarDocumento(doc.id, tituloDoc)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded-lg text-xs transition-colors border border-emerald-200 cursor-pointer"
                        title="Restaurar para o repositório"
                      >
                        Restaurar
                      </button>
                      <button
                        onClick={() => excluirPermanente(doc.id, tituloDoc)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-medium rounded-lg text-xs transition-colors border border-slate-200 cursor-pointer"
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