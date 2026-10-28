import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { Plataforma, Dominio } from "../../../types/plataforma";
import { ROTULOS_TIPO_PLATAFORMA } from "../../../types/plataformaConstantes";
import SelectPesquisavel from "../../../components/selectPesquisavel";

interface FormDominioProps {
  dominioExistente?: Dominio | null;
  plataformas: Plataforma[];
  salvando: boolean;
  onCancelar: () => void;
  onSubmit: (dados: {
    nome: string;
    dataExpiracao: string;
    plataformaId: number;
  }) => Promise<void>;
}

export default function FormDominio({
  dominioExistente,
  plataformas,
  salvando,
  onCancelar,
  onSubmit,
}: FormDominioProps) {
  const { t } = useTranslation();
  // Filtrar apenas plataformas de gestão de domínio ou qualquer plataforma se não houver desse tipo
  const plataformasDns = plataformas.filter(
    (p) => p.tipo === "GESTAO_DOMINIO"
  );
  const listaPlataformas = plataformasDns.length > 0 ? plataformasDns : plataformas;

  const [plataformaId, setPlataformaId] = useState<number | string>(
    dominioExistente?.plataformaId ?? (listaPlataformas[0]?.id || "")
  );
  const [nome, setNome] = useState(dominioExistente?.nome ?? "");
  const [dataExpiracao, setDataExpiracao] = useState(
    dominioExistente?.dataExpiracao
      ? dominioExistente.dataExpiracao.split("T")[0]
      : ""
  );

  useEffect(() => {
    if (dominioExistente) {
      setPlataformaId(dominioExistente.plataformaId);
      setNome(dominioExistente.nome);
      setDataExpiracao(
        dominioExistente.dataExpiracao
          ? dominioExistente.dataExpiracao.split("T")[0]
          : ""
      );
    }
  }, [dominioExistente]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!plataformaId) {
      toast.error(t("plataformas.form.dominio.selecionePlataforma"));
      return;
    }
    if (!nome.trim()) {
      toast.error(t("plataformas.form.dominio.nomeObrigatorio"));
      return;
    }

    const dominioLimpo = nome.trim().toLowerCase();
    // Regex simples para formato de domínio
    if (!dominioLimpo.includes(".") || dominioLimpo.startsWith(".") || dominioLimpo.endsWith(".")) {
      toast.error(t("plataformas.form.dominio.nomeInvalido"));
      return;
    }

    if (!dataExpiracao) {
      toast.error(t("plataformas.form.dominio.dataObrigatoria"));
      return;
    }

    await onSubmit({
      plataformaId: Number(plataformaId),
      nome: dominioLimpo,
      dataExpiracao,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">
            {dominioExistente ? t("plataformas.form.dominio.tituloEditar") : t("plataformas.form.dominio.tituloNovo")}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("plataformas.form.dominio.descricao")}
          </p>
        </div>

        {/* Plataforma Pai */}
        <div>
          <label htmlFor="dominio-plataforma" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            {t("plataformas.form.dominio.plataforma")}
          </label>
          <SelectPesquisavel
            id="dominio-plataforma"
            valor={String(plataformaId)}
            onChange={setPlataformaId}
            required
            placeholder={t("plataformas.form.selecionePlataforma")}
            opcoes={listaPlataformas.map((plat) => ({
              valor: String(plat.id),
              label: plat.nome,
              descricao: ROTULOS_TIPO_PLATAFORMA[plat.tipo] ?? plat.tipo,
            }))}
          />
        </div>

        {/* Nome do Domínio */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            {t("plataformas.form.dominio.nome")}
          </label>
          <input
            type="text"
            required
            placeholder={t("plataformas.form.dominio.nomePlaceholder")}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
          />
        </div>

        {/* Data de Expiração */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            {t("plataformas.form.dominio.dataExpiracao")}
          </label>
          <input
            type="date"
            required
            value={dataExpiracao}
            onChange={(e) => setDataExpiracao(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
          />
          <p className="text-xs text-slate-400 mt-1">
            {t("plataformas.form.dominio.dataExpiracaoAjuda")}
          </p>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancelar}
          disabled={salvando}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all cursor-pointer"
        >
          {t("plataformas.comum.cancelar")}
        </button>
        <button
          type="submit"
          disabled={salvando}
          className="px-6 py-2.5 bg-netline-azul hover:bg-blue-900 text-white font-semibold text-sm rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          {salvando ? t("plataformas.comum.aGuardar") : dominioExistente ? t("plataformas.form.dominio.atualizar") : t("plataformas.form.dominio.criar")}
        </button>
      </div>
    </form>
  );
}

