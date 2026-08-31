import { useState } from "react";
import { toast } from "sonner";
import { useLixeiraData } from "../../../hooks/useLixeiraData";

export default function LixeiraPage() {
  const {
    documentos,
    loading,
    erro,
    restaurar,
    excluirDefinitivo,
    esvaziar,
  } = useLixeiraData();

  const [termoPesquisa, setTermoPesquisa] = useState("");

  // =========================================================
  // FORMATAR TAMANHO
  // =========================================================

  const formatarTamanho = (
    bytes?: string | number | null,
  ): string => {
    if (bytes === undefined || bytes === null || bytes === "") {
      return "N/D";
    }

    const numBytes = Number(bytes);

    if (Number.isNaN(numBytes)) {
      return "N/D";
    }

    if (numBytes === 0) {
      return "0 B";
    }

    const k = 1024;
    const tamanhos = ["B", "KB", "MB", "GB"];

    const indice = Math.min(
      Math.floor(Math.log(numBytes) / Math.log(k)),
      tamanhos.length - 1,
    );

    return `${parseFloat(
      (numBytes / Math.pow(k, indice)).toFixed(1),
    )} ${tamanhos[indice]}`;
  };

  // =========================================================
  // CALCULAR DIAS RESTANTES
  // =========================================================

  const calcularDiasRestantes = (
    apagadoEm?: string | null,
  ): number => {
    if (!apagadoEm) {
      return 30;
    }

    const dataEliminacao = new Date(apagadoEm);

    if (Number.isNaN(dataEliminacao.getTime())) {
      return 30;
    }

    const dataLimite = new Date(dataEliminacao);

    dataLimite.setDate(
      dataLimite.getDate() + 30,
    );

    const hoje = new Date();

    const diferenca =
      dataLimite.getTime() - hoje.getTime();

    const dias = Math.ceil(
      diferenca / (1000 * 60 * 60 * 24),
    );

    return Math.max(dias, 0);
  };

  // =========================================================
  // RESTAURAR DOCUMENTO
  // =========================================================

  const handleRestaurar = async (
    id: number,
    titulo: string,
  ) => {
    try {
      await restaurar(id);
      toast.success(`O documento "${titulo}" foi restaurado com sucesso.`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao restaurar o documento.",
      );
    }
  };

  // =========================================================
  // ELIMINAR DEFINITIVAMENTE (CONFIRMAÇÃO COM SONNER)
  // =========================================================

  const handleExcluirDefinitivo = (
    id: number,
    titulo: string,
  ) => {
    toast.custom((t) => (
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-lg max-w-sm w-full space-y-3">
        <p className="text-sm font-medium text-slate-800">
          Deseja apagar <span className="font-bold">"{titulo}"</span> definitivamente?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t);
              try {
                await excluirDefinitivo(id);
                toast.success(`O documento "${titulo}" foi eliminado.`);
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : "Erro ao eliminar o documento.",
                );
              }
            }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Apagar
          </button>
        </div>
      </div>
    ));
  };

  // =========================================================
  // ESVAZIAR LIXEIRA (CONFIRMAÇÃO COM SONNER)
  // =========================================================

  const handleEsvaziar = () => {
    toast.custom((t) => (
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-lg max-w-sm w-full space-y-3">
        <p className="text-sm font-medium text-slate-800">
          Tem certeza que deseja apagar <span className="font-bold">todos os itens</span> da lixeira definitivamente?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t);
              try {
                await esvaziar();
                toast.success("A lixeira foi esvaziada completamente.");
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : "Erro ao esvaziar a lixeira.",
                );
              }
            }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Esvaziar Tudo
          </button>
        </div>
      </div>
    ));
  };

  // =========================================================
  // FILTRAR DOCUMENTOS
  // =========================================================

  const documentosFiltrados = documentos.filter((doc) => {
    const termo = termoPesquisa.toLowerCase();
    const titulo = (doc.titulo || "").toLowerCase();
    const autor = (doc.usuario?.nome || "").toLowerCase();

    return titulo.includes(termo) || autor.includes(termo);
  });

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <p className="text-slate-500 font-medium text-sm animate-pulse">
          A carregar itens da lixeira...
        </p>
      </div>
    );
  }

  // =========================================================
  // ERRO
  // =========================================================

  if (erro) {
    return (
      <div className="w-full bg-white rounded-2xl border border-red-100 shadow-sm p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            !
          </div>

          <h3 className="text-base font-bold text-slate-700">
            Não foi possível carregar a lixeira
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            {erro}
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // PÁGINA
  // =========================================================

  return (
    <div className="w-full space-y-6">

      {/* BANNER SUPERIOR */}
      <div className="bg-[#18357a] text-white p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
            REPOSITÓRIO
          </span>
          <h1 className="text-3xl font-bold mt-1">Lixeira do Repositório</h1>
          <p className="text-sm text-blue-100/90 mt-1">
            Os itens descartados são mantidos por até 30 dias antes de serem apagados definitivamente.
          </p>
        </div>

        {documentos.length > 0 && (
          <button
            type="button"
            onClick={handleEsvaziar}
            className="px-4 py-2.5 bg-red-50/10 hover:bg-red-500/20 text-red-200 font-medium rounded-xl text-sm transition-colors border border-red-400/30 self-start sm:self-auto cursor-pointer whitespace-nowrap backdrop-blur-sm"
          >
            Esvaziar Lixeira
          </button>
        )}
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="relative max-w-md">
          <input
            type="text"
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
            placeholder="Pesquisar por documento ou autor..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1b365d]/20 focus:border-[#1b365d] transition-all"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"
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

      {/* CONTAINER DA TABELA */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {documentosFiltrados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-semibold">
                  <th className="py-3 px-4">Documento</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Tamanho</th>
                  <th className="py-3 px-4">Exclusão definitiva em</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {documentosFiltrados.map((documento) => {
                  const titulo =
                    documento.titulo || "Documento sem título";

                  const categoria =
                    documento.categoria?.nome || "Geral";

                  const autor =
                    documento.usuario?.nome || "Sistema";

                  const diasRestantes =
                    calcularDiasRestantes(documento.apagadoEm);

                  return (
                    <tr
                      key={documento.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div
                          className="truncate max-w-xs font-medium text-slate-800"
                          title={titulo}
                        >
                          {titulo}
                        </div>
                        <span className="text-xs text-slate-400">
                          Por: {autor}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs text-slate-600 font-medium">
                          {categoria}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-500 text-xs">
                        {formatarTamanho(documento.tamanho)}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            diasRestantes <= 5
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {diasRestantes === 0
                            ? "Expira hoje"
                            : `${diasRestantes} ${
                                diasRestantes === 1 ? "dia" : "dias"
                              }`}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() =>
                            handleRestaurar(documento.id, titulo)
                          }
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded-lg text-xs transition-colors border border-emerald-200 cursor-pointer mr-2"
                        >
                          Restaurar
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleExcluirDefinitivo(documento.id, titulo)
                          }
                          className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-medium rounded-lg text-xs transition-colors border border-slate-200 cursor-pointer"
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
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              {termoPesquisa ? "🔍" : "✓"}
            </div>
            <h3 className="text-base font-bold text-slate-700">
              {termoPesquisa
                ? "Nenhum resultado encontrado"
                : "A lixeira está vazia"}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {termoPesquisa
                ? `Não foram encontrados documentos correspondentes a "${termoPesquisa}".`
                : "Nenhum documento descartado recentemente no repositório."}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}