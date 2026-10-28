import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useTranslation } from "react-i18next";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// O worker é empacotado pelo Vite com a app, para funcionar sem acesso ao CDN
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

// Os ficheiros exigem sessão: o pdf.js tem de enviar o cookie no pedido à API (outra origem).
// Fora do componente, para o react-pdf não recarregar o documento a cada render.
const OPCOES_PDF = { withCredentials: true };

interface DocumentoViewerPdfProps {
  url: string;
  titulo: string;
}

export default function DocumentoViewerPdf({ url, titulo }: DocumentoViewerPdfProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [largura, setLargura] = useState(0);
  const [numPaginas, setNumPaginas] = useState(0);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [erroCarregamento, setErroCarregamento] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const largo = entries[0]?.contentRect.width;
      if (largo) setLargura(largo);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
    setNumPaginas(0);
    setErroCarregamento(false);
  }, [url]);

  return (
    <div className="flex flex-col w-full h-full">
      <div
        ref={containerRef}
        role="region"
        aria-label={t("documentos.visualizador.previsualizacaoDe", { titulo })}
        className="flex-1 overflow-auto bg-slate-50 flex justify-center py-4"
      >
        {erroCarregamento ? (
          <p className="text-slate-400 text-sm p-8 self-center">{t("documentos.visualizador.erroPdf")}</p>
        ) : (
          <Document
            file={url}
            options={OPCOES_PDF}
            onLoadSuccess={({ numPages }) => setNumPaginas(numPages)}
            onLoadError={() => setErroCarregamento(true)}
            loading={<p className="text-slate-400 text-sm p-8">{t("documentos.visualizador.aCarregarPdf")}</p>}
          >
            {largura > 0 && (
              <Page
                pageNumber={paginaAtual}
                width={Math.min(largura - 16, 800)}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            )}
          </Document>
        )}
      </div>

      {numPaginas > 1 && (
        <div className="flex items-center justify-center gap-3 py-3 border-t border-slate-100 bg-white shrink-0">
          <button
            onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
            disabled={paginaAtual <= 1}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600 disabled:opacity-40 hover:bg-slate-200 transition-colors"
          >
            ← {t("documentos.visualizador.anterior")}
          </button>
          <span className="text-xs text-slate-500 font-medium">
            {t("documentos.visualizador.pagina", { atual: paginaAtual, total: numPaginas })}
          </span>
          <button
            onClick={() => setPaginaAtual((p) => Math.min(numPaginas, p + 1))}
            disabled={paginaAtual >= numPaginas}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600 disabled:opacity-40 hover:bg-slate-200 transition-colors"
          >
            {t("documentos.visualizador.seguinte")} →
          </button>
        </div>
      )}
    </div>
  );
}