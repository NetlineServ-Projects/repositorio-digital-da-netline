import type {
  TipoAmbiente,
  TipoCredencial,
  TipoDns,
} from "../../../hooks/useSistemasData";

// Classes partilhadas pelos formulários
export const CLASSE_ROTULO = "text-xs font-semibold text-slate-500 uppercase";
export const CLASSE_CAMPO =
  "w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900";

export const AMBIENTES: { valor: TipoAmbiente; label: string }[] = [
  { valor: "PRODUCAO", label: "Produção" },
  { valor: "TESTES", label: "Testes" },
];

export const rotuloAmbiente = (ambiente: TipoAmbiente) =>
  AMBIENTES.find((a) => a.valor === ambiente)?.label ?? ambiente;

export const TIPOS_CREDENCIAL: { valor: TipoCredencial; label: string }[] = [
  { valor: "ENV_VARIAVEIS", label: "Variáveis de Ambiente (.env)" },
  { valor: "CREDENCIAIS_BD", label: "Credenciais de Base de Dados" },
  { valor: "CHAVE_TOKEN_API", label: "Chave/Token de API" },
  { valor: "CHAVE_SSH", label: "Chave SSH" },
  { valor: "CERTIFICADO_SSL", label: "Certificado SSL/TLS" },
  { valor: "CREDENCIAIS_DNS", label: "Credenciais de DNS/Domínio" },
  { valor: "ACESSO_CONSOLA_CLOUD", label: "Acesso à Consola Cloud (root/IAM)" },
  { valor: "CREDENCIAIS_CICD", label: "Credenciais CI/CD" },
  { valor: "CONFIGURACAO_VPN_FIREWALL", label: "Configuração VPN/Firewall" },
  { valor: "CREDENCIAIS_SMTP", label: "Credenciais SMTP/E-mail" },
  { valor: "BACKUP_ACESSO", label: "Backup — localização e acesso" },
  { valor: "OUTRO", label: "Outro" },
];

export const rotuloTipoCredencial = (tipo: TipoCredencial) =>
  TIPOS_CREDENCIAL.find((t) => t.valor === tipo)?.label ?? tipo;

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