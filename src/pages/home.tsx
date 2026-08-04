import Header from "../components/header";
import Card from "../components/card";
import { CabinetDocsIcon, CameraIcon, FileIcon } from "../components/icons";
import Principal from "../assets/principal.png";
import Fundo1 from "../assets/fundo.jpg";
import Suporte from "../components/suporte";
import Footer from "../components/footer";

const Home = () => {
  const lidarComAdesao = () => {
    alert("Redirecionando para o formulário de adesão!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header onPlanosClick={lidarComAdesao} />

      {/* ================= HERO SECTION ================= */}
      <section
        id="inicio"
        className="relative bg-cover bg-center min-h-screen w-full flex items-center justify-center p-6 md:p-12"
        style={{ backgroundImage: `url(${Fundo1})` }}
      >
        {/* Camada para escurecer o fundo e realçar o texto */}
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]"></div>

        <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-20">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-amber-100 font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight">
              Repositório Digital da <span className="text-amber-400">Netline</span>
            </h2>
            <p className="text-white font-bold text-2xl sm:text-3xl leading-snug">
              Conectando ideias, estruturando o futuro.
            </p>
            <p className="text-lg sm:text-xl text-amber-200/90 font-medium pt-2">
              Bem-vindo ao repositório interno da Netline.
            </p>
          </div>

          <div className="flex justify-center items-center">
            <img
              src={Principal}
              className="w-full max-w-lg h-auto object-cover rounded-2xl shadow-2xl border border-white/10 hover:scale-105 transition-transform duration-300"
              alt="Plataforma Netline"
            />
          </div>
        </div>
      </section>

      {/* ================= SOBRE NÓS ================= */}
      <section id="sobrenós" className="bg-gray-100 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Sobre a Plataforma
          </h1>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-16">
            O Repositório Digital da Netline é um espaço centralizado para
            consulta e preservação do conhecimento institucional.
            A plataforma reúne aplicações desenvolvidas pela empresa,
            documentação técnica e funcional, manuais de utilização,
            marcos históricos e registos de eventos, garantindo que a
            informação permaneça acessível, organizada e disponível para toda
            a equipa.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card
              title="Aplicações e Documentação"
              description="Consulte o catálogo de soluções desenvolvidas pela Netline, bem como os respetivos manuais e informações técnicas."
              className="text-center bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              icon={<FileIcon />}
            />

            <Card
              title="Conhecimento Centralizado"
              description="Reúna num único local aplicações, manuais, procedimentos e documentos essenciais para o funcionamento da organização."
              className="text-center bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              icon={<CabinetDocsIcon />}
            />

            <Card
              title="Memória Institucional"
              description="Preserve a história da empresa através de marcos importantes, eventos corporativos e conquistas alcançadas ao longo dos anos."
              className="text-center bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              icon={<CameraIcon />}
            />
          </div>
        </div>
      </section>

      {/* ================= SUPORTE ================= */}
      <section id="suporte" className="bg-gray-200 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-blue-700 font-semibold text-sm uppercase tracking-wider mb-2">
            Contactos
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Suporte Técnico
          </h2>
          <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Problemas ao submeter manuais ou dúvidas? Entre em contacto com o nosso suporte técnico. Estamos disponíveis para garantir que a tua experiência seja simples e rápida.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Suporte />
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
};

export default Home;