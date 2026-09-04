import { useState } from "react";
import { useAprovacoesData } from "../../../hooks/useAprovacoesData";
import { Link } from "react-router-dom";
import { IconVer } from "../../../components/icons";
import SearchInput from "../../../components/searchInput";
import ViewToggle from "../../../components/viewToggle";
import DocumentoRow from "../../../components/documentoRow";
import DocumentoCard from "../../../components/documentoCard";
import ModalMotivoRejeicao from "../../../components/modalMotivoRejeicao"
import { toast } from "sonner";

export default function AprovacoesPage() {
  const { documentos, categorias, loading, erro, recarregar, alterarEstado } =
    useAprovacoesData();

  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [statusFiltro, setStatusFiltro] = useState("PENDENTE");
  const [modoExibicao, setModoExibicao] = useState<"tabela" | "cards">(
    "tabela",
  );
  const [idParaRejeitar, setIdParaRejeitar] = useState<number | null>(null);

  const handleAprovar = async (id: number) => {
    try {
      await alterarEstado(id, "APROVADO");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao aprovar documento.");
    }
  };

  const confirmarRejeicao = async (motivo: string) => {
    if (idParaRejeitar === null) return;
    try {
      await alterarEstado(idParaRejeitar, "REJEITADO", motivo || undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao rejeitar documento.");
    } finally {
      setIdParaRejeitar(null);
    }
  };

  const documentosFiltrados = documentos.filter((doc) => {
    const nomeDoc = doc.titulo || doc.nomeArquivo || "";
    const autorDoc = doc.usuario?.nome || "";
    const catDoc = doc.categoria?.nome || "";
    const atendeBusca =
      nomeDoc.toLowerCase().includes(busca.toLowerCase()) ||
      autorDoc.toLowerCase().includes(busca.toLowerCase());
    const atendeCategoria =
      categoriaFiltro === "Todas" ||
      catDoc.toLowerCase() === categoriaFiltro.toLowerCase();
    const atendeStatus =
      statusFiltro === "Todos" || doc.estado === statusFiltro;
    return atendeBusca && atendeCategoria && atendeStatus;
  });

  const totalPendentes = documentos.filter(
    (d) => d.estado === "PENDENTE",
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-slate-500 font-medium animate-pulse text-sm">
          A carregar solicitações...
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

  return (
    <div className="space-y-6">
      <div className="bg-[#18357a] text-white p-6 md:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">
            Gestão de Submissões
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Painel de Aprovações
          </h1>
          <p className="text-sm text-blue-100/80 mt-1">
            Analise, verifique e valide os documentos submetidos pelos
            colaboradores
          </p>
        </div>
        <div className="flex items-center gap-2 bg-amber-400/20 text-amber-200 border border-amber-300/30 px-4 py-2.5 rounded-xl backdrop-blur-sm self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-xs font-bold">
            {totalPendentes} Solicitações Pendentes
          </span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-80 relative">
          <SearchInput
            value={busca}
            onChange={setBusca}
            placeholder="Pesquisar por documento ou colaborador..."
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          >
            <option value="PENDENTE">Apenas Pendentes</option>
            <option value="APROVADO">Apenas Aprovados</option>
            <option value="REJEITADO">Apenas Rejeitados</option>
            <option value="Todos">Todos os Status</option>
          </select>
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
                  <th className="py-3.5 px-4 font-semibold text-right">
                    Ações do Gestor
                  </th>
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
                          <Link
                            to={`/dashboard/aprovacoes/details/${doc.id}`}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-200/60 inline-flex"
                            title="Ver detalhes"
                          >
                            <IconVer />
                          </Link>
                          {doc.estado === "PENDENTE" ? (
                            <>
                              <button
                                onClick={() => handleAprovar(doc.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                              >
                                Aprovar
                              </button>
                              <button
                                onClick={() => setIdParaRejeitar(doc.id)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 text-xs font-semibold rounded-lg transition-colors"
                              >
                                Rejeitar
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-slate-400 italic pl-2">
                              Concluído
                            </span>
                          )}
                        </>
                      }
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">
                      Nenhuma solicitação encontrada para o filtro selecionado.
                    </td>
                  </tr>
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
                    <Link
                      to={`/dashboard/aprovacoes/details/${doc.id}`}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-200/60"
                      title="Ver detalhes"
                    >
                      <IconVer />
                    </Link>
                    {doc.estado === "PENDENTE" ? (
                      <>
                        <button
                          onClick={() => handleAprovar(doc.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => setIdParaRejeitar(doc.id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Rejeitar
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 italic pl-2">
                        Concluído
                      </span>
                    )}
                  </>
                }
              />
            ))
          ) : (
            <div className="col-span-full bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-400">
              Nenhuma solicitação encontrada para o filtro selecionado.
            </div>
          )}
        </div>
      )}

      <ModalMotivoRejeicao
        aberto={idParaRejeitar !== null}
        onConfirmar={confirmarRejeicao}
        onCancelar={() => setIdParaRejeitar(null)}
      />
    </div>
  );
}