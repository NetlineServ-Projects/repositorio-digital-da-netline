import logoNetline from "../assets/netline.jpg";

const Footer = () => {
  return (
    <footer className="bg-blue-950 text-slate-200 pt-12 pb-6 px-8 rounded-t-2xl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-blue-800/60">
        
        {/* Coluna 1: Logo e Descrição da Netline */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={logoNetline}
              alt="Logotipo Netline"
              className="w-auto h-10 rounded-lg object-contain bg-white p-1"
            />
            <span className="text-xl font-bold tracking-wide text-white uppercase">
              Netline
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            Repositório Digital Interno — Preservando o conhecimento, aplicações e a memória institucional da empresa.
          </p>
        </div>

        {/* Coluna 2: Navegação Rápida */}
        <div>
          <h3 className="text-white font-semibold text-base mb-4 tracking-wider uppercase">
            Navegação
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <a href="#inicio" className="hover:text-amber-400 transition-colors">
                Início
              </a>
            </li>
            <li>
              <a href="#sobrenos" className="hover:text-amber-400 transition-colors">
                Sobre a Plataforma
              </a>
            </li>
            <li>
              <a href="#suporte" className="hover:text-amber-400 transition-colors">
                Suporte Técnico
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-amber-400 transition-colors">
                Acesso ao Sistema
              </a>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Contacto / Informação Institucional */}
        <div>
          <h3 className="text-white font-semibold text-base mb-4 tracking-wider uppercase">
            Suporte Interno
          </h3>
          <p className="text-sm text-slate-300 mb-2">
            Precisa de ajuda ou de registar novos ficheiros?
          </p>
          <p className="text-sm text-amber-400 font-medium">
            suporte@netline.co.mz
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Maputo, Moçambique
          </p>
        </div>

      </div>

      {/* Direitos de Autor e Rodapé Inferior */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>
          © {new Date().getFullYear()} Netline. Todos os direitos reservados.
        </p>
        <p className="text-slate-500">
          Uso Exclusivo Interno
        </p>
      </div>
    </footer>
  );
};

export default Footer;