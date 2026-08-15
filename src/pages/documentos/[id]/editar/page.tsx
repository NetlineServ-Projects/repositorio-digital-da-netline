import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDocumentosData } from "../../../../hooks/useDocumentosData";
import { useDocumentoDetalhe } from "../../../../hooks/useDocumentoDetalhe";
import { toast } from "sonner";

export default function EditarDocumentoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categorias, editarDocumento } = useDocumentosData();
  const { documento, loading, erro } = useDocumentoDetalhe(id ?? "");

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (documento) {
      setTitulo(documento.titulo || "");
      setDescricao(documento.descricao || "");
      setCategoriaId(documento.categoria?.id ? String(documento.categoria.id) : "");
    }
  }, [documento]);

  const handleSalvar = async () => {
    if (!documento) return;
    setSalvando(true);
    try {
      await editarDocumento(documento.id, { titulo, descricao, categoriaId });
      toast.success("Documento atualizado com sucesso.");
      navigate("/dashboard/documentos");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar documento.");
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-12"><p className="text-slate-500 font-medium animate-pulse text-sm">A carregar documento...</p></div>;
  }

  if (erro || !documento) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center space-y-3 max-w-lg">
        <p className="text-red-600 text-sm font-medium">{erro || "Documento não encontrado."}</p>
        <Link to="/dashboard/documentos" className="text-sm text-[#18357a] font-semibold hover:underline">Voltar aos Documentos</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <Link to="/dashboard/documentos" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors">
        ← Voltar aos Documentos
      </Link>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5">
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
            rows={4}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">Categoria</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
          >
            <option value="">Sem Categoria</option>
            {categorias.map((cat) => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <Link to="/dashboard/documentos" className="flex-1 text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-sm font-semibold rounded-lg transition-colors">
            Cancelar
          </Link>
          <button
            onClick={handleSalvar}
            disabled={salvando || !titulo}
            className="flex-1 py-2.5 bg-[#18357a] hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {salvando ? "A guardar..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
} //essa e o edit