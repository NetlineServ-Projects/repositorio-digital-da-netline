import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import ModalConfirmacao from "./modalConfirmacaoprops";

export interface OpcoesConfirmacao {
  titulo: string;
  mensagem: ReactNode;
  textoConfirmar?: string;
  textoCarregando?: string;
  perigoso?: boolean;
  // Se existir, corre com a janela aberta (botões desativados e "A processar...") e a janela
  // só fecha quando terminar; um erro fecha a janela e é devolvido a quem chamou
  acao?: () => Promise<void>;
}

type Confirmar = (opcoes: OpcoesConfirmacao) => Promise<boolean>;

const ContextoConfirmacao = createContext<Confirmar | null>(null);

// Uma única janela para toda a aplicação, em vez de window.confirm ou confirmações em toast
export function ProvedorConfirmacao({ children }: { children: ReactNode }) {
  const [pedido, setPedido] = useState<OpcoesConfirmacao | null>(null);
  const resolverRef = useRef<{ resolver: (v: boolean) => void; rejeitar: (e: unknown) => void } | null>(null);

  const confirmar = useCallback<Confirmar>((opcoes) => {
    // Um pedido novo cancela o anterior que ainda estivesse aberto
    resolverRef.current?.resolver(false);
    setPedido(opcoes);
    return new Promise<boolean>((resolver, rejeitar) => {
      resolverRef.current = { resolver, rejeitar };
    });
  }, []);

  const fechar = (resultado: boolean, erro?: unknown) => {
    const atual = resolverRef.current;
    resolverRef.current = null;
    setPedido(null);
    if (erro !== undefined) atual?.rejeitar(erro);
    else atual?.resolver(resultado);
  };

  const aoConfirmar = async () => {
    if (!pedido?.acao) return fechar(true);
    try {
      await pedido.acao();
      fechar(true);
    } catch (erro) {
      fechar(false, erro);
    }
  };

  return (
    <ContextoConfirmacao.Provider value={confirmar}>
      {children}
      <ModalConfirmacao
        aberto={pedido !== null}
        titulo={pedido?.titulo ?? ""}
        mensagem={pedido?.mensagem ?? ""}
        textoConfirmar={pedido?.textoConfirmar}
        textoCarregando={pedido?.textoCarregando}
        perigoso={pedido?.perigoso}
        onConfirmar={aoConfirmar}
        onCancelar={() => fechar(false)}
      />
    </ContextoConfirmacao.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConfirmacao(): Confirmar {
  const confirmar = useContext(ContextoConfirmacao);
  if (!confirmar) throw new Error("useConfirmacao tem de ser usado dentro de <ProvedorConfirmacao>.");
  return confirmar;
}
