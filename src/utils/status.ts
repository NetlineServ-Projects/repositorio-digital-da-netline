const ROTULOS_STATUS: Record<string, string> = {
  EM_DESENVOLVIMENTO: "Em Desenvolvimento",
  EM_PRODUCAO: "Em Produção",
  MANUTENCAO: "Manutenção",
};

export function rotuloStatus(status: string): string {
  if (ROTULOS_STATUS[status]) return ROTULOS_STATUS[status];
  const texto = status.replace(/_/g, " ").toLowerCase();
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}