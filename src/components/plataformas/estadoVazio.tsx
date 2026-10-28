import { EstadoVazio as EstadoVazioPartilhado } from "../estados";

interface EstadoVazioProps {
  mensagem: string;
}

// Mantido para os separadores de Plataformas: usa o estado vazio partilhado da aplicação
export default function EstadoVazio({ mensagem }: EstadoVazioProps) {
  return <EstadoVazioPartilhado mensagem={mensagem} />;
}
