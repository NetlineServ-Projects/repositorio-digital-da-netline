import { Link } from "react-router-dom";
import type { SistemaDaPlataforma } from "../../types/plataforma";
import { IconSistemas, IconSetaDireita } from "../icons";
import { rotuloStatus } from "../../utils/status";
import { ROTULO_AMBIENTE } from "../../utils/servidor";

const CLASSE_CAMADA = "px-2 py-0.5 rounded-md text-[11px] font-semibold border max-w-full break-words";

// Um sistema que usa a plataforma, com o que lá está: o frontend e/ou o backend (por ambiente)
export default function CartaoSistemaHospedado({ sistema }: { sistema: SistemaDaPlataforma }) {
  return (
    <Link
      to={`/dashboard/sistemas/${sistema.id}`}
      className="group bg-white rounded-2xl border border-slate-200/70 border-l-4 border-l-blue-900 shadow-xs p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
          <IconSistemas className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-900">{sistema.nome}</p>
          <p className="text-[11px] text-slate-400">{rotuloStatus(sistema.status)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {sistema.frontend && (
          <span className={`${CLASSE_CAMADA} bg-[#d99b26]/10 text-[#8a5f0e] border-[#d99b26]/25`}>Frontend</span>
        )}
        {sistema.backend.map((b, i) => (
          <span
            key={`${b.ambiente}-${i}`}
            className={`${CLASSE_CAMADA} bg-blue-50 text-blue-900 border-blue-100`}
            title={b.viaImagem ? `Usa a imagem ${b.imagem}` : b.servidor ? `No servidor ${b.servidor}` : undefined}
          >
            {/* Num registo, o sistema usa uma imagem guardada aqui (mas corre noutra plataforma) */}
            {b.viaImagem ? "Imagem" : "Backend"} · {ROTULO_AMBIENTE[b.ambiente]}
            {(b.viaImagem ? b.imagem : b.servidor) && (
              <span className="font-normal text-blue-900/70"> · {b.viaImagem ? b.imagem : b.servidor}</span>
            )}
          </span>
        ))}
      </div>

      <span className="mt-auto text-[11px] font-semibold text-blue-900 flex items-center gap-1">
        Ver sistema <IconSetaDireita className="w-3 h-3" />
      </span>
    </Link>
  );
}
