import { Link } from "react-router-dom";
import type { SistemaInfraestrutura } from "../../../hooks/useSistemasData";
import { IconServer } from "../../../components/icons";
import { caminhoDetalheServidor } from "../../../utils/servidor";
import CartaoInfra, { BotaoAcaoInfra, LinhaInfra } from "./cartaoInfra";

interface CartaoBackendProps {
  subtitulo: string;
  infraestrutura: SistemaInfraestrutura | null;
  ehAdmin: boolean;
  onEditar: () => void;
}

const CLASSE_LINK = "text-blue-900 hover:underline";

export default function CartaoBackend({ subtitulo, infraestrutura, ehAdmin, onEditar }: CartaoBackendProps) {
  // Registos antigos: o backend estava "na" plataforma de um registo de imagens, que não executa nada
  const plataformaInvalida = Boolean(infraestrutura?.plataforma && infraestrutura.plataforma.tipo !== "CLOUD_BASE_DADOS");

  return (
    <CartaoInfra
      titulo="Backend"
      subtitulo={subtitulo}
      Icone={IconServer}
      acao={
        ehAdmin && (
          <BotaoAcaoInfra onClick={onEditar}>{infraestrutura ? "Editar" : "Registar"}</BotaoAcaoInfra>
        )
      }
    >
      {!infraestrutura ? (
        <p className="text-xs text-slate-400 italic">Ainda não há infraestrutura registada neste ambiente.</p>
      ) : (
        <>
        {plataformaInvalida && (
          <p className="mb-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
            {infraestrutura.plataforma?.nome} guarda imagens mas não executa sistemas.
            {ehAdmin ? " Edite e indique a plataforma Cloud onde o backend corre." : ""}
          </p>
        )}
        <dl className="divide-y divide-slate-100">
          <LinhaInfra rotulo="Corre em">
            {infraestrutura.plataforma ? (
              <Link to={`/dashboard/plataformas?plataforma=${infraestrutura.plataforma.id}`} className={CLASSE_LINK}>
                {infraestrutura.plataforma.nome}
              </Link>
            ) : (
              "—"
            )}
          </LinhaInfra>
          <LinhaInfra rotulo="Servidor">
            {infraestrutura.servidor ? (
              <Link to={caminhoDetalheServidor(infraestrutura.servidor.id)} className={CLASSE_LINK}>
                {infraestrutura.servidor.nome}
              </Link>
            ) : (
              "—"
            )}
          </LinhaInfra>
          {infraestrutura.servidor?.hostname && (
            <LinhaInfra rotulo="Hostname">
              <span className="font-mono text-xs">{infraestrutura.servidor.hostname}</span>
            </LinhaInfra>
          )}
          <LinhaInfra rotulo="Imagem">
            {infraestrutura.imagem ? (
              <>
                <span className="font-mono text-xs">
                  {infraestrutura.imagem.nome}:{infraestrutura.imagem.tag}
                </span>
                {infraestrutura.imagem.plataforma && (
                  <span className="block text-[11px] font-normal text-slate-400">
                    do registo{" "}
                    <Link
                      to={`/dashboard/plataformas?plataforma=${infraestrutura.imagem.plataforma.id}`}
                      className={CLASSE_LINK}
                    >
                      {infraestrutura.imagem.plataforma.nome}
                    </Link>
                  </span>
                )}
              </>
            ) : (
              "—"
            )}
          </LinhaInfra>
          <LinhaInfra rotulo="Endereço">
            {infraestrutura.url ? <span className="font-mono text-xs">{infraestrutura.url}</span> : "—"}
          </LinhaInfra>
        </dl>
        </>
      )}
    </CartaoInfra>
  );
}
