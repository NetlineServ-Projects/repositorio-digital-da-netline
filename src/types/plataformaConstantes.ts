import i18n from "../lang/i18n";
import type { TipoPlataforma, VisibilidadeImagem, OrigemImagem } from "./plataforma";

// Mapa de rótulos cujos valores se leem do i18n no momento do acesso (idioma ativo).
// Mantém a forma Record<chave, texto>: ROTULOS_X[valor] e Object.keys continuam a funcionar.
export function rotulosTraduzidos<K extends string>(prefixo: string, chaves: readonly K[]): Record<K, string> {
  const rotulos = {} as Record<K, string>;
  for (const chave of chaves) {
    Object.defineProperty(rotulos, chave, { get: () => i18n.t(`${prefixo}.${chave}`), enumerable: true });
  }
  return rotulos;
}

// Locale das datas mostradas nesta área, conforme o idioma ativo
export const localeDatas = () => (i18n.language === "en" ? "en-GB" : "pt-PT");

export const ROTULOS_TIPO_PLATAFORMA = rotulosTraduzidos<TipoPlataforma>("plataformas.tipos", [
  "CLOUD_BASE_DADOS",
  "CONTAINERIZACAO",
  "GESTAO_DOMINIO",
]);

export const ROTULOS_VISIBILIDADE_IMAGEM = rotulosTraduzidos<VisibilidadeImagem>("plataformas.visibilidade", [
  "PUBLICA",
  "PRIVADA",
]);

export const ROTULOS_ORIGEM_IMAGEM = rotulosTraduzidos<OrigemImagem>("plataformas.origem", [
  "PROPRIA",
  "TERCEIROS",
]);
