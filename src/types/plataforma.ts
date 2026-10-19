export type TipoPlataforma = "CLOUD_BASE_DADOS" | "CONTAINERIZACAO" | "GESTAO_DOMINIO";

export interface Plataforma {
  id: number;
  nome: string;
  tipo: TipoPlataforma;
  urlPainel?: string | null;
  ativo: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
  totais?: {
    dominios: number;
    servidores: number;
    sistemas: number;
    imagens: number;
  };
  fornecedorContainer: FornecedorContainer | null;
  registryUrl: string | null;
  namespace: string | null;
  registryUtilizador: string | null;
  temTokenRegistry: boolean;
  dominios?: Dominio[];
  servidores?: Servidor[];
  imagens?: ImagemContainer[];
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
  estado: "ATIVO" | "INATIVO"
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

export type FornecedorContainer =
  | "DOCKER_HUB"
  | "GITHUB_CONTAINER_REGISTRY"
  | "AWS_ECR"
  | "GOOGLE_ARTIFACT_REGISTRY"
  | "AZURE_CONTAINER_REGISTRY"
  | "GITLAB_REGISTRY"
  | "KUBERNETES"
  | "DOCKER_SWARM"
  | "PORTAINER"
  | "OUTRO";

export type VisibilidadeImagem = "PUBLICA" | "PRIVADA";
export type OrigemImagem = "PROPRIA" | "TERCEIROS";

export interface ImagemContainer {
  id: number;
  nome: string;
  tag: string;
  portaExposta: number | null;
  digest: string | null;
  ultimoPushEm: string | null;
  visibilidade: VisibilidadeImagem;
  origem: OrigemImagem;
  ativo: boolean;
  plataformaId: number;
  plataforma: { id: number; nome: string; tipo: string };
  criadoEm: string;
  atualizadoEm: string;
}
export interface DadosPlataforma {
  nome: string;
  tipo: TipoPlataforma;
  urlPainel?: string | null;
  ativo?: boolean;
  fornecedorContainer?: FornecedorContainer | null;
  registryUrl?: string | null;
  namespace?: string | null;
  registryUtilizador?: string | null;
  registryToken?: string | null;
}