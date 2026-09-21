import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DocumentoViewerPdfProps {
  url: string;
  titulo: string;
}

export default function DocumentoViewerPdf({ url, titulo }: DocumentoViewerPdfProps) {
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
      <div ref={containerRef} className="flex-1 overflow-auto bg-slate-50 flex justify-center py-4">
        {erroCarregamento ? (
          <p className="text-slate-400 text-sm p-8 self-center">Não foi possível carregar a pré-visualização do PDF.</p>
        ) : (
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => setNumPaginas(numPages)}
            onLoadError={() => setErroCarregamento(true)}
            loading={<p className="text-slate-400 text-sm p-8">A carregar PDF...</p>}
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
            ← Anterior
          </button>
          <span className="text-xs text-slate-500 font-medium">
            Página {paginaAtual} de {numPaginas}
          </span>
          <button
            onClick={() => setPaginaAtual((p) => Math.min(numPaginas, p + 1))}
            disabled={paginaAtual >= numPaginas}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-600 disabled:opacity-40 hover:bg-slate-200 transition-colors"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}