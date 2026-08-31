import { API_URL } from "../utils/api";

interface AvatarUsuarioProps {
  nome: string;
  fotografia?: string | null;
  tamanho?: "sm" | "md" | "lg";
}

const TAMANHOS = {
  sm: "w-8 h-8 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-24 h-24 text-2xl",
};

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

export default function AvatarUsuario({ nome, fotografia, tamanho = "md" }: AvatarUsuarioProps) {
  const classesBase = `rounded-full flex items-center justify-center font-semibold shrink-0 ${TAMANHOS[tamanho]}`;

  if (fotografia) {
    return (
      <img
        src={`${API_URL}${fotografia}`}
        alt={nome}
        className={`${classesBase} object-cover border border-slate-200`}
      />
    );
  }

  return (
    <div className={`${classesBase} bg-blue-900 text-white`}>
      {iniciais(nome)}
    </div>
  );
}