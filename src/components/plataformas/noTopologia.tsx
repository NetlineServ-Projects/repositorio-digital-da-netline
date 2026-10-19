import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { ComponenteIcone } from "./botaoAba";
import {
  IconCloud,
  IconPlataforma,
  IconDominio,
  IconRede,
  IconServer,
  IconSistema,
  IconImagem,
} from "../icons";
import {
  LARGURA_NO,
  ALTURA_NO,
  type NoGrafo,
  type TipoNo,
} from "../../utils/construirGrafoTopologia";

const ESTILOS: Record<
  TipoNo,
  { Icone: ComponenteIcone; caixa: string; icone: string }
> = {
  raiz: {
    Icone: IconCloud,
    caixa: "bg-[#18357a] border-[#18357a] text-white",
    icone: "bg-white/15 text-white",
  },
  plataforma: {
    Icone: IconPlataforma,
    caixa: "bg-white border-blue-200 text-slate-800",
    icone: "bg-blue-50 text-blue-900",
  },
  dominio: {
    Icone: IconDominio,
    caixa: "bg-white border-indigo-200 text-slate-800",
    icone: "bg-indigo-50 text-indigo-900",
  },
  subdominio: {
    Icone: IconRede,
    caixa: "bg-white border-slate-200 text-slate-800",
    icone: "bg-slate-100 text-slate-600",
  },
  servidor: {
    Icone: IconServer,
    caixa: "bg-white border-emerald-200 text-slate-800",
    icone: "bg-emerald-50 text-emerald-900",
  },
  sistema: {
    Icone: IconSistema,
    caixa: "bg-white border-amber-200 text-slate-800",
    icone: "bg-amber-50 text-amber-900",
  },
  imagem: {
    Icone: IconImagem,
    caixa: "bg-white border-violet-200 text-slate-800",
    icone: "bg-violet-50 text-violet-900",
  },
};

export default function NoTopologia({
  data,
  targetPosition,
  sourcePosition,
}: NodeProps<NoGrafo>) {
  const estilo = ESTILOS[data.tipo];
  const ehRaiz = data.tipo === "raiz";

  return (
    <>
      <Handle type="target" position={targetPosition ?? Position.Top} style={{ opacity: 0 }} />

      <div
        style={{ width: LARGURA_NO, height: ALTURA_NO }}
        className={`flex items-center gap-3 px-3 rounded-xl border shadow-xs ${estilo.caixa} ${
          data.inativo ? "opacity-60" : ""
        }`}
      >
        <div
          className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${estilo.icone}`}
        >
          <estilo.Icone className="w-4 h-4" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-bold truncate" title={data.titulo}>
            {data.titulo}
          </p>
          {data.subtitulo && (
            <p
              className={`text-[11px] truncate ${
                ehRaiz ? "text-blue-100" : "text-slate-500"
              }`}
              title={data.subtitulo}
            >
              {data.subtitulo}
            </p>
          )}
          {data.detalhe && (
            <p
              className="text-[10px] text-slate-400 truncate"
              title={data.detalhe}
            >
              {data.detalhe}
            </p>
          )}
        </div>
      </div>

      <Handle type="source" position={sourcePosition ?? Position.Bottom} style={{ opacity: 0 }} />
    </>
  );
}
