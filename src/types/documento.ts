export interface Documento {
  id: number;
  titulo: string;
  descricao?: string;
  nomeArquivo: string;
  caminho: string;
  tipoArquivo: string;
  tamanho: string | number;
  estado: "PENDENTE" | "APROVADO" | "REJEITADO";
  motivoRejeicao?: string | null;
  dataSubmissao?: string;
  usuario?: { nome: string };
  categoria?: { id: number; nome: string };
  apagadoEm?: string | null;
  sistemaId?: number;
  // Preenchido quando o documento foi anexado a partir de um sistema
  sistema?: { id: number; nome: string } | null;
}

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  sensivel?:boolean;
}