import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { ReactFlow, Background, Controls, Panel, useReactFlow } from "@xyflow/react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import "@xyflow/react/dist/style.css";
import EstadoVazio from "../../../components/plataformas/estadoVazio";
import NoTopologia from "../../../components/plataformas/noTopologia";
import {
  construirGrafoTopologia,
  type DirecaoTopologia,
} from "../../../utils/construirGrafoTopologia";
import type { PlataformaArvore } from "../../../types/plataformaArvore";
import { IconDownload } from "../../../components/icons";

// Fora do componente, para o React Flow não recriar os tipos a cada render
const tiposDeNo = { topologia: NoTopologia };

// Os rótulos estão em plataformas.topologia.* (chave indicada em cada item)
const OPCOES_DIRECAO: { valor: DirecaoTopologia; chave: string }[] = [
  { valor: "TB", chave: "vertical" },
  { valor: "LR", chave: "horizontal" },
];

const LEGENDA_NOS = [
  { chave: "plataforma", cor: "bg-blue-900" },
  { chave: "dominio", cor: "bg-indigo-600" },
  { chave: "registoDns", cor: "bg-slate-500" },
  { chave: "servidor", cor: "bg-emerald-600" },
  { chave: "sistema", cor: "bg-amber-500" },
  { chave: "imagem", cor: "bg-violet-600" },
];

const LEGENDA_LIGACOES = [
  { chave: "estrutura", classe: "border-t-2 border-slate-400" },
  { chave: "dns", classe: "border-t-2 border-indigo-600" },
  { chave: "hospeda", classe: "border-t-2 border-dashed border-emerald-600" },
];

// Tem de estar dentro do <ReactFlow> para ler os nós com useReactFlow
function BotaoExportar({ arvore, contentor }: { arvore: PlataformaArvore[]; contentor: RefObject<HTMLDivElement | null> }) {
  const { t } = useTranslation();
  const { getNodes, getNodesBounds } = useReactFlow();
  const [aberto, setAberto] = useState(false);
  const [aExportar, setAExportar] = useState<"pdf" | "excel" | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const aoClicarFora = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, [aberto]);

  const exportar = async (formato: "pdf" | "excel") => {
    setAberto(false);
    setAExportar(formato);
    try {
      const { exportarTopologiaPdf, exportarTopologiaExcel } = await import("../../../utils/exportarTopologia");
      if (formato === "pdf") {
        if (!contentor.current) return;
        await exportarTopologiaPdf(contentor.current, getNodesBounds(getNodes()));
      } else {
        await exportarTopologiaExcel(arvore);
      }
      toast.success(t(formato === "pdf" ? "plataformas.topologia.pdfDescarregado" : "plataformas.topologia.excelDescarregado"));
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : t("plataformas.topologia.erroExportar"));
    } finally {
      setAExportar(null);
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        disabled={aExportar !== null}
        aria-haspopup="menu"
        aria-expanded={aberto}
        className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200 shadow-xs text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 cursor-pointer"
      >
        <IconDownload className="w-3.5 h-3.5" />
        {aExportar ? t("plataformas.topologia.aExportar") : t("plataformas.topologia.exportar")}
      </button>
      {aberto && (
        <div role="menu" className="absolute left-0 mt-1.5 w-48 bg-white rounded-xl border border-slate-200 shadow-lg p-1.5 z-10">
          <button
            type="button"
            role="menuitem"
            onClick={() => exportar("pdf")}
            className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <span className="font-semibold block">PDF</span>
            <span className="text-[11px] text-slate-400">{t("plataformas.topologia.pdfDescricao")}</span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => exportar("excel")}
            className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <span className="font-semibold block">Excel (.xlsx)</span>
            <span className="text-[11px] text-slate-400">{t("plataformas.topologia.excelDescricao")}</span>
          </button>
        </div>
      )}
    </div>
  );
}

interface AbaTopologiaProps {
  arvore: PlataformaArvore[];
}

export default function AbaTopologia({ arvore }: AbaTopologiaProps) {
  const { t, i18n } = useTranslation();
  const [direcao, setDirecao] = useState<DirecaoTopologia>("TB");
  // No telemóvel a legenda tapa o grafo: fica recolhida atrás de um botão
  const [legendaAberta, setLegendaAberta] = useState(false);
  const contentorRef = useRef<HTMLDivElement>(null);

  // Os textos dos nós vêm do i18n: o grafo reconstrói-se também quando o idioma muda
  const { nos, ligacoes } = useMemo(
    () => construirGrafoTopologia(arvore, direcao),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- o idioma não é lido aqui, mas muda os textos
    [arvore, direcao, i18n.language],
  );

  if (arvore.length === 0) {
    return <EstadoVazio mensagem={t("plataformas.topologia.vazio")} />;
  }

  return (
    <div ref={contentorRef} className="h-[65vh] sm:h-[70vh] min-h-96 bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
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

        <Panel position="top-left" className="flex flex-wrap items-start gap-2">
          <div className="flex gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-xs">
            {OPCOES_DIRECAO.map((opcao) => (
              <button
                key={opcao.valor}
                type="button"
                onClick={() => setDirecao(opcao.valor)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  direcao === opcao.valor
                    ? "bg-netline-azul text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {t(`plataformas.topologia.${opcao.chave}`)}
              </button>
            ))}
          </div>
          <BotaoExportar arvore={arvore} contentor={contentorRef} />
        </Panel>

        <Panel position="top-right" className="flex flex-col items-end gap-1.5">
          <button
            type="button"
            onClick={() => setLegendaAberta((a) => !a)}
            aria-expanded={legendaAberta}
            className="sm:hidden px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-xs text-xs font-semibold text-slate-600 cursor-pointer"
          >
            {t("plataformas.topologia.legenda")} {legendaAberta ? "▴" : "▾"}
          </button>
          <div
            className={`${legendaAberta ? "block" : "hidden"} sm:block bg-white rounded-xl border border-slate-200 shadow-xs p-3 space-y-3 text-[11px] text-slate-600`}
          >
            <div className="space-y-1.5">
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                {t("plataformas.topologia.elementos")}
              </p>
              {LEGENDA_NOS.map((item) => (
                <div key={item.chave} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded ${item.cor}`} />
                  {t(`plataformas.topologia.nos.${item.chave}`)}
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                {t("plataformas.topologia.ligacoes")}
              </p>
              {LEGENDA_LIGACOES.map((item) => (
                <div key={item.chave} className="flex items-center gap-2">
                  <span className={`w-6 ${item.classe}`} />
                  {t(`plataformas.topologia.relacoes.${item.chave}`)}
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}