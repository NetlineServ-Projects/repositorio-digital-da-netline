import { useState } from "react";
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

  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "info";
    texto: string;
  } | null>(null);

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
  // MENSAGEM
  // =========================================================

  const exibirMensagem = (
    tipo: "sucesso" | "info",
    texto: string,
  ) => {
    setMensagem({
      tipo,
      texto,
    });

    setTimeout(() => {
      setMensagem(null);
    }, 3500);
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

      exibirMensagem(
        "sucesso",
        `O documento "${titulo}" foi restaurado com sucesso.`,
      );
    } catch (error) {
      exibirMensagem(
        "info",
        error instanceof Error
          ? error.message
          : "Erro ao restaurar o documento.",
      );
    }
  };

  // =========================================================
  // ELIMINAR DEFINITIVAMENTE
  // =========================================================

  const handleExcluirDefinitivo = async (
    id: number,
    titulo: string,
  ) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja apagar "${titulo}" definitivamente? Esta ação não pode ser desfeita.`,
    );

    if (!confirmar) {
      return;
    }

    try {
      await excluirDefinitivo(id);

      exibirMensagem(
        "info",
        `O documento "${titulo}" foi eliminado definitivamente.`,
      );
    } catch (error) {
      exibirMensagem(
        "info",
        error instanceof Error
          ? error.message
          : "Erro ao eliminar o documento.",
      );
    }
  };

  // =========================================================
  // ESVAZIAR LIXEIRA
  // =========================================================

  const handleEsvaziar = async () => {
    const confirmar = window.confirm(
      "Tem certeza que deseja apagar todos os itens da lixeira definitivamente? Esta ação não pode ser desfeita.",
    );

    if (!confirmar) {
      return;
    }

    try {
      await esvaziar();

      exibirMensagem(
        "info",
        "A lixeira foi esvaziada completamente.",
      );
    } catch (error) {
      exibirMensagem(
        "info",
        error instanceof Error
          ? error.message
          : "Erro ao esvaziar a lixeira.",
      );
    }
  };

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
      <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-red-100 shadow-sm p-8">
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
    <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-8">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Lixeira do Repositório
          </h2>

          <p className="text-slate-500 font-medium text-sm mt-1">
            Os itens descartados são mantidos por até 30 dias
            antes de serem apagados definitivamente.
          </p>
        </div>

        {documentos.length > 0 && (
          <button
            type="button"
            onClick={handleEsvaziar}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg text-sm transition-colors border border-red-200 self-start sm:self-auto cursor-pointer"
          >
            Esvaziar Lixeira
          </button>
        )}
      </div>

      {/* =====================================================
          MENSAGEM
      ===================================================== */}

      {mensagem && (
        <div
          className={`mb-6 p-3 rounded-lg text-xs font-semibold ${
            mensagem.tipo === "sucesso"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          {mensagem.texto}
        </div>
      )}

      {/* =====================================================
          LISTA DE DOCUMENTOS
      ===================================================== */}

      {documentos.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">

            {/* Cabeçalho da tabela */}

            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-semibold">

                <th className="py-3 px-4">
                  Documento
                </th>

                <th className="py-3 px-4">
                  Categoria
                </th>

                <th className="py-3 px-4">
                  Tamanho
                </th>

                <th className="py-3 px-4">
                  Exclusão definitiva em
                </th>

                <th className="py-3 px-4 text-right">
                  Ações
                </th>

              </tr>
            </thead>

            {/* Corpo da tabela */}

            <tbody className="divide-y divide-slate-100 text-sm">

              {documentos.map((documento) => {
                const titulo =
                  documento.titulo ||
                  "Documento sem título";

                const categoria =
                  documento.categoria?.nome ||
                  "Geral";

                const autor =
                  documento.usuario?.nome ||
                  "Sistema";

                const diasRestantes =
                  calcularDiasRestantes(
                    documento.apagadoEm,
                  );

                return (
                  <tr
                    key={documento.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >

                    {/* Documento */}

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

                    {/* Categoria */}

                    <td className="py-4 px-4">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs text-slate-600 font-medium">
                        {categoria}
                      </span>
                    </td>

                    {/* Tamanho */}

                    <td className="py-4 px-4 text-slate-500 text-xs">
                      {formatarTamanho(
                        documento.tamanho,
                      )}
                    </td>

                    {/* Prazo */}

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
                              diasRestantes === 1
                                ? "dia"
                                : "dias"
                            }`}
                      </span>
                    </td>

                    {/* Ações */}

                    <td className="py-4 px-4 text-right whitespace-nowrap">

                      <button
                        type="button"
                        onClick={() =>
                          handleRestaurar(
                            documento.id,
                            titulo,
                          )
                        }
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded-lg text-xs transition-colors border border-emerald-200 cursor-pointer mr-2"
                      >
                        Restaurar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleExcluirDefinitivo(
                            documento.id,
                            titulo,
                          )
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

        /* ===================================================
           ESTADO VAZIO
        =================================================== */

        <div className="py-16 text-center">

          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✓
          </div>

          <h3 className="text-base font-bold text-slate-700">
            A lixeira está vazia
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Nenhum documento descartado recentemente no
            repositório.
          </p>

        </div>
      )}

    </div>
  );
}