import type { TipoHospedagem } from "../types/infraestrutura";

// "servidor:3" / "plataforma:2" -> tipo e id
export const tipoDeHospedagem = (valor: string): TipoHospedagem =>
  valor.startsWith("plataforma:") ? "plataforma" : "servidor";

export const idDeHospedagem = (valor: string) => valor.split(":")[1] ?? "";

export function montarEndereco(nome: string, dominio?: string): string {
  const prefixo = nome.trim().toLowerCase();
  if (!dominio || !prefixo) return "";
  return prefixo === "@" ? dominio : `${prefixo}.${dominio}`;
}