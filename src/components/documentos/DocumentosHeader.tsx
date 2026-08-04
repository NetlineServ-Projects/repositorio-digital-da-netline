interface DocumentosHeaderProps {
  total: number;
  onNovoDocumento: () => void;
}

export default function DocumentosHeader({ total, onNovoDocumento }: DocumentosHeaderProps) {
  return (
    <div className="bg-[#18357a] text-white p-6 md:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">Repositório Digital</p>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Documentos</h1>
        <p className="text-sm text-blue-100/80 mt-1">Consulta e download dos ficheiros oficiais da Netline</p>
      </div>

      <div className="flex items-center gap-3 self-start md:self-auto">
        <div className="bg-white/10 text-white font-medium text-xs px-3 py-2.5 rounded-lg border border-white/10 backdrop-blur-sm">
          Total: {total}
        </div>
        <button
          type="button"
          onClick={onNovoDocumento}
          className="bg-white text-[#18357a] hover:bg-blue-50 transition-colors font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span>+</span> Novo Documento
        </button>
      </div>
    </div>
  );
}