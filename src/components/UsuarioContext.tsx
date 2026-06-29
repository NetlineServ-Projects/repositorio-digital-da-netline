import React, { createContext, useState, useContext } from "react";

// 1. Definimos o que é um Usuário (A regra do TypeScript)
interface Usuario {
  name: string;
}

// 2. Definimos o que a nossa "Central" vai guardar e oferecer para os componentes
interface UsuarioContextType {
  usuarioLogado: Usuario | null;
  fazerLogin: (nomeDoUsuario: string) => void;
}

// 3. Criamos a central (Contexto)
const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

// 4. Criamos o "Provedor" (O componente que vai envelopar o nosso site)
export function UsuarioProvider({ children }: { children: React.ReactNode }) {
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(() => {
    const dadosSalvos = localStorage.getItem("usuario_logado");

    if (dadosSalvos && dadosSalvos !== "undefined" && dadosSalvos !== "null") {
      try {
        const funcionario = JSON.parse(dadosSalvos);
        return { name: funcionario.name || funcionario.nome };
      } catch (e) {
        console.error("Erro ao converter JSON:", e);
        return null;
      }
    }
    return null;
  });
  const fazerLogin = (nomeDoUsuario: string) => {
    setUsuarioLogado({ name: nomeDoUsuario });
  };

  return (
    <UsuarioContext.Provider value={{ usuarioLogado, fazerLogin }}>
      {children}
    </UsuarioContext.Provider>
  );
}

// 5. Criamos um gancho (Hook) para ficar muito fácil usar isso depois nos componentes
export function useUsuario() {
  const context = useContext(UsuarioContext);
  if (!context) {
    throw new Error("useUsuario deve ser usado dentro de um UsuarioProvider");
  }
  return context;
}
