export type TipoPlataforma = "CLOUD_BASE_DADOS" | "CONTAINERIZACAO" | "GESTAO_DOMINIO";

export interface Plataforma {
  id: number;
  nome: string;
  tipo: TipoPlataforma;
  urlPainel?: string | null;
  ativo: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
  _count?: {
    dominios: number;
    servidores: number;
    infraestruturas: number;
  };
  dominios?: Dominio[];
  servidores?: Servidor[];
}

export interface Servidor {
  id: number;
  nome: string;
  hostname: string;
  ip?: string;
  ipCifrado?: string;
  usernameSsh: string;
  password?: string;
  numeroCpu: number;
  memoriaRam: number;
  memoriaRamUnidade?: "MB" | "GB" | "TB";
  disco: number;
  discoUnidade?: "MB" | "GB" | "TB";
  larguraBanda: number;
  larguraBandaUnidade?: "MBPS" | "GBPS";
  sistemaOperativo: string;
  versaoSo?: string | null;
  cloud?: string | null;
  regiao?: string | null;
  plataformaId: number;
  plataforma?: {
    id: number;
    nome: string;
    tipo: TipoPlataforma;
  };
  infraestruturas?: Array<{
    id: number;
    ambiente: string;
    url?: string | null;
    sistema?: {
      id: number;
      nome: string;
      status: string;
      versaoAtual?: string | null;
      urlProducao?: string | null;
    };
    credenciais?: Array<{
      id: number;
      tipo: string;
      label: string;
      criadoEm?: string;
    }>;
  }>;
}

export interface Dominio {
  id: number;
  nome: string;
  dataExpiracao: string;
  plataformaId: number;
  criadoEm?: string;
  atualizadoEm?: string;
  plataforma?: {
    id: number;
    nome: string;
  };
  subdominios?: Subdominio[];
}

export type TipoDns =
  | "A"
  | "AAAA"
  | "CNAME"
  | "MX"
  | "TXT"
  | "NS"
  | "SRV"
  | "CAA"
  | "PTR"
  | "SOA"
  | "DS"
  | "DNSKEY"
  | "RRSIG"
  | "TLSA"
  | "SSHFP"
  | "OUTRO";

export interface Subdominio {
  id: number;
  dominioId: number;
  nome: string;
  tipoDns: TipoDns;
  servidorId?: number | null;
  destino?: string | null;
  servidor?: Servidor | null;
  dominio?: Dominio;
}

