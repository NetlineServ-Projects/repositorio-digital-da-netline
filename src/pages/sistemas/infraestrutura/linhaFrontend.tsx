import { Link } from "react-router-dom";
import type { PlataformaResumo } from "../../../hooks/useSistemasData";
import { IconPlataforma } from "../../../components/icons";
import LogotipoPlataforma from "../../../components/plataformas/logotipoPlataforma";
import CartaoInfra from "./cartaoInfra";

interface LinhaFrontendProps {
  plataforma?: PlataformaResumo | null;
  ehAdmin: boolean;
}

// A plataforma do frontend é a mesma nos dois ambientes (define-se no formulário do sistema)
export default function LinhaFrontend({ plataforma, ehAdmin }: LinhaFrontendProps) {
  return (
    <CartaoInfra
      titulo="Frontend"
      subtitulo="Todos os ambientes"
      Icone={IconPlataforma}
      classeIcone="bg-[#d99b26]/10 text-[#b07a14]"
    >
      {plataforma ? (
        <Link
          to={`/dashboard/plataformas?plataforma=${plataforma.id}`}
          className="flex items-center gap-3 p-3 -m-1 rounded-xl hover:bg-slate-50 transition-colors group"
        >
          <LogotipoPlataforma nome={plataforma.nome} logotipo={plataforma.logotipo ?? null} />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-slate-800 truncate group-hover:text-blue-900">
              {plataforma.nome}
            </span>
            <span className="block text-[11px] text-slate-400">Ver plataforma →</span>
          </span>
        </Link>
      ) : (
        <p className="text-xs text-slate-400 italic">
          O frontend ainda não tem plataforma.
          {ehAdmin ? " Defina-a ao editar o sistema." : ""}
        </p>
      )}
    </CartaoInfra>
  );
}
