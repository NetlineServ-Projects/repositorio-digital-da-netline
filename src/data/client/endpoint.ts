export const API_ENDPOINTS = {
  USUARIOS: "/usuarios",
  USUARIO_BY_ID: (id: number | string) => `/usuarios/${id}`,
  USUARIO_FOTOGRAFIA: "/usuarios/me/fotografia",

  PERFIL: "/auth/me",
  ALTERAR_SENHA: "/auth/senha",

  DOCUMENTOS: "/documentos",
  DOCUMENTO_BY_ID: (id: number | string) => `/documentos/${id}`,
  DOCUMENTOS_LIXEIRA: "/documentos?lixeira=true",
  DOCUMENTO_DEFINITIVO: (id: number | string) => `/documentos/${id}?definitivo=true`,

  CATEGORIAS: "/categorias",

  SISTEMAS: "/sistemas",
  SISTEMA_BY_ID: (id: number | string) => `/sistemas/${id}`,

  // Infraestrutura por ambiente (PRODUCAO | TESTES | DESENVOLVIMENTO)
  SISTEMA_INFRAESTRUTURAS: (sistemaId: number | string) =>
    `/sistemas/${sistemaId}/infraestruturas`,
  SISTEMA_INFRAESTRUTURA: (sistemaId: number | string, ambiente: string) =>
    `/sistemas/${sistemaId}/infraestruturas/${ambiente}`,
  SISTEMA_CREDENCIAIS: (sistemaId: number | string, ambiente: string) =>
    `/sistemas/${sistemaId}/infraestruturas/${ambiente}/credenciais`,
  SISTEMA_CREDENCIAL: (
    sistemaId: number | string,
    ambiente: string,
    credencialId: number | string,
  ) =>
    `/sistemas/${sistemaId}/infraestruturas/${ambiente}/credenciais/${credencialId}`,

  ATIVIDADES_RECENTES: "/atividades/recentes",
};