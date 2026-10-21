import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Outlet, useOutletContext,useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  reautenticar,
  TOKEN_ELEVADO_DURACAO_MS,
} from "../../../hooks/useSistemasData";
import { ErroApi } from "../../../utils/api";
import ReautenticacaoModal from "./reautenticacaoModal";

// Lançado quando a pessoa fecha o pedido da palavra-passe sem a introduzir
export class AcessoCancelado extends Error {
  constructor() {
    super("Acesso cancelado.");
    this.name = "AcessoCancelado";
  }
}

interface AcessoInfraestrutura {
  // true enquanto o acesso elevado está válido (usado para esconder dados quando expira)
  temAcesso: boolean;
  // Executa a ação com o token elevado. Se não houver acesso válido, pede a
  // palavra-passe por cima da página e repete a ação depois de reautenticar.
  comAcesso: <T>(acao: (tokenElevado: string) => Promise<T>) => Promise<T>;
  // Descarta o acesso (o token só existe em memória, nunca no localStorage)
  bloquear: () => void;
}

const Contexto = createContext<AcessoInfraestrutura | null>(null);

// 401 = sem token elevado ou expirado. 403 (perfil sem permissão) não é expiração.
function erroDeAcesso(erro: unknown): boolean {
  const status = erro instanceof ErroApi ? erro.status : null;
  const mensagem = erro instanceof Error ? erro.message.toLowerCase() : "";
  return (
    status === 401 ||
    mensagem.includes("reautenticaç") ||
    mensagem.includes("token elevado")
  );
}

interface PedidoPendente {
  promessa: Promise<string>;
  resolver: (token: string) => void;
  rejeitar: (erro: Error) => void;
}

function AcessoInfraestruturaProvider({ children }: { children: ReactNode }) {
  const [tokenElevado, setTokenElevado] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const expiraEmRef = useRef(0);

  const [modalAberto, setModalAberto] = useState(false);
  const [reautenticando, setReautenticando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const pedidoRef = useRef<PedidoPendente | null>(null);

  const bloquear = useCallback(() => {
    tokenRef.current = null;
    expiraEmRef.current = 0;
    setTokenElevado(null);
  }, []);

  // Abre o pedido da palavra-passe. Vários pedidos ao mesmo tempo partilham o mesmo.
  const pedirAcesso = useCallback((): Promise<string> => {
    if (pedidoRef.current) return pedidoRef.current.promessa;

    let resolver!: (token: string) => void;
    let rejeitar!: (erro: Error) => void;
    const promessa = new Promise<string>((res, rej) => {
      resolver = res;
      rejeitar = rej;
    });

    pedidoRef.current = { promessa, resolver, rejeitar };
    setErro(null);
    setModalAberto(true);
    return promessa;
  }, []);

  const comAcesso = useCallback(
    async <T,>(acao: (tokenElevado: string) => Promise<T>): Promise<T> => {
      const valido =
        tokenRef.current !== null && Date.now() < expiraEmRef.current;

      let token = valido ? (tokenRef.current as string) : await pedirAcesso();

      try {
        return await acao(token);
      } catch (e) {
        if (!erroDeAcesso(e)) throw e;
        // O servidor recusou o token (expirou): pede de novo e repete uma vez
        bloquear();
        token = await pedirAcesso();
        return acao(token);
      }
    },
    [pedirAcesso, bloquear],
  );

  const confirmar = async (senha: string) => {
    setReautenticando(true);
    setErro(null);
    try {
      const resultado = await reautenticar(senha);
      tokenRef.current = resultado.tokenElevado;
      expiraEmRef.current = Date.now() + TOKEN_ELEVADO_DURACAO_MS;
      setTokenElevado(resultado.tokenElevado);
      setModalAberto(false);
      pedidoRef.current?.resolver(resultado.tokenElevado);
      pedidoRef.current = null;
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao reautenticar.");
    } finally {
      setReautenticando(false);
    }
  };

  const cancelar = () => {
    setModalAberto(false);
    pedidoRef.current?.rejeitar(new AcessoCancelado());
    pedidoRef.current = null;
  };

  // Bloqueia sozinho quando os 3 minutos terminam, mesmo sem nenhuma ação
  useEffect(() => {
    if (!tokenElevado) return;
    const timer = setTimeout(
      () => {
        bloquear();
        toast.info(
          "O acesso à infraestrutura expirou. Reautentique-se para continuar.",
        );
      },
      Math.max(expiraEmRef.current - Date.now(), 0),
    );
    return () => clearTimeout(timer);
  }, [tokenElevado, bloquear]);

  const valor = useMemo(
    () => ({ temAcesso: tokenElevado !== null, comAcesso, bloquear }),
    [tokenElevado, comAcesso, bloquear],
  );

  return (
    <Contexto.Provider value={valor}>
      {children}
      <ReautenticacaoModal
        aberto={modalAberto}
        enviando={reautenticando}
        erro={erro}
        onConfirmar={confirmar}
        onCancelar={cancelar}
      />
    </Contexto.Provider>
  );
}

// Rota-pai de /dashboard/sistemas/:id. O acesso mantém-se enquanto se navega entre a
// página do sistema e os formulários dele, e perde-se ao sair ou ao mudar de sistema.
export function AcessoInfraestruturaLayout() {
  const { id } = useParams<{ id: string }>();
  // Reencaminha o contexto do Dashboard (utilizador) para as páginas filhas
  const contextoDoDashboard = useOutletContext();
  return (
    <AcessoInfraestruturaProvider key={id}>
      <Outlet context={contextoDoDashboard} />
    </AcessoInfraestruturaProvider>
  );
}

export function useAcessoInfraestrutura(): AcessoInfraestrutura {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error(
      "useAcessoInfraestrutura tem de ser usado dentro de AcessoInfraestruturaLayout.",
    );
  }
  return contexto;
}

// Versão que devolve null fora do contexto (a página da lista de sistemas não o tem)
export function useAcessoInfraestruturaOpcional(): AcessoInfraestrutura | null {
  return useContext(Contexto);
}