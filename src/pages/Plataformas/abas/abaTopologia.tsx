import { useMemo } from "react";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import EstadoVazio from "../../../components/plataformas/estadoVazio";
import NoTopologia from "../../../components/plataformas/noTopologia";
import { construirGrafoTopologia } from "../../../utils/construirGrafoTopologia";
import type { PlataformaArvore } from "../../../types/plataformaArvore";

// Fora do componente, para o React Flow não recriar os tipos a cada render
const tiposDeNo = { topologia: NoTopologia };

interface AbaTopologiaProps {
  arvore: PlataformaArvore[];
}

export default function AbaTopologia({ arvore }: AbaTopologiaProps) {
  const { nos, ligacoes } = useMemo(
    () => construirGrafoTopologia(arvore),
    [arvore],
  );

  if (arvore.length === 0) {
    return <EstadoVazio mensagem="Nenhuma plataforma registada." />;
  }

  return (
    <div className="h-[70vh] bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <ReactFlow
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
      </ReactFlow>
    </div>
  );
}