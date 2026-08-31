import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useOutletContext } from "react-router-dom";
import { useDocumentosData } from "../../hooks/useDocumentosData";
import SearchInput from "../../components/searchInput";
import ViewToggle from "../../components/viewToggle";
import DocumentoRow from "../../components/documentoRow";
import DocumentoCard from "../../components/documentoCard";
import ModalConfirmacao from "../../components/modalConfirmacaoprops";
import FilterSelect from "../../components/filterSelect";
import { IconVer } from "../../components/icons";
import { classificarTipo, OPCOES_TIPO } from "../../utils/tipoDocumento";
import { toast } from "sonner";

interface DashboardContext {
  usuario: { nome: string; perfil?: string } | null;
}

export default function DocumentosPage() {
  const { t } = useTranslation();
  const { documentos, categorias, loading, erro, recarregar, apagarDocumento } = useDocumentosData();
  const { usuario } = useOutletContext<DashboardContext>();
  const ehAdmin = usuario?.perfil === "ADMIN";

  const MESES = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({ valor: String(i), label: t(`comum.meses.${i}`) })),
    [t]
  );

  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string[]>([]);
  const [autorFiltro, setAutorFiltro] = useState<string[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState<string[]>([]);
  const [mesFiltro, setMesFiltro] = useState<string[]>([]);
  const [anoFiltro, setAnoFiltro] = useState<string[]>([]);
  const [modoExibicao, setModoExibicao] = useState<"tabela" | "cards">("tabela");
  const [documentoParaApagar, setDocumentoParaApagar] = useState<number | null>(null);

  const autoresUnicos = useMemo(() => {
    const nomes = documentos.map((d) => d.usuario?.nome).filter((n): n is string => !!n);
    return Array.from(new Set(nomes)).sort();
  }, [documentos]);

  const anosUnicos = useMemo(() => {
    const anos = documentos.map((d) => d.dataSubmissao?.slice(0, 4)).filter((a): a is string => !!a);
    return Array.from(new Set(anos)).sort((a, b) => b.localeCompare(a));
  }, [documentos]);

  const confirmarApagar = async () => {
    if (documentoParaApagar === null) return;
    const id = documentoParaApagar;
    setDocumentoParaApagar(null);
    try {
      await apagarDocumento(id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("comum.erroApagarDocumento"));
    }
  };

  const documentosFiltrados = documentos.filter((doc) => {
    const nomeDoc = doc.titulo || doc.nomeArquivo || "";
    const autorDoc = doc.usuario?.nome || "";
    const catDoc = doc.categoria?.nome || "";
    const tipoDoc = classificarTipo(doc.tipoArquivo);

    const atendeBusca =
      nomeDoc.toLowerCase().includes(busca.toLowerCase()) ||
      autorDoc.toLowerCase().includes(busca.toLowerCase());

    const atendeCategoria =
      categoriaFiltro.length === 0 || categoriaFiltro.includes(catDoc);

    const atendeAutor =
      autorFiltro.length === 0 || autorFiltro.includes(autorDoc);

    const atendeTipo =
      tipoFiltro.length === 0 || tipoFiltro.includes(tipoDoc);

    let atendeData = true;
    if (doc.dataSubmissao) {
      const dataDoc = new Date(doc.dataSubmissao);
      if (mesFiltro.length > 0 && !mesFiltro.includes(String(dataDoc.getMonth()))) {
        atendeData = false;
      }
      if (anoFiltro.length > 0 && !anoFiltro.includes(String(dataDoc.getFullYear()))) {
        atendeData = false;
      }
    } else if (mesFiltro.length > 0 || anoFiltro.length > 0) {
      atendeData = false;
    }

    return atendeBusca && atendeCategoria && atendeAutor && atendeTipo && atendeData;
  });

  const limparFiltros = () => {
    setBusca("");
    setCategoriaFiltro([]);
    setAutorFiltro([]);
    setTipoFiltro([]);
    setMesFiltro([]);
    setAnoFiltro([]);
  };

  const filtrosAtivos =
    busca !== "" ||
    categoriaFiltro.length > 0 ||
    autorFiltro.length > 0 ||
    tipoFiltro.length > 0 ||
    mesFiltro.length > 0 ||
    anoFiltro.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-slate-500 font-medium animate-pulse text-sm">{t("documentos.carregando")}</p>
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
          {t("comum.tentarNovamente")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#18357a] text-white p-6 md:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">{t("documentos.repositorio")}</p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">{t("documentos.titulo")}</h1>
          <p className="text-sm text-blue-100/80 mt-1">{t("documentos.subtitulo")}</p>
        </div>

        <Link
          to="/dashboard/documentos/new"
          className="px-4 py-2.5 bg-white text-[#18357a] text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors self-start md:self-auto"
        >
          {t("documentos.botaoNovo")}
        </Link>
      </div>

      {/* Painel de Busca e Filtros Customizados */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-80 relative">
            <SearchInput value={busca} onChange={setBusca} placeholder={t("documentos.pesquisarPlaceholder")} />
          </div>
          <ViewToggle modo={modoExibicao} onChange={setModoExibicao} />
        </div>

        {/* Grid dos Custom Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end pt-2">
          <FilterSelect
            label={t("documentos.categoria")}
            placeholder={t("documentos.todasCategorias")}
            opcoes={categorias.map((c) => ({ valor: c.nome, label: c.nome }))}
            selecionados={categoriaFiltro}
            onChange={setCategoriaFiltro}
          />

          <FilterSelect
            label={t("comum.autor")}
            placeholder={t("comum.todosAutores")}
            opcoes={autoresUnicos.map((a) => ({ valor: a, label: a }))}
            selecionados={autorFiltro}
            onChange={setAutorFiltro}
          />

          <FilterSelect
            label={t("comum.tipoFicheiro")}
            placeholder={t("comum.todosTipos")}
            opcoes={OPCOES_TIPO.filter((tipo) => tipo.valor !== "TODOS").map((tipo) => ({ valor: tipo.valor, label: tipo.label }))}
            selecionados={tipoFiltro}
            onChange={setTipoFiltro}
          />

          <FilterSelect
            label={t("comum.mes")}
            placeholder={t("comum.todosMeses")}
            opcoes={MESES}
            selecionados={mesFiltro}
            onChange={setMesFiltro}
          />

          <FilterSelect
            label={t("comum.ano")}
            placeholder={t("comum.todosAnos")}
            opcoes={anosUnicos.map((ano) => ({ valor: ano, label: ano }))}
            selecionados={anoFiltro}
            onChange={setAnoFiltro}
          />
        </div>

        {filtrosAtivos && (
          <div className="flex justify-end pt-1">
            <button
              onClick={limparFiltros}
              className="inline-flex items-center gap-1 text-xs text-rose-600 font-semibold hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors border border-rose-100"
            >
              ✕ {t("comum.limparFiltros")}
            </button>
          </div>
        )}
      </div>

      {/* Exibição em Tabela ou Grid de Cards */}
      {modoExibicao === "tabela" ? (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase text-xs border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">{t("documentos.tabela.documento")}</th>
                  <th className="py-3.5 px-4 font-semibold">{t("documentos.tabela.categoria")}</th>
                  <th className="py-3.5 px-4 font-semibold">{t("documentos.tabela.submetidoPor")}</th>
                  <th className="py-3.5 px-4 font-semibold">{t("documentos.tabela.data")}</th>
                  <th className="py-3.5 px-4 font-semibold text-right">{t("comum.acoes")}</th>
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
                            to={`/dashboard/documentos/${doc.id}`}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-200/60"
                            title={t("comum.verDocumento")}
                          >
                            <IconVer />
                          </Link>
                          {ehAdmin && (
                            <>
                              <Link
                                to={`/dashboard/documentos/${doc.id}/editar`}
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#18357a] text-xs font-semibold rounded-lg transition-colors border border-blue-100"
                              >
                                {t("comum.editar")}
                              </Link>
                              <button
                                onClick={() => setDocumentoParaApagar(doc.id)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 text-xs font-semibold rounded-lg transition-colors"
                              >
                                {t("comum.apagar")}
                              </button>
                            </>
                          )}
                        </>
                      }
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">
                      {t("documentos.nenhumDocumento")}
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
                      to={`/dashboard/documentos/${doc.id}`}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-200/60"
                      title={t("comum.ver")}
                    >
                      <IconVer />
                    </Link>
                    {ehAdmin && (
                      <>
                        <Link
                          to={`/dashboard/documentos/${doc.id}/editar`}
                          className="px-2.5 py-1 text-xs text-[#18357a] font-semibold hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                        >
                          {t("comum.editar")}
                        </Link>
                        <button
                          onClick={() => setDocumentoParaApagar(doc.id)}
                          className="px-2.5 py-1 text-xs text-rose-600 font-semibold hover:bg-rose-50 rounded-lg transition-colors border border-rose-200/60"
                        >
                          {t("comum.apagar")}
                        </button>
                      </>
                    )}
                  </>
                }
              />
            ))
          ) : (
            <div className="col-span-full bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-400">
              {t("documentos.nenhumDocumento")}
            </div>
          )}
        </div>
      )}

      {/* Modal de Confirmação para Remoção */}
      <ModalConfirmacao
        aberto={documentoParaApagar !== null}
        titulo={t("comum.modalApagarDocumento.titulo")}
        mensagem={t("comum.modalApagarDocumento.mensagem")}
        textoConfirmar={t("comum.modalApagarDocumento.confirmar")}
        perigoso
        onConfirmar={confirmarApagar}
        onCancelar={() => setDocumentoParaApagar(null)}
      />
    </div>
  );
}