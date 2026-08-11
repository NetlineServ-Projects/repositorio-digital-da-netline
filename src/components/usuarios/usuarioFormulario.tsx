import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import type { UsuarioFormData } from "../../hooks/useUsuariosData";

interface UsuarioFormularioProps {
  editandoId: number | null;
  formData: UsuarioFormData;
  onFormDataChange: (dados: UsuarioFormData) => void;
  salvando: boolean;
  erro: string | null;
  onVoltar: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function UsuarioFormulario({ editandoId, formData, onFormDataChange, salvando, erro, onVoltar, onSubmit }: UsuarioFormularioProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-5 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button onClick={onVoltar} className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
            <span>Voltar</span>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{editandoId ? "Editar Usuário" : "Criar Novo Usuário"}</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {editandoId ? "Atualize as credenciais e permissões do utilizador" : "Preencha os dados abaixo para cadastrar um novo utilizador"}
            </p>
          </div>
        </div>
      </div>

      {erro && <div className="p-4 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl">{erro}</div>}

      <form onSubmit={onSubmit} className="space-y-5 text-sm">
        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">Nome Completo</label>
          <input type="text" required placeholder="Ex: João Tembe" value={formData.nome} onChange={(e) => onFormDataChange({ ...formData, nome: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-sm text-slate-700" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">E-mail Institucional</label>
            <input type="email" required placeholder="usuario@netline.co.mz" value={formData.email} onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-sm text-slate-700" />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">{editandoId ? "Nova Senha (opcional)" : "Senha Inicial"}</label>
            <input type="password" required={!editandoId} minLength={8} placeholder={editandoId ? "Deixe em branco para manter" : "Mínimo 8 caracteres"} value={formData.senha} onChange={(e) => onFormDataChange({ ...formData, senha: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-sm text-slate-700" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Número de Telefone</label>
            <input type="text" required placeholder="Ex: 841234567" value={formData.numero} onChange={(e) => onFormDataChange({ ...formData, numero: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-sm text-slate-700" />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Cargo</label>
            <input type="text" required placeholder="Ex: Técnico de Redes" value={formData.cargo} onChange={(e) => onFormDataChange({ ...formData, cargo: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-sm text-slate-700" />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">Perfil / Permissão</label>
          <select value={formData.perfil} onChange={(e) => onFormDataChange({ ...formData, perfil: e.target.value as "ADMIN" | "FUNCIONARIO" })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-sm text-slate-700">
            <option value="FUNCIONARIO">Funcionário</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        <div className="pt-5 border-t border-slate-100 flex justify-end gap-3">
          <button type="button" onClick={onVoltar} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors">Cancelar</button>
          <button type="submit" disabled={salvando} className="flex items-center gap-2 px-6 py-3 bg-[#1B2A4A] text-white rounded-xl text-sm font-semibold hover:bg-[#14203A] transition-colors disabled:opacity-50 shadow-sm">
            {salvando ? (<><FontAwesomeIcon icon={faSpinner} spin className="w-4 h-4" /><span>Guardando...</span></>) : (<><FontAwesomeIcon icon={faSave} className="w-4 h-4" /><span>{editandoId ? "Atualizar Conta" : "Criar Conta"}</span></>)}
          </button>
        </div>
      </form>
    </div>
  );
}