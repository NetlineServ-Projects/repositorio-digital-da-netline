import Header from "../../components/header";
import Card from "../../components/card";
import { CabinetDocsIcon, CameraIcon, FileIcon } from "../../components/icons";
import Principal from "../../assets/principal.png";
import Fundo1 from "../../assets/fundo.jpg";
import Suporte from "../../components/suporte";
import Footer from "../../components/footer";
import { toast } from "sonner";

export default function Home() {
  const lidarComAdesao = () => {
    toast.info("Redirecionando para o formulário de adesão...");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      <Header onPlanosClick={lidarComAdesao} />

      {/* ================= HERO SECTION OTIMIZADO ================= */}
      <section
        id="inicio"
        className="relative w-full flex items-center justify-center bg-cover bg-center px-6 py-16 md:py-24 pt-28 md:pt-36"
        style={{ backgroundImage: `url(${Fundo1})` }}
      >
        {/* Overlay com gradiente suave */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/85 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Lado Esquerdo - Conteúdo Principal */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 text-amber-300 text-xs font-semibold tracking-wider uppercase border border-amber-400/20">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              Repositório Interno
            </span>

            <h1 className="text-amber-50 font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
              Repositório Digital da <span className="text-amber-400">Netline</span>
            </h1>

            <p className="text-white font-medium text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Conectando ideias, estruturando o futuro.
            </p>

            <p className="text-sm sm:text-base text-slate-300 font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Plataforma centralizada para consulta, preservação e gestão do conhecimento institucional, documentações e aplicações corporativas.
            </p>

            {/* Ações / Botões */}
            <div className="pt-2 flex flex-wrap gap-4 justify-center lg:justify-start">
              <a
                href="#sobrenos"
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-sm font-bold shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                Explorar Plataforma
              </a>
              <a
                href="#suporte"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/15 transition-all cursor-pointer backdrop-blur-xs"
              >
                Suporte Técnico
              </a>
            </div>

            {/* Métrica / Atalho rápido */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
              <div>
                <span className="block text-xl font-bold text-amber-400">100%</span>
                <span className="text-xs text-slate-400">Centralizado</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-amber-400">Seguro</span>
                <span className="text-xs text-slate-400">Acesso Interno</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-amber-400">Online</span>
                <span className="text-xs text-slate-400">Disponibilidade</span>
              </div>
            </div>
          </div>

          {/* Lado Direito - Imagem Ilustrativa */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative group w-full max-w-md lg:max-w-none">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 to-blue-600/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-300" />
              <img
                src={Principal}
                className="relative w-full h-auto object-cover rounded-2xl shadow-2xl border border-white/15 transition-transform duration-300 group-hover:scale-[1.01]"
                alt="Plataforma Netline"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ================= SOBRE NÓS ================= */}
      <section id="sobrenos" className="py-20 px-6 bg-slate-100/60">
        <div className="max-w-6xl mx-auto text-center space-y-14">
          <div className="max-w-3xl mx-auto space-y-3">
            <span className="text-blue-700 font-semibold text-xs uppercase tracking-widest block">
              Plataforma Institucional
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Sobre o Repositório
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              O Repositório Digital da Netline é o espaço central para consulta e preservação da informação corporativa. Reúne aplicações desenvolvidas, documentações técnicas, manuais de utilização e registos de eventos, garantindo acessibilidade e organização contínua.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <Card
              title="Aplicações e Documentação"
              description="Consulte o catálogo de soluções desenvolvidas pela Netline, bem como manuais e especificações técnicas."
              className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3"
              icon={<FileIcon />}
            />

            <Card
              title="Conhecimento Centralizado"
              description="Reúna num único local aplicações, procedimentos operacionais e documentos essenciais para a organização."
              className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3"
              icon={<CabinetDocsIcon />}
            />

            <Card
              title="Memória Institucional"
              description="Preserve o histórico da empresa através de marcos importantes, conquistas e eventos corporativos."
              className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3"
              icon={<CameraIcon />}
            />
          </div>
        </div>
      </section>

      {/* ================= SUPORTE ================= */}
      <section id="suporte" className="py-20 px-6 bg-slate-200/50">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-blue-700 font-semibold text-xs uppercase tracking-widest block">
              Canais de Ajuda
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Suporte Técnico
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              Dúvidas sobre o envio de manuais ou utilização do sistema? Entre em contacto com a equipa de suporte para assistência direta.
            </p>
          </div>

          <Suporte />
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}