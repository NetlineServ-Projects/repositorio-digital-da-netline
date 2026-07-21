import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserPlus,
  faEdit,
  faTrashAlt,
  faKey,
  faSearch,
  faArrowLeft,
  faEye,
  faEnvelope,
  faShieldAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface Documento {
  id: string | number;
  nome: string;
  categoria: string;
  tamanho: string;
  dataUpload: string;
  status: "Pendente" | "Aprovado" | "Rejeitado";
}

interface Usuario {
  id: string | number;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  funcao: "Administrador" | "Usuário";
  status: "Ativo" | "Inativo";
  totalDocumentos: number;
}

export default function Usuarios() {
  // Lista Estado de Usuários
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: "1",
      nome: "Elisa Nhamuanzo",
      email: "elisa.nhamuanzo@netline.co.mz",
      cargo: "Assistente de Desenvolvimento",
      departamento: "Tecnologias de Informação",
      funcao: "Administrador",
      status: "Ativo",
      totalDocumentos: 14,
    },
    {
      id: "2",
      nome: "Kevin Silva",
      email: "kevin.silva@netline.co.mz",
      cargo: "Técnico de Suporte",
      departamento: "Sistemas & Redes",
      funcao: "Usuário",
      status: "Ativo",
      totalDocumentos: 6,
    },
    {
      id: "3",
      nome: "Marta Cossa",
      email: "marta.cossa@netline.co.mz",
      cargo: "Analista Financeira",
      departamento: "Finanças",
      funcao: "Usuário",
      status: "Ativo",
      totalDocumentos: 8,
    },
  ]);

  // Mock de Documentos vinculados
  const [documentosPorUsuario] = useState<Record<string, Documento[]>>({
    "Elisa Nhamuanzo": [
      {
        id: "101",
        nome: "Especificacao_Tecnica_Repositorio.pdf",
        categoria: "Sistemas",
        tamanho: "1.8 MB",
        dataUpload: "21/07/2026",
        status: "Aprovado",
      },
    ],
    "Kevin Silva": [
      {
        id: "201",
        nome: "Manual_de_Procedimentos.docx",
        categoria: "Documentação",
        tamanho: "1.1 MB",
        dataUpload: "20/07/2026",
        status: "Aprovado",
      },
    ],
  });

  // Estados de Navegação e Modais
  const [usuarioAtivo, setUsuarioAtivo] = useState<Usuario | null>(null);
  const [busca, setBusca] = useState("");
  const [buscaDoc, setBuscaDoc] = useState("");

  const [modalCriar, setModalCriar] = useState(false);
  const [usuarioParaEditar, setUsuarioParaEditar] = useState<Usuario | null>(null);

  // Form State para Criar/Editar
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cargo: "",
    departamento: "",
    funcao: "Usuário" as "Administrador" | "Usuário",
    status: "Ativo" as "Ativo" | "Inativo",
  });

  // Abrir Modal de Edição preenchendo os campos
  const handleAbrirEditar = (u: Usuario) => {
    setUsuarioParaEditar(u);
    setFormData({
      nome: u.nome,
      email: u.email,
      senha: "", // Vazia para permitir redefinição opcional
      cargo: u.cargo,
      departamento: u.departamento,
      funcao: u.funcao,
      status: u.status,
    });
  };

  // Guardar Edição do Usuário
  const handleSalvarEdicao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioParaEditar) return;

    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === usuarioParaEditar.id
          ? {
              ...u,
              nome: formData.nome,
              email: formData.email,
              cargo: formData.cargo,
              departamento: formData.departamento,
              funcao: formData.funcao,
              status: formData.status,
            }
          : u
      )
    );
    setUsuarioParaEditar(null);
  };

  // Criar Novo Usuário
  const handleCriarUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    const novo: Usuario = {
      id: Date.now().toString(),
      nome: formData.nome,
      email: formData.email,
      cargo: formData.cargo,
      departamento: formData.departamento,
      funcao: formData.funcao,
      status: formData.status,
      totalDocumentos: 0,
    };

    setUsuarios((prev) => [...prev, novo]);
    setModalCriar(false);
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

  // Eliminar Usuário
  const handleEliminar = (id: string | number, nome: string) => {
    if (confirm(`Tem certeza que deseja eliminar o acesso do usuário "${nome}"?`)) {
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    }
  };

  // Filtros de Usuários e Documentos
  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase()) ||
      u.departamento.toLowerCase().includes(busca.toLowerCase())
  );

  const documentosDoUsuario = usuarioAtivo
    ? (documentosPorUsuario[usuarioAtivo.nome] || []).filter((doc) =>
        doc.nome.toLowerCase().includes(buscaDoc.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      {!usuarioAtivo ? (
        <>
          {/* Cabeçalho com Botão de Novo Usuário */}
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
              onClick={() => {
                setFormData({
                  nome: "",
                  email: "",
                  senha: "",
                  cargo: "",
                  departamento: "",
                  funcao: "Usuário",
                  status: "Ativo",
                });
                setModalCriar(true);
              }}
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

          {/* Grelha de Cards de Usuários */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usuariosFiltrados.map((u) => (
              <div
                key={u.id}
                className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Topo do Card com Status e Ações Rápida (Editar/Excluir) */}
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
                        title="Editar Perfil & Credenciais"
                        className="p-1.5 text-slate-400 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <FontAwesomeIcon icon={faEdit} className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEliminar(u.id, u.nome)}
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

                {/* Rodapé do Card */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Documentos: <strong className="text-slate-700">{u.totalDocumentos}</strong>
                  </span>

                  <button
                    onClick={() => {
                      setUsuarioAtivo(u);
                      setBuscaDoc("");
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
        </>
      ) : (
        /* VISTA DE DOCUMENTOS DO USUÁRIO */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUsuarioAtivo(null)}
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

          {/* Tabela de Ficheiros */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
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
                {documentosDoUsuario.map((doc) => (
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
          </div>
        </div>
      )}

      {/* MODAL: CRIAR NOVO USUÁRIO */}
      {modalCriar && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Criar Novo Usuário</h3>
              <button
                onClick={() => setModalCriar(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleCriarUsuario} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João Tembe"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">E-mail Institucional</label>
                  <input
                    type="email"
                    required
                    placeholder="usuario@netline.co.mz"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Senha Inicial</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cargo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: TÉCNICO DE REDES"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Perfil / Função</label>
                  <select
                    value={formData.funcao}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        funcao: e.target.value as "Administrador" | "Usuário",
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  >
                    <option value="Usuário">Usuário Padrão</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status do Acesso</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "Ativo" | "Inativo",
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalCriar(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-semibold hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800"
                >
                  Criar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR USUÁRIO & CREDENCIAIS */}
      {usuarioParaEditar && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">
                Editar Perfil: {usuarioParaEditar.nome}
              </h3>
              <button
                onClick={() => setUsuarioParaEditar(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleSalvarEdicao} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Redefinir Senha <span className="font-normal text-slate-400">(opcional)</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Nova senha..."
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cargo</label>
                  <input
                    type="text"
                    required
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Departamento</label>
                  <input
                    type="text"
                    required
                    value={formData.departamento}
                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nível de Permissão</label>
                  <select
                    value={formData.funcao}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        funcao: e.target.value as "Administrador" | "Usuário",
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  >
                    <option value="Usuário">Usuário Padrão</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estado da Conta</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "Ativo" | "Inativo",
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUsuarioParaEditar(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-semibold hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}