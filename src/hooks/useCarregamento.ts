import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import i18n from "../lang/i18n";

// Estado de carregamento partilhado pelos hooks de dados:
//   - carregando: só na PRIMEIRA carga (a página mostra o esqueleto/"A carregar...");
//   - aAtualizar: recargas seguintes (depois de gravar, apagar...) correm por trás, sem
//     tirar os dados do ecrã, para a página não piscar;
//   - erro: só quando a primeira carga falha (a página mostra o erro com "Tentar novamente").
//     Se uma recarga falhar, os dados antigos ficam e aparece um aviso.
// "buscar" faz os pedidos; "aplicar" guarda o resultado, e só corre se nenhum pedido mais
// recente o tiver substituído (uma resposta atrasada não apaga dados mais novos).
export function useCarregamento(mensagemErro: string) {
  const [carregando, setCarregando] = useState(true);
  const [aAtualizar, setAAtualizar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const jaCarregouRef = useRef(false);
  const pedidoAtualRef = useRef(0);

  const executar = useCallback(
    async <T,>(buscar: () => Promise<T>, aplicar: (dados: T) => void) => {
      const pedido = ++pedidoAtualRef.current;
      const primeira = !jaCarregouRef.current;
      if (primeira) setCarregando(true);
      else setAAtualizar(true);
      setErro(null);

      try {
        const dados = await buscar();
        if (pedido !== pedidoAtualRef.current) return;
        aplicar(dados);
        jaCarregouRef.current = true;
      } catch (err) {
        if (pedido !== pedidoAtualRef.current) return;
        const mensagem = err instanceof Error && err.message ? err.message : mensagemErro;
        if (primeira) setErro(mensagem);
        else toast.error(i18n.t("comum.erros.atualizar", { mensagem }));
      } finally {
        if (pedido === pedidoAtualRef.current) {
          setCarregando(false);
          setAAtualizar(false);
        }
      }
    },
    [mensagemErro],
  );

  return { carregando, aAtualizar, erro, executar };
}
