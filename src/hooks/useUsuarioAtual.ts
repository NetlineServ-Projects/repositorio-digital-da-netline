import { useCallback, useEffect, useState } from "react";
import { fetchComToken } from "../utils/api";
import { API_ENDPOINTS } from "../data/client/endpoint";
import { aplicarTema } from "../utils/tema";
import { useCarregamento } from "./useCarregamento";
import i18n from "../lang/i18n";
import type { UsuarioData } from "./useDashboardData";

// O layout do painel só precisa de saber quem está ligado (nome, perfil, fotografia).
// Os números do dashboard carregam na própria página inicial, sem atrasar as outras páginas.
export function useUsuarioAtual() {
  const [usuario, setUsuario] = useState<UsuarioData | null>(null);
  const { carregando, erro, executar } = useCarregamento(i18n.t("comum.erros.carregarPerfil"));

  const recarregar = useCallback(
    () =>
      executar(
        () => fetchComToken(API_ENDPOINTS.PERFIL) as Promise<UsuarioData>,
        (perfil) => {
          setUsuario(perfil);
          // A preferência do backend manda (ex: mudada noutro computador)
          aplicarTema(Boolean(perfil?.temaEscuro));
        },
      ),
    [executar],
  );

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { usuario, ehAdmin: usuario?.perfil === "ADMIN", carregando, erro, recarregar };
}
