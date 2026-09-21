interface DocumentoViewerImagemProps {
  url: string;
  titulo: string;
}

export default function DocumentoViewerImagem({ url, titulo }: DocumentoViewerImagemProps) {
  return (
    <img
      src={url}
      alt={titulo}
      className="max-w-full max-h-full object-contain p-4"
    />
  );
}