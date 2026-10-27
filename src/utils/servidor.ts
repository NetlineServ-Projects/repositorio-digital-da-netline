import type { Servidor } from "../types/plataforma";

export const ROTULO_AMBIENTE: Record<"PRODUCAO" | "TESTES", string> = {
  PRODUCAO: "Produção",
  TESTES: "Testes",
};

export const ROTULO_ESTADO_SERVIDOR: Record<Servidor["estado"], string> = {
  ATIVO: "Ativo",
  INATIVO: "Inativo",
};

export const CLASSE_ESTADO_SERVIDOR: Record<Servidor["estado"], string> = {
  ATIVO: "bg-emerald-50 text-emerald-700 border-emerald-200",
  INATIVO: "bg-slate-100 text-slate-500 border-slate-200",
};

export const formatarRam = (s: Servidor) => `${s.memoriaRam} ${s.memoriaRamUnidade ?? "GB"}`;
export const formatarDisco = (s: Servidor) => `${s.disco} ${s.discoUnidade ?? "GB"}`;
// 1000 Mbps (ou múltiplos) mostra-se como Gbps, que é mais curto e é como se costuma ler
export const formatarBanda = (s: Servidor) => {
  if (s.larguraBandaUnidade === "GBPS") return `${s.larguraBanda} Gbps`;
  if (s.larguraBanda >= 1000 && s.larguraBanda % 1000 === 0) return `${s.larguraBanda / 1000} Gbps`;
  return `${s.larguraBanda} Mbps`;
};

export interface SistemaHospedado {
  id: number;
  nome: string;
  status: string;
  ambientes: ("PRODUCAO" | "TESTES")[];
  temBackend: boolean; // a infraestrutura do sistema usa este servidor
  enderecos: string[]; // endereços DNS do sistema que apontam para este servidor
}

// A API devolve um registo por sistema, ambiente e origem; aqui junta-se um por sistema
export function agruparSistemasHospedados(servidor: Servidor): SistemaHospedado[] {
  const porId = new Map<number, SistemaHospedado>();
  for (const { ambiente, sistema, origem, endereco } of servidor.sistemasHospedados ?? []) {
    const atual =
      porId.get(sistema.id) ?? { ...sistema, ambientes: [], temBackend: false, enderecos: [] };
    if (!atual.ambientes.includes(ambiente)) atual.ambientes.push(ambiente);
    if (origem === "BACKEND") atual.temBackend = true;
    if (endereco && !atual.enderecos.includes(endereco)) atual.enderecos.push(endereco);
    porId.set(sistema.id, atual);
  }
  return [...porId.values()].sort((a, b) => a.nome.localeCompare(b.nome));
}

export const caminhoDetalheServidor = (id: number) => `/dashboard/plataformas/servidores/${id}`;
