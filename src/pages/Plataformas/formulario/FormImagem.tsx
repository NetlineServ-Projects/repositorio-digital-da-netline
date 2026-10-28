import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type {
  Plataforma,
  ImagemContainer,
  VisibilidadeImagem,
  OrigemImagem,
} from "../../../types/plataforma";
import {
  ROTULOS_VISIBILIDADE_IMAGEM,
  ROTULOS_ORIGEM_IMAGEM,
} from "../../../types/plataformaConstantes";
import SelectPesquisavel from "../../../components/selectPesquisavel";

interface FormImagemProps {
  imagemExistente?: ImagemContainer | null;
  plataformas: Plataforma[];
  salvando: boolean;
  onCancelar: () => void;
  onSubmit: (dados: Record<string, unknown>) => Promise<void>;
}

const CLASSE_CAMPO =
  "w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 text-slate-800";
const CLASSE_ROTULO =
  "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2";

export default function FormImagem({
  imagemExistente,
  plataformas,
  salvando,
  onCancelar,
  onSubmit,
}: FormImagemProps) {
  const { t } = useTranslation();
  const plataformasContainerizacao = plataformas.filter(
    (p) => p.tipo === "CONTAINERIZACAO"
  );

  const [plataformaId, setPlataformaId] = useState<number | string>(
    imagemExistente?.plataformaId ?? plataformasContainerizacao[0]?.id ?? ""
  );
  const [nome, setNome] = useState(imagemExistente?.nome ?? "");
  const [tag, setTag] = useState(imagemExistente?.tag ?? "latest");
  const [portaExposta, setPortaExposta] = useState(
    imagemExistente?.portaExposta?.toString() ?? ""
  );
  const [visibilidade, setVisibilidade] = useState<VisibilidadeImagem>(
    imagemExistente?.visibilidade ?? "PRIVADA"
  );
  const [origem, setOrigem] = useState<OrigemImagem>(
    imagemExistente?.origem ?? "PROPRIA"
  );
  const [digest, setDigest] = useState(imagemExistente?.digest ?? "");
  const [ultimoPushEm, setUltimoPushEm] = useState(
    imagemExistente?.ultimoPushEm?.slice(0, 10) ?? ""
  );
  const [ativo, setAtivo] = useState(imagemExistente?.ativo ?? true);

  const ehPropria = origem === "PROPRIA";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!plataformaId) {
      toast.error(t("plataformas.form.imagem.selecionePlataforma"));
      return;
    }
    if (!nome.trim()) {
      toast.error(t("plataformas.form.imagem.nomeObrigatorio"));
      return;
    }

    const porta = portaExposta.trim() ? Number(portaExposta) : null;
    if (porta !== null && (!Number.isInteger(porta) || porta < 1 || porta > 65535)) {
      toast.error(t("plataformas.form.imagem.portaInvalida"));
      return;
    }

    const payload: Record<string, unknown> = {
      nome: nome.trim(),
      tag: tag.trim() || "latest",
      portaExposta: porta,
      visibilidade,
      origem,
      ativo,
      digest: ehPropria && digest.trim() ? digest.trim() : null,
      ultimoPushEm:
        ehPropria && ultimoPushEm ? new Date(ultimoPushEm).toISOString() : null,
    };

    // A imagem não muda de plataforma depois de criada
    if (!imagemExistente) {
      payload.plataformaId = Number(plataformaId);
    }

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">
            {imagemExistente ? t("plataformas.form.imagem.tituloEditar") : t("plataformas.form.imagem.tituloNova")}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("plataformas.form.imagem.descricao")}
          </p>
        </div>

        {/* Plataforma */}
        <div>
          <label htmlFor="imagem-plataforma" className={CLASSE_ROTULO}>{t("plataformas.form.plataformaAssociada")}</label>
          <SelectPesquisavel
            id="imagem-plataforma"
            valor={String(plataformaId)}
            onChange={setPlataformaId}
            disabled={Boolean(imagemExistente)}
            required
            placeholder={t("plataformas.form.selecionePlataforma")}
            opcoes={plataformasContainerizacao.map((plat) => ({
              valor: String(plat.id),
              label: plat.nome,
            }))}
          />
          {plataformasContainerizacao.length === 0 && (
            <p className="text-xs text-amber-600 mt-1.5">
              {t("plataformas.form.imagem.semPlataformas")}
            </p>
          )}
        </div>

        {/* Identificação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className={CLASSE_ROTULO}>{t("plataformas.form.imagem.nome")}</label>
            <input
              type="text"
              required
              placeholder={t("plataformas.form.imagem.nomePlaceholder")}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={CLASSE_CAMPO}
            />
            <p className="text-[11px] text-slate-400 mt-1">
              {t("plataformas.form.imagem.nomeAjuda")}
            </p>
          </div>
          <div>
            <label className={CLASSE_ROTULO}>{t("plataformas.form.imagem.tag")}</label>
            <input
              type="text"
              placeholder="latest"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className={CLASSE_CAMPO}
            />
          </div>
        </div>

        {/* Classificação */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="imagem-origem" className={CLASSE_ROTULO}>{t("plataformas.form.imagem.origem")}</label>
            <SelectPesquisavel
              id="imagem-origem"
              valor={origem}
              onChange={(v) => setOrigem(v as OrigemImagem)}
              opcoes={(Object.keys(ROTULOS_ORIGEM_IMAGEM) as OrigemImagem[]).map((valor) => ({
                valor,
                label: ROTULOS_ORIGEM_IMAGEM[valor],
              }))}
            />
          </div>
          <div>
            <label htmlFor="imagem-visibilidade" className={CLASSE_ROTULO}>{t("plataformas.form.imagem.visibilidade")}</label>
            <SelectPesquisavel
              id="imagem-visibilidade"
              valor={visibilidade}
              onChange={(v) => setVisibilidade(v as VisibilidadeImagem)}
              opcoes={(Object.keys(ROTULOS_VISIBILIDADE_IMAGEM) as VisibilidadeImagem[]).map(
                (valor) => ({ valor, label: ROTULOS_VISIBILIDADE_IMAGEM[valor] })
              )}
            />
          </div>
          <div>
            <label className={CLASSE_ROTULO}>{t("plataformas.form.imagem.porta")}</label>
            <input
              type="number"
              min="1"
              max="65535"
              placeholder={t("plataformas.form.imagem.portaPlaceholder")}
              value={portaExposta}
              onChange={(e) => setPortaExposta(e.target.value)}
              className={CLASSE_CAMPO}
            />
          </div>
        </div>

        {/* Só para imagens construídas pela empresa */}
        {ehPropria && (
          <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t("plataformas.form.imagem.digest")}
              </label>
              <input
                type="text"
                placeholder="sha256:..."
                value={digest}
                onChange={(e) => setDigest(e.target.value)}
                className={`${CLASSE_CAMPO} font-mono bg-white`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t("plataformas.form.imagem.ultimoPush")}
              </label>
              <input
                type="date"
                value={ultimoPushEm}
                onChange={(e) => setUltimoPushEm(e.target.value)}
                className={`${CLASSE_CAMPO} bg-white`}
              />
            </div>
          </div>
        )}

        {/* Estado */}
        <label className="flex items-center gap-2.5 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
            className="w-4 h-4 accent-netline-azul"
          />
          <span className="text-sm font-medium text-slate-700">{t("plataformas.form.imagem.ativa")}</span>
        </label>
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
          {salvando ? t("plataformas.comum.aGuardar") : imagemExistente ? t("plataformas.form.imagem.atualizar") : t("plataformas.form.imagem.criar")}
        </button>
      </div>
    </form>
  );
}