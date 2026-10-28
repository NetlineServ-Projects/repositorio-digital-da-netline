import type {
  TipoAmbiente,
  TipoCredencial,
  TipoDns,
} from "../../../hooks/useSistemasData";
import i18n from "../../../lang/i18n";

// Classes partilhadas pelos formulários
export const CLASSE_ROTULO = "text-xs font-semibold text-slate-500 uppercase";
export const CLASSE_CAMPO =
  "w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900";

// Os rótulos vêm das traduções (sistemas.ambientes.* e sistemas.credenciais.tipos.*)
export const AMBIENTES: TipoAmbiente[] = ["PRODUCAO", "TESTES"];

export const rotuloAmbiente = (ambiente: TipoAmbiente) =>
  i18n.t(`sistemas.ambientes.${ambiente}`, { defaultValue: ambiente });

export const TIPOS_CREDENCIAL: TipoCredencial[] = [
  "ENV_VARIAVEIS",
  "CREDENCIAIS_BD",
  "CHAVE_TOKEN_API",
  "CHAVE_SSH",
  "CERTIFICADO_SSL",
  "CREDENCIAIS_DNS",
  "ACESSO_CONSOLA_CLOUD",
  "CREDENCIAIS_CICD",
  "CONFIGURACAO_VPN_FIREWALL",
  "CREDENCIAIS_SMTP",
  "BACKUP_ACESSO",
  "OUTRO",
];

export const rotuloTipoCredencial = (tipo: TipoCredencial) =>
  i18n.t(`sistemas.credenciais.tipos.${tipo}`, { defaultValue: tipo });

// ─── Subdomínio ──────────────────────────────────────────────────────────────

// A e AAAA apontam para o IP de um servidor; os restantes tipos usam o campo "destino"
export const TIPOS_DNS_COM_SERVIDOR: TipoDns[] = ["A", "AAAA"];
export const TIPO_DNS_PADRAO: TipoDns = "CNAME";

export const registoUsaServidor = (tipoDns: TipoDns) =>
  TIPOS_DNS_COM_SERVIDOR.includes(tipoDns);

export function montarEndereco(nome: string, dominio?: string): string {
  const prefixo = nome.trim().toLowerCase();
  if (!dominio || !prefixo) return "";
  return prefixo === "@" ? dominio : `${prefixo}.${dominio}`;
}

// ─── Endereços das páginas da infraestrutura de um sistema ───────────────────

export function caminhosInfraestrutura(
  sistemaId: string | number,
  ambiente: TipoAmbiente,
) {
  const base = `/dashboard/sistemas/${sistemaId}`;
  return {
    // A página do sistema, já na aba Infraestrutura e no mesmo ambiente
    sistema: `${base}?aba=infraestrutura&ambiente=${ambiente}`,
    editar: `${base}/infraestrutura/${ambiente}/editar`,
    novaCredencial: `${base}/infraestrutura/${ambiente}/credenciais/nova`,
    editarCredencial: (credencialId: number | string) =>
      `${base}/infraestrutura/${ambiente}/credenciais/${credencialId}/editar`,
  };
}