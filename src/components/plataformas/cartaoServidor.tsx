import { Link } from "react-router-dom";
import { IconServer } from "../icons";
import type { Servidor } from "../../types/plataforma";
import {
  CLASSE_ESTADO_SERVIDOR,
  ROTULO_ESTADO_SERVIDOR,
  caminhoDetalheServidor,
  formatarDisco,
  formatarRam,
} from "../../utils/servidor";

// Resumo de um servidor; o cartão inteiro leva à página de detalhes
export default function CartaoServidor({ servidor }: { servidor: Servidor }) {
  const totalSistemas = servidor.totais?.sistemas ?? 0;

  return (
    <Link
      to={caminhoDetalheServidor(servidor.id)}
      aria-label={`Ver detalhes do servidor ${servidor.nome}`}
      className="group bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <IconServer className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-800 text-sm truncate group-hover:text-blue-900">
              {servidor.nome}
            </p>
            <p className="text-slate-400 font-mono text-[11px] truncate">{servidor.hostname}</p>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold shrink-0 ${CLASSE_ESTADO_SERVIDOR[servidor.estado]}`}
        >
          {ROTULO_ESTADO_SERVIDOR[servidor.estado]}
        </span>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-center">
        {[
          ["CPU", `${servidor.numeroCpu} vCPU`],
          ["RAM", formatarRam(servidor)],
          ["Disco", formatarDisco(servidor)],
        ].map(([rotulo, valor]) => (
          <div key={rotulo} className="bg-slate-50 rounded-lg py-2">
            <dt className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{rotulo}</dt>
            <dd className="text-xs font-bold text-slate-800 mt-0.5">{valor}</dd>
          </div>
        ))}
      </dl>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 text-[11px]">
        <span className="font-mono text-slate-500 truncate">{servidor.ip || "-"}</span>
        <span className={`font-semibold shrink-0 ${totalSistemas > 0 ? "text-blue-900" : "text-slate-400"}`}>
          {totalSistemas} {totalSistemas === 1 ? "sistema" : "sistemas"}
        </span>
      </div>
    </Link>
  );
}
