import type { TipoAmbiente, TipoCredencial } from "../../../hooks/useSistemasData";

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

// Endereços das páginas da infraestrutura de um sistema, num só sítio
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