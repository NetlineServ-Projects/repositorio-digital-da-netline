import type { ReactNode } from "react";
import type { SistemaInfraestrutura } from "../../../hooks/useSistemasData";

function Linha({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
      <span className="text-xs font-medium text-slate-500 sm:w-28 shrink-0">{rotulo}</span>
      <span className="text-sm text-slate-800 break-all">{children}</span>
    </div>
  );
}

interface CartaoBackendProps {
  titulo: string;
  infraestrutura: SistemaInfraestrutura | null;
  ehAdmin: boolean;
  onEditar: () => void;
  children?: ReactNode; // as credenciais
}

export default function CartaoBackend({
  titulo,
  infraestrutura,
  ehAdmin,
  onEditar,
  children,
}: CartaoBackendProps) {
  const subdominio = infraestrutura?.subdominio ?? null;
  const mostrarImagem =
    infraestrutura?.plataforma?.tipo === "CONTAINERIZACAO" || Boolean(infraestrutura?.imagem);

  return (
    <section className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-800">{titulo}</h3>
        {ehAdmin && (
          <button
            type="button"
            onClick={onEditar}
            className="text-xs font-semibold text-blue-900 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {infraestrutura ? "Editar infraestrutura" : "Registar infraestrutura"}
          </button>
        )}
      </div>

      {!infraestrutura ? (
        <p className="text-xs text-slate-400 italic">
          Ainda não há infraestrutura registada neste ambiente.
        </p>
      ) : (
        <div className="space-y-2.5">
          <Linha rotulo="Plataforma">{infraestrutura.plataforma?.nome ?? "—"}</Linha>
          <Linha rotulo="Servidor">
            {infraestrutura.servidor
              ? `${infraestrutura.servidor.nome}${
                  infraestrutura.servidor.hostname ? ` (${infraestrutura.servidor.hostname})` : ""
                }`
              : "—"}
          </Linha>
          {mostrarImagem && (
            <Linha rotulo="Imagem">
              {infraestrutura.imagem
                ? `${infraestrutura.imagem.nome}:${infraestrutura.imagem.tag}`
                : "—"}
            </Linha>
          )}
          <Linha rotulo={subdominio ? "Subdomínio" : "Endereço"}>
            {subdominio ? (
              <>
                <span className="font-mono">
                  {subdominio.nomeCompleto ?? subdominio.nome}
                </span>{" "}
                <span className="text-xs text-slate-400">({subdominio.tipoDns})</span>
              </>
            ) : (
              (infraestrutura.url ?? "—")
            )}
          </Linha>
        </div>
      )}

      <div className="border-t border-slate-100 pt-4">{children}</div>
    </section>
  );
}