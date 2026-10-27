import type {
  Sistema,
  TipoAmbiente,
  TipoDns,
} from "../../../hooks/useSistemasData";
import { TIPO_DNS_PADRAO, registoUsaServidor } from "../infraestrutura/constantes";

// O que o formulário guarda de cada ambiente (Produção ou Testes)
export interface EstadoEndereco {
  temSubdominio: boolean;
  dominioId: string;
  nome: string;
  tipoDns: TipoDns;
  servidorId: string;
  destino: string;
  url: string; // endereço escrito à mão, usado quando não há subdomínio
}

export const ENDERECO_VAZIO: EstadoEndereco = {
  temSubdominio: false,
  dominioId: "",
  nome: "",
  tipoDns: TIPO_DNS_PADRAO,
  servidorId: "",
  destino: "",
  url: "",
};

export function tinhaSubdominio(sistema: Sistema | null | undefined, ambiente: TipoAmbiente) {
  return Boolean(sistema?.subdominios?.some((s) => s.ambiente === ambiente));
}

// Preenche o estado a partir do sistema que está a ser editado
export function estadoInicialEndereco(
  sistema: Sistema | null | undefined,
  ambiente: TipoAmbiente,
): EstadoEndereco {
  const url = (ambiente === "PRODUCAO" ? sistema?.urlProducao : sistema?.urlTestes) ?? "";
  const subdominio = sistema?.subdominios?.find((s) => s.ambiente === ambiente);

  if (!subdominio) return { ...ENDERECO_VAZIO, url };

  return {
    temSubdominio: true,
    dominioId: String(subdominio.dominioId),
    nome: subdominio.nome,
    tipoDns: subdominio.tipoDns,
    servidorId: subdominio.servidorId != null ? String(subdominio.servidorId) : "",
    destino: subdominio.destino ?? "",
    url,
  };
}

// Devolve a mensagem de erro, ou null se estiver tudo preenchido
export function validarEndereco(titulo: string, estado: EstadoEndereco): string | null {
  if (!estado.temSubdominio) return null;

  if (!estado.dominioId) return `${titulo}: escolha o domínio do subdomínio.`;
  if (!estado.nome.trim()) {
    return `${titulo}: indique o nome do subdomínio (ou "@" para a raiz do domínio).`;
  }
  if (registoUsaServidor(estado.tipoDns)) {
    if (!estado.servidorId) return `${titulo}: escolha o servidor do registo.`;
  } else if (!estado.destino.trim()) {
    return `${titulo}: indique o destino do registo.`;
  }
  return null;
}

// omitido (undefined) = não mexer | null = remover | objeto = criar ou atualizar
export function montarSubdominio(estado: EstadoEndereco, existia: boolean) {
  if (!estado.temSubdominio) return existia ? null : undefined;

  const usaServidor = registoUsaServidor(estado.tipoDns);

  return {
    dominioId: Number(estado.dominioId),
    nome: estado.nome.trim().toLowerCase(),
    tipoDns: estado.tipoDns,
    servidorId: usaServidor ? Number(estado.servidorId) : null,
    destino: usaServidor ? null : estado.destino.trim(),
  };
}