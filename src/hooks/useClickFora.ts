import { useEffect, useRef } from "react";

// Chama `aoClicarFora` quando se clica fora do elemento que recebe o `ref`.
// Quem usa deve passar uma função estável (useCallback).
export function useClickFora<T extends HTMLElement>(aoClicarFora: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        aoClicarFora();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [aoClicarFora]);

  return ref;
}