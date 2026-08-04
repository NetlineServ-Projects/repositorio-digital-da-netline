import { IconDocumento } from "../icons";

interface HeroBannerProps {
  totalDocumentos: number;
  totalSistemas: number;
  onVerDocumentos: () => void;
}

export default function HeroBanner({ totalDocumentos, totalSistemas, onVerDocumentos }: HeroBannerProps) {
  return (
    <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">Repositório Digital</span>
        <h2 className="text-2xl font-bold mt-1">Explore os Documentos da Netline</h2>
        <p className="text-xs text-blue-100 mt-1">
          {totalDocumentos} documentos disponíveis · {totalSistemas} sistemas integrados
        </p>
      </div>
      <button
        onClick={onVerDocumentos}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-white transition-colors flex items-center gap-2 backdrop-blur-xs cursor-pointer"
      >
        <IconDocumento className="w-4 h-4" />
        Ver Todos Documentos
      </button>
    </div>
  );
}