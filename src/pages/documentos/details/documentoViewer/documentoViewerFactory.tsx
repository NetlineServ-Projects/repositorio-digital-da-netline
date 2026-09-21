import DocumentoViewerImagem from "./documentoViewerImagem";
import DocumentoViewerPdf from "./documentoViewerPdf";
import DocumentoViewerFallback from "./documentoViewerFallback";

const FORMATOS_IMAGEM = ["png", "jpg", "jpeg", "gif", "webp"];
const FORMATOS_PDF = ["pdf"];

interface DocumentoViewerFactoryProps {
  extensao: string;
  url: string;
  titulo: string;
  nomeArquivo: string;
}

export default function DocumentoViewerFactory({ extensao, url, titulo, nomeArquivo }: DocumentoViewerFactoryProps) {
  const ext = extensao.toLowerCase();

  if (FORMATOS_IMAGEM.includes(ext)) {
    return <DocumentoViewerImagem url={url} titulo={titulo} />;
  }

  if (FORMATOS_PDF.includes(ext)) {
    return <DocumentoViewerPdf url={url} titulo={titulo} />;
  }

  return <DocumentoViewerFallback extensao={ext} url={url} nomeArquivo={nomeArquivo} />;
}