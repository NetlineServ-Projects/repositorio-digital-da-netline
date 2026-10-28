import React, { createContext, useState, useContext } from "react";
import { limparTema } from "../utils/tema";
import { limparSessaoLocal, terminarSessaoNoServidor } from "../utils/api";

interface Usuario {
  name: string;
  perfil: "ADMIN" | "FUNCIONARIO"; // confirma o nome exato do campo no backend
}

interface UsuarioContextType {
  usuarioLogado: Usuario | null;
  fazerLogin: (usuario: Usuario) => void;
  fazerLogout: () => Promise<void>;
}

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

export function UsuarioProvider({ children }: { children: React.ReactNode }) {
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(() => {
    // A versão antiga guardava o token aqui; com o cookie HttpOnly deixa de fazer sentido
    localStorage.removeItem("token_sistema");
    localStorage.removeItem("token");
    const dadosSalvos = localStorage.getItem("usuario_logado");

    if (dadosSalvos && dadosSalvos !== "undefined" && dadosSalvos !== "null") {
      try {
        const dados = JSON.parse(dadosSalvos);
        return { name: dados.name || dados.nome, perfil: dados.perfil };
      } catch (e) {
        console.error("Erro ao converter JSON:", e);
        return null;
      }
    }
    return null;
  });

  const fazerLogin = (usuario: Usuario) => {
    setUsuarioLogado(usuario);
  };

  const fazerLogout = async () => {
    await terminarSessaoNoServidor(); // só o backend consegue apagar o cookie HttpOnly
    limparSessaoLocal();
    limparTema();
    setUsuarioLogado(null);
    window.location.href = "/";
  };

  return (
    <UsuarioContext.Provider value={{ usuarioLogado, fazerLogin, fazerLogout }}>
      {children}
    </UsuarioContext.Provider>
  );
}

export function useUsuario() {
  const context = useContext(UsuarioContext);
  if (!context) {
    throw new Error("useUsuario deve ser usado dentro de um UsuarioProvider");
  }
  return context;
}