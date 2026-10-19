import { useMemo, useState } from "react";
import { ReactFlow, Background, Controls, Panel } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import EstadoVazio from "../../../components/plataformas/estadoVazio";
import NoTopologia from "../../../components/plataformas/noTopologia";
import {
  construirGrafoTopologia,
  type DirecaoTopologia,
} from "../../../utils/construirGrafoTopologia";
import type { PlataformaArvore } from "../../../types/plataformaArvore";

// Fora do componente, para o React Flow não recriar os tipos a cada render
const tiposDeNo = { topologia: NoTopologia };

const OPCOES_DIRECAO: { valor: DirecaoTopologia; rotulo: string }[] = [
  { valor: "TB", rotulo: "Vertical" },
  { valor: "LR", rotulo: "Horizontal" },
];

const LEGENDA_NOS = [
  { rotulo: "Plataforma", cor: "bg-blue-900" },
  { rotulo: "Domínio", cor: "bg-indigo-600" },
  { rotulo: "Registo DNS", cor: "bg-slate-500" },
  { rotulo: "Servidor", cor: "bg-emerald-600" },
  { rotulo: "Sistema", cor: "bg-amber-500" },
  { rotulo: "Imagem", cor: "bg-violet-600" },
];

const LEGENDA_LIGACOES = [
  { rotulo: "Estrutura", classe: "border-t-2 border-slate-400" },
  { rotulo: "Aponta para (DNS)", classe: "border-t-2 border-indigo-600" },
  { rotulo: "Hospeda", classe: "border-t-2 border-dashed border-emerald-600" },
];

interface AbaTopologiaProps {
  arvore: PlataformaArvore[];
}

export default function AbaTopologia({ arvore }: AbaTopologiaProps) {
  const [direcao, setDirecao] = useState<DirecaoTopologia>("TB");

  const { nos, ligacoes } = useMemo(
    () => construirGrafoTopologia(arvore, direcao),
    [arvore, direcao],
  );

  if (arvore.length === 0) {
    return <EstadoVazio mensagem="Nenhuma plataforma registada." />;
  }

  return (
    <div className="h-[70vh] bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      {/* key: obriga o fitView a correr outra vez quando a direção muda */}
      <ReactFlow
        key={direcao}
        nodes={nos}
        edges={ligacoes}
        nodeTypes={tiposDeNo}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Background gap={20} />
        <Controls showInteractive={false} />

        <Panel position="top-left">
          <div className="flex gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-xs">
            {OPCOES_DIRECAO.map((opcao) => (
              <button
                key={opcao.valor}
                type="button"
                onClick={() => setDirecao(opcao.valor)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  direcao === opcao.valor
                    ? "bg-[#18357a] text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {opcao.rotulo}
              </button>
            ))}
          </div>
        </Panel>

        <Panel position="top-right">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3 space-y-3 text-[11px] text-slate-600">
            <div className="space-y-1.5">
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Elementos
              </p>
              {LEGENDA_NOS.map((item) => (
                <div key={item.rotulo} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded ${item.cor}`} />
                  {item.rotulo}
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Ligações
              </p>
              {LEGENDA_LIGACOES.map((item) => (
                <div key={item.rotulo} className="flex items-center gap-2">
                  <span className={`w-6 ${item.classe}`} />
                  {item.rotulo}
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}