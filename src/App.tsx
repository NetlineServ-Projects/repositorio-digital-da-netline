import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Autenticacao from "./pages/autenticacao";
import Cadastro from "./pages/cadastro";
import Dashboard from "./pages/dashboard";
import { UsuarioProvider } from "./components/UsuarioContext";

function App() {
  return (
    <BrowserRouter>
      <UsuarioProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/autenticacao" element={<Autenticacao />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </UsuarioProvider>
    </BrowserRouter>
  );
}

export default App;
