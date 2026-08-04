import { useState } from "react";
import Sidebar from "../components/sidebar";
import HeaderDashboard from "../components/HeaderDashboard";
import Perfil from "../components/Perfil";
import Configuracoes from "../components/Configuracoes";
import Documentos from "../components/Documentos";
import Categorias from "../components/Categorias";
import Lixeira from "../components/Lixeira";
import Aprovacoes from "../components/Aprovacoes";
import Sistemas from "../components/Sistemas";
import Usuarios from "../components/Usuarios";

import HeroBanner from "../components/dashboard/HeroBanner";
import MetricsGrid from "../components/dashboard/MetricsGrid";
import AcoesRapidas from "../components/dashboard/AcoesRapidas";
import DocumentosRecentes from "../components/dashboard/DocumentosRecentes";
import AtividadeRecente from "../components/dashboard/AtividadeRecente";

import { useDashboardData } from "../hooks/useDashboardData";
import { fetchComToken } from "../utils/api";

export default function Dashboard() {
  const [abaAtiva, setAbaAtiva] = useState("dashboard");
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
      await fetchComToken("/api/usuarios/me", { method: "DELETE" }); // confirmar rota real no backend
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir a conta.");
    }
  };

  const renderConteudoPrincipal = () => {
    switch (abaAtiva) {
      case "perfil": return <Perfil />;
      case "documentos": return <Documentos />;
      case "aprovacoes": return <Aprovacoes />;
      case "categorias": return <Categorias />;
      case "sistemas": return <Sistemas />;
      case "usuarios": return <Usuarios />;
      case "lixeira": return <Lixeira />;
      case "configuracoes": return <Configuracoes />;
      default:
        return (
          <div className="space-y-6">
            <HeroBanner totalDocumentos={totalDocumentos} totalSistemas={totalSistemas} onVerDocumentos={() => setAbaAtiva("documentos")} />
            <MetricsGrid
              totalDocumentos={totalDocumentos}
              pendentesAprovacao={pendentesAprovacao}
              totalAprovados={totalAprovados}
              totalSistemas={totalSistemas}
              totalCategorias={totalCategorias}
            />
            <AcoesRapidas onNavegar={setAbaAtiva} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <DocumentosRecentes documentos={documentosRecentes} onVerTodos={() => setAbaAtiva("documentos")} />
              <AtividadeRecente />
            </div>
          </div>
        );
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
      <Sidebar abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} onDeletarConta={handleDeletarConta} fechada={sidebarFechada} />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <HeaderDashboard sidebarFechada={sidebarFechada} setSidebarFechada={setSidebarFechada} usuario={usuario} />
        <main className="p-8 flex-1">{renderConteudoPrincipal()}</main>
      </div>
    </div>
  );
}