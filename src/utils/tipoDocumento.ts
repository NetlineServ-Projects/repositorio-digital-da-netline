export type GrupoTipo = "PDF" | "WORD" | "IMAGEM" | "OUTRO";

export function classificarTipo(tipoArquivo: string): GrupoTipo {
  const valor = tipoArquivo.toLowerCase();

  if (valor.includes("pdf")) return "PDF";
  if (valor.includes("word") || valor.includes("doc")) return "WORD";
  if (valor.includes("image") || /\.(png|jpe?g|webp|gif)$/.test(valor)) return "IMAGEM";

  return "OUTRO";
}

export const OPCOES_TIPO: { valor: GrupoTipo | "TODOS"; label: string }[] = [
  { valor: "TODOS", label: "Todos os Tipos" },
  { valor: "WORD", label: "Word" },
  { valor: "PDF", label: "PDF" },
  { valor: "IMAGEM", label: "Imagem" },
  { valor: "OUTRO", label: "Outro" },
];