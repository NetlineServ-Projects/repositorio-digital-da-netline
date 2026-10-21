import { useState } from "react";
import { toast } from "sonner";
import type { Credencial } from "../../../hooks/useSistemasData";
import { rotuloTipoCredencial } from "./constantes";

interface ListaCredenciaisProps {
  credenciais: Credencial[];
  ehAdmin: boolean;
  onAdicionar: () => void;
  onEditar: (credencial: Credencial) => void;
  onApagar: (credencial: Credencial) => void;
}

export default function ListaCredenciais({
  credenciais,
  ehAdmin,
  onAdicionar,
  onEditar,
  onApagar,
}: ListaCredenciaisProps) {
  const [revelados, setRevelados] = useState<Set<number>>(new Set());
  const [copiadoId, setCopiadoId] = useState<number | null>(null);

  const alternarRevelado = (id: number) =>
    setRevelados((prev) => {
      const novo = new Set(prev);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });

  const copiarValor = async (id: number, valor: string) => {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiadoId(id);
      toast.success("Valor copiado para a área de transferência.");
      setTimeout(() => setCopiadoId(null), 2000);
    } catch {
      toast.error("Não foi possível copiar o valor.");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h4 className="text-xs font-semibold text-slate-700">Credenciais do Backend</h4>
        {ehAdmin && (
          <button
            type="button"
            onClick={onAdicionar}
            className="text-xs font-semibold text-blue-900 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-left sm:text-right"
          >
            + Adicionar credencial
          </button>
        )}
      </div>

      {credenciais.length === 0 && (
        <p className="text-xs text-slate-400 italic">Sem credenciais registadas.</p>
      )}

      {credenciais.map((credencial) => {
        const revelado = revelados.has(credencial.id);
        const copiado = copiadoId === credencial.id;
        return (
          <div
            key={credencial.id}
            className="border border-slate-100 rounded-lg p-3 space-y-2 hover:border-slate-200 transition-all"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800 truncate">{credencial.label}</p>
                <p className="text-[11px] text-slate-400 truncate">
                  {rotuloTipoCredencial(credencial.tipo)}
                </p>
              </div>
              {ehAdmin && (
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onEditar(credencial)}
                    className="text-[11px] text-slate-500 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onApagar(credencial)}
                    className="text-[11px] text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    Apagar
                  </button>
                </div>
              )}
            </div>

            <div className="bg-slate-50 rounded-md p-2 flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-2 overflow-hidden">
              <pre className="text-[11px] text-slate-700 whitespace-pre-wrap break-all font-mono max-w-full overflow-x-auto">
                {revelado
                  ? credencial.valor
                  : "•".repeat(Math.min(credencial.valor?.length || 24, 30))}
              </pre>
              <div className="flex justify-end gap-1 shrink-0 pt-1 sm:pt-0 border-t sm:border-0 border-slate-200/60">
                <button
                  type="button"
                  onClick={() => alternarRevelado(credencial.id)}
                  className="text-[11px] text-slate-500 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
                >
                  {revelado ? "Ocultar" : "Mostrar"}
                </button>
                <button
                  type="button"
                  onClick={() => credencial.valor && copiarValor(credencial.id, credencial.valor)}
                  className="text-[11px] text-slate-500 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
                >
                  {copiado ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}