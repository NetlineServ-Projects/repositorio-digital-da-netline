import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { fetchComToken } from "../../utils/api";

export default function ConfiguracoesPage() {
  // Estado das configurações (agora vindo do backend, não do localStorage)
  const [darkTheme, setDarkTheme] = useState<boolean>(false);
  const [notificacoesEmail, setNotificacoesEmail] = useState<boolean>(true);
  const [idioma, setIdioma] = useState<string>("pt");

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  // Carregar preferências do usuário autenticado
  useEffect(() => {
    const carregarPreferencias = async () => {
      try {
        const usuario = await fetchComToken("/auth/me");
        setDarkTheme(Boolean(usuario.temaEscuro));
        setNotificacoesEmail(usuario.notificacoesEmail ?? true);
        setIdioma(usuario.idioma || "pt");

        if (usuario.temaEscuro) {
          document.documentElement.classList.add("dark");
        }
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Não foi possível carregar as configurações.");
      } finally {
        setLoading(false);
      }
    };

    carregarPreferencias();
  }, []);

  // Alternar o tema visual (só o estado local + classe no <html>; a persistência acontece no Salvar)
  const handleToggleTema = () => {
    const novoEstado = !darkTheme;
    setDarkTheme(novoEstado);

    if (novoEstado) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Guardar todas as configurações de uma vez, agora via API
  const salvarConfiguracoes = async (e: FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);

    try {
      await fetchComToken("/usuarios/me/preferencias", {
        method: "PATCH",
        body: JSON.stringify({
          temaEscuro: darkTheme,
          notificacoesEmail,
          idioma,
        }),
      });

      setMensagem("Configurações salvas!");
      setTimeout(() => setMensagem(null), 2500);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível salvar as configurações.");
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
        <p className="text-slate-500 text-sm animate-pulse">A carregar configurações...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
      <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Configurações</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie as preferências simples da sua conta
          </p>
        </div>

        {mensagem && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
            {mensagem}
          </span>
        )}
      </div>

      {erro && (
        <div className="mb-4 text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {erro}
        </div>
      )}

      <form onSubmit={salvarConfiguracoes} className="space-y-6">
        {/* 1. Modo Escuro / Claro */}
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-semibold text-slate-700">Aparência da Plataforma</p>
            <p className="text-xs text-slate-400">
              {darkTheme ? "Modo Escuro ativado" : "Modo Claro ativado (Padrão)"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleTema}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              darkTheme ? "bg-[#062869]" : "bg-slate-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                darkTheme ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <hr className="border-slate-100" />

        {/* 2. Notificações por Email */}
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-semibold text-slate-700">Notificações por E-mail</p>
            <p className="text-xs text-slate-400">
              Receber alertas no e-mail quando novos documentos forem adicionados
            </p>
          </div>
          <input
            type="checkbox"
            checked={notificacoesEmail}
            onChange={(e) => setNotificacoesEmail(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
          />
        </div>

        <hr className="border-slate-100" />

        {/* 3. Idioma do Sistema */}
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-semibold text-slate-700">Idioma da Plataforma</p>
            <p className="text-xs text-slate-400">Selecione o idioma de preferência</p>
          </div>
          <select
            value={idioma}
            onChange={(e) => setIdioma(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="pt">Português (PT)</option>
            <option value="en">English (EN)</option>
          </select>
        </div>

        {/* Botão Salvar */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={salvando}
            className="px-5 py-2 bg-[#062869] hover:bg-blue-900 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-xs transition-colors shadow-sm"
          >
            {salvando ? "A salvar..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}