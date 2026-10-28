import { useState } from "react";
import { useTranslation } from "react-i18next";
import { API_URL } from "../../utils/api";

const TAMANHOS = {
  md: "w-11 h-11 rounded-xl text-base",
  lg: "w-16 h-16 rounded-2xl text-2xl",
};

interface LogotipoPlataformaProps {
  nome: string;
  logotipo: string | null;
  tamanho?: keyof typeof TAMANHOS;
}

// O logótipo da plataforma; sem logótipo (ou se a imagem falhar), a inicial do nome
export default function LogotipoPlataforma({
  nome,
  logotipo,
  tamanho = "md",
}: LogotipoPlataformaProps) {
  const { t } = useTranslation();
  const [falhou, setFalhou] = useState(false);

  if (logotipo && !falhou) {
    return (
      <img
        src={`${API_URL}${logotipo}`}
        alt={t("plataformas.cartoes.logotipoDe", { nome })}
        onError={() => setFalhou(true)}
        // Fundo branco fixo: os logótipos são desenhados para fundo claro, também no tema escuro
        className={`${TAMANHOS[tamanho]} object-contain bg-[#ffffff] border border-slate-100 p-1 shrink-0`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`${TAMANHOS[tamanho]} bg-blue-50 text-blue-900 flex items-center justify-center font-bold shrink-0`}
    >
      {nome.charAt(0).toUpperCase()}
    </div>
  );
}
