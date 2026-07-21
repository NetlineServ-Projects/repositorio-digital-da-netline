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

  // Estados para controlar o modo de edição e os dados do formulário
  const [editando, setEditando] = useState<boolean>(false);
  const [formDados, setFormDados] = useState<UsuarioData>({
    nome: "",
    email: "",
    cargo: "",
    departamento: "",
    dataAdmissao: "",
  });

  // Estados para alteração de senha
  const [alterarSenha, setAlterarSenha] = useState<boolean>(false);
  const [senhaForm, setSenhaForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  // Feedback para o utilizador
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  useEffect(() => {
    const stringUsuario = localStorage.getItem("usuario_logado");
    if (stringUsuario) {
      try {
        const dadosInstanciados = JSON.parse(stringUsuario);
        setUsuario(dadosInstanciados);
        setFormDados(dadosInstanciados);
      } catch (err) {
        console.error("Erro ao carregar os dados do localStorage", err);
      }
    } else {
      // Valor padrão de fallback se ainda não existir no localStorage
      const dadosIniciais: UsuarioData = {
        nome: "Elisa Cesário Nhamuanzo",
        email: "elisa.nhamuanzo@netline.co.mz",
        cargo: "Desenvolvedora Full-Stack",
        departamento: "Tecnologia da Informação",
        dataAdmissao: "Maio de 2026",
      };
      setUsuario(dadosIniciais);
      setFormDados(dadosIniciais);
      localStorage.setItem("usuario_logado", JSON.stringify(dadosIniciais));
    }
  }, []);

  // Atualiza o estado temporário do formulário enquanto o utilizador digita
  const lidarComMudancaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDados((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Salva as alterações no localStorage e atualiza o estado global
  const salvarAlteracoes = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação rápida de senha caso esteja aberta a seção de alteração de senha
    if (alterarSenha) {
      if (!senhaForm.senhaAtual || !senhaForm.novaSenha) {
        setMensagem({ tipo: "erro", texto: "Preencha os campos de senha adequadamente." });
        return;
      }
      if (senhaForm.novaSenha !== senhaForm.confirmarSenha) {
        setMensagem({ tipo: "erro", texto: "A nova senha e a confirmação não coincidem." });
        return;
      }
    }

    // Salva perfil no localStorage
    localStorage.setItem("usuario_logado", JSON.stringify(formDados));

    // Atualiza estado local
    setUsuario(formDados);
    setEditando(false);
    setAlterarSenha(false);
    setSenhaForm({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });

    setMensagem({ tipo: "sucesso", texto: "Perfil atualizado com sucesso!" });
    setTimeout(() => setMensagem(null), 3000);
  };

  const cancelarEdicao = () => {
    setEditando(false);
    setAlterarSenha(false);
    if (usuario) setFormDados(usuario);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Cabeçalho do Perfil (Banner) */}
      <div className="h-32 bg-[#062869] relative">
        <div className="absolute -bottom-10 left-8 bg-slate-100 border-4 border-white p-4 rounded-full shadow-sm text-slate-600 flex items-center justify-center w-24 h-24">
          <IconUsuario className="w-12 h-12" />
        </div>
      </div>

      {/* Alerta / Toast de feedback */}
      {mensagem && (
        <div
          className={`mx-8 mt-12 p-3 rounded-lg text-xs font-semibold flex items-center justify-between ${
            mensagem.tipo === "sucesso"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <span>{mensagem.texto}</span>
        </div>
      )}

      {/* Formulário Envolvente */}
      <form onSubmit={salvarAlteracoes} className={mensagem ? "p-8 pt-4" : "pt-14 p-8"}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {usuario?.nome || "Nome do Utilizador"}
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {usuario?.cargo || "Colaborador Netline"}
            </p>
          </div>

          {/* Botões Alternáveis */}
          <div className="mt-4 sm:mt-0 space-x-2">
            {editando ? (
              <>
                <button
                  type="button"
                  onClick={cancelarEdicao}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded-lg text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
                >
                  Salvar Alterações
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditando(true)}
                className="px-4 py-2 bg-[#062869] hover:bg-blue-900 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
              >
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Detalhes da Conta */}
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

          {/* Campo: Cargo */}
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

        {/* Seção Opcional: Segurança & Senha (Visível apenas ao Editar) */}
        {editando && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700">Segurança da Conta</h3>
              <button
                type="button"
                onClick={() => setAlterarSenha(!alterarSenha)}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                {alterarSenha ? "Ocultar troca de senha" : "Alterar Senha de Acesso"}
              </button>
            </div>

            {alterarSenha && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Senha Atual</label>
                  <input
                    type="password"
                    value={senhaForm.senhaAtual}
                    onChange={(e) => setSenhaForm({ ...senhaForm, senhaAtual: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Nova Senha</label>
                  <input
                    type="password"
                    value={senhaForm.novaSenha}
                    onChange={(e) => setSenhaForm({ ...senhaForm, novaSenha: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500"
                    placeholder="Nova senha"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Confirmar Senha</label>
                  <input
                    type="password"
                    value={senhaForm.confirmarSenha}
                    onChange={(e) => setSenhaForm({ ...senhaForm, confirmarSenha: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500"
                    placeholder="Confirmar nova senha"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}