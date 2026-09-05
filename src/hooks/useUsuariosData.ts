import { useCallback, useEffect, useState } from "react";
import { fetchComToken } from "../utils/api";
import { API_ENDPOINTS } from "../data/client/endpoint";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  numero: string;
  cargo: string;
  departamento: string; // NOVO
  perfil: "ADMIN" | "FUNCIONARIO";
  fotografia?: string | null;
  dataCriacao?: string;
}

export interface UsuarioFormData {
  nome: string;
  email: string;
  senha: string;
  numero: string;
  cargo: string;
  departamento: string; // NOVO
  perfil: "ADMIN" | "FUNCIONARIO";
}

export function useUsuariosData() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);

  // =========================================================
  // CARREGAR USUÁRIOS
  // =========================================================

  const carregarUsuarios = useCallback(async () => {
    setCarregando(true);

    try {
      const data = await fetchComToken(
        API_ENDPOINTS.USUARIOS,
      );

      setUsuarios(data ?? []);
    } finally {
      setCarregando(false);
    }
  }, []);

  // =========================================================
  // CARREGAMENTO INICIAL
  // =========================================================

  useEffect(() => {
    carregarUsuarios().catch((error) => {
      console.error(
        "Erro ao carregar usuários:",
        error,
      );
    });
  }, [carregarUsuarios]);

  // =========================================================
  // CRIAR / EDITAR USUÁRIO
  // =========================================================

  const salvarUsuario = async (
    dados: Partial<UsuarioFormData>,
    editandoId: number | null,
  ) => {
    const isEdit = editandoId !== null;

    const endpoint = isEdit
      ? API_ENDPOINTS.USUARIO_BY_ID(editandoId)
      : API_ENDPOINTS.USUARIOS;

    // Antes: "PUT" — a rota do backend é PATCH /usuarios/:id (atualização parcial), não PUT.
    const method = isEdit ? "PATCH" : "POST";

    const payload = { ...dados };

    // Durante a edição, senha vazia não deve ser enviada
    if (isEdit && !payload.senha) {
      delete payload.senha;
    }

    const data = await fetchComToken(endpoint, {
      method,
      body: JSON.stringify(payload),
    });

    await carregarUsuarios();

    return data;
  };

  // =========================================================
  // ELIMINAR USUÁRIO
  // =========================================================

  const eliminarUsuario = async (id: number) => {
    await fetchComToken(
      API_ENDPOINTS.USUARIO_BY_ID(id),
      {
        method: "DELETE",
      },
    );

    await carregarUsuarios();
  };

  return {
    usuarios,
    carregando,
    carregarUsuarios,
    salvarUsuario,
    eliminarUsuario,
  };
}