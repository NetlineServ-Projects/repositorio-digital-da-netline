import type { ComponentType, ReactNode } from "react";
import SuporteTecnico from "../../assets/suporte tecnio2.jpg";
import { IconTelefone, IconEmail, IconWhatsapp, IconLocalizacao } from "../../components/icons";

function Contacto({
  rotulo,
  Icone,
  href,
  externo = false,
  children,
}: {
  rotulo: string;
  Icone: ComponentType<{ className?: string }>;
  href?: string;
  externo?: boolean;
  children: ReactNode;
}) {
  const conteudo = (
    <>
      <span className="w-11 h-11 rounded-xl bg-[#e3c234]/15 text-[#e3c234] flex items-center justify-center shrink-0 group-hover:bg-[#e3c234] group-hover:text-[#0b1f4d] transition-colors">
        <Icone className="w-4 h-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-blue-200/70">{rotulo}</span>
        <span className="block text-sm sm:text-base font-semibold text-white break-words">{children}</span>
      </span>
    </>
  );
  const classe =
    "group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors";

  return href ? (
    <a href={href} className={classe} {...(externo && { target: "_blank", rel: "noopener noreferrer" })}>
      {conteudo}
    </a>
  ) : (
    <div className={classe}>{conteudo}</div>
  );
}

export default function Suporte() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[#0b1f4d] p-6 sm:p-10 lg:p-12">
      {/* Brilhos nas cores da marca */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#e3c234]/15 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-[#22628a]/40 blur-3xl" aria-hidden="true" />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div>
            <h3 className="font-['Poppins'] text-2xl sm:text-3xl font-bold text-white">Fale com a equipa</h3>
            <p className="mt-2 text-sm text-blue-100/70">Respondemos em dias úteis, durante o horário de expediente.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            <Contacto rotulo="Telefone" Icone={IconTelefone} href="tel:+258844907372">
              +258 84 490 7372
            </Contacto>
            <Contacto rotulo="WhatsApp" Icone={IconWhatsapp} href="https://wa.me/258844907372" externo>
              +258 84 490 7372
            </Contacto>
            <Contacto rotulo="E-mail" Icone={IconEmail} href="mailto:suporte@netline.co.mz">
              suporte@netline.co.mz
            </Contacto>
            <Contacto rotulo="Localização" Icone={IconLocalizacao}>
              Av. Acordos de Lusaka, Malhangalene "B", KaMpfumo
            </Contacto>
          </div>
        </div>

        <div className="relative max-w-md mx-auto w-full">
          <div className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-[#e3c234]/40 to-[#22628a]/40 blur-xl opacity-60" aria-hidden="true" />
          <img
            src={SuporteTecnico}
            alt="Técnico de suporte da Netline ao computador"
            className="relative w-full aspect-[4/5] object-cover rounded-3xl border border-white/15"
          />
          <div className="absolute -bottom-4 left-4 right-4 sm:left-6 sm:right-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-white shadow-xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-slate-700">Suporte técnico interno disponível</span>
          </div>
        </div>
      </div>
    </div>
  );
}
