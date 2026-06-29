import React, { useState, useEffect } from "react";
import { IconUsuario } from "../components/icons";

interface UsuarioData {
  nome: string;
  email: string;
  cargo?: string;
  departamento?: string;
  dataAdmissao?: string;
}

export default function Perfil() {
  const [usuario, setUsuario] = useState<UsuarioData | null>(null);

  // 1. Estados para controlar o modo de edição e os dados do formulário
  const [editando, setEditando] = useState<boolean>(false);
  const [formDados, setFormDados] = useState<UsuarioData>({
    nome: "",
    email: "",
    cargo: "",
    departamento: "",
    dataAdmissao: "",
  });

  useEffect(() => {
    const stringUsuario = localStorage.getItem("usuario_logado");
    if (stringUsuario) {
      const dadosInstanciados = JSON.parse(stringUsuario);
      setUsuario(dadosInstanciados);
      // Inicializa o formulário com os dados atuais do utilizador
      setFormDados(dadosInstanciados);

      //   setUsuario(JSON.parse(stringUsuario));
    }
  }, []);
  // 2. Atualiza o estado temporário do formulário enquanto o utilizador digita
  const lidarComMudancaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDados((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Salva as alterações no localStorage e atualiza o estado global do componente
  const salvarAlteracoes = (e: React.FormEvent) => {
    e.preventDefault();

    // Atualiza o localStorage com os novos dados introduzidos
    localStorage.setItem("usuario_logado", JSON.stringify(formDados));

    // Atualiza o estado visual
    setUsuario(formDados);
    setEditando(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Cabeçalho do Perfil (Banner) */}
      <div className="h-32 bg-[#062869] relative">
        {/* Avatar/Ícone do Utilizador posicionado de forma absoluta */}
        <div className="absolute -bottom-10 left-8 bg-slate-100 border-4 border-white p-4 rounded-full shadow-sm text-slate-600 flex items-center justify-center w-24 h-24">
          <IconUsuario className="w-12 h-12" />
        </div>
      </div>

      {/* Informações Principais */}

     {/* Formulário Envolvente para interceptar o Save */}
      <form onSubmit={salvarAlteracoes} className="pt-14 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {usuario?.nome || "Nome do Utilizador"}
            </h2>
            <p className="text-slate-500 font-medium">
              {usuario?.cargo || "Colaborador Netline"}
            </p>
          </div>
          
          {/* 4. Botão Alternável (Muda de texto e ação dependendo do estado) */}
          <div className="mt-4 sm:mt-0 space-x-2">
            {editando ? (
              <>
                <button 
                  type="button"
                  onClick={() => { setEditando(false); setFormDados(usuario || formDados); }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded-lg text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
                >
                  Salvar
                </button>
              </>
            ) : (
              <button 
                type="button"
                onClick={() => setEditando(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
              >
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Detalhes da Conta / Inputs Condicionais */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Campo: Nome */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Nome Completo
            </label>
            {editando ? (
              <input
                type="text"
                name="nome"
                aria-label="Nome do utilizador"
                value={formDados.nome}
                onChange={lidarComMudancaInput}
                className="w-full px-4 py-2.5 bg-white border border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-lg text-slate-700 font-medium outline-none transition-all"
                required
              />
            ) : (
              <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
                {usuario?.nome || "N/A"}
              </div>
            )}
          </div>

          {/* Campo: E-mail */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Endereço de E-mail
            </label>
            {editando ? (
              <input
                type="email"
                name="email"
                aria-label="E-mail de utilizador"
                value={formDados.email}
                onChange={lidarComMudancaInput}
                className="w-full px-4 py-2.5 bg-white border border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-lg text-slate-700 font-medium outline-none transition-all"
                required
              />
            ) : (
              <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
                {usuario?.email || "N/A"}
              </div>
            )}
          </div>

          {/* Campo: Cargo (Adicionado para ficar editável também) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Cargo
            </label>
            {editando ? (
              <input
                type="text"
                name="cargo"
                aria-label="Cargo de Utilizador"
                value={formDados.cargo || ""}
                onChange={lidarComMudancaInput}
                className="w-full px-4 py-2.5 bg-white border border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-lg text-slate-700 font-medium outline-none transition-all"
              />
            ) : (
              <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
                {usuario?.cargo || "Colaborador Netline"}
              </div>
            )}
          </div>

          {/* Campo: Departamento */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Departamento
            </label>
            {editando ? (
              <input
                type="text"
                name="departamento"
                aria-label="Departamento de Utilizador"
                value={formDados.departamento || ""}
                onChange={lidarComMudancaInput}
                className="w-full px-4 py-2.5 bg-white border border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-lg text-slate-700 font-medium outline-none transition-all"
              />
            ) : (
              <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
                {usuario?.departamento || "Tecnologia da Informação"}
              </div>
            )}
          </div>

        </div>
      </form>
    </div>
  );
}
