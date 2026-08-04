import type { Documento } from "../../hooks/useDocumentosData";
import { IconDownload, IconVer, IconCaneta, IconLixeira } from "../icons";
import { obterUrlFicheiro, formatarExtensao, obterNomeExibicao, formatarTamanho } from "../../utils/documentos";
import { API_URL } from "../../utils/api";

interface DocumentoCardProps {
  doc: Documento;
  onAprovar: (id: number) => void;
  onEditar: (doc: Documento) => void;
  onApagar: (id: number) => void;
}

export default function DocumentoCard({ doc, onAprovar, onEditar, onApagar }: DocumentoCardProps) {
  const ext = formatarExtensao(doc.tipoArquivo, doc.nomeArquivo);
  const nomeExibicao = obterNomeExibicao(doc);
  const pendente = doc.estado === "PENDENTE";

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <span className="p-2.5 bg-blue-50 text-[#18357a] rounded-xl text-xs font-extrabold uppercase shrink-0 border border-blue-100/50">{ext}</span>
          {pendente && <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-2 py-0.5 rounded font-semibold">Pendente</span>}
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 text-base line-clamp-1" title={nomeExibicao}>{nomeExibicao}</h3>
          {doc.descricao && <p className="text-xs text-slate-400 line-clamp-2 mt-1" title={doc.descricao}>{doc.descricao}</p>}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Cat: <strong className="text-slate-600">{doc.categoria?.nome || "Sem Categoria"}</strong></span>
          <span>{formatarTamanho(doc.tamanho)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Por: <strong className="text-slate-600">{doc.usuario?.nome || "Sistema"}</strong></span>
          <span>{doc.dataSubmissao ? new Date(doc.dataSubmissao).toLocaleDateString("pt-PT") : "N/A"}</span>
        </div>

        <div className="flex items-center justify-end gap-1.5 pt-2">
          {pendente && (
            <button onClick={() => onAprovar(doc.id)} className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
              Aprovar
            </button>
          )}
          <a href={obterUrlFicheiro(doc.caminho, API_URL)} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-200/60" title="Visualizar">
            <IconVer />
          </a>
          <a href={obterUrlFicheiro(doc.caminho, API_URL)} download={doc.nomeArquivo || doc.titulo} className="p-2 bg-blue-50 hover:bg-blue-100 text-[#18357a] rounded-lg transition-colors border border-blue-100" title="Baixar">
            <IconDownload />
          </a>
          <button onClick={() => onEditar(doc)} className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors border border-amber-200/60" title="Editar">
            <IconCaneta />
          </button>
          <button onClick={() => onApagar(doc.id)} className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors border border-rose-100" title="Apagar">
            <IconLixeira />
          </button>
        </div>
      </div>
    </div>
  );
}