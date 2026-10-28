import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoNetline from "../../assets/netline.jpg";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="relative bg-[#081633] text-slate-300 pt-16 pb-8 px-6 overflow-hidden">
      {/* Linha nas duas cores do logótipo */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#22628a] via-netline-amarelo to-[#22628a]" aria-hidden="true" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/10">
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-14 h-14 rounded-2xl bg-[#f7f7f7] flex items-center justify-center ring-1 ring-white/10 overflow-hidden">
              <img src={logoNetline} alt={t("home.logotipo")} className="w-12 h-12 object-contain" />
            </span>
            <div>
              <p className="font-['Poppins'] text-lg font-bold text-white">Netline Serv, Lda</p>
              <p className="text-xs text-slate-400">{t("home.rodape.subtitulo")}</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            {t("home.rodape.texto")}
          </p>
        </div>

        <nav className="md:col-span-3" aria-label={t("home.rodape.navegacaoAria")}>
          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">{t("home.rodape.navegacao")}</h3>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#inicio" className="hover:text-netline-amarelo transition-colors">{t("home.navegacao.inicio")}</a></li>
            <li><a href="#sobrenos" className="hover:text-netline-amarelo transition-colors">{t("home.navegacao.plataforma")}</a></li>
            <li><a href="#como-funciona" className="hover:text-netline-amarelo transition-colors">{t("home.navegacao.comoFunciona")}</a></li>
            <li><a href="#suporte" className="hover:text-netline-amarelo transition-colors">{t("home.suporte.titulo")}</a></li>
            <li><Link to="/autenticacao" className="hover:text-netline-amarelo transition-colors">{t("home.rodape.acesso")}</Link></li>
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">{t("home.rodape.suporteInterno")}</h3>
          <p className="text-sm text-slate-400">{t("home.rodape.precisaAjuda")}</p>
          <a href="mailto:suporte@netline.co.mz" className="inline-block mt-2 text-sm font-semibold text-netline-amarelo hover:underline">
            suporte@netline.co.mz
          </a>
          <p className="text-xs text-slate-500 mt-2">{t("home.rodape.local")}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>{t("home.rodape.direitos", { ano: new Date().getFullYear() })}</p>
        <p className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-netline-amarelo" aria-hidden="true" />
          {t("home.rodape.usoInterno")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
