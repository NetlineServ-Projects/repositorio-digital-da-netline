import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDocumentoDetalhe } from "../../../../hooks/useDocumentoDetalhe";
import { useDocumentosData } from "../../../../hooks/useDocumentosData";
import { toast } from "sonner";
import SelectPesquisavel from "../../../../components/selectPesquisavel";
import { EstadoCarregando, EstadoErro } from "../../../../components/estados";

export default function AprovacaoEditPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { documento, loading, erro, recarregar, atualizar } = useDocumentoDetalhe(id!);
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
      toast.error(err instanceof Error ? err.message : t("admin.aprovacoes.erroGuardar"));
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
        <Link to="/dashboard/aprovacoes" className="text-sm text-netline-azul font-semibold hover:underline">{t("admin.aprovacoes.voltar")}</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Link to={`/dashboard/aprovacoes/details/${id}`} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 font-medium">← {t("admin.aprovacoes.voltarDetalhes")}</Link>

      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-100 shadow-sm space-y-5">
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
            rows={3}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="aprovacao-categoria" className="text-xs font-semibold text-slate-500 uppercase">{t("documentos.editar.categoriaLabel")}</label>
          <SelectPesquisavel
            id="aprovacao-categoria"
            valor={String(categoriaId)}
            onChange={(v) => setCategoriaId(v ? Number(v) : "")}
            opcaoVazia={t("documentos.form.semCategoria")}
            opcoes={categorias.map((cat) => ({ valor: String(cat.id), label: cat.nome }))}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 border-t border-slate-100 pt-4">
          <Link to={`/dashboard/aprovacoes/details/${id}`} className="flex-1 py-2.5 text-center bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-sm font-semibold rounded-lg transition-colors">{t("componentes.confirmacao.cancelar")}</Link>
          <button onClick={handleSalvar} disabled={salvando} className="flex-1 py-2.5 bg-netline-azul hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
            {salvando ? t("documentos.aGuardar") : t("admin.aprovacoes.guardarAlteracoes")}
          </button>
        </div>
      </div>
    </div>
  );
}