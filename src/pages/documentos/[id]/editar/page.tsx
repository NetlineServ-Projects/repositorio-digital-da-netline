import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDocumentosData } from "../../../../hooks/useDocumentosData";
import { useDocumentoDetalhe } from "../../../../hooks/useDocumentoDetalhe";
import { toast } from "sonner";
import SelectPesquisavel from "../../../../components/selectPesquisavel";
import { EstadoCarregando, EstadoErro } from "../../../../components/estados";

export default function EditarDocumentoPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categorias, editarDocumento } = useDocumentosData();
  const { documento, loading, erro, recarregar } = useDocumentoDetalhe(id ?? "");

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Se o documento pertence a um sistema, "voltar" deve regressar ao sistema
  // em vez da listagem geral de Documentos
  const voltar = documento?.sistemaId
    ? `/dashboard/sistemas/${documento.sistemaId}`
    : "/dashboard/documentos";

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
      toast.success(t("documentos.editar.atualizadoComSucesso"));
      navigate(voltar);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("documentos.editar.erroAtualizar"));
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return <EstadoCarregando mensagem={t("documentos.detalhes.carregando")} />;
  }

  if (erro || !documento) {
    return (
      <div className="space-y-3 text-center">
        {erro ? (
          <EstadoErro mensagem={erro} onTentarNovamente={recarregar} />
        ) : (
          <EstadoErro mensagem={t("documentos.detalhes.naoEncontrado")} />
        )}
        <Link to="/dashboard/documentos" className="text-sm text-netline-azul font-semibold hover:underline">
          {t("documentos.detalhes.voltar")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <Link to={voltar} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors">
        ← {t("documentos.detalhes.voltar")}
      </Link>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-5">
        <h1 className="font-bold text-slate-800 text-lg">{t("documentos.editar.titulo")}</h1>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">{t("documentos.editar.tituloLabel")}</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">{t("documentos.editar.descricaoLabel")}</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="documento-categoria" className="text-xs font-semibold text-slate-500 uppercase">{t("documentos.editar.categoriaLabel")}</label>
          <SelectPesquisavel
            id="documento-categoria"
            valor={categoriaId}
            onChange={setCategoriaId}
            opcaoVazia={t("documentos.form.semCategoria")}
            opcoes={categorias.map((cat) => ({ valor: String(cat.id), label: cat.nome }))}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <Link to={voltar} className="flex-1 text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-sm font-semibold rounded-lg transition-colors">
            {t("documentos.form.cancelar")}
          </Link>
          <button
            onClick={handleSalvar}
            disabled={salvando || !titulo}
            className="flex-1 py-2.5 bg-netline-azul hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {salvando ? t("documentos.aGuardar") : t("documentos.guardar")}
          </button>
        </div>
      </div>
    </div>
  );
}