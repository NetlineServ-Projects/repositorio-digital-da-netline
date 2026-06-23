

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";       
import Autenticacao from "./pages/autenticacao"
import Cadastro from "./pages/cadastro"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/autenticacao" element={<Autenticacao/>} />
        <Route path="/cadastro" element={<Cadastro />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;