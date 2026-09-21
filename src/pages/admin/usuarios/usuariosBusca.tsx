import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface UsuariosBuscaProps {
  busca: string;
  onBuscaChange: (v: string) => void;
}

export default function UsuariosBusca({ busca, onBuscaChange }: UsuariosBuscaProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
      <FontAwesomeIcon icon={faSearch} className="text-slate-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Pesquisar por nome, e-mail ou cargo..."
        value={busca}
        onChange={(e) => onBuscaChange(e.target.value)}
        className="w-full text-sm bg-transparent focus:outline-none text-slate-700 placeholder-slate-400"
      />
    </div>
  );
}