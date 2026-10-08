import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Plataforma, Dominio } from "../../../types/plataforma";

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
      toast.error("Selecione a plataforma onde o domínio está registrado.");
      return;
    }
    if (!nome.trim()) {
      toast.error("O nome do domínio é obrigatório.");
      return;
    }

    const dominioLimpo = nome.trim().toLowerCase();
    // Regex simples para formato de domínio
    if (!dominioLimpo.includes(".") || dominioLimpo.startsWith(".") || dominioLimpo.endsWith(".")) {
      toast.error("Indique um nome de domínio válido (ex: netline.co.mz).");
      return;
    }

    if (!dataExpiracao) {
      toast.error("A data de expiração do domínio é obrigatória.");
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
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">
            {dominioExistente ? "Editar Domínio" : "Novo Domínio"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre os domínios corporativos e controle as datas de renovação e apontamentos
          </p>
        </div>

        {/* Plataforma Pai */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Plataforma / Registrador DNS *
          </label>
          <select
            value={plataformaId}
            onChange={(e) => setPlataformaId(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
          >
            <option value="" disabled>Selecione a plataforma...</option>
            {listaPlataformas.map((plat) => (
              <option key={plat.id} value={plat.id}>
                {plat.nome} ({plat.tipo === "GESTAO_DOMINIO" ? "Gestão de Domínio" : plat.tipo})
              </option>
            ))}
          </select>
        </div>

        {/* Nome do Domínio */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Nome do Domínio Principal *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: netline.co.mz ou intranet.netline.co.mz"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
          />
        </div>

        {/* Data de Expiração */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Data de Expiração / Renovação *
          </label>
          <input
            type="date"
            required
            value={dataExpiracao}
            onChange={(e) => setDataExpiracao(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
          />
          <p className="text-xs text-slate-400 mt-1">
            Data em que o domínio expira no registrador para alertas de renovação
          </p>
        </div>
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
          {salvando ? "A salvar..." : dominioExistente ? "Atualizar Domínio" : "Criar Domínio"}
        </button>
      </div>
    </form>
  );
}

