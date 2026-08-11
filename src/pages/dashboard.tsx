import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import HeaderDashboard from "../components/headerDashboard";
import { useDashboardData } from "../hooks/useDashboardData";
import { fetchComToken } from "../utils/api";

export default function Dashboard() {
  const [sidebarFechada, setSidebarFechada] = useState(false);

  const {
    usuario,
    totalCategorias,
    totalSistemas,
    totalDocumentos,
    pendentesAprovacao,
    totalAprovados,
    documentosRecentes,
    loading,
    erro,
    recarregar,
  } = useDashboardData();

  const handleDeletarConta = async () => {
    if (!window.confirm("Atenção: Tem certeza que deseja encerrar a sessão e APAGAR permanentemente a sua conta?")) return;
    try {
      await fetchComToken("/usuarios/me", { method: "DELETE" });
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir a conta.");
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50"><p className="text-slate-600 font-medium animate-pulse">Carregando painel...</p></div>;
  }

  if (erro) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 gap-4">
        <p className="text-red-600 font-medium">Ocorreu um erro: {erro}</p>
        <button onClick={recarregar} className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors cursor-pointer">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar onDeletarConta={handleDeletarConta} fechada={sidebarFechada} />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <HeaderDashboard sidebarFechada={sidebarFechada} setSidebarFechada={setSidebarFechada} usuario={usuario} />
        <main className="p-8 flex-1">
          <Outlet
            context={{ totalCategorias, totalSistemas, totalDocumentos, pendentesAprovacao, totalAprovados, documentosRecentes }}
          />
        </main>
      </div>
    </div>
  );
}