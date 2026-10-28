import { useState, useEffect, useCallback } from "react";
import { fetchComToken } from "../utils/api";
import { API_ENDPOINTS } from "../data/client/endpoint";
import type { Documento } from "../types/documento";
import { useCarregamento } from "./useCarregamento";
import i18n from "../lang/i18n";

export function useLixeiraData() {
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const { carregando: loading, aAtualizar, erro, executar } = useCarregamento(i18n.t("comum.erros.carregarLixeira"));

    const fetchLixeira = useCallback(
        () =>
            executar(
                () => fetchComToken(API_ENDPOINTS.DOCUMENTOS_LIXEIRA),
                (docs) => setDocumentos(Array.isArray(docs) ? docs : []),
            ),
        [executar],
    );

    useEffect(() => {
        fetchLixeira();
    }, [fetchLixeira]);

    const restaurar = async (id: number) => {
        try {
            await fetchComToken(API_ENDPOINTS.DOCUMENTO_BY_ID(id), {
                method: "PATCH",
                body: JSON.stringify({
                    apagadoEm: null,
                }),
            });

            await fetchLixeira();
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error(i18n.t("comum.erros.restaurarDocumento"));
        }
    };

    const excluirDefinitivo = async (id: number) => {
        try {
            await fetchComToken(
                API_ENDPOINTS.DOCUMENTO_DEFINITIVO(id),
                {
                    method: "DELETE",
                }
            );

            await fetchLixeira();
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error(i18n.t("comum.erros.eliminarDocumento"));
        }
    };

    const esvaziar = async () => {
        try {
            await Promise.all(
                documentos.map((documento) =>
                    fetchComToken(
                        API_ENDPOINTS.DOCUMENTO_DEFINITIVO(documento.id),
                        {
                            method: "DELETE",
                        }
                    )
                )
            );

            await fetchLixeira();
        } catch (error) {
            throw error instanceof Error
                ? error
                : new Error(i18n.t("comum.erros.esvaziarLixeira"));
        }
    };

    return {
        documentos,
        loading,
        aAtualizar,
        erro,
        refetch: fetchLixeira,
        restaurar,
        excluirDefinitivo,
        esvaziar,
    };
}