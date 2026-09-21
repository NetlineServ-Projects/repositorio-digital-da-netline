interface DocumentoViewerFallbackProps {
  extensao: string;
  url: string;
  nomeArquivo: string;
}

export default function DocumentoViewerFallback({ extensao, url, nomeArquivo }: DocumentoViewerFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center px-6 py-12">
      <span className="p-3 bg-blue-50 text-[#18357a] rounded-lg text-sm font-extrabold uppercase border border-blue-100/50">
        {extensao}
      </span>
      <p className="text-slate-500 text-sm">
        Pré-visualização não disponível para este tipo de ficheiro.
      </p>
      <a
        href={url}
        download={nomeArquivo}
        className="text-sm text-[#18357a] font-semibold hover:underline"
      >
        Baixar para visualizar
      </a>
    </div>
  );
}