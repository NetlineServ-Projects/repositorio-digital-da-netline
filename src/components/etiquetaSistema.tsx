import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IconSistema } from "./icons";

// Indica o sistema a que um documento pertence (quando foi anexado a partir de um sistema),
// com ligação para a página desse sistema
export default function EtiquetaSistema({ sistema }: { sistema?: { id: number; nome: string } | null }) {
  const { t } = useTranslation();
  if (!sistema) return null;
  return (
    <Link
      to={`/dashboard/sistemas/${sistema.id}`}
      title={t("componentes.documento.verSistema", { nome: sistema.nome })}
      className="inline-flex items-center gap-1 max-w-full px-2 py-0.5 rounded-md bg-netline-dourado/10 border border-netline-dourado/25 text-[11px] font-semibold text-[#8a5f0e] hover:bg-netline-dourado/20 transition-colors"
    >
      <IconSistema className="w-3 h-3 shrink-0" />
      <span className="truncate">{sistema.nome}</span>
    </Link>
  );
}
