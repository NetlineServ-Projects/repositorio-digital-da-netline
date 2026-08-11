import React, { useState, useEffect } from "react";
import { IconUsuario } from "./icons";

interface UsuarioData {
  id?: string;
  nome: string;
  email: string;
  cargo?: string;
  departamento?: string;
  dataAdmissao?: string;
}

export default function Perfil() {
  const [usuario, setUsuario] = useState<UsuarioData | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);

  // Estados do formulário
  const [editando, setEditando] = useState<boolean>(false);
  const [formDados, setFormDados] = useState<UsuarioData>({
    nome: "",
    email: "",
    cargo: "",
    departamento: "",
  });

  // Alteração de senha
  const [alterarSenha, setAlterarSenha] = useState<boolean>(false);
  const [senhaForm, setSenhaForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  // Estados de feedback e envio
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);
  const [salvando, setSalvando] = useState<boolean>(false);

  // Endpoint base da sua API
  const API_URL = "http://localhost:5000/api/usuarios/perfil";

  // Buscar dados do utilizador do backend ao carregar a página
  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const token = localStorage.getItem("token"); // Token de autenticação JWT

        const resposta = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar os dados do perfil.");
        }

        const dados: UsuarioData = await resposta.json();
        setUsuario(dados);
        setFormDados(dados);
      } catch (err: any) {
        setMensagem({ tipo: "erro", texto: err.message || "Erro de conexão com o servidor." });
      } finally {
        setCarregando(false);
      }
    };

    carregarPerfil();
  }, []);

  const iniciarEdicao = () => {
    if (usuario) {
      setFormDados({
        nome: usuario.nome || "",
        email: usuario.email || "",
        cargo: usuario.cargo || "",
        departamento: usuario.departamento || "",
      });
    }
    setEditando(true);
  };

  const lidarComMudancaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDados((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Enviar os dados atualizados para a API
  const salvarAlteracoes = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem(null);

    // Validação de senha no frontend antes de disparar o request
    if (alterarSenha) {
      if (!senhaForm.senhaAtual || !senhaForm.novaSenha || !senhaForm.confirmarSenha) {
        setMensagem({ tipo: "erro", texto: "Preencha todos os campos da alteração de senha." });
        setSalvando(false);
        return;
      }
      if (senhaForm.novaSenha !== senhaForm.confirmarSenha) {
        setMensagem({ tipo: "erro", texto: "A nova senha e a confirmação não coincidem." });
        setSalvando(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");

      // Payload contendo os dados do perfil + senha (se ativado)
      const payload = {
        ...formDados,
        ...(alterarSenha && {
          senhaAtual: senhaForm.senhaAtual,
          novaSenha: senhaForm.novaSenha,
        }),
      };

      const resposta = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(resultado.mensagem || "Falha ao atualizar o perfil.");
      }

      // Atualiza o estado da UI com a resposta do backend
      setUsuario(resultado.usuario || formDados);
      setEditando(false);
      setAlterarSenha(false);
      setSenhaForm({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
      setMensagem({ tipo: "sucesso", texto: "Perfil e dados atualizados com sucesso!" });
    } catch (err: any) {
      setMensagem({ tipo: "erro", texto: err.message || "Erro ao salvar as alterações." });
    } finally {
      setSalvando(false);
    }
  };

  const cancelarEdicao = () => {
    setEditando(false);
    setAlterarSenha(false);
    setSenhaForm({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
    if (usuario) setFormDados(usuario);
  };

  if (carregando) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-slate-500 font-medium">
        Carregando dados do perfil...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Banner */}
      <div className="h-32 bg-[#062869] relative">
        <div className="absolute -bottom-10 left-8 bg-slate-100 border-4 border-white p-4 rounded-full shadow-sm text-slate-600 flex items-center justify-center w-24 h-24">
          <IconUsuario className="w-12 h-12" />
        </div>
      </div>

      {/* Alerta de Feedback */}
      {mensagem && (
        <div
          className={`mx-8 mt-12 p-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
            mensagem.tipo === "sucesso"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <span>{mensagem.texto}</span>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={salvarAlteracoes} className={mensagem ? "p-8 pt-4" : "pt-14 p-8"}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {usuario?.nome || "Utilizador"}
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {usuario?.cargo || "Colaborador"}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 space-x-2">
            {editando ? (
              <>
                <button
                  type="button"
                  onClick={cancelarEdicao}
                  disabled={salvando}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
                >
                  {salvando ? "A salvar..." : "Salvar Alterações"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={iniciarEdicao}
                className="px-4 py-2 bg-[#062869] hover:bg-blue-900 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
              >
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Campos do Perfil */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Nome Completo
            </label>
            {editando ? (
              <input
                type="text"
                name="nome"
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

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Endereço de E-mail
            </label>
            {editando ? (
              <input
                type="email"
                name="email"
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

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Cargo
            </label>
            {editando ? (
              <input
                type="text"
                name="cargo"
                value={formDados.cargo || ""}
                onChange={lidarComMudancaInput}
                className="w-full px-4 py-2.5 bg-white border border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-lg text-slate-700 font-medium outline-none transition-all"
              />
            ) : (
              <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
                {usuario?.cargo || "N/A"}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Departamento
            </label>
            {editando ? (
              <input
                type="text"
                name="departamento"
                value={formDados.departamento || ""}
                onChange={lidarComMudancaInput}
                className="w-full px-4 py-2.5 bg-white border border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-lg text-slate-700 font-medium outline-none transition-all"
              />
            ) : (
              <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
                {usuario?.departamento || "N/A"}
              </div>
            )}
          </div>
        </div>

        {/* Alteração de Senha */}
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