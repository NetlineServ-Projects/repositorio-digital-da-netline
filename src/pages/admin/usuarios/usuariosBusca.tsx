import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { IndicadorAtualizar } from "../../../components/estados";

interface UsuariosBuscaProps {
  busca: string;
  onBuscaChange: (v: string) => void;
  aAtualizar?: boolean; // recarga da lista a correr por trás
}

export default function UsuariosBusca({ busca, onBuscaChange, aAtualizar = false }: UsuariosBuscaProps) {
  const { t } = useTranslation();
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
      <FontAwesomeIcon icon={faSearch} className="text-slate-400 w-4 h-4" />
      <input
        type="text"
        placeholder={t("admin.usuarios.pesquisar")}
        aria-label={t("admin.usuarios.pesquisar")}
        value={busca}
        onChange={(e) => onBuscaChange(e.target.value)}
        className="w-full text-sm bg-transparent focus:outline-none text-slate-700 placeholder-slate-400"
      />
      <span className="shrink-0">
        <IndicadorAtualizar ativo={aAtualizar} />
      </span>
    </div>
  );
}