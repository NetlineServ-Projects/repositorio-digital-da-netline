export interface Documento {
  id: number;
  titulo: string;
  descricao?: string;
  nomeArquivo: string;
  caminho: string;
  tipoArquivo: string;
  tamanho: string | number;
  estado: "PENDENTE" | "APROVADO" | "REJEITADO";
  dataSubmissao?: string;
  usuario?: { nome: string };
  categoria?: { id: number; nome: string };
  apagadoEm?: string | null
}

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  sensivel?:boolean;
}