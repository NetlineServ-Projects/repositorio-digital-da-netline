import { useState } from "react";
import { toast } from "sonner";
import type {
  Credencial,
  TipoAmbiente,
  ComponenteSistema,
  TipoCredencial,
} from "../../../hooks/useSistemasData";
import type { InfraestruturaApi } from "../../../types/infraestrutura";
import {
  CAMPO_VAZIO,
  CLASSE_CAMPO_BRANCO,
  CLASSE_LABEL_FORTE,
  TIPOS_CREDENCIAL,
  labelTipo,
} from "./constantes";

interface Props {
  titulo: string;
  sistemaId: string | number;
  ambiente: TipoAmbiente;
  componente: ComponenteSistema;
  tokenElevado: string;
  credenciais: Credencial[];
  configurado: boolean;
  api: Pick<
    InfraestruturaApi,
    "adicionarCredencial" | "atualizarCredencial" | "apagarCredencial"
  >;
  tratarErro: (erro: unknown, mensagemGenerica: string) => void;
  aoAlterar: () => Promise<void>; // o formulário recarrega e avisa o pai
}

export default function CredenciaisComponente({
  titulo,
  sistemaId,
  ambiente,
  componente,
  tokenElevado,
  credenciais,
  configurado,
  api,
  tratarErro,
  aoAlterar,
}: Props) {
  const { adicionarCredencial, atualizarCredencial, apagarCredencial } = api;

  const [formularioAberto, setFormularioAberto] = useState<
    "novo" | Credencial | null
  >(null);
  const [campo, setCampo] = useState(CAMPO_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [revelados, setRevelados] = useState<Set<number>>(new Set());
  const [copiadoId, setCopiadoId] = useState<number | null>(null);

  const atualizarCampo = (parcial: Partial<typeof CAMPO_VAZIO>) =>
    setCampo((prev) => ({ ...prev, ...parcial }));

  const abrirNova = () => {
    setCampo(CAMPO_VAZIO);
    setFormularioAberto("novo");
  };

  const abrirEditar = (c: Credencial) => {
    setCampo({ tipo: c.tipo, label: c.label, valor: c.valor || "" });
    setFormularioAberto(c);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      tipo: campo.tipo,
      label: campo.label.trim(),
      valor: campo.valor.trim(),
    };
    if (!payload.label || !payload.valor) {
      toast.error("Preencha todos os campos da credencial.");
      return;
    }

    setSalvando(true);
    try {
      if (formularioAberto && formularioAberto !== "novo") {
        await atualizarCredencial(sistemaId, ambiente, componente, formularioAberto.id, payload, tokenElevado);
        toast.success("Credencial atualizada com sucesso.");
      } else {
        await adicionarCredencial(sistemaId, ambiente, componente, payload, tokenElevado);
        toast.success("Credencial adicionada com sucesso.");
      }
      setFormularioAberto(null);
      await aoAlterar();
    } catch (error) {
      tratarErro(error, "Erro ao guardar a credencial.");
    } finally {
      setSalvando(false);
    }
  };

  const handleApagar = (c: Credencial) => {
    toast(`Apagar a credencial "${c.label}"?`, {
      description: "Esta ação não pode ser desfeita.",
      action: {
        label: "Apagar",
        onClick: async () => {
          try {
            await apagarCredencial(sistemaId, ambiente, componente, c.id, tokenElevado);
            toast.success("Credencial apagada.");
            await aoAlterar();
          } catch (error) {
            tratarErro(error, "Erro ao apagar credencial.");
          }
        },
      },
      cancel: { label: "Cancelar", onClick: () => {} },
    });
  };

  const alternarRevelado = (id: number) =>
    setRevelados((prev) => {
      const novo = new Set(prev);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });

  const copiar = async (id: number, valor: string) => {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiadoId(id);
      toast.success("Valor copiado para a área de transferência.");
      setTimeout(() => setCopiadoId(null), 2000);
    } catch {
      toast.error("Não foi possível copiar o valor.");
    }
  };

  const formInvalido = !campo.label.trim() || !campo.valor.trim();

  return (
    <div className="border-t border-slate-100 pt-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase">
          Credenciais do {titulo}
        </h4>
        {configurado && !formularioAberto && (
          <button
            type="button"
            onClick={abrirNova}
            className="text-xs font-semibold text-blue-900 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-left sm:text-right"
          >
            + Adicionar credencial
          </button>
        )}
      </div>

      {!configurado && (
        <p className="text-xs text-slate-400 italic">
          Guarde primeiro a infraestrutura para poder adicionar credenciais.
        </p>
      )}

      {configurado && credenciais.length === 0 && !formularioAberto && (
        <p className="text-xs text-slate-400 italic">
          Sem credenciais registadas neste componente.
        </p>
      )}

      <div className="space-y-3">
        {credenciais.map((c) => {
          const revelado = revelados.has(c.id);
          return (
            <div
              key={c.id}
              className="border border-slate-100 rounded-lg p-3 space-y-2 hover:border-slate-200 transition-all"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 truncate">{c.label}</p>
                  <p className="text-[11px] text-slate-400 truncate">{labelTipo(c.tipo)}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => abrirEditar(c)}
                    className="text-[11px] text-slate-500 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApagar(c)}
                    className="text-[11px] text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    Apagar
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-md p-2 flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-2 overflow-hidden">
                <pre className="text-[11px] text-slate-700 whitespace-pre-wrap break-all font-mono max-w-full overflow-x-auto">
                  {revelado ? c.valor : "•".repeat(Math.min(c.valor?.length || 24, 30))}
                </pre>
                <div className="flex justify-end gap-1 shrink-0 pt-1 sm:pt-0 border-t sm:border-0 border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => alternarRevelado(c.id)}
                    className="text-[11px] text-slate-500 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    {revelado ? "Ocultar" : "Mostrar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => c.valor && copiar(c.id, c.valor)}
                    className="text-[11px] text-slate-500 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    {copiadoId === c.id ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {formularioAberto && (
        <form
          onSubmit={handleSalvar}
          className="bg-slate-50/60 p-4 rounded-xl border border-slate-200 space-y-3"
        >
          <h5 className="text-xs font-bold text-slate-800">
            {formularioAberto === "novo" ? "Nova credencial" : "Editar credencial"} — {titulo}
          </h5>

          <div>
            <label className={CLASSE_LABEL_FORTE}>Tipo</label>
            <select
              value={campo.tipo}
              onChange={(e) => atualizarCampo({ tipo: e.target.value as TipoCredencial })}
              className={CLASSE_CAMPO_BRANCO}
            >
              {TIPOS_CREDENCIAL.map((t) => (
                <option key={t.valor} value={t.valor}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={CLASSE_LABEL_FORTE}>
              Rótulo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={campo.label}
              onChange={(e) => atualizarCampo({ label: e.target.value })}
              placeholder="Ex: .env do backend"
              className={CLASSE_CAMPO_BRANCO}
            />
          </div>

          <div>
            <label className={CLASSE_LABEL_FORTE}>
              Valor <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={campo.valor}
              onChange={(e) => atualizarCampo({ valor: e.target.value })}
              rows={4}
              placeholder="Cole aqui o conteúdo (variáveis de ambiente, chave, token...)"
              className={`${CLASSE_CAMPO_BRANCO} font-mono`}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1">
            <button
              type="button"
              onClick={() => setFormularioAberto(null)}
              disabled={salvando}
              className="w-full py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando || formInvalido}
              className="w-full py-2.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {salvando ? "A guardar..." : "Guardar"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}