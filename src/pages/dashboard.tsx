import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "../components/sidebar";
import HeaderDashboard from "../components/headerDashboard";
import { useDashboardData } from "../hooks/useDashboardData";
import { fetchComToken } from "../utils/api";
import { toast } from "sonner";
import ModalConfirmacao from "../components/modalConfirmacaoprops";

export default function Dashboard() {
  const { t } = useTranslation();
  const location = useLocation();

  // Fecha a sidebar por padrão se o ecrã for pequeno (< 768px)
  const [sidebarFechada, setSidebarFechada] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  const [modalApagarContaAberto, setModalApagarContaAberto] = useState(false);

  const {
    usuario,
    totalCategorias,
    totalSistemas,
    totalPlataformas,
    totalDocumentos,
    pendentesAprovacao,
    totalAprovados,
    documentosRecentes,
    atividades,
    ehAdmin,
    loading,
    erro,
    recarregar,
  } = useDashboardData();

  // Redimensionamento do ecrã ajusta automaticamente a barra lateral
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarFechada(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fecha o menu mobile automaticamente ao mudar de rota/página
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarFechada(true);
    }
  }, [location.pathname]);

  const confirmarDeletarConta = async () => {
    setModalApagarContaAberto(false);
    try {
      await fetchComToken("/usuarios/me", { method: "DELETE" });
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("layout.erroApagarConta"),
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <p className="text-slate-600 text-sm sm:text-base font-medium animate-pulse">
          {t("layout.carregandoPainel")}
        </p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 gap-4 p-4 text-center">
        <p className="text-red-600 text-sm sm:text-base font-medium">
          {t("layout.erroOcorreu", { erro })}
        </p>
        <button
          onClick={recarregar}
          className="px-4 py-2 bg-slate-800 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
        >
          {t("comum.tentarNovamente")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* Sidebar com posicionamento dinâmico no mobile */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out ${
          sidebarFechada
            ? "-translate-x-full md:translate-x-0"
            : "translate-x-0"
        }`}
      >
        <Sidebar fechada={sidebarFechada} />
      </div>

      {/* Overlay transparente para fechar a sidebar ao clicar fora (Apenas Mobile) */}
      {!sidebarFechada && (
        <div
          onClick={() => setSidebarFechada(true)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Conteúdo Principal Flexível */}
      <div className="flex-1 flex flex-col min-w-0 w-full transition-all duration-300">
        <HeaderDashboard
          sidebarFechada={sidebarFechada}
          setSidebarFechada={setSidebarFechada}
          usuario={usuario}
          onDeletarConta={() => setModalApagarContaAberto(true)}
        />

        {/* Main com p-4 no Mobile e p-8 a partir de ecrãs médios (md) */}
        <main className="p-4 sm:p-6 md:p-8 flex-1 max-w-full overflow-x-hidden">
          <Outlet
            context={{
              usuario,
              ehAdmin,
              totalCategorias,
              totalSistemas,
              totalPlataformas,
              totalDocumentos,
              pendentesAprovacao,
              totalAprovados,
              documentosRecentes,
              atividades,
              recarregarDashboard: recarregar,
            }}
          />
        </main>
      </div>

      <ModalConfirmacao
        aberto={modalApagarContaAberto}
        titulo={t("layout.modalApagarConta.titulo")}
        mensagem={t("layout.modalApagarConta.mensagem")}
        textoConfirmar={t("layout.modalApagarConta.confirmar")}
        perigoso
        onConfirmar={confirmarDeletarConta}
        onCancelar={() => setModalApagarContaAberto(false)}
      />
    </div>
  );
}