import { Link } from "react-router-dom";
import logoNetline from "../../assets/netline.jpg";

const Footer = () => {
  return (
    <footer className="relative bg-[#081633] text-slate-300 pt-16 pb-8 px-6 overflow-hidden">
      {/* Linha nas duas cores do logótipo */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#22628a] via-[#e3c234] to-[#22628a]" aria-hidden="true" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/10">
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-14 h-14 rounded-2xl bg-[#f7f7f7] flex items-center justify-center ring-1 ring-white/10 overflow-hidden">
              <img src={logoNetline} alt="Logótipo Netline" className="w-12 h-12 object-contain" />
            </span>
            <div>
              <p className="font-['Poppins'] text-lg font-bold text-white">Netline Serv, Lda</p>
              <p className="text-xs text-slate-400">Repositório Digital Interno</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            Preservando o conhecimento, as aplicações e a memória institucional da empresa num único lugar.
          </p>
        </div>

        <nav className="md:col-span-3" aria-label="Navegação do rodapé">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Navegação</h3>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#inicio" className="hover:text-[#e3c234] transition-colors">Início</a></li>
            <li><a href="#sobrenos" className="hover:text-[#e3c234] transition-colors">A plataforma</a></li>
            <li><a href="#como-funciona" className="hover:text-[#e3c234] transition-colors">Como funciona</a></li>
            <li><a href="#suporte" className="hover:text-[#e3c234] transition-colors">Suporte técnico</a></li>
            <li><Link to="/autenticacao" className="hover:text-[#e3c234] transition-colors">Acesso ao sistema</Link></li>
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Suporte interno</h3>
          <p className="text-sm text-slate-400">Precisa de ajuda ou de registar novos ficheiros?</p>
          <a href="mailto:suporte@netline.co.mz" className="inline-block mt-2 text-sm font-semibold text-[#e3c234] hover:underline">
            suporte@netline.co.mz
          </a>
          <p className="text-xs text-slate-500 mt-2">Maputo, Moçambique</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Netline Serv, Lda. Todos os direitos reservados.</p>
        <p className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e3c234]" aria-hidden="true" />
          Uso exclusivo interno
        </p>
      </div>
    </footer>
  );
};

export default Footer;
