export const API_ENDPOINTS = {
  // Usuários
  USUARIOS: "/usuarios",
  USUARIO_BY_ID: (id: number | string) => `/usuarios/${id}`,

  // Documentos
  DOCUMENTOS: "/documentos",
  DOCUMENTO_BY_ID: (id: number | string) => `/documentos/${id}`,
  DOCUMENTOS_LIXEIRA: "/documentos?lixeira=true",
  DOCUMENTO_DEFINITIVO: (id: number | string) =>
    `/documentos/${id}?definitivo=true`,

  // Categorias
  CATEGORIAS: "/categorias",
};