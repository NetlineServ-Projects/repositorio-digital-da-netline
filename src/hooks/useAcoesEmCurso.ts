import { useCallback, useRef, useState } from "react";

// Impede que a mesma ação corra duas vezes para o mesmo item (duplo clique em "Aprovar",
// "Restaurar"...). O ref bloqueia logo no segundo clique; o estado serve para desativar o botão.
export function useAcoesEmCurso<Id extends string | number = number>() {
  const emCursoRef = useRef(new Set<Id>());
  const [emCurso, setEmCurso] = useState<ReadonlySet<Id>>(new Set());

  const executar = useCallback(async (id: Id, acao: () => Promise<void>) => {
    if (emCursoRef.current.has(id)) return;
    emCursoRef.current.add(id);
    setEmCurso(new Set(emCursoRef.current));
    try {
      await acao();
    } finally {
      emCursoRef.current.delete(id);
      setEmCurso(new Set(emCursoRef.current));
    }
  }, []);

  const estaEmCurso = useCallback((id: Id) => emCurso.has(id), [emCurso]);

  return { executar, estaEmCurso };
}
