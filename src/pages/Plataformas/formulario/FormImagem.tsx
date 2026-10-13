import { useState } from "react";
import { toast } from "sonner";
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
      toast.error("Selecione a plataforma da imagem.");
      return;
    }
    if (!nome.trim()) {
      toast.error("O nome da imagem é obrigatório.");
      return;
    }

    const porta = portaExposta.trim() ? Number(portaExposta) : null;
    if (porta !== null && (!Number.isInteger(porta) || porta < 1 || porta > 65535)) {
      toast.error("A porta deve ser um número entre 1 e 65535.");
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
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">
            {imagemExistente ? "Editar Imagem" : "Nova Imagem"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Registe uma imagem de container publicada num registry da plataforma
          </p>
        </div>

        {/* Plataforma */}
        <div>
          <label className={CLASSE_ROTULO}>Plataforma Associada *</label>
          <select
            value={plataformaId}
            onChange={(e) => setPlataformaId(e.target.value)}
            disabled={Boolean(imagemExistente)}
            required
            className={`${CLASSE_CAMPO} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            <option value="" disabled>
              Selecione a plataforma...
            </option>
            {plataformasContainerizacao.map((plat) => (
              <option key={plat.id} value={plat.id}>
                {plat.nome}
              </option>
            ))}
          </select>
          {plataformasContainerizacao.length === 0 && (
            <p className="text-xs text-amber-600 mt-1.5">
              Ainda não existe nenhuma plataforma de containerização. Crie uma primeiro.
            </p>
          )}
        </div>

        {/* Identificação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className={CLASSE_ROTULO}>Nome da Imagem *</label>
            <input
              type="text"
              required
              placeholder="Ex: netline/repositorio-backend"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={CLASSE_CAMPO}
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Caminho completo, em minúsculas (ex: moodlehq/moodle-php-apache).
            </p>
          </div>
          <div>
            <label className={CLASSE_ROTULO}>Tag</label>
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
            <label className={CLASSE_ROTULO}>Origem</label>
            <select
              value={origem}
              onChange={(e) => setOrigem(e.target.value as OrigemImagem)}
              className={CLASSE_CAMPO}
            >
              {(Object.keys(ROTULOS_ORIGEM_IMAGEM) as OrigemImagem[]).map((valor) => (
                <option key={valor} value={valor}>
                  {ROTULOS_ORIGEM_IMAGEM[valor]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={CLASSE_ROTULO}>Visibilidade</label>
            <select
              value={visibilidade}
              onChange={(e) => setVisibilidade(e.target.value as VisibilidadeImagem)}
              className={CLASSE_CAMPO}
            >
              {(Object.keys(ROTULOS_VISIBILIDADE_IMAGEM) as VisibilidadeImagem[]).map(
                (valor) => (
                  <option key={valor} value={valor}>
                    {ROTULOS_VISIBILIDADE_IMAGEM[valor]}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label className={CLASSE_ROTULO}>Porta Exposta</label>
            <input
              type="number"
              min="1"
              max="65535"
              placeholder="Ex: 3000"
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
                Digest
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
                Data do Último Push
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
            className="w-4 h-4 accent-[#18357a]"
          />
          <span className="text-sm font-medium text-slate-700">Imagem ativa</span>
        </label>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancelar}
          disabled={salvando}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={salvando}
          className="px-6 py-2.5 bg-[#18357a] hover:bg-blue-900 text-white font-semibold text-sm rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          {salvando ? "A salvar..." : imagemExistente ? "Atualizar Imagem" : "Criar Imagem"}
        </button>
      </div>
    </form>
  );
}