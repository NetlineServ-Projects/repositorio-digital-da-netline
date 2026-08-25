import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

interface UsuariosHeaderProps {
  total: number;
  onNovoUsuario: () => void;
}

export default function UsuariosHeader({ total, onNovoUsuario }: UsuariosHeaderProps) {
  return (
    <div className="bg-[#18357a] p-8 rounded-2xl shadow-sm text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <span className="text-xs uppercase font-semibold text-blue-200/80 tracking-widest block mb-1">GESTÃO DE ACESSOS</span>
        <h2 className="text-3xl font-bold">Usuários</h2>
        <p className="text-sm text-blue-100/80 mt-1">Gerencie contas, perfis e permissões dos colaboradores da Netline</p>
      </div>
      <div className="flex items-center gap-4 self-end md:self-center">
        <div className="bg-[#14203A]/70 border border-white/10 px-4 py-2 rounded-xl text-xs font-medium text-blue-100">Total: {total}</div>
        <button onClick={onNovoUsuario} className="flex items-center gap-2 bg-white text-[#1B2A4A] hover:bg-slate-100 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <FontAwesomeIcon icon={faUserPlus} className="w-4 h-4" />
          <span>Novo Usuário</span>
        </button>
      </div>
    </div>
  );
}