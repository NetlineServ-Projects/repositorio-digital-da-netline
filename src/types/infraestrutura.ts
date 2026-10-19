import type {
  AmbienteResumo,
  SistemaInfraestrutura,
  TipoAmbiente,
  ComponenteSistema,
  TipoCredencial,
  OpcaoHospedagem,
} from "../hooks/useSistemasData";
import type { TipoDns } from "../hooks/useSistemasData";

export interface InfraestruturaApi {
  listarInfraestruturas: (
    sistemaId: string | number,
    tokenElevado: string,
  ) => Promise<AmbienteResumo[]>;
  buscarInfraestrutura: (
    sistemaId: string | number,
    ambiente: TipoAmbiente,
    componente: ComponenteSistema,
    tokenElevado: string,
  ) => Promise<SistemaInfraestrutura | null>;
  salvarInfraestrutura: (
    sistemaId: string | number,
    ambiente: TipoAmbiente,
    componente: ComponenteSistema,
    dados: Record<string, unknown>,
    tokenElevado: string,
  ) => Promise<unknown>;
  adicionarCredencial: (
    sistemaId: string | number,
    ambiente: TipoAmbiente,
    componente: ComponenteSistema,
    dados: { tipo: TipoCredencial; label: string; valor: string },
    tokenElevado: string,
  ) => Promise<unknown>;
  atualizarCredencial: (
    sistemaId: string | number,
    ambiente: TipoAmbiente,
    componente: ComponenteSistema,
    credencialId: number,
    dados: Partial<{ tipo: TipoCredencial; label: string; valor: string }>,
    tokenElevado: string,
  ) => Promise<unknown>;
  apagarCredencial: (
    sistemaId: string | number,
    ambiente: TipoAmbiente,
    componente: ComponenteSistema,
    credencialId: number,
    tokenElevado: string,
  ) => Promise<unknown>;
}

// O ambiente (Produção/Testes) agora vem do pai: este componente já não o escolhe
export interface ComponenteInfraestruturaProps {
  sistemaId: string | number;
  ambiente: TipoAmbiente;
  tokenElevado: string;
  ehAdmin: boolean;
  servidores: OpcaoHospedagem[];
  plataformas: OpcaoHospedagem[];
  dominios: OpcaoHospedagem[];
  api: InfraestruturaApi;
  tratarErro: (erro: unknown, mensagemGenerica: string) => void;
  onAlterado: () => void;
}

export type TipoHospedagem = "servidor" | "plataforma";

// Tudo o que o formulário sabe sobre o subdomínio, num só objeto
export interface EstadoSubdominio {
  ativo: boolean;
  dominioId: string;
  nome: string;
  tipoDns: TipoDns;
  destino: string;
}