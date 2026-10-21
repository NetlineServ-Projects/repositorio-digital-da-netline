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
import { AcessoCancelado, useAcessoInfraestrutura } from "./acessoInfraestrutura";
import { AMBIENTES, caminhosInfraestrutura, rotuloAmbiente } from "./constantes";
import CartaoBackend from "./cartaoBackend";
import ListaCredenciais from "./listarCredenciais";
import LinhaFrontend from "./linhaFrontend";

type EstadoAba = "carregando" | "pronto" | "bloqueado" | "erro";

interface InfraestruturaTabProps {
  sistema: Sistema;
  ehAdmin: boolean;
}

// Aba só de leitura. Escrever (infraestrutura e credenciais) faz-se em páginas próprias.
export default function InfraestruturaTab({ sistema, ehAdmin }: InfraestruturaTabProps) {
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
        erro instanceof Error ? erro.message : "Erro ao carregar a infraestrutura.",
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
    setSearchParams({ aba: "infraestrutura", ambiente: novo }, { replace: true });

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
              erro instanceof Error ? erro.message : "Erro ao apagar a credencial.",
            );
          }
        },
      },
      cancel: { label: "Cancelar", onClick: () => {} },
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div role="group" aria-label="Ambiente" className="flex flex-wrap gap-2">
        {AMBIENTES.map((a) => {
          const ativo = a.valor === ambiente;
          return (
            <button
              key={a.valor}
              type="button"
              onClick={() => mudarAmbiente(a.valor)}
              aria-pressed={ativo}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900/40 ${
                ativo
                  ? "bg-blue-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {a.label}
            </button>
          );
        })}
      </div>

      {estado === "carregando" && (
        <p className="text-slate-500 text-xs animate-pulse">A carregar a infraestrutura...</p>
      )}

      {estado === "bloqueado" && (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
          <p className="text-xs text-slate-600">
            O acesso à infraestrutura está bloqueado. Introduza a palavra-passe para ver os dados.
          </p>
          <button
            type="button"
            onClick={carregar}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
          >
            Introduzir palavra-passe
          </button>
        </div>
      )}

      {estado === "erro" && (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
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

      {estado === "pronto" && (
        <>
          <CartaoBackend
            titulo={`Backend — ${rotuloAmbiente(ambiente)}`}
            infraestrutura={infraestrutura}
            ehAdmin={ehAdmin}
            onEditar={() => navigate(caminhos.editar)}
          >
            {infraestrutura ? (
              <ListaCredenciais
                credenciais={infraestrutura.credenciais}
                ehAdmin={ehAdmin}
                onAdicionar={() => navigate(caminhos.novaCredencial)}
                onEditar={(c) => navigate(caminhos.editarCredencial(c.id))}
                onApagar={handleApagarCredencial}
              />
            ) : (
              <p className="text-xs text-slate-400 italic">
                Registe primeiro a infraestrutura para poder adicionar credenciais.
              </p>
            )}
          </CartaoBackend>

          <LinhaFrontend plataforma={sistema.plataformaFrontend} ehAdmin={ehAdmin} />
        </>
      )}
    </div>
  );
}