import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useSistemasData } from "../../../hooks/useSistemasData";
import SistemaFormulario from "../formulario/page";

export default function EditarSistemaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sistemas, editarSistema, loading } = useSistemasData();
  const [salvando, setSalvando] = useState(false);

  const sistema = sistemas.find((s) => String(s.id) === id);

  const handleSubmit = async (dados: Record<string, unknown>) => {
    if (!sistema) return;
    setSalvando(true);
    try {
      await editarSistema(sistema.id, dados);
      toast.success("Sistema atualizado com sucesso!");
      navigate("/dashboard/sistemas");
    } catch {
      toast.error("Erro ao guardar as alterações.");
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

  if (!sistema) {
    return (
      <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm text-sm text-slate-500">
        Sistema não encontrado.{" "}
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
      onCancelar={() => navigate("/dashboard/sistemas")}
      onSubmit={handleSubmit}
    />
  );
}