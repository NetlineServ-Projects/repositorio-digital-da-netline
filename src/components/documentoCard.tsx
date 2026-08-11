import type { ReactNode } from "react";
import { IconDownload } from "./icons";
import { obterUrlFicheiro, formatarExtensao, obterNomeExibicao, formatarTamanho } from "../utils/documentos";
import { API_URL } from "../utils/api";
import StatusBadge from "./statusBadge";
import type { Documento } from "../types/documento";

export default function DocumentoCard({ doc, acoes }: { doc: Documento; acoes?: ReactNode }) {
  const ext = formatarExtensao(doc.tipoArquivo, doc.nomeArquivo);
  const nomeExibicao = obterNomeExibicao(doc);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <span className="p-2 bg-blue-50 text-[#18357a] rounded-lg text-xs font-extrabold uppercase border border-blue-100/50">{ext}</span>
          <StatusBadge estado={doc.estado} />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm truncate" title={nomeExibicao}>{nomeExibicao}</h4>
          {doc.descricao && <p className="text-xs text-slate-400 line-clamp-2 mt-1" title={doc.descricao}>{doc.descricao}</p>}
        </div>
        <div className="text-xs space-y-1 text-slate-500 pt-1">
          <p>Submetido por: <strong className="text-slate-700">{doc.usuario?.nome || "Sistema"}</strong></p>
          <p>Categoria: <span className="text-slate-600">{doc.categoria?.nome || "Sem Categoria"}</span></p>
          <p>Tamanho: <span className="text-slate-600">{formatarTamanho(doc.tamanho)}</span></p>
        </div>
      </div>
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">{doc.dataSubmissao ? new Date(doc.dataSubmissao).toLocaleDateString("pt-PT") : "N/A"}</span>
        <div className="flex items-center gap-1.5">
          
          <a href={obterUrlFicheiro(doc.caminho, API_URL)} download={doc.nomeArquivo} className="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#18357a] rounded-lg transition-colors border border-blue-100" title="Baixar">
            <IconDownload />
          </a>
          {acoes}
        </div>
      </div>
    </div>
  );
}