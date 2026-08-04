import { useState } from "react";
import { IconVer, IconDownload } from "../components/icons";
import { useAprovacoesData } from "../hooks/useAprovacoesData";
import { obterUrlFicheiro, formatarExtensao, obterNomeExibicao, formatarTamanho } from "../utils/documentos";
import { API_URL } from "../utils/api";

export default function Aprovacoes() {
  const { documentos, categorias, loading, erro, recarregar, alterarEstado } = useAprovacoesData();

  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [statusFiltro, setStatusFiltro] = useState<string>("PENDENTE");
  const [modoExibicao, setModoExibicao] = useState<"tabela" | "cards">("tabela");

  const handleAprovar = async (id: number) => {
    try {
      await alterarEstado(id, "APROVADO");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao aprovar documento.");
    }
  };

  const handleRejeitar = async (id: number) => {
    const motivo = prompt("Motivo da rejeição (opcional):") || undefined;
    try {
      await alterarEstado(id, "REJEITADO", motivo);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao rejeitar documento.");
    }
  };

  const documentosFiltrados = documentos.filter((doc) => {
    const nomeDoc = doc.titulo || doc.nomeArquivo || "";
    const autorDoc = doc.usuario?.nome || "";
    const catDoc = doc.categoria?.nome || "";

    const atendeBusca = nomeDoc.toLowerCase().includes(busca.toLowerCase()) || autorDoc.toLowerCase().includes(busca.toLowerCase());
    const atendeCategoria = categoriaFiltro === "Todas" || catDoc.toLowerCase() === categoriaFiltro.toLowerCase();
    const atendeStatus = statusFiltro === "Todos" || doc.estado === statusFiltro;

    return atendeBusca && atendeCategoria && atendeStatus;
  });

  const totalPendentes = documentos.filter((d) => d.estado === "PENDENTE").length;

  if (loading) {
    return <div className="flex items-center justify-center p-12"><p className="text-slate-500 font-medium animate-pulse text-sm">A carregar solicitações...</p></div>;
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
          <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">Gestão de Submissões</p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Painel de Aprovações</h1>
          <p className="text-sm text-blue-100/80 mt-1">Analise, verifique e valide os documentos submetidos pelos colaboradores</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-400/20 text-amber-200 border border-amber-300/30 px-4 py-2.5 rounded-xl backdrop-blur-sm self-start md:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-xs font-bold">{totalPendentes} Solicitações Pendentes</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Pesquisar por documento ou colaborador..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)} className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-900/20">
            <option value="PENDENTE">Apenas Pendentes</option>
            <option value="APROVADO">Apenas Aprovados</option>
            <option value="REJEITADO">Apenas Rejeitados</option>
            <option value="Todos">Todos os Status</option>
          </select>

          <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)} className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900/20">
            <option value="Todas">Todas as Categorias</option>
            {categorias.map((cat) => <option key={cat.id} value={cat.nome}>{cat.nome}</option>)}
          </select>

          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 ml-auto md:ml-0">
            <button onClick={() => setModoExibicao("tabela")} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${modoExibicao === "tabela" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>Tabela</button>
            <button onClick={() => setModoExibicao("cards")} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${modoExibicao === "cards" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>Grelha</button>
          </div>
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
                  <th className="py-3.5 px-4 font-semibold text-right">Ações do Gestor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documentosFiltrados.length > 0 ? (
                  documentosFiltrados.map((doc) => {
                    const ext = formatarExtensao(doc.tipoArquivo, doc.nomeArquivo);
                    const nomeExibicao = obterNomeExibicao(doc);

                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 text-slate-800 flex items-center gap-3">
                          <span className="p-2 bg-blue-50 text-[#18357a] rounded-lg text-[11px] font-extrabold uppercase min-w-10 text-center shrink-0 border border-blue-100/50">{ext}</span>
                          <div className="flex flex-col truncate max-w-xs md:max-w-sm">
                            <span className="font-semibold text-slate-800 text-sm truncate" title={nomeExibicao}>{nomeExibicao}</span>
                            {doc.descricao && <span className="text-xs text-slate-400 font-normal truncate" title={doc.descricao}>{doc.descricao}</span>}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">{doc.categoria?.nome || "Sem Categoria"}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">{doc.usuario?.nome || "Sistema"}</td>
                        <td className="py-3.5 px-4 text-xs">{doc.dataSubmissao ? new Date(doc.dataSubmissao).toLocaleDateString("pt-PT") : "N/A"}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${doc.estado === "APROVADO" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : doc.estado === "PENDENTE" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
                            {doc.estado === "APROVADO" ? "Aprovado" : doc.estado === "PENDENTE" ? "Pendente" : "Rejeitado"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a href={obterUrlFicheiro(doc.caminho, API_URL)} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-200/60" title="Visualizar documento">
                              <IconVer />
                            </a>
                            <a href={obterUrlFicheiro(doc.caminho, API_URL)} download={doc.nomeArquivo} className="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#18357a] rounded-lg transition-colors border border-blue-100" title="Baixar ficheiro">
                              <IconDownload />
                            </a>

                            {doc.estado === "PENDENTE" ? (
                              <>
                                <button onClick={() => handleAprovar(doc.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm">Aprovar</button>
                                <button onClick={() => handleRejeitar(doc.id)} className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 text-xs font-semibold rounded-lg transition-colors">Rejeitar</button>
                              </>
                            ) : (
                              <span className="text-xs text-slate-400 italic pl-2">Concluído</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={6} className="text-center py-8 text-slate-400">Nenhuma solicitação encontrada para o filtro selecionado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentosFiltrados.length > 0 ? (
            documentosFiltrados.map((doc) => {
              const ext = formatarExtensao(doc.tipoArquivo, doc.nomeArquivo);
              const nomeExibicao = obterNomeExibicao(doc);

              return (
                <div key={doc.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="p-2 bg-blue-50 text-[#18357a] rounded-lg text-xs font-extrabold uppercase border border-blue-100/50">{ext}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${doc.estado === "APROVADO" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : doc.estado === "PENDENTE" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>
                        {doc.estado === "APROVADO" ? "Aprovado" : doc.estado === "PENDENTE" ? "Pendente" : "Rejeitado"}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm truncate" title={nomeExibicao}>{nomeExibicao}</h4>
                      {doc.descricao && <p className="text-xs text-slate-400 line-clamp-2 mt-1" title={doc.descricao}>{doc.descricao}</p>}
                    </div>
                    <div className="text-xs space-y-1 text-slate-500 pt-1">
                      <p>Submetido por: <strong className="text-slate-700">{doc.usuario?.nome || "Sistema"}</strong></p>
                      <p>Categoria: <span className="text-slate-600">{doc.categoria?.nome || "Sem Categoria"}</span></p>
                      <p>Tamanho: <span className="text-slate-600">{formatarTamanho(doc.tamanho)}</span></p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{doc.dataSubmissao ? new Date(doc.dataSubmissao).toLocaleDateString("pt-PT") : "N/A"}</span>
                    <div className="flex items-center gap-1.5">
                      <a href={obterUrlFicheiro(doc.caminho, API_URL)} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-200/60" title="Visualizar">
                        <IconVer />
                      </a>
                      <a href={obterUrlFicheiro(doc.caminho, API_URL)} download={doc.nomeArquivo} className="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#18357a] rounded-lg transition-colors border border-blue-100" title="Baixar">
                        <IconDownload />
                      </a>
                      {doc.estado === "PENDENTE" ? (
                        <div className="flex gap-1.5 ml-1">
                          <button onClick={() => handleRejeitar(doc.id)} className="px-2.5 py-1 text-xs text-rose-600 font-semibold hover:bg-rose-50 rounded-lg transition-colors border border-rose-200/60">Rejeitar</button>
                          <button onClick={() => handleAprovar(doc.id)} className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">Aprovar</button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic ml-2">Concluído</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-400">Nenhuma solicitação encontrada para o filtro selecionado.</div>
          )}
        </div>
      )}
    </div>
  );
}