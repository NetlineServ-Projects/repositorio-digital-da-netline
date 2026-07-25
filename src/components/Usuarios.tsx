import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserPlus,
  faEdit,
  faTrashAlt,
  faSearch,
  faArrowLeft,
  faEye,
  faEnvelope,
  faShieldAlt,
  faSpinner,
  faSave,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

// Tipos
export interface Documento {
  id: string | number;
  nome: string;
  categoria: string;
  tamanho: string;
  dataUpload: string;
  status: "Pendente" | "Aprovado" | "Rejeitado";
}

export interface Usuario {
  id: string | number;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  funcao: "Administrador" | "Usuário";
  status: "Ativo" | "Inativo";
  totalDocumentos: number;
}

// Controla o modo de visualização principal da página
type ModoVisao = "LISTA" | "FORMULARIO_CRIAR" | "FORMULARIO_EDITAR" | "VER_DOCUMENTOS";

export default function Usuarios() {
  // Dados
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [documentosDoUsuario, setDocumentosDoUsuario] = useState<Documento[]>([]);
  
  // Níveis de Estado e Navegação
  const [modo, setModo] = useState<ModoVisao>("LISTA");
  const [usuarioAtivo, setUsuarioAtivo] = useState<Usuario | null>(null);
  const [usuarioParaEliminar, setUsuarioParaEliminar] = useState<Usuario | null>(null);

  // Loaders e Mensagens
  const [loadingUsuarios, setLoadingUsuarios] = useState<boolean>(true);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  // Pesquisas
  const [busca, setBusca] = useState("");
  const [buscaDoc, setBuscaDoc] = useState("");

  // Formulário Único
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cargo: "",
    departamento: "",
    funcao: "Usuário" as "Administrador" | "Usuário",
    status: "Ativo" as "Ativo" | "Inativo",
  });

  // 1. CARREGAR USUÁRIOS
  const fetchUsuarios = async () => {
    setLoadingUsuarios(true);
    setErro(null);
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Falha ao carregar utilizadores");
      const data = await response.json();
      setUsuarios(data);
    } catch (err: any) {
      setErro(err.message || "Erro de ligação ao servidor");
    } finally {
      setLoadingUsuarios(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // 2. CARREGAR DOCUMENTOS
  const fetchDocumentosDoUsuario = async (userId: string | number) => {
    setLoadingDocs(true);
    try {
      const response = await fetch(`/api/users/${userId}/documents`);
      if (!response.ok) throw new Error("Erro ao procurar documentos");
      const data = await response.json();
      setDocumentosDoUsuario(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    if (modo === "VER_DOCUMENTOS" && usuarioAtivo) {
      fetchDocumentosDoUsuario(usuarioAtivo.id);
    }
  }, [modo, usuarioAtivo]);

  // Auxiliares de Navegação do Formulário
  const resetForm = () => {
    setFormData({
      nome: "",
      email: "",
      senha: "",
      cargo: "",
      departamento: "",
      funcao: "Usuário",
      status: "Ativo",
    });
  };

  const handleAbrirCriar = () => {
    resetForm();
    setUsuarioAtivo(null);
    setModo("FORMULARIO_CRIAR");
  };

  const handleAbrirEditar = (u: Usuario) => {
    setUsuarioAtivo(u);
    setFormData({
      nome: u.nome,
      email: u.email,
      senha: "", // Opcional no editar
      cargo: u.cargo,
      departamento: u.departamento,
      funcao: u.funcao,
      status: u.status,
    });
    setModo("FORMULARIO_EDITAR");
  };

  const handleVoltarParaLista = () => {
    setModo("LISTA");
    setUsuarioAtivo(null);
    resetForm();
  };

  // 3. SUBMIT DO FORMULÁRIO (CRIAR OU EDITAR)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    try {
      const isEdicao = modo === "FORMULARIO_EDITAR";
      const url = isEdicao
        ? `/api/admin/users/${usuarioAtivo?.id}`
        : "/api/admin/users";
      const method = isEdicao ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Falha ao guardar os dados do utilizador");

      await fetchUsuarios();
      handleVoltarParaLista();
    } catch (err: any) {
      alert(err.message || "Ocorreu um erro ao processar o pedido");
    } finally {
      setSalvando(false);
    }
  };

  // 4. ELIMINAR USUÁRIO
  const confirmarEliminacao = async () => {
    if (!usuarioParaEliminar) return;

    try {
      const response = await fetch(`/api/admin/users/${usuarioParaEliminar.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao eliminar utilizador");

      setUsuarios((prev) => prev.filter((u) => u.id !== usuarioParaEliminar.id));
      setUsuarioParaEliminar(null);
    } catch (err: any) {
      alert(err.message || "Não foi possível eliminar o utilizador");
    }
  };

  // Filtros
  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase()) ||
      u.departamento.toLowerCase().includes(busca.toLowerCase())
  );

  const docsFiltrados = documentosDoUsuario.filter((doc) =>
    doc.nome.toLowerCase().includes(buscaDoc.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* ==================== VISTA 1: LISTA PRINCIPAL DE USUÁRIOS ==================== */}
      {modo === "LISTA" && (
        <>
          {/* Cabeçalho */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Gestão de Usuários e Credenciais
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Gerencie contas, credenciais de acesso e permissões internas
              </p>
            </div>
            <button
              onClick={handleAbrirCriar}
              className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm"
            >
              <FontAwesomeIcon icon={faUserPlus} className="w-3.5 h-3.5" />
              <span>Novo Usuário</span>
            </button>
          </div>

          {/* Barra de Pesquisa */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Pesquisar por nome, e-mail ou setor..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
              />
              <span className="absolute left-3 top-2.5 text-slate-400">
                <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Grid de Conteúdo */}
          {loadingUsuarios ? (
            <div className="flex justify-center items-center py-12 text-slate-500 gap-2">
              <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
              <span className="text-sm">A carregar utilizadores...</span>
            </div>
          ) : erro ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm text-center">
              {erro}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {usuariosFiltrados.map((u) => (
                <div
                  key={u.id}
                  className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg">
                          <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            u.status === "Ativo"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {u.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAbrirEditar(u)}
                          title="Editar Perfil"
                          className="p-1.5 text-slate-400 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <FontAwesomeIcon icon={faEdit} className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setUsuarioParaEliminar(u)}
                          title="Eliminar Usuário"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-800 text-base">{u.nome}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{u.cargo}</p>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2 text-slate-500">
                        <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{u.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <FontAwesomeIcon icon={faShieldAlt} className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-700">{u.departamento}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                          {u.funcao}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Documentos: <strong className="text-slate-700">{u.totalDocumentos}</strong>
                    </span>

                    <button
                      onClick={() => {
                        setUsuarioAtivo(u);
                        setBuscaDoc("");
                        setModo("VER_DOCUMENTOS");
                      }}
                      className="flex items-center gap-1.5 py-1.5 px-3 bg-slate-50 hover:bg-blue-900 hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200 hover:border-blue-900"
                    >
                      <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" />
                      <span>Ver Documentos</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ==================== VISTA 2: FORMULÁRIO COMPLETO (CRIAR / EDITAR) ==================== */}
      {(modo === "FORMULARIO_CRIAR" || modo === "FORMULARIO_EDITAR") && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-3xl mx-auto space-y-6">
          {/* Cabeçalho do Formulário */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <button
                onClick={handleVoltarParaLista}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {modo === "FORMULARIO_CRIAR" ? "Criar Novo Usuário" : `Editar Perfil: ${usuarioAtivo?.nome}`}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {modo === "FORMULARIO_CRIAR"
                    ? "Preencha os dados e credenciais para o novo utilizador do sistema"
                    : "Atualize os dados e privilégios de acesso do utilizador"}
                </p>
              </div>
            </div>
          </div>

          {/* Corpo do Formulário */}
          <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nome Completo</label>
              <input
                type="text"
                required
                placeholder="Ex: João Tembe"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">E-mail Institucional</label>
                <input
                  type="email"
                  required
                  placeholder="usuario@netline.co.mz"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {modo === "FORMULARIO_CRIAR" ? "Senha Inicial" : "Redefinir Senha (opcional)"}
                </label>
                <input
                  type="password"
                  required={modo === "FORMULARIO_CRIAR"}
                  placeholder={modo === "FORMULARIO_CRIAR" ? "••••••••" : "Deixe em branco para não alterar"}
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cargo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: TÉCNICO DE REDES"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Departamento / Setor</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: TI"
                  value={formData.departamento}
                  onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Perfil / Permissão</label>
                <select
                  value={formData.funcao}
                  onChange={(e) => setFormData({ ...formData, funcao: e.target.value as "Administrador" | "Usuário" })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-sm"
                >
                  <option value="Usuário">Usuário Padrão</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estado da Conta</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "Ativo" | "Inativo" })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-sm"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>

            {/* Ações do Formulário */}
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleVoltarParaLista}
                className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50"
              >
                {salvando ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="w-3.5 h-3.5" />
                    <span>A guardar...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="w-3.5 h-3.5" />
                    <span>{modo === "FORMULARIO_CRIAR" ? "Criar Conta" : "Salvar Alterações"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== VISTA 3: TABELA DE DOCUMENTOS ==================== */}
      {modo === "VER_DOCUMENTOS" && usuarioAtivo && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <button
                onClick={handleVoltarParaLista}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Ficheiros de {usuarioAtivo.nome}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {usuarioAtivo.cargo} — {usuarioAtivo.departamento}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            {loadingDocs ? (
              <div className="p-8 text-center text-slate-500">
                <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5 mr-2" />
                A carregar ficheiros...
              </div>
            ) : docsFiltrados.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Nenhum documento encontrado para este utilizador.
              </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-400 uppercase text-xs border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Documento</th>
                    <th className="py-3.5 px-4 font-semibold">Categoria</th>
                    <th className="py-3.5 px-4 font-semibold">Tamanho</th>
                    <th className="py-3.5 px-4 font-semibold">Data</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {docsFiltrados.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{doc.nome}</td>
                      <td className="py-3.5 px-4">{doc.categoria}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">{doc.tamanho}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">{doc.dataUpload}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                          {doc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ==================== BANNER FLUTUANTE / CAIXA INLINE DE CONFIRMAÇÃO DE ELIMINAÇÃO ==================== */}
      {usuarioParaEliminar && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-red-200 shadow-xl rounded-xl p-4 max-w-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Eliminar Acesso</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tem a certeza que deseja eliminar o utilizador <strong>{usuarioParaEliminar.nome}</strong>?
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
            <button
              onClick={() => setUsuarioParaEliminar(null)}
              className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-semibold hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              onClick={confirmarEliminacao}
              className="px-3 py-1.5 bg-red-600 text-white rounded-md text-[11px] font-semibold hover:bg-red-700"
            >
              Sim, Eliminar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}