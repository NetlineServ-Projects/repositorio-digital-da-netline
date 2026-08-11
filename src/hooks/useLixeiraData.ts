import { useState, useEffect, useCallback } from "react";
import { fetchComToken } from "../utils/api";
import { API_ENDPOINTS } from "../data/client/endpoint";
import type { Documento } from "../types/documento";

export function useLixeiraData() {
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const fetchLixeira = useCallback(async () => {
        setLoading(true);
        setErro(null);

        try {
            const docs = await fetchComToken(
                API_ENDPOINTS.DOCUMENTOS_LIXEIRA
            );

            setDocumentos(docs);
        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : "Erro ao carregar a lixeira."
            );
        } finally {
            setLoading(false);
        }
    }, []);

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
                : new Error("Erro ao restaurar o documento.");
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
                : new Error("Erro ao eliminar o documento.");
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
                : new Error("Erro ao esvaziar a lixeira.");
        }
    };

    return {
        documentos,
        loading,
        erro,
        refetch: fetchLixeira,
        restaurar,
        excluirDefinitivo,
        esvaziar,
    };
}