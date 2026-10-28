import i18n from "../lang/i18n";

export type GrupoTipo = "PDF" | "WORD" | "IMAGEM" | "OUTRO";

export function classificarTipo(tipoArquivo: string): GrupoTipo {
  const valor = tipoArquivo.toLowerCase();

  if (valor.includes("pdf")) return "PDF";
  if (valor.includes("word") || valor.includes("doc")) return "WORD";
  if (valor.includes("image") || /\.(png|jpe?g|webp|gif)$/.test(valor)) return "IMAGEM";

  return "OUTRO";
}

// "label" é um getter para seguir o idioma atual sempre que é lido
const opcaoTipo = (valor: GrupoTipo | "TODOS", chave: string) => ({
  valor,
  get label() {
    return i18n.t(`comum.tiposFicheiro.${chave}`);
  },
});

export const OPCOES_TIPO: { valor: GrupoTipo | "TODOS"; label: string }[] = [
  opcaoTipo("TODOS", "todos"),
  opcaoTipo("WORD", "word"),
  opcaoTipo("PDF", "pdf"),
  opcaoTipo("IMAGEM", "imagem"),
  opcaoTipo("OUTRO", "outro"),
];