import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDocumentoDetalhe } from "../../../../hooks/useDocumentoDetalhe";
import { useDocumentosData } from "../../../../hooks/useDocumentosData";
import { toast } from "sonner";
import SelectPesquisavel from "../../../../components/selectPesquisavel";

export default function AprovacaoEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { documento, loading, erro, atualizar } = useDocumentoDetalhe(id!);
  const { categorias } = useDocumentosData();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (documento) {
      setTitulo(documento.titulo || "");
      setDescricao(documento.descricao || "");
      setCategoriaId(documento.categoria?.id ?? "");
    }
  }, [documento]);

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      await atualizar({
        titulo,
        descricao,
        ...(categoriaId !== "" && { categoriaId: Number(categoriaId) }),
      });
      navigate(`/dashboard/aprovacoes/details/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao guardar alterações.");
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-12"><p className="text-slate-500 font-medium animate-pulse text-sm">A carregar documento...</p></div>;
  }

  if (erro || !documento) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center space-y-3">
        <p className="text-red-600 text-sm font-medium">{erro || "Documento não encontrado."}</p>
        <Link to="/dashboard/aprovacoes"className="text-sm text-[#18357a] font-semibold hover:underline">Voltar às Aprovações</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Link to={`/dashboard/aprovacoes/details/${id}`} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 font-medium">← Voltar aos Detalhes</Link>

      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-100 shadow-sm space-y-5">
        <h1 className="font-bold text-slate-800 text-lg">Editar Documento</h1>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="aprovacao-categoria" className="text-xs font-semibold text-slate-500 uppercase">Categoria</label>
          <SelectPesquisavel
            id="aprovacao-categoria"
            valor={String(categoriaId)}
            onChange={(v) => setCategoriaId(v ? Number(v) : "")}
            opcaoVazia="Sem Categoria"
            opcoes={categorias.map((cat) => ({ valor: String(cat.id), label: cat.nome }))}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 border-t border-slate-100 pt-4">
          <Link to={`/dashboard/aprovacoes/details/${id}`} className="flex-1 py-2.5 text-center bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-sm font-semibold rounded-lg transition-colors">Cancelar</Link>
          <button onClick={handleSalvar} disabled={salvando} className="flex-1 py-2.5 bg-[#18357a] hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
            {salvando ? "A guardar..." : "Guardar Alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}