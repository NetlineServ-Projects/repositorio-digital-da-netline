import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

interface UsuariosHeaderProps {
  total: number;
  onNovoUsuario: () => void;
}

export default function UsuariosHeader({ total, onNovoUsuario }: UsuariosHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className="bg-netline-azul p-5 sm:p-8 rounded-2xl shadow-sm text-white flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
      <div>
        <span className="text-xs uppercase font-semibold text-blue-200/80 tracking-widest block mb-1">{t("admin.usuarios.eyebrow")}</span>
        <h2 className="text-2xl sm:text-3xl font-bold">{t("admin.usuarios.titulo")}</h2>
        <p className="text-sm text-blue-100/80 mt-1">{t("admin.usuarios.subtitulo")}</p>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
        <div className="bg-[#14203A]/70 border border-white/10 px-4 py-2 rounded-xl text-xs font-medium text-blue-100 whitespace-nowrap">{t("admin.usuarios.total", { total })}</div>
        <button onClick={onNovoUsuario} className="flex-1 sm:flex-none justify-center flex items-center gap-2 bg-white text-[#1B2A4A] hover:bg-slate-100 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <FontAwesomeIcon icon={faUserPlus} className="w-4 h-4" />
          <span>{t("admin.usuarios.novo")}</span>
        </button>
      </div>
    </div>
  );
}