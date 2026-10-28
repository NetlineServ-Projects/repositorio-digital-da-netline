import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { fetchComToken } from "../../utils/api";
import { API_ENDPOINTS } from "../../data/client/endpoint";

interface ModalFotografiaProps {
  aberto: boolean;
  arquivo: File | null;
  onFechar: () => void;
  onSucesso: () => void;
}

export default function ModalFotografia({ aberto, arquivo, onFechar, onSucesso }: ModalFotografiaProps) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!arquivo) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(arquivo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [arquivo]);

  if (!aberto || !arquivo) return null;

  const confirmar = async () => {
    setEnviando(true);
    try {
      const formData = new FormData();
      formData.append("fotografia", arquivo);

      await fetchComToken(API_ENDPOINTS.USUARIO_FOTOGRAFIA, {
        method: "PATCH",
        body: formData,
      });

      toast.success(t("perfil.fotografia.atualizada"));
      onSucesso();
      onFechar();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("perfil.fotografia.erro"));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-800 mb-4">{t("perfil.fotografia.titulo")}</h3>

        <div className="flex justify-center mb-6">
          <img
            src={preview ?? undefined}
            alt={t("perfil.fotografia.previsualizacao")}
            className="w-32 h-32 rounded-full object-cover border-4 border-slate-100 shadow-sm"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onFechar}
            disabled={enviando}
            className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded-xl text-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {t("componentes.confirmacao.cancelar")}
          </button>
          <button
            type="button"
            onClick={confirmar}
            disabled={enviando}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {enviando ? t("perfil.fotografia.aEnviar") : t("componentes.confirmacao.confirmar")}
          </button>
        </div>
      </div>
    </div>
  );
}