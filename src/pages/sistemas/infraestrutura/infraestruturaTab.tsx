import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  apagarCredencial,
  buscarInfraestrutura,
  type Credencial,
  type Sistema,
  type SistemaInfraestrutura,
  type TipoAmbiente,
} from "../../../hooks/useSistemasData";
import {
  AcessoCancelado,
  useAcessoInfraestrutura,
} from "./acessoInfraestrutura";
import {
  AMBIENTES,
  caminhosInfraestrutura,
  rotuloAmbiente,
} from "./constantes";
import CartaoBackend from "./cartaoBackend";
import ListaCredenciais from "./listarCredenciais";
import LinhaFrontend from "./linhaFrontend";
import CartaoSubdominio from "./cartaoSubdominio";
import CartaoInfra from "./cartaoInfra";
import { Secao } from "../../../components/secaoDetalhe";
import { IconCadeado, IconServer } from "../../../components/icons";

type EstadoAba = "carregando" | "pronto" | "bloqueado" | "erro";

interface InfraestruturaTabProps {
  sistema: Sistema;
  ehAdmin: boolean;
}

// Aba só de leitura. Escrever (infraestrutura e credenciais) faz-se em páginas próprias.
export default function InfraestruturaTab({
  sistema,
  ehAdmin,
}: InfraestruturaTabProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { comAcesso, temAcesso } = useAcessoInfraestrutura();

  // O ambiente vive no endereço, para se voltar ao mesmo depois de um formulário
  const ambiente: TipoAmbiente =
    searchParams.get("ambiente") === "TESTES" ? "TESTES" : "PRODUCAO";
  const caminhos = caminhosInfraestrutura(sistema.id, ambiente);

  const [estado, setEstado] = useState<EstadoAba>("carregando");
  const [infraestrutura, setInfraestrutura] =
    useState<SistemaInfraestrutura | null>(null);
  const pedidoAtual = useRef(0); // ignora respostas de pedidos que já foram substituídos

  const carregar = useCallback(async () => {
    const pedido = ++pedidoAtual.current;
    setEstado("carregando");
    setInfraestrutura(null); // os valores do ambiente anterior não ficam em memória

    try {
      const dados = await comAcesso((token) =>
        buscarInfraestrutura(sistema.id, ambiente, token),
      );
      if (pedido !== pedidoAtual.current) return;
      setInfraestrutura(dados);
      setEstado("pronto");
    } catch (erro) {
      if (pedido !== pedidoAtual.current) return;
      if (erro instanceof AcessoCancelado) {
        setEstado("bloqueado");
        return;
      }
      toast.error(
        erro instanceof Error
          ? erro.message
          : "Erro ao carregar a infraestrutura.",
      );
      setEstado("erro");
    }
  }, [comAcesso, sistema.id, ambiente]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Quando o acesso expira, os valores desencriptados deixam de ficar no ecrã
  useEffect(() => {
    if (!temAcesso && estado === "pronto") {
      setInfraestrutura(null);
      setEstado("bloqueado");
    }
  }, [temAcesso, estado]);

  const mudarAmbiente = (novo: TipoAmbiente) =>
    setSearchParams(
      { aba: "infraestrutura", ambiente: novo },
      { replace: true },
    );

  const handleApagarCredencial = (credencial: Credencial) => {
    toast(`Apagar a credencial "${credencial.label}"?`, {
      description: "Esta ação não pode ser desfeita.",
      action: {
        label: "Apagar",
        onClick: async () => {
          try {
            await comAcesso((token) =>
              apagarCredencial(sistema.id, ambiente, credencial.id, token),
            );
            toast.success("Credencial apagada.");
            await carregar();
          } catch (erro) {
            if (erro instanceof AcessoCancelado) return;
            toast.error(
              erro instanceof Error
                ? erro.message
                : "Erro ao apagar a credencial.",
            );
          }
        },
      },
      cancel: { label: "Cancelar", onClick: () => {} },
    });
  };

  const subdominio = sistema.subdominios?.find((s) => s.ambiente === ambiente);
  const credenciais = infraestrutura?.credenciais ?? [];

  return (
    <div className="space-y-8">
      {/* ================= AMBIENTE ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Ambiente"
          className="inline-flex p-1 bg-slate-100 rounded-xl self-start"
        >
          {AMBIENTES.map((a) => {
            const ativo = a.valor === ambiente;
            return (
              <button
                key={a.valor}
                type="button"
                onClick={() => mudarAmbiente(a.valor)}
                aria-pressed={ativo}
                className={`px-4 py-2 sm:py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900/40 ${
                  ativo ? "bg-white text-blue-900 shadow-xs" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {a.label}
              </button>
            );
          })}
        </div>
        <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <IconCadeado className="w-3 h-3" />
          Dados protegidos: o acesso pede a palavra-passe e expira passados 3 minutos.
        </p>
      </div>

      {/* ================= ESTRUTURA ================= */}
      <Secao titulo={`Estrutura — ${rotuloAmbiente(ambiente)}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
          <CartaoSubdominio ambiente={ambiente} subdominio={subdominio} ehAdmin={ehAdmin} />

          {estado === "pronto" ? (
            <CartaoBackend
              subtitulo={rotuloAmbiente(ambiente)}
              infraestrutura={infraestrutura}
              ehAdmin={ehAdmin}
              onEditar={() => navigate(caminhos.editar)}
            />
          ) : (
            <CartaoInfra titulo="Backend" subtitulo={rotuloAmbiente(ambiente)} Icone={IconServer}>
              {estado === "carregando" ? (
                <div className="space-y-2.5 animate-pulse" aria-label="A carregar a infraestrutura">
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  {estado === "bloqueado" ? "Protegido. Desbloqueie para ver." : "Não foi possível carregar."}
                </p>
              )}
            </CartaoInfra>
          )}

          <LinhaFrontend plataforma={sistema.plataformaFrontend} ehAdmin={ehAdmin} />
        </div>
      </Secao>

      {/* ================= CREDENCIAIS ================= */}
      <Secao
        titulo={`Credenciais do backend${estado === "pronto" && infraestrutura ? ` (${credenciais.length})` : ""}`}
        acao={
          estado === "pronto" &&
          infraestrutura &&
          ehAdmin && (
            <button
              type="button"
              onClick={() => navigate(caminhos.novaCredencial)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
            >
              + Adicionar credencial
            </button>
          )
        }
      >
        {estado === "carregando" && (
          <div className="h-24 bg-white rounded-2xl border border-slate-200/70 animate-pulse" />
        )}

        {estado === "bloqueado" && (
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs p-8 flex flex-col items-center text-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center">
              <IconCadeado className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">Acesso protegido</p>
              <p className="text-xs text-slate-500 mt-1">
                Introduza a sua palavra-passe para ver o backend e as credenciais deste ambiente.
              </p>
            </div>
            <button
              type="button"
              onClick={carregar}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
            >
              Desbloquear
            </button>
          </div>
        )}

        {estado === "erro" && (
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-600">Não foi possível carregar a infraestrutura.</p>
            <button
              type="button"
              onClick={carregar}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Tentar de novo
            </button>
          </div>
        )}

        {estado === "pronto" &&
          (infraestrutura ? (
            <ListaCredenciais
              credenciais={credenciais}
              ehAdmin={ehAdmin}
              onEditar={(c) => navigate(caminhos.editarCredencial(c.id))}
              onApagar={handleApagarCredencial}
            />
          ) : (
            <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-400 italic">
                Registe primeiro a infraestrutura do backend para poder adicionar credenciais.
              </p>
            </div>
          ))}
      </Secao>
    </div>
  );
}
