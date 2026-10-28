import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoNetline from "../../assets/netline.jpg";

// Rótulos em home.navegacao.<chave>
const LINKS = [
  { href: "#inicio", chave: "inicio" },
  { href: "#sobrenos", chave: "plataforma" },
  { href: "#como-funciona", chave: "comoFunciona" },
  { href: "#suporte", chave: "suporte" },
];

// Barra flutuante: transparente sobre o hero, com fundo de vidro depois de fazer scroll
export default function Header() {
  const { t } = useTranslation();
  const [menuAberto, setMenuAberto] = useState(false);
  const [comScroll, setComScroll] = useState(false);

  useEffect(() => {
    const aoFazerScroll = () => setComScroll(window.scrollY > 24);
    aoFazerScroll();
    window.addEventListener("scroll", aoFazerScroll, { passive: true });
    return () => window.removeEventListener("scroll", aoFazerScroll);
  }, []);

  const solido = comScroll || menuAberto;

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-6 pt-3">
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
          solido
            ? "bg-white/90 backdrop-blur-md shadow-lg shadow-slate-900/5 border border-slate-200/70"
            : "bg-white/5 backdrop-blur-sm border border-white/10"
        }`}
      >
        <div className="flex justify-between items-center h-16 px-4 sm:px-5">
          <a href="#inicio" className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-[#f7f7f7] flex items-center justify-center shrink-0 ring-1 ring-black/5 overflow-hidden">
              <img src={logoNetline} alt={t("home.logotipo")} className="w-9 h-9 object-contain" />
            </span>
            <span className={`font-['Poppins'] text-lg font-bold tracking-tight truncate ${solido ? "text-slate-900" : "text-white"}`}>
              Netline <span className="text-netline-amarelo">Serv</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1" aria-label={t("home.navegacao.seccoes")}>
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  solido ? "text-slate-600 hover:text-netline-azul hover:bg-slate-100" : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {t(`home.navegacao.${l.chave}`)}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              to="/autenticacao"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-netline-amarelo hover:bg-[#d4b225] text-netline-marinho text-sm font-bold shadow-md shadow-netline-amarelo/25 transition-colors"
            >
              {t("home.iniciarSessao")}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <button
            onClick={() => setMenuAberto((a) => !a)}
            type="button"
            className={`md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              solido ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10"
            }`}
            aria-label={menuAberto ? t("home.navegacao.fecharMenu") : t("home.navegacao.abrirMenu")}
            aria-expanded={menuAberto}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {menuAberto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuAberto && (
          <div className="md:hidden border-t border-slate-200/70 px-3 pt-2 pb-4 space-y-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuAberto(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {t(`home.navegacao.${l.chave}`)}
              </a>
            ))}
            <Link
              to="/autenticacao"
              onClick={() => setMenuAberto(false)}
              className="block mt-2 text-center px-4 py-3 rounded-xl bg-netline-amarelo text-netline-marinho text-sm font-bold"
            >
              {t("home.iniciarSessao")}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
