import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useSistemasData, podeGerirSistema } from "../../../hooks/useSistemasData";
import SistemaFormulario from "../formulario/page";

interface DashboardContext {
  usuario: { id?: number; nome: string; perfil?: string } | null;
}

export default function EditarSistemaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario } = useOutletContext<DashboardContext>();
  const { sistemas, editarSistema, loading } = useSistemasData();
  const [salvando, setSalvando] = useState(false);

  const sistema = sistemas.find((s) => String(s.id) === id);
  const caminhoDoSistema = `/dashboard/sistemas/${id}`;

  const handleSubmit = async (dados: Record<string, unknown>) => {
    if (!sistema) return;
    setSalvando(true);
    try {
      await editarSistema(sistema.id, dados);
      toast.success("Sistema atualizado com sucesso!");
      navigate(caminhoDoSistema);
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Erro ao guardar as alterações.");
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <p className="text-slate-500 text-sm animate-pulse">A carregar...</p>
      </div>
    );
  }

  if (!sistema || !podeGerirSistema(sistema, usuario)) {
    return (
      <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm text-sm text-slate-500">
        {sistema
          ? "Só quem criou o sistema (ou um administrador) o pode editar."
          : "Sistema não encontrado."}{" "}
        <button onClick={() => navigate("/dashboard/sistemas")} className="text-blue-900 font-semibold underline">
          Voltar
        </button>
      </div>
    );
  }

  return (
    <SistemaFormulario
      sistemaExistente={sistema}
      salvando={salvando}
      onCancelar={() => navigate(caminhoDoSistema)}
      onSubmit={handleSubmit}
    />
  );
}
