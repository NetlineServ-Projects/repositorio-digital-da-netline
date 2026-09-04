import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Home from "./pages/home/home";
import Autenticacao from "./pages/auth/autenticacao";
import Dashboard from "./pages/dashboard";
import DashboardHome from "./pages/dashboardHome";
import Documentos from "./pages/documentos/page";
import DocumentoDetalhesPage from "./pages/documentos/details/page";
import Categorias from "./pages/categorias/page";
import Usuarios from "./pages/admin/usuarios/page";
import Perfil from "./pages/perfil/page";
import ConfiguracoesPage from "./pages/configuracoes/configuracoesPage";
import Lixeira from "./pages/admin/lixeira/page";
import AprovacoesPage from "./pages/admin/aprovacoes/page";
import AprovacaoDetalhesPage from "./pages/admin/aprovacoes/details/page";
import AprovacaoEditPage from "./pages/admin/aprovacoes/edit/page";
import { UsuarioProvider, useUsuario } from "./components/usuarioContext";
import SistemasPage from "./pages/sistemas/page";
import { Toaster } from "sonner";
import NovoDocumentoPage from "./pages/documentos/new/page";
import EditarDocumentoPage from "./pages/documentos/[id]/editar/page";
import EditarSistemaPage from "./pages/sistemas/editar/page";

function RotaProtegida({ children }: { children: React.ReactNode }) {
  const { usuarioLogado } = useUsuario();
  if (!usuarioLogado) return <Navigate to="/autenticacao" replace />;
  return <>{children}</>;
}

function RotaAdmin({ children }: { children: React.ReactNode }) {
  const { usuarioLogado } = useUsuario();
  if (!usuarioLogado) return <Navigate to="/autenticacao" replace />;
  if (usuarioLogado.perfil !== "ADMIN")
    return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <UsuarioProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/autenticacao" element={<Autenticacao />} />

          <Route
            path="/dashboard"
            element={
              <RotaProtegida>
                <Dashboard />
              </RotaProtegida>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="documentos" element={<Documentos />} />
            <Route path="documentos/:id" element={<DocumentoDetalhesPage />} />
            <Route path="documentos/new" element={<NovoDocumentoPage />} />
            <Route
              path="documentos/:id/editar"
              element={<EditarDocumentoPage />}
            />
            <Route path="categorias" element={<Categorias />} />
            <Route path="sistemas" element={<SistemasPage />} />
            <Route
              path="admin"
              element={
                <RotaAdmin>
                  <Outlet />
                </RotaAdmin>
              }
            ></Route>
            <Route path="aprovacoes" element={<AprovacoesPage />} />
            <Route
              path="aprovacoes/details/:id"
              element={<AprovacaoDetalhesPage />}
            />
            <Route path="aprovacoes/edit/:id" element={<AprovacaoEditPage />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="lixeira" element={<Lixeira />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="sistemas" element={<SistemasPage />} />
            <Route path="sistemas/:id" element={<SistemasPage />} />
            <Route path="sistemas/:id/editar" element={<EditarSistemaPage />} />
            <Route path="configuracoes" element={<ConfiguracoesPage />} />
          </Route>
        </Routes>
      </UsuarioProvider>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}

export default App;
