import type { TipoPlataforma, TipoDns } from "./plataforma";

export interface SistemaArvore {
  id: number;
  nome: string;
  status: string;
  versaoAtual?: string | null;
}

export interface InfraestruturaArvore {
  id: number;
  ambiente: string;
  url?: string | null;
  sistema: SistemaArvore;
}

export interface ServidorArvore {
  id: number;
  nome: string;
  hostname: string;
  ip: string | null;
  numeroCpu: number;
  memoriaRam: number;
  memoriaRamUnidade?: string;
  disco: number;
  discoUnidade?: string;
  infraestruturas?: InfraestruturaArvore[];
}

export interface SubdominioArvore {
  id: number;
  nomeCompleto: string;
  tipoDns: TipoDns;
  destino?: string | null;
  servidor?: ServidorArvore | null;
}

export interface DominioArvore {
  id: number;
  nome: string;
  diasParaExpirar: number | null;
  expirado: boolean;
  subdominios: SubdominioArvore[];
}

export interface ImagemArvore {
  id: number;
  nome: string;
  tag: string;
  visibilidade: string;
  origem: string;
  ativo: boolean;
  // Backends que correm a partir desta imagem (noutra plataforma)
  infraestruturas?: InfraestruturaArvore[];
}

export interface PlataformaArvore {
  id: number;
  nome: string;
  tipo: TipoPlataforma;
  urlPainel?: string | null;
  ativo: boolean;
  dominios?: DominioArvore[];
  servidores?: ServidorArvore[];
  infraestruturas?: InfraestruturaArvore[];
  imagens?: ImagemArvore[];
  // Frontends alojados nesta plataforma (ex: Vercel)
  sistemasFrontend?: SistemaArvore[];
}