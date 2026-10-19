import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type {
  AmbienteResumo,
  ComponenteSistema,
  OpcaoHospedagem,
  TipoAmbiente,
} from "../../../hooks/useSistemasData";
import { ErroApi } from "../../../utils/api";
import ComponenteInfraestrutura, {
  type InfraestruturaApi,
} from "./componenteInfraestrutura";

const AMBIENTES: { valor: TipoAmbiente; label: string }[] = [
  { valor: "PRODUCAO", label: "Produção" },
  { valor: "TESTES", label: "Testes" },
];

const COMPONENTES: { valor: ComponenteSistema; label: string }[] = [
  { valor: "FRONTEND", label: "Frontend" },
  { valor: "BACKEND", label: "Backend" },
];

interface InfraestruturaTabProps {
  sistemaId: string | number;
  tokenElevado: string;
  ehAdmin: boolean;
  onSessaoExpirada: () => void;
  onDadosAlterados?: () => void;
  api: InfraestruturaApi;
  listarServidores: () => Promise<OpcaoHospedagem[]>;
  listarPlataformas: () => Promise<OpcaoHospedagem[]>;
  listarDominios: () => Promise<OpcaoHospedagem[]>;
}

export default function InfraestruturaTab({
  sistemaId,
  tokenElevado,
  ehAdmin,
  onSessaoExpirada,
  api,
  listarServidores,
  listarPlataformas,
  listarDominios,
  onDadosAlterados,
}: InfraestruturaTabProps) {
  const [ambiente, setAmbiente] = useState<TipoAmbiente>("PRODUCAO");
  const [resumo, setResumo] = useState<AmbienteResumo[]>([]);
  const [servidores, setServidores] = useState<OpcaoHospedagem[]>([]);
  const [plataformas, setPlataformas] = useState<OpcaoHospedagem[]>([]);
  const [dominios, setDominios] = useState<OpcaoHospedagem[]>([]);

  const { listarInfraestruturas } = api;

  const tratarErro = useCallback(
    (error: unknown, mensagemGenerica: string) => {
      const status = error instanceof ErroApi ? error.status : null;
      const mensagem =
        error instanceof Error ? error.message.toLowerCase() : "";

      // 401 = sem token elevado ou expirado. 403 (perfil sem permissão)
      // não é sessão expirada: mostra a mensagem do servidor.
      if (
        status === 401 ||
        mensagem.includes("reautenticaç") ||
        mensagem.includes("token elevado")
      ) {
        toast.error("A sua sessão de acesso expirou. Reautentique-se.");
        onSessaoExpirada();
        return;
      }
      toast.error(error instanceof Error ? error.message : mensagemGenerica);
    },
    [onSessaoExpirada],
  );

  const atualizarResumo = useCallback(async () => {
    try {
      setResumo(await listarInfraestruturas(sistemaId, tokenElevado));
    } catch (error) {
      tratarErro(error, "Erro ao carregar o resumo de infraestrutura.");
    }
  }, [sistemaId, tokenElevado, listarInfraestruturas, tratarErro]);

  useEffect(() => {
    atualizarResumo();
  }, [atualizarResumo]);

  // Listas para os seletores de servidor/plataforma (só uma vez por abertura)
  useEffect(() => {
    let cancelado = false;
    Promise.all([listarServidores(), listarPlataformas(), listarDominios()])
      .then(([srv, plt, dom]) => {
        if (cancelado) return;
        setServidores(srv);
        setPlataformas(plt.filter((p) => p.tipo !== "GESTAO_DOMINIO"));
        setDominios(dom);
      })
      .catch((error) => {
        if (!cancelado)
          tratarErro(
            error,
            "Erro ao carregar servidores, plataformas e domínios.",
          );
      });
    return () => {
      cancelado = true;
    };
  }, [listarServidores, listarPlataformas, listarDominios, tratarErro]);
  const totalDoAmbiente = (valor: TipoAmbiente) =>
    resumo
      .filter((r) => r.ambiente === valor)
      .reduce((soma, r) => soma + r.totalCredenciais, 0);

  const labelAmbiente =
    AMBIENTES.find((a) => a.valor === ambiente)?.label ?? ambiente;

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      <div role="group" aria-label="Ambiente" className="flex flex-wrap gap-2">
        {AMBIENTES.map((a) => {
          const ativo = a.valor === ambiente;
          return (
            <button
              key={a.valor}
              type="button"
              onClick={() => setAmbiente(a.valor)}
              aria-pressed={ativo}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900/40 ${
                ativo
                  ? "bg-blue-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {a.label}
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full font-normal ${
                  ativo ? "bg-white/20 text-white" : "bg-white text-slate-500"
                }`}
              >
                {totalDoAmbiente(a.valor)}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-slate-500">
        Em {labelAmbiente}, o frontend e o backend podem estar em servidores ou
        plataformas diferentes.
      </p>

      {COMPONENTES.map((c) => (
        // A key reinicia o cartão ao mudar de ambiente: os valores
        // desencriptados do ambiente anterior não ficam em memória.
        <ComponenteInfraestrutura
          key={`${ambiente}-${c.valor}`}
          titulo={c.label}
          sistemaId={sistemaId}
          ambiente={ambiente}
          componente={c.valor}
          tokenElevado={tokenElevado}
          ehAdmin={ehAdmin}
          servidores={servidores}
          plataformas={plataformas}
          dominios={dominios}
          api={api}
          tratarErro={tratarErro}
          onAlterado={() => {
            atualizarResumo();
            onDadosAlterados?.();
          }}
        />
      ))}
    </div>
  );
}
