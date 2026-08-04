import type { Documento } from "../../hooks/useDocumentosData";
import { IconDownload, IconVer, IconCaneta, IconLixeira } from "../icons";
import { obterUrlFicheiro, formatarExtensao, obterNomeExibicao, formatarTamanho } from "../../utils/documentos";
import { API_URL } from "../../utils/api";

interface DocumentoLinhaProps {
  doc: Documento;
  onAprovar: (id: number) => void;
  onEditar: (doc: Documento) => void;
  onApagar: (id: number) => void;
}

export default function DocumentoLinha({ doc, onAprovar, onEditar, onApagar }: DocumentoLinhaProps) {
  const ext = formatarExtensao(doc.tipoArquivo, doc.nomeArquivo);
  const nomeExibicao = obterNomeExibicao(doc);
  const pendente = doc.estado === "PENDENTE";

  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      <td className="py-3.5 px-4 text-slate-800 flex items-center gap-3">
        <span className="p-2 bg-blue-50 text-[#18357a] rounded-lg text-[11px] font-extrabold uppercase min-w-10.5 text-center shrink-0 border border-blue-100/50">
          {ext}
        </span>
        <div className="flex flex-col truncate max-w-xs md:max-w-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 text-sm truncate" title={nomeExibicao}>{nomeExibicao}</span>
            {pendente && <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-1.5 py-0.5 rounded font-semibold">Pendente</span>}
          </div>
          {doc.descricao && <span className="text-xs text-slate-400 font-normal truncate" title={doc.descricao}>{doc.descricao}</span>}
        </div>
      </td>
      <td className="py-3.5 px-4">{doc.categoria?.nome || "Sem Categoria"}</td>
      <td className="py-3.5 px-4">{doc.usuario?.nome || "Sistema"}</td>
      <td className="py-3.5 px-4 text-xs">
        {doc.dataSubmissao ? new Date(doc.dataSubmissao).toLocaleDateString("pt-PT") : "N/A"}
      </td>
      <td className="py-3.5 px-4 text-xs text-slate-400">{formatarTamanho(doc.tamanho)}</td>
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {pendente && (
            <button onClick={() => onAprovar(doc.id)} className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors">
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
      </td>
    </tr>
  );
}