import type { ReactNode } from "react";

interface CardProps {
  numero: string; // "01", "02"... ordem visual da secção
  title: string;
  description: string;
  icon: ReactNode;
}

// Cartão de funcionalidade da landing: ícone em azul da marca, número discreto e um traço
// dourado que cresce ao passar o rato
const Card = ({ numero, title, description, icon }: CardProps) => {
  return (
    <article className="group relative h-full bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-[#18357a]/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <span className="absolute top-0 left-7 right-7 h-1 rounded-b-full bg-[#e3c234] scale-x-25 group-hover:scale-x-100 origin-left transition-transform duration-500" />
      <div className="flex items-start justify-between">
        <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#18357a] to-[#22628a] text-white flex items-center justify-center shadow-lg shadow-[#18357a]/25 text-2xl">
          {icon}
        </span>
        <span className="font-['Poppins'] text-4xl font-extrabold text-slate-100 group-hover:text-[#e3c234]/30 transition-colors select-none">
          {numero}
        </span>
      </div>
      <h3 className="font-['Poppins'] mt-6 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{description}</p>
    </article>
  );
};

export default Card;
