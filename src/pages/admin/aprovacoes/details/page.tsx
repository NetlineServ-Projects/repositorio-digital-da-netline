import { useParams, useNavigate, Link } from "react-router-dom";
import { useDocumentoDetalhe } from "../../../../hooks/useDocumentoDetalhe";
import StatusBadge from "../../../../components/statusBadge";
import { obterUrlFicheiro, formatarExtensao, obterNomeExibicao, formatarTamanho } from "../../../../utils/documentos";
import { API_URL } from "../../../../utils/api";
import { IconDownload } from "../../../../components/icons";
import { toast } from "sonner";

export default function AprovacaoDetalhesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { documento, loading, erro, alterarEstado } = useDocumentoDetalhe(id!);

  const handleAprovar = async () => {
    try {
      await alterarEstado("APROVADO");
      navigate("/dashboard/aprovacoes");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao aprovar documento.");
    }
  };

  const handleRejeitar = async () => {
    const motivo = prompt("Motivo da rejeição (opcional):") || undefined;
    try {
      await alterarEstado("REJEITADO", motivo);
      navigate("/dashboard/aprovacoes");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao rejeitar documento.");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-12"><p className="text-slate-500 font-medium animate-pulse text-sm">A carregar documento...</p></div>;
  }

  if (erro || !documento) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center space-y-3">
        <p className="text-red-600 text-sm font-medium">{erro || "Documento não encontrado."}</p>
        <Link to="/dashboard/aprovacoes" className="text-sm text-[#18357a] font-semibold hover:underline">Voltar às Aprovações</Link>
      </div>
    );
  }

  const ext = formatarExtensao(documento.tipoArquivo, documento.nomeArquivo);
  const nomeExibicao = obterNomeExibicao(documento);

  return (
    <div className="space-y-6 max-w-2xl">
      <Link to="/dashboard/aprovacoes" className="text-sm text-slate-500 hover:text-slate-800 font-medium">← Voltar às Aprovações</Link>

      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-blue-50 text-[#18357a] rounded-lg text-xs font-extrabold uppercase border border-blue-100/50">{ext}</span>
            <div>
              <h1 className="font-bold text-slate-800 text-lg">{nomeExibicao}</h1>
              {documento.descricao && <p className="text-sm text-slate-400 mt-0.5">{documento.descricao}</p>}
            </div>
          </div>
          <StatusBadge estado={documento.estado} />
        </div>

        <dl className="grid grid-cols-2 gap-4 text-sm border-t border-slate-100 pt-4">
          <div>
            <dt className="text-slate-400 text-xs uppercase font-semibold">Categoria</dt>
            <dd className="text-slate-700 mt-0.5">{documento.categoria?.nome || "Sem Categoria"}</dd>
          </div>
          <div>
            <dt className="text-slate-400 text-xs uppercase font-semibold">Submetido por</dt>
            <dd className="text-slate-700 mt-0.5">{documento.usuario?.nome || "Sistema"}</dd>
          </div>
          <div>
            <dt className="text-slate-400 text-xs uppercase font-semibold">Data</dt>
            <dd className="text-slate-700 mt-0.5">{documento.dataSubmissao ? new Date(documento.dataSubmissao).toLocaleDateString("pt-PT") : "N/A"}</dd>
          </div>
          <div>
            <dt className="text-slate-400 text-xs uppercase font-semibold">Tamanho</dt>
            <dd className="text-slate-700 mt-0.5">{formatarTamanho(documento.tamanho)}</dd>
          </div>
        </dl>

        <a href={obterUrlFicheiro(documento.caminho, API_URL)} download={documento.nomeArquivo} className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-[#18357a] text-sm font-semibold rounded-lg transition-colors border border-blue-100">
          <IconDownload /> Baixar ficheiro
        </a>

        {documento.estado === "PENDENTE" && (
          <div className="flex gap-3 border-t border-slate-100 pt-4">
            <button onClick={handleRejeitar} className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 text-sm font-semibold rounded-lg transition-colors">Rejeitar</button>
            <button onClick={handleAprovar} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">Aprovar</button>
          </div>
        )}
      </div>
    </div>
  );
}