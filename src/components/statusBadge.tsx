import { useTranslation } from "react-i18next";
import type { Documento } from "../types/documento";

const ESTILOS: Record<Documento["estado"], string> = {
  APROVADO: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  PENDENTE: "bg-amber-50 text-amber-700 border border-amber-200",
  REJEITADO: "bg-rose-50 text-rose-700 border border-rose-200",
};

export default function StatusBadge({ estado }: { estado: Documento["estado"] }) {
  const { t } = useTranslation();
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ESTILOS[estado]}`}>
      {t(`comum.status.${estado}`)}
    </span>
  );
}