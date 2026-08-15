import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDocumentosData } from "../../../hooks/useDocumentosData";
import { toast } from "sonner";
import { IconUpload } from "../../../components/icons";

export default function NovoDocumentoPage() {
  const navigate = useNavigate();
  const { categorias, criarDocumento } = useDocumentosData();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [ficheiro, setFicheiro] = useState<File | null>(null);
  const [salvando, setSalvando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!titulo.trim()) {
      toast.error("Por favor, insira o título do documento.");
      return;
    }

    if (!ficheiro) {
      toast.error("Por favor, selecione um ficheiro para carregar.");
      return;
    }

    setSalvando(true);

    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descricao", descricao);
      formData.append("categoriaId", categoriaId);
      formData.append("ficheiro", ficheiro);

      await criarDocumento(formData);
      toast.success("Documento criado com sucesso.");
      navigate("/dashboard/documentos");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar documento.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <Link
        to="/dashboard/documentos"
        className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
      >
        ← Voltar aos Documentos
      </Link>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5">
        <h1 className="font-bold text-slate-800 text-lg">Novo Documento</h1>

        {/* Título */}
        <div className="space-y-1.5">
          <label htmlFor="titulo" className="text-xs font-semibold text-slate-500 uppercase">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            id="titulo"
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Guia de Procedimentos Externa"
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18357a]/20 focus:border-[#18357a] transition-all"
          />
        </div>

        {/* Descrição */}
        <div className="space-y-1.5">
          <label htmlFor="descricao" className="text-xs font-semibold text-slate-500 uppercase">
            Descrição
          </label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            placeholder="Breve resumo sobre o conteúdo do documento..."
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18357a]/20 focus:border-[#18357a] transition-all resize-none"
          />
        </div>

        {/* Categoria */}
        <div className="space-y-1.5">
          <label htmlFor="categoria" className="text-xs font-semibold text-slate-500 uppercase">
            Categoria
          </label>
          <select
            id="categoria"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18357a]/20 focus:border-[#18357a] transition-all"
          >
            <option value="">Sem Categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>

        {/* Área de Seleção de Ficheiro */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">
            Ficheiro <span className="text-red-500">*</span>
          </label>
          <div className="relative border-2 border-dashed border-slate-200 hover:border-[#18357a]/50 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors text-center cursor-pointer">
            <input
              type="file"
              required
              onChange={(e) => setFicheiro(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center gap-1">
              <IconUpload className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-xs text-slate-500 font-medium">
                {ficheiro ? (
                  <span className="text-[#18357a] font-semibold">{ficheiro.name}</span>
                ) : (
                  "Clique aqui para escolher ou arraste o ficheiro"
                )}
              </span>
              <span className="text-[11px] text-slate-400">
                {ficheiro ? `${(ficheiro.size / (1024 * 1024)).toFixed(2)} MB` : "PDF, PNG, JPG, DOCX até 10MB"}
              </span>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-3 pt-3">
          <Link
            to="/dashboard/documentos"
            className="flex-1 text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-sm font-semibold rounded-lg transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={salvando || !titulo || !ficheiro}
            className="flex-1 py-2.5 bg-[#18357a] hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {salvando ? "A guardar..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}