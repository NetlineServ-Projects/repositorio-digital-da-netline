import React from "react";
import Header from "../components/header";
import Card from "../components/card";
import  { CabinetDocsIcon, CameraIcon, FileIcon, RepositoryIcon } from "../components/icons";
import Principal from "../assets/principal.png";
import Fundo1 from "../assets/fundo.jpg";
import Suporte from "../components/suporte";
import Footer from "../components/footer"

const Home =() => {
  const lidarComAdesao = () => {
    alert("Redirecionando para o formulário de adesão!");
  };

  return (
    <div className="">
      <Header onPlanosClick={lidarComAdesao} />

      <section
        id="inicio"
        className="bg-cover bg-center h-screen w-full  justify-between grid grid-cols-2 p-10 rounded-xl"
        style={{ backgroundImage: `url(${Fundo1})` }}
      >
        <div className="pt-65">
          <h2 className="text-amber-50 font-bold text-6xl ">
            Repositório Digital da <span>Netline</span>
          </h2>
          <p className="text-[#ffffff] font-bold text-4xl">
            Conectando ideias, estruturando o futuro.{" "}
          </p>
          <br></br>
          <p className="text-2xl">
            {" "}
            <span className="text-[#f1d772] font-semibold">
              Bem-vindo ao repositório interno da Netline.{" "}
            </span>
          </p>
        </div>

        <div className="justify-center items-center flex">
          <img
            src={Principal}
            className="w-[90%] h-[82%] box-border object-cover rounded-2xl shadow-2xl  transform hover:scale-105 transition-transform duration-300"
            alt=""
          />
        </div>
      </section>

      <section id="sobrenós">
        <div className="grid grid-cols-1 bg-gray-100 pt-20">
          <div className="justify-center">
            <h1 className="text-2xl md:text-5xl font-bold leading-4 text-center">
              <span>Sobre a Plataforma</span>
            </h1>
            <br></br>
            <p className="text-center text-base font-normal mt-2 max-w-[50%}">
              O Repositório Digital da Netline é um espaço centralizado para
              consulta e preservação do conhecimento institucional. <br />
              A plataforma reúne aplicações desenvolvidas pela empresa,
              documentação técnica e funcional, manuais de utilização, <br />
              marcos históricos e registos de eventos, garantindo que a
              informação permaneça acessível, organizada e disponível para toda
              a equipa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8 px-8 mb-15">

            <Card
             
              title=" Aplicações e Documentação"
              description="Consulte o catálogo de soluções desenvolvidas pela Netline, bem como os respetivos manuais e informações técnicas."
              className="text-center"
              icon={<FileIcon/>}
            />
            

            <Card
              title="Conhecimento Centralizado"
              description="Reúna num único local aplicações, manuais, procedimentos e documentos essenciais para o funcionamento da organização."
              className="text-center"
              icon={<CabinetDocsIcon/>}
            />
            <Card
              title=" Memória Institucional"
              description="Preserve a história da empresa através de marcos importantes, eventos corporativos e conquistas alcançadas ao longo dos anos."
              icon={<CameraIcon/>}
            />
          </div>
        </div>
      </section>

      <section id="suporte" className="bg-gray-200">
        <div className="flex flex-col items-center p-20">
          <h2 className="text-5xl font-bold leading-4 text-center p-8">
            Suporte
          </h2>
          <h1 className="text-2xl font-bold leading-4 text-center">
            Contactos
          </h1>
          <p className="text-center text-xl font-semibold mt-2 max-w-[65%}">
            Problemas ao submeter manuais ou dúvidas? <br />
            Entre em contacto com o nosso suporte técnico. Estamos disponíveis
            para garantir que a tua experiência seja simples e rápida.
          </p>
        </div>
        <div>
          <Suporte/>
        </div>
      </section>
      <Footer/>
    </div>
  );
}

export default Home;
