import i18n from "../lang/i18n";

// Rótulo traduzido do estado de um sistema (chaves em sistemas.status.*)
export function rotuloStatus(status: string): string {
  const chave = `sistemas.status.${status}`;
  if (i18n.exists(chave)) return i18n.t(chave);
  const texto = status.replace(/_/g, " ").toLowerCase();
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
