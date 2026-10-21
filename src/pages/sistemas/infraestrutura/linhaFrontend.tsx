import { Link } from "react-router-dom";
import type { PlataformaResumo } from "../../../hooks/useSistemasData";

interface LinhaFrontendProps {
  plataforma?: PlataformaResumo | null;
  ehAdmin: boolean;
}

export default function LinhaFrontend({ plataforma, ehAdmin }: LinhaFrontendProps) {
  return (
    <p className="text-xs text-slate-600 px-1">
      {plataforma ? (
        <>
          O frontend deste sistema está hospedado em <strong>{plataforma.nome}</strong>.{" "}
          <Link
            to={`/dashboard/plataformas?plataforma=${plataforma.id}`}
            className="font-semibold text-blue-900 hover:underline"
          >
            VER PLATAFORMA
          </Link>
        </>
      ) : ehAdmin ? (
        "O frontend deste sistema ainda não tem plataforma. Defina-a ao editar o sistema."
      ) : (
        "O frontend deste sistema ainda não tem plataforma definida."
      )}
    </p>
  );
}