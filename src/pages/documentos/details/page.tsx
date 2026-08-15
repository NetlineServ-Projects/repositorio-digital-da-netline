import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useDocumentoDetalhe } from "../../../hooks/useDocumentoDetalhe";
import StatusBadge from "../../../components/statusBadge";
import DocumentoViewerFactory from "../../../components/documentoViewer/documentoViewerFactory";
import {
  obterUrlFicheiro,
  formatarExtensao,
  obterNomeExibicao,
  formatarTamanho
} from "../../../utils/documentos";
import { API_URL } from "../../../utils/api";
import { IconDownload } from "../../../components/icons";

export default function DocumentoDetalhesPage() {
  const { id } = useParams<{ id: string }>();
  const { documento, loading, erro } = useDocumentoDetalhe(id ?? "");

  const dados = useMemo(() => {
    if (!documento) return null;

    return {
      extensao: formatarExtensao(documento.tipoArquivo, documento.nomeArquivo),
      nomeExibicao: obterNomeExibicao(documento),
      urlFicheiro: obterUrlFicheiro(documento.caminho, API_URL),
      dataSubmissao: documento.dataSubmissao
        ? new Date(documento.dataSubmissao).toLocaleDateString("pt-PT")
        : "N/A"
    };
  }, [documento]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-slate-500 font-medium animate-pulse text-sm">
          A carregar documento...
        </p>
      </div>
    );
  }

  if (erro || !documento || !dados) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center space-y-3 max-w-lg">
        <p className="text-red-600 text-sm font-medium">
          {erro || "Documento não encontrado."}
        </p>
        <Link to="/dashboard/documentos" className="text-sm text-[#18357a] font-semibold hover:underline">
          Voltar aos Documentos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <Link to="/dashboard/documentos" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors">
        ← Voltar aos Documentos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex items-center justify-center h-[75vh] min-h-125">
          <DocumentoViewerFactory
            extensao={dados.extensao}
            url={dados.urlFicheiro}
            titulo={dados.nomeExibicao}
            nomeArquivo={documento.nomeArquivo}
          />
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-5 h-fit">
          <div className="flex items-start gap-3">
            <span className="p-2.5 bg-blue-50 text-[#18357a] rounded-lg text-xs font-extrabold uppercase border border-blue-100/50 shrink-0">
              {dados.extensao}
            </span>
            <div className="space-y-1">
              <h1 className="font-bold text-slate-800 text-lg leading-snug">
                {dados.nomeExibicao}
              </h1>
              {documento.descricao && (
                <p className="text-sm text-slate-400">
                  {documento.descricao}
                </p>
              )}
            </div>
          </div>

          <div>
            <StatusBadge estado={documento.estado} />
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 text-sm border-t border-slate-100 pt-4">
            <div>
              <dt className="text-slate-400 text-xs uppercase font-semibold">Categoria</dt>
              <dd className="text-slate-700 mt-0.5 font-medium wrap-break-word">
                {documento.categoria?.nome || "Sem Categoria"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400 text-xs uppercase font-semibold">Submetido por</dt>
              <dd className="text-slate-700 mt-0.5 font-medium wrap-break-word">
                {documento.usuario?.nome || "Sistema"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400 text-xs uppercase font-semibold">Data</dt>
              <dd className="text-slate-700 mt-0.5 font-medium">{dados.dataSubmissao}</dd>
            </div>
            <div>
              <dt className="text-slate-400 text-xs uppercase font-semibold">Tamanho</dt>
              <dd className="text-slate-700 mt-0.5 font-medium">
                {formatarTamanho(documento.tamanho)}
              </dd>
            </div>
          </dl>

          <a
            href={dados.urlFicheiro}
            download={documento.nomeArquivo}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-[#18357a] text-sm font-semibold rounded-lg transition-colors border border-blue-100/80 mt-2"
          >
            <IconDownload /> Baixar ficheiro
          </a>
        </div>

      </div>
    </div>
  );
} // essa e do detalhes