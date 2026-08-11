import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faPen, faTrash, faUserShield, faUser } from "@fortawesome/free-solid-svg-icons";
import type { Usuario } from "../../hooks/useUsuariosData";

interface UsuariosTabelaProps {
  usuarios: Usuario[];
  carregando: boolean;
  onEditar: (u: Usuario) => void;
  onEliminar: (id: number, nome: string) => void;
}

export default function UsuariosTabela({ usuarios, carregando, onEditar, onEliminar }: UsuariosTabelaProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {carregando ? (
        <div className="p-12 text-center text-slate-400 text-sm flex justify-center items-center gap-2">
          <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
          <span>Carregando utilizadores...</span>
        </div>
      ) : usuarios.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-sm">Nenhum utilizador encontrado.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-slate-400 uppercase font-semibold text-xs tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-4 px-6">NOME / E-MAIL</th>
                <th className="py-4 px-6">CARGO</th>
                <th className="py-4 px-6">TELEFONE</th>
                <th className="py-4 px-6">PERFIL</th>
                <th className="py-4 px-6 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-800 text-sm">{u.nome}</div>
                    <div className="text-xs text-slate-400 font-normal mt-0.5">{u.email}</div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 text-sm">{u.cargo || "-"}</td>
                  <td className="py-4 px-6 text-slate-600 text-sm">{u.numero || "-"}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${u.perfil === "ADMIN" ? "bg-purple-100/70 text-purple-700" : "bg-blue-100/70 text-blue-600"}`}>
                      <FontAwesomeIcon icon={u.perfil === "ADMIN" ? faUserShield : faUser} className="w-3.5 h-3.5" />
                      {u.perfil}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onEditar(u)} className="p-2.5 text-amber-600 bg-amber-100/60 hover:bg-amber-100 rounded-lg transition-colors" title="Editar">
                        <FontAwesomeIcon icon={faPen} className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => onEliminar(u.id, u.nome)} className="p-2.5 text-rose-600 bg-rose-100/60 hover:bg-rose-100 rounded-lg transition-colors" title="Eliminar">
                        <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}