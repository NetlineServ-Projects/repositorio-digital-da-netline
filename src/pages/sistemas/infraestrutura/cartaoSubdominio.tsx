import type { SubdominioDoSistema, TipoAmbiente } from "../../../hooks/useSistemasData";
import { IconDominio } from "../../../components/icons";
import CartaoInfra, { LinhaInfra } from "./cartaoInfra";
import { rotuloAmbiente } from "./constantes";

interface CartaoSubdominioProps {
  ambiente: TipoAmbiente;
  subdominio?: SubdominioDoSistema;
  ehAdmin: boolean;
}

// O subdomínio é do sistema (regista-se no formulário do sistema): aqui só se mostra
export default function CartaoSubdominio({ ambiente, subdominio, ehAdmin }: CartaoSubdominioProps) {
  return (
    <CartaoInfra
      titulo="Endereço público"
      subtitulo={`DNS · ${rotuloAmbiente(ambiente)}`}
      Icone={IconDominio}
      classeIcone="bg-emerald-50 text-emerald-700"
    >
      {subdominio ? (
        <div className="space-y-4">
          <a
            href={`https://${subdominio.nomeCompleto}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-mono text-sm font-semibold text-blue-900 hover:underline break-all"
          >
            {subdominio.nomeCompleto}
          </a>
          <dl className="divide-y divide-slate-100 border-t border-slate-100 pt-2">
            <LinhaInfra rotulo="Domínio">{subdominio.dominio.nome}</LinhaInfra>
            <LinhaInfra rotulo="Registo">{subdominio.tipoDns}</LinhaInfra>
            {subdominio.destino && (
              <LinhaInfra rotulo="Destino">
                <span className="font-mono text-xs">{subdominio.destino}</span>
              </LinhaInfra>
            )}
          </dl>
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">
          Este ambiente ainda não tem subdomínio.
          {ehAdmin ? " Defina-o ao editar o sistema." : ""}
        </p>
      )}
    </CartaoInfra>
  );
}
