import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUserPlus, faSpinner, faSave, faArrowLeft, faPen, faTrash, faSearch, faUserShield, faUser 
} from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "../utils/api";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  numero: string;
  cargo: string;
  perfil: "ADMIN" | "FUNCIONARIO";
  dataCriacao?: string;
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [formAberto, setFormAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    numero: "",
    cargo: "",
    perfil: "FUNCIONARIO" as "ADMIN" | "FUNCIONARIO",
  });

  const carregarUsuarios = async () => {
    setCarregando(true);
    try {
      const token = localStorage.getItem("token_sistema");
      const res = await fetch(`${API_URL}/api/usuarios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.mensagem || "Erro ao carregar usuários.");
      setUsuarios(data.data || []);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao carregar lista de usuários.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const resetForm = () => {
    setFormData({ nome: "", email: "", senha: "", numero: "", cargo: "", perfil: "FUNCIONARIO" });
    setEditandoId(null);
  };

  const abrirNovoForm = () => {
    resetForm();
    setSucesso(null);
    setErro(null);
    setFormAberto(true);
  };

  const abrirEditar = (u: Usuario) => {
    setEditandoId(u.id);
    setFormData({
      nome: u.nome,
      email: u.email,
      senha: "",
      numero: u.numero || "",
      cargo: u.cargo || "",
      perfil: u.perfil
    });
    setSucesso(null);
    setErro(null);
    setFormAberto(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    setSucesso(null);

    try {
      const token = localStorage.getItem("token_sistema");
      const isEdit = editandoId !== null;
      const url = isEdit ? `${API_URL}/api/usuarios/${editandoId}` : `${API_URL}/api/usuarios`;
      const method = isEdit ? "PUT" : "POST";

      const payload: Record<string, unknown> = { ...formData };
      if (isEdit && !payload.senha) {
        delete payload.senha;
      }

      const resposta = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const corpo = await resposta.json();
      if (!resposta.ok) throw new Error(corpo?.mensagem || "Erro ao salvar utilizador.");

      setSucesso(`Utilizador "${corpo.data?.nome || formData.nome}" ${isEdit ? "atualizado" : "criado"} com sucesso.`);
      setFormAberto(false);
      resetForm();
      carregarUsuarios();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro de ligação ao servidor.");
    } finally {
      setSalvando(false);
    }
  };

  const handleEliminar = async (id: number, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja eliminar o utilizador "${nome}"?`)) return;

    try {
      const token = localStorage.getItem("token_sistema");
      const res = await fetch(`${API_URL}/api/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.mensagem || "Erro ao eliminar utilizador.");

      setSucesso(`Utilizador "${nome}" eliminado com sucesso.`);
      carregarUsuarios();
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao eliminar utilizador.");
    }
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(busca.toLowerCase()) ||
    u.email.toLowerCase().includes(busca.toLowerCase()) ||
    u.cargo?.toLowerCase().includes(busca.toLowerCase())
  );

  if (!formAberto) {
    return (
      <div className="space-y-6">
        {/* Banner do Cabeçalho - Padrão da aba Documentos */}
        <div className="bg-[#1B2A4A] p-8 rounded-2xl shadow-sm text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-xs uppercase font-semibold text-blue-200/80 tracking-widest block mb-1">
              GESTÃO DE ACESSOS
            </span>
            <h2 className="text-3xl font-bold">Usuários</h2>
            <p className="text-sm text-blue-100/80 mt-1">
              Gerencie contas, perfis e permissões dos colaboradores da Netline
            </p>
          </div>

          <div className="flex items-center gap-4 self-end md:self-center">
            <div className="bg-[#14203A]/70 border border-white/10 px-4 py-2 rounded-xl text-xs font-medium text-blue-100">
              Total: {usuarios.length}
            </div>
            <button
              onClick={abrirNovoForm}
              className="flex items-center gap-2 bg-white text-[#1B2A4A] hover:bg-slate-100 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              <FontAwesomeIcon icon={faUserPlus} className="w-4 h-4" />
              <span>Novo Usuário</span>
            </button>
          </div>
        </div>

        {/* Mensagens de Alerta */}
        {erro && <div className="p-4 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl">{erro}</div>}
        {sucesso && <div className="p-4 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">{sucesso}</div>}

        {/* Barra de Pesquisa */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <FontAwesomeIcon icon={faSearch} className="text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Pesquisar por nome, e-mail ou cargo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full text-sm bg-transparent focus:outline-none text-slate-700 placeholder-slate-400"
          />
        </div>

        {/* Tabela de Usuários */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {carregando ? (
            <div className="p-12 text-center text-slate-400 text-sm flex justify-center items-center gap-2">
              <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
              <span>Carregando utilizadores...</span>
            </div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Nenhum utilizador encontrado.
            </div>
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
                  {usuariosFiltrados.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800 text-sm">{u.nome}</div>
                        <div className="text-xs text-slate-400 font-normal mt-0.5">{u.email}</div>
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-sm">{u.cargo || "-"}</td>
                      <td className="py-4 px-6 text-slate-600 text-sm">{u.numero || "-"}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          u.perfil === "ADMIN" 
                            ? "bg-purple-100/70 text-purple-700" 
                            : "bg-blue-100/70 text-blue-600"
                        }`}>
                          <FontAwesomeIcon icon={u.perfil === "ADMIN" ? faUserShield : faUser} className="w-3.5 h-3.5" />
                          {u.perfil}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirEditar(u)}
                            className="p-2.5 text-amber-600 bg-amber-100/60 hover:bg-amber-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <FontAwesomeIcon icon={faPen} className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEliminar(u.id, u.nome)}
                            className="p-2.5 text-rose-600 bg-rose-100/60 hover:bg-rose-100 rounded-lg transition-colors"
                            title="Eliminar"
                          >
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
      </div>
    );
  }

  // Formulário (Criar / Editar)
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-5 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setFormAberto(false); resetForm(); }}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
            <span>Voltar</span>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {editandoId ? "Editar Usuário" : "Criar Novo Usuário"}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {editandoId ? "Atualize as credenciais e permissões do utilizador" : "Preencha os dados abaixo para cadastrar um novo utilizador"}
            </p>
          </div>
        </div>
      </div>

      {erro && <div className="p-4 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl">{erro}</div>}

      <form onSubmit={handleSubmit} className="space-y-5 text-sm">
        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">Nome Completo</label>
          <input
            type="text" required placeholder="Ex: João Tembe"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-sm text-slate-700"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">E-mail Institucional</label>
            <input
              type="email" required placeholder="usuario@netline.co.mz"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-sm text-slate-700"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              {editandoId ? "Nova Senha (opcional)" : "Senha Inicial"}
            </label>
            <input
              type="password"
              required={!editandoId}
              minLength={8}
              placeholder={editandoId ? "Deixe em branco para manter" : "Mínimo 8 caracteres"}
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-sm text-slate-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Número de Telefone</label>
            <input
              type="text" required placeholder="Ex: 841234567"
              value={formData.numero}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-sm text-slate-700"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Cargo</label>
            <input
              type="text" required placeholder="Ex: Técnico de Redes"
              value={formData.cargo}
              onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-sm text-slate-700"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">Perfil / Permissão</label>
          <select
            value={formData.perfil}
            onChange={(e) => setFormData({ ...formData, perfil: e.target.value as "ADMIN" | "FUNCIONARIO" })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-sm text-slate-700"
          >
            <option value="FUNCIONARIO">Funcionário</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        <div className="pt-5 border-t border-slate-100 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={() => { setFormAberto(false); resetForm(); }} 
            className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={salvando} 
            className="flex items-center gap-2 px-6 py-3 bg-[#1B2A4A] text-white rounded-xl text-sm font-semibold hover:bg-[#14203A] transition-colors disabled:opacity-50 shadow-sm"
          >
            {salvando ? (
              <><FontAwesomeIcon icon={faSpinner} spin className="w-4 h-4" /><span>Guardando...</span></>
            ) : (
              <><FontAwesomeIcon icon={faSave} className="w-4 h-4" /><span>{editandoId ? "Atualizar Conta" : "Criar Conta"}</span></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}