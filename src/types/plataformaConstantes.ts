import type { TipoPlataforma, VisibilidadeImagem, OrigemImagem } from "./plataforma";

export const ROTULOS_TIPO_PLATAFORMA: Record<TipoPlataforma, string> = {
  CLOUD_BASE_DADOS: "Cloud Base de Dados",
  CONTAINERIZACAO: "Containerização & Nuvem",
  GESTAO_DOMINIO: "Gestão de Domínio",
};

export const ROTULOS_VISIBILIDADE_IMAGEM: Record<VisibilidadeImagem, string> = {
  PUBLICA: "Pública",
  PRIVADA: "Privada",
};

export const ROTULOS_ORIGEM_IMAGEM: Record<OrigemImagem, string> = {
  PROPRIA: "Própria",
  TERCEIROS: "Terceiros",
};