import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import Header from "./header";
import Card from "./card";
import Suporte from "./suporte";
import Footer from "./footer";
import logoNetline from "../../assets/netline.jpg";
import Principal from "../../assets/principal.png";
import {
  CabinetDocsIcon,
  CameraIcon,
  FileIcon,
  IconDocumento,
  IconSistemas,
  IconPlataforma,
  IconAprovado,
  IconUpload,
  IconPesquisa,
  IconEscudo,
  IconCadeado,
  IconRelogio,
} from "../../components/icons";

type Icone = ComponentType<{ className?: string }>;

// Os textos vêm de home.<grupo>.<chave>.titulo / .texto
const PILARES: { Icone: Icone; chave: string }[] = [
  { Icone: IconDocumento, chave: "centralizado" },
  { Icone: IconCadeado, chave: "seguro" },
  { Icone: IconRelogio, chave: "sempreAMao" },
];

const MODULOS: { Icone: Icone; chave: string }[] = [
  { Icone: IconDocumento, chave: "documentos" },
  { Icone: IconSistemas, chave: "sistemas" },
  { Icone: IconPlataforma, chave: "plataformas" },
  { Icone: IconAprovado, chave: "aprovacoes" },
];

const PASSOS: { Icone: Icone; chave: string }[] = [
  { Icone: IconUpload, chave: "submeter" },
  { Icone: IconEscudo, chave: "rever" },
  { Icone: IconPesquisa, chave: "consultar" },
];

function TituloSecao({ etiqueta, titulo, texto, claro = false }: { etiqueta: string; titulo: string; texto?: string; claro?: boolean }) {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-3">
      <span
        className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] ${claro ? "text-netline-amarelo" : "text-[#22628a]"}`}
      >
        <span className="w-6 h-px bg-current" aria-hidden="true" />
        {etiqueta}
        <span className="w-6 h-px bg-current" aria-hidden="true" />
      </span>
      <h2 className={`font-['Poppins'] text-3xl md:text-4xl font-bold tracking-tight ${claro ? "text-white" : "text-slate-900"}`}>
        {titulo}
      </h2>
      {texto && <p className={`text-base md:text-lg leading-relaxed ${claro ? "text-blue-100/70" : "text-slate-600"}`}>{texto}</p>}
    </div>
  );
}

// Pequeno cartão de vidro que flutua à volta do logótipo no hero
function Etiqueta({ Icone, texto, className }: { Icone: Icone; texto: string; className: string }) {
  return (
    <div
      className={`absolute flex items-center gap-2 px-3 py-2 rounded-xl bg-netline-marinho/85 backdrop-blur-md border border-white/15 shadow-xl text-white text-xs font-semibold ${className}`}
    >
      <span className="w-7 h-7 rounded-lg bg-netline-amarelo text-netline-marinho flex items-center justify-center">
        <Icone className="w-3.5 h-3.5" />
      </span>
      {texto}
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased">
      <Header />

      {/* ================= HERO ================= */}
      <section id="inicio" className="relative overflow-hidden bg-netline-marinho pt-32 pb-20 md:pt-40 md:pb-28 px-6">
        {/* Fundo: grelha subtil e brilhos nas cores do logótipo */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />
        <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-[#22628a]/50 blur-3xl" aria-hidden="true" />
        <div className="absolute top-1/3 -right-32 w-[26rem] h-[26rem] rounded-full bg-netline-amarelo/20 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-netline-marinho" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 items-center">
          <div className="lg:col-span-7 text-center lg:text-left space-y-7">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-semibold text-blue-100 tracking-wide">
              <span className="h-2 w-2 rounded-full bg-netline-amarelo motion-safe:animate-pulse" />
              {t("home.hero.etiqueta")}
            </span>

            <h1 className="font-['Poppins'] text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-white">
              <Trans
                i18nKey="home.hero.titulo"
                components={{
                  destaque: (
                    <span className="bg-gradient-to-r from-[#f3d65a] via-netline-amarelo to-[#c9a51b] bg-clip-text text-transparent" />
                  ),
                }}
              />
            </h1>

            <p className="text-base sm:text-lg text-blue-100/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {t("home.hero.texto")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to="/autenticacao"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-netline-amarelo hover:bg-[#d4b225] text-netline-marinho text-sm font-bold shadow-lg shadow-netline-amarelo/25 transition-all hover:-translate-y-0.5"
              >
                {t("home.hero.entrar")} <span aria-hidden="true">→</span>
              </Link>
              <a
                href="#sobrenos"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-sm font-semibold transition-colors"
              >
                {t("home.hero.conhecer")}
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 max-w-xl mx-auto lg:mx-0">
              {PILARES.map(({ Icone, chave }) => (
                <div key={chave} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 text-left">
                  <span className="w-9 h-9 rounded-xl bg-[#22628a]/60 text-netline-amarelo flex items-center justify-center shrink-0">
                    <Icone className="w-4 h-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-white">{t(`home.pilares.${chave}.titulo`)}</span>
                    <span className="block text-[11px] text-blue-100/60">{t(`home.pilares.${chave}.texto`)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Montra do logótipo: anéis nas cores da marca à volta do símbolo */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              <div className="absolute inset-0 rounded-full bg-netline-amarelo/10 blur-2xl" aria-hidden="true" />
              <div
                className="absolute inset-0 rounded-full border-2 border-dashed border-netline-amarelo/40 motion-safe:animate-[spin_50s_linear_infinite]"
                aria-hidden="true"
              />
              <div className="absolute inset-6 sm:inset-8 rounded-full border border-[#22628a]/70" aria-hidden="true" />
              <div className="absolute inset-12 sm:inset-16 rounded-full bg-[#f7f7f7] shadow-2xl shadow-black/40 ring-8 ring-white/5 flex items-center justify-center overflow-hidden">
                <img src={logoNetline} alt={t("home.hero.logotipo")} className="w-[88%] h-[88%] object-contain" />
              </div>

              <Etiqueta Icone={IconDocumento} texto={t("home.hero.etiquetaDocumentos")} className="top-6 -left-4 sm:left-0 animate-flutuar" />
              <Etiqueta Icone={IconSistemas} texto={t("home.hero.etiquetaSistemas")} className="top-1/2 -right-6 sm:-right-8 animate-flutuar-lento" />
              <Etiqueta Icone={IconPlataforma} texto={t("home.hero.etiquetaPlataformas")} className="bottom-4 left-2 sm:left-6 animate-flutuar-lento" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= A PLATAFORMA ================= */}
      <section id="sobrenos" className="py-20 md:py-28 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-14">
          <TituloSecao
            etiqueta={t("home.plataforma.etiqueta")}
            titulo={t("home.plataforma.titulo")}
            texto={t("home.plataforma.texto")}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              numero="01"
              title={t("home.plataforma.cartoes.aplicacoes.titulo")}
              description={t("home.plataforma.cartoes.aplicacoes.texto")}
              icon={<FileIcon className="w-7 h-7" />}
            />
            <Card
              numero="02"
              title={t("home.plataforma.cartoes.conhecimento.titulo")}
              description={t("home.plataforma.cartoes.conhecimento.texto")}
              icon={<CabinetDocsIcon className="w-7 h-7" />}
            />
            <Card
              numero="03"
              title={t("home.plataforma.cartoes.memoria.titulo")}
              description={t("home.plataforma.cartoes.memoria.texto")}
              icon={<CameraIcon className="w-7 h-7" />}
            />
          </div>
        </div>
      </section>

      {/* ================= MÓDULOS ================= */}
      <section className="py-20 md:py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#22628a]/20 via-transparent to-netline-amarelo/25 blur-2xl" aria-hidden="true" />
            <img
              src={Principal}
              alt={t("home.modulos.ilustracao")}
              className="relative w-full rounded-[2rem] shadow-2xl shadow-netline-azul/20 border border-slate-200/70"
            />
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <div className="space-y-3 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#22628a]">
                <span className="w-6 h-px bg-current" aria-hidden="true" />
                {t("home.modulos.etiqueta")}
              </span>
              <h2 className="font-['Poppins'] text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                {t("home.modulos.titulo")}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MODULOS.map(({ Icone, chave }) => (
                <div
                  key={chave}
                  className="group p-5 rounded-2xl border border-slate-200/80 hover:border-netline-amarelo/60 hover:bg-netline-amarelo/5 transition-colors"
                >
                  <span className="w-10 h-10 rounded-xl bg-netline-azul/5 text-netline-azul group-hover:bg-netline-azul group-hover:text-netline-amarelo flex items-center justify-center transition-colors">
                    <Icone className="w-4 h-4" />
                  </span>
                  <h3 className="mt-4 text-sm font-bold text-slate-900">{t(`home.modulos.${chave}.titulo`)}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{t(`home.modulos.${chave}.texto`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMO FUNCIONA ================= */}
      <section id="como-funciona" className="relative py-20 md:py-28 px-6 bg-netline-marinho overflow-hidden">
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] rounded-full bg-[#22628a]/40 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto space-y-14">
          <TituloSecao
            claro
            etiqueta={t("home.comoFunciona.etiqueta")}
            titulo={t("home.comoFunciona.titulo")}
            texto={t("home.comoFunciona.texto")}
          />
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PASSOS.map(({ Icone, chave }, i) => (
              <li key={chave} className="relative p-7 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="w-12 h-12 rounded-2xl bg-netline-amarelo text-netline-marinho flex items-center justify-center shadow-lg shadow-netline-amarelo/20">
                    <Icone className="w-5 h-5" />
                  </span>
                  <span className="font-['Poppins'] text-sm font-bold text-netline-amarelo">{t("home.comoFunciona.passo", { numero: i + 1 })}</span>
                </div>
                <h3 className="font-['Poppins'] mt-5 text-xl font-bold text-white">{t(`home.comoFunciona.${chave}.titulo`)}</h3>
                <p className="mt-2 text-sm text-blue-100/70 leading-relaxed">{t(`home.comoFunciona.${chave}.texto`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================= SUPORTE ================= */}
      <section id="suporte" className="py-20 md:py-28 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-12">
          <TituloSecao
            etiqueta={t("home.suporte.etiqueta")}
            titulo={t("home.suporte.titulo")}
            texto={t("home.suporte.texto")}
          />
          <Suporte />
        </div>
      </section>

      {/* ================= CHAMADA FINAL ================= */}
      <section className="px-6 pb-20 md:pb-28 bg-slate-50">
        <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-netline-amarelo to-[#f0d354] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full border-[18px] border-white/25" aria-hidden="true" />
          <div className="relative">
            <h2 className="font-['Poppins'] text-2xl sm:text-3xl font-bold text-netline-marinho">{t("home.chamada.titulo")}</h2>
            <p className="mt-1 text-sm sm:text-base text-netline-marinho/75">{t("home.chamada.texto")}</p>
          </div>
          <Link
            to="/autenticacao"
            className="relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-netline-marinho hover:bg-netline-azul text-white text-sm font-bold shadow-xl transition-colors shrink-0"
          >
            {t("home.iniciarSessao")} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
