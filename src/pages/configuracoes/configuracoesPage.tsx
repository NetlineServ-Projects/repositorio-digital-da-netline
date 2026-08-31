import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { fetchComToken } from "../../utils/api";

export default function ConfiguracoesPage() {
  const { t, i18n } = useTranslation();

  const [darkTheme, setDarkTheme] = useState<boolean>(false);
  const [notificacoesEmail, setNotificacoesEmail] = useState<boolean>(true);
  const [idioma, setIdioma] = useState<string>("pt");

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const carregarPreferencias = async () => {
      try {
        const usuario = await fetchComToken("/auth/me");
        const temaAtivo = Boolean(usuario.temaEscuro);

        setDarkTheme(temaAtivo);
        setNotificacoesEmail(usuario.notificacoesEmail ?? true);
        setIdioma(usuario.idioma || "pt");

        // sincroniza o i18next (troca a UI) — isto já grava em localStorage("idioma")
        i18n.changeLanguage(usuario.idioma || "pt");

        // sincroniza o tema: aplica a classe + persiste, para o script
        // do index.html já encontrar o valor certo no próximo carregamento
        document.documentElement.classList.toggle("dark", temaAtivo);
        localStorage.setItem("temaEscuro", String(temaAtivo));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("configuracoes.erroCarregar"));
      } finally {
        setLoading(false);
      }
    };

    carregarPreferencias();
    // Este efeito deve correr só uma vez, ao montar a página.
    // Não incluir i18n/t nas dependências: a função `t` muda de referência
    // sempre que o idioma muda, o que faria este efeito correr de novo
    // e reverter a escolha do usuário buscando outra vez o valor antigo do backend.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleTema = () => {
    const novoEstado = !darkTheme;
    setDarkTheme(novoEstado);
    document.documentElement.classList.toggle("dark", novoEstado);
    localStorage.setItem("temaEscuro", String(novoEstado));
  };

  const handleChangeIdioma = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novoIdioma = e.target.value;
    setIdioma(novoIdioma);
    i18n.changeLanguage(novoIdioma); // muda a UI imediatamente, sem esperar pelo Save
  };

  const salvarConfiguracoes = async (e: FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    try {
      await fetchComToken("/usuarios/me/preferencias", {
        method: "PATCH",
        body: JSON.stringify({ temaEscuro: darkTheme, notificacoesEmail, idioma }),
      });

      i18n.changeLanguage(idioma);

      toast.success(t("configuracoes.salvoComSucesso"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("configuracoes.erroSalvar"));
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm animate-pulse">
          {t("configuracoes.carregando")}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="bg-[#18357a] text-white p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
            {t("configuracoes.preferencias")}
          </span>
          <h1 className="text-3xl font-bold mt-1">{t("configuracoes.titulo")}</h1>
          <p className="text-sm text-blue-100/90 mt-1">{t("configuracoes.subtitulo")}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 sm:p-8">
        <form onSubmit={salvarConfiguracoes} className="space-y-6">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {t("configuracoes.aparencia")}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {darkTheme ? t("configuracoes.modoEscuro") : t("configuracoes.modoClaro")}
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleTema}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                darkTheme ? "bg-[#1b365d]" : "bg-slate-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  darkTheme ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <hr className="border-slate-100 dark:border-slate-700" />

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {t("configuracoes.notificacoesEmail")}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {t("configuracoes.notificacoesEmailDesc")}
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificacoesEmail}
              onChange={(e) => setNotificacoesEmail(e.target.checked)}
              className="w-4 h-4 text-[#1b365d] border-slate-300 rounded focus:ring-[#1b365d] cursor-pointer"
            />
          </div>

          <hr className="border-slate-100 dark:border-slate-700" />

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {t("configuracoes.idioma")}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {t("configuracoes.idiomaDesc")}
              </p>
            </div>
            <select
              value={idioma}
              onChange={handleChangeIdioma}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#1b365d] cursor-pointer"
            >
              <option value="pt">Português (PT)</option>
              <option value="en">English (EN)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            <button
              type="submit"
              disabled={salvando}
              className="px-5 py-2.5 bg-[#1b365d] hover:bg-[#142847] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
            >
              {salvando ? t("configuracoes.salvando") : t("configuracoes.salvar")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}