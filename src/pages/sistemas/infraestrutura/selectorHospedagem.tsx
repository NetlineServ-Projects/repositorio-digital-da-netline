import { useCallback, useState } from "react";
import type { OpcaoHospedagem } from "../../../hooks/useSistemasData";
import { CLASSE_CAMPO_BRANCO, CLASSE_LABEL } from "./constantes";
import { useClickFora } from "../../../hooks/useClickFora.ts";

interface Props {
  valor: string; // "servidor:3" | "plataforma:2" | ""
  aoEscolher: (valor: string) => void;
  servidores: OpcaoHospedagem[];
  plataformas: OpcaoHospedagem[];
}

export default function SeletorHospedagem({
  valor,
  aoEscolher,
  servidores,
  plataformas,
}: Props) {
  const [aberto, setAberto] = useState(false);
  const fechar = useCallback(() => setAberto(false), []);
  const ref = useClickFora<HTMLDivElement>(fechar);

  const grupos = [
    { titulo: "Servidores", tipo: "servidor", itens: servidores },
    { titulo: "Plataformas", tipo: "plataforma", itens: plataformas },
  ].filter((g) => g.itens.length > 0);

  const nomeSelecionado = () => {
    if (!valor) return "Selecionar...";
    const [tipo, id] = valor.split(":");
    const lista = tipo === "servidor" ? servidores : plataformas;
    return lista.find((o) => String(o.id) === id)?.nome ?? "Selecionar...";
  };

  const escolher = (novo: string) => {
    aoEscolher(novo);
    setAberto(false);
  };

  const classeOpcao = (v: string) =>
    `w-full text-left px-3 py-2 text-xs rounded-lg cursor-pointer hover:bg-slate-50 ${
      valor === v ? "bg-blue-50 text-blue-900 font-semibold" : "text-slate-700"
    }`;

  return (
    <div>
      <label className={CLASSE_LABEL}>Onde está hospedado</label>
      <div className="relative" ref={ref}>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={aberto}
          onClick={() => setAberto((a) => !a)}
          className={`${CLASSE_CAMPO_BRANCO} flex items-center justify-between text-left cursor-pointer`}
        >
          <span>{nomeSelecionado()}</span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${aberto ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {aberto && (
          <div
            role="listbox"
            className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto p-1 space-y-1"
          >
            <button type="button" onClick={() => escolher("")} className={classeOpcao("")}>
              Selecionar...
            </button>
            {grupos.map((g) => (
              <div key={g.tipo} className="border-t border-slate-100 pt-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">
                  {g.titulo}
                </div>
                {g.itens.map((o) => {
                  const v = `${g.tipo}:${o.id}`;
                  return (
                    <button key={v} type="button" onClick={() => escolher(v)} className={classeOpcao(v)}>
                      {o.nome}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-400 mt-1">
        {grupos.length === 0
          ? "Ainda não há servidores nem plataformas registados."
          : "Se a plataforma tem servidores registados, escolha o servidor. Escolha a plataforma só quando não há servidor (como a Vercel)."}
      </p>
    </div>
  );
}