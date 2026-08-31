import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { API_URL, fetchComToken } from "../../utils/api";
import { API_ENDPOINTS } from "../../data/client/endpoint";
import { IconUsuario } from "../../components/icons";
import ModalFotografia from "../../components/modalFotografia";
import type { UsuarioData } from "../../hooks/useDashboardData";

interface DashboardContext {
  usuario: UsuarioData | null;
  recarregarDashboard: () => void;
}

interface DadosPerfilForm {
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
}

export default function PerfilPage() {
  const { usuario, recarregarDashboard } = useOutletContext<DashboardContext>();
  const ehAdmin = usuario?.perfil === "ADMIN";

  const [editando, setEditando] = useState(false);
  const [formDados, setFormDados] = useState<DadosPerfilForm>({
    nome: "",
    email: "",
    cargo: "",
    departamento: "",
  });

  const [alterarSenha, setAlterarSenha] = useState(false);
  const [senhaForm, setSenhaForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const [salvando, setSalvando] = useState(false);

  const inputFotoRef = useRef<HTMLInputElement>(null);
  const [arquivoFoto, setArquivoFoto] = useState<File | null>(null);
  const [modalFotoAberto, setModalFotoAberto] = useState(false);

  useEffect(() => {
    if (usuario) {
      setFormDados({
        nome: usuario.nome || "",
        email: usuario.email || "",
        cargo: usuario.cargo || "",
        departamento: usuario.departamento || "",
      });
    }
  }, [usuario]);

  const lidarComMudancaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDados((prev) => ({ ...prev, [name]: value }));
  };

  const lidarComSelecaoFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (arquivo) {
      setArquivoFoto(arquivo);
      setModalFotoAberto(true);
    }
    e.target.value = ""; // permite re-selecionar o mesmo ficheiro depois
  };

  const cancelarEdicao = () => {
    setEditando(false);
    setAlterarSenha(false);
    setSenhaForm({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
    if (usuario) {
      setFormDados({
        nome: usuario.nome || "",
        email: usuario.email || "",
        cargo: usuario.cargo || "",
        departamento: usuario.departamento || "",
      });
    }
  };

  const salvarAlteracoes = async (e: React.FormEvent) => {
    e.preventDefault();

    if (alterarSenha) {
      if (!senhaForm.senhaAtual || !senhaForm.novaSenha || !senhaForm.confirmarSenha) {
        toast.error("Preencha todos os campos da alteração de senha.");
        return;
      }
      if (senhaForm.novaSenha !== senhaForm.confirmarSenha) {
        toast.error("A nova senha e a confirmação não coincidem.");
        return;
      }
    }

    setSalvando(true);
    try {
      // Admin: campos de perfil só são editáveis (e só são enviados) por admin
      if (ehAdmin && usuario?.id) {
        await fetchComToken(API_ENDPOINTS.USUARIO_BY_ID(usuario.id), {
          method: "PATCH",
          body: JSON.stringify(formDados),
        });
      }

      // Senha: comum a ambos os perfis, sempre via /auth/senha
      if (alterarSenha) {
        await fetchComToken(API_ENDPOINTS.ALTERAR_SENHA, {
          method: "PATCH",
          body: JSON.stringify({
            senhaAtual: senhaForm.senhaAtual,
            novaSenha: senhaForm.novaSenha,
          }),
        });
      }

      recarregarDashboard();
      setEditando(false);
      setAlterarSenha(false);
      setSenhaForm({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
      toast.success("Perfil atualizado com sucesso!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  };

  if (!usuario) {
    return (
      <div className="flex justify-center items-center p-12">
        <p className="text-slate-500 font-medium text-sm animate-pulse">A carregar dados do perfil...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-[#18357a] relative">
          <button
            type="button"
            onClick={() => inputFotoRef.current?.click()}
            className="absolute -bottom-10 left-8 bg-slate-100 border-4 border-white p-0 rounded-full shadow-sm text-slate-600 flex items-center justify-center w-24 h-24 overflow-hidden cursor-pointer group"
            title="Alterar fotografia"
          >
            {usuario.fotografia ? (
              <img src={ `${API_URL}${usuario.fotografia}`} alt={usuario.nome} className="w-full h-full object-cover" />
            ) : (
              <IconUsuario className="w-12 h-12" />
            )}
            <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-semibold">
              Alterar
            </span>
          </button>
          <input
            ref={inputFotoRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={lidarComSelecaoFoto}
          />
        </div>

        <form onSubmit={salvarAlteracoes} className="pt-14 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{usuario.nome || "Utilizador"}</h2>
              <p className="text-slate-500 font-medium text-sm">{usuario.cargo || "Colaborador"}</p>
            </div>

            <div className="mt-4 sm:mt-0 space-x-2">
              {editando ? (
                <>
                  <button
                    type="button"
                    onClick={cancelarEdicao}
                    disabled={salvando}
                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded-xl text-xs transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvando}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {salvando ? "A salvar..." : "Salvar Alterações"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditando(true)}
                  className="px-4 py-2 bg-[#1b365d] hover:bg-[#142847] text-white font-medium rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                >
                  Editar Perfil
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {([
              ["nome", "Nome Completo"],
              ["email", "Endereço de E-mail"],
              ["cargo", "Cargo"],
              ["departamento", "Departamento"],
            ] as const).map(([campo, label]) => (
              <div key={campo}>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {label}
                </label>
                {editando && ehAdmin ? (
                  <input
                    type={campo === "email" ? "email" : "text"}
                    name={campo}
                    value={formDados[campo]}
                    onChange={lidarComMudancaInput}
                    className="w-full px-4 py-2.5 bg-white border border-[#1b365d]/40 focus:ring-2 focus:ring-[#1b365d]/20 focus:border-[#1b365d] rounded-xl text-slate-700 text-sm font-medium outline-none transition-all"
                    required={campo === "nome" || campo === "email"}
                  />
                ) : (
                  <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm font-medium">
                    {usuario[campo as keyof UsuarioData] || "N/A"}
                  </div>
                )}
              </div>
            ))}
          </div>

          {editando && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-700">Segurança da Conta</h3>
                <button
                  type="button"
                  onClick={() => setAlterarSenha(!alterarSenha)}
                  className="text-xs text-[#1b365d] hover:underline font-semibold cursor-pointer"
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
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-[#1b365d]"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Nova Senha</label>
                    <input
                      type="password"
                      value={senhaForm.novaSenha}
                      onChange={(e) => setSenhaForm({ ...senhaForm, novaSenha: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-[#1b365d]"
                      placeholder="Nova senha"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Confirmar Senha</label>
                    <input
                      type="password"
                      value={senhaForm.confirmarSenha}
                      onChange={(e) => setSenhaForm({ ...senhaForm, confirmarSenha: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-[#1b365d]"
                      placeholder="Confirmar nova senha"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>

      <ModalFotografia
        aberto={modalFotoAberto}
        arquivo={arquivoFoto}
        onFechar={() => {
          setModalFotoAberto(false);
          setArquivoFoto(null);
        }}
        onSucesso={recarregarDashboard}
      />
    </div>
  );
}