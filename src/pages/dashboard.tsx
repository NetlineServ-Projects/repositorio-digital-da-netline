import React from "react";
import { useState, useEffect } from "react";
import logoNetline from "../assets/netline.jpg";
import { IconUsuario, IconLogout,IconTerminarSeccao } from "../components/icons";
import Perfil from "../components/Perfil";
import Configuracoes from "../components/configuracoes";
import Documentos from "../components/documentos";

interface UsuarioData {
  nome: string;
  totalArquivos: number;
  espacoUsado: string;
  ultimoUpload: string;
}

export default function Dashboard() {
  const [abaAtiva, setAbaAtiva] = useState<string>("documentos");
  const [usuario, setUsuario] = useState<UsuarioData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const buscarDadosDaAPI = async () => {
      try {
        // Se você usa tokens (JWT), recupere-o aqui (ex: salvo no login)
        const token = localStorage.getItem("token_sistema");

        // Substitua pela URL real da sua rota de perfil/dashboard
        const resposta = await fetch("http://localhost:3000/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Se a sua API exigir autenticação, descomente a linha abaixo:
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar os dados do usuário.");
        }

        const dados: UsuarioData = await resposta.json();

        // 2. Atualiza o estado -> Isso força o React a renderizar a tela com os dados novos
        setUsuario(dados);
      } catch (error: any) {
        console.error("Erro na requisição:", error);
        setErro(error.message || "Erro ao conectar com o servidor.");
      } finally {
        setLoading(false);
      }
    };

    buscarDadosDaAPI();
  }, []); // Array vazio garante que rode apenas uma vez ao abrir a página

  const lidarComLogout = () => {
    localStorage.removeItem("token_sistema");
    localStorage.removeItem("usuario_logado");
    window.location.href = "./"; // Redireciona para o login
  };
  const terminarSeccao = async () => {
    // 1. Confirmação de segurança (essencial já que vai apagar do banco de dados)
    const confirmarExclusao = window.confirm(
      "Atenção: Tem certeza que deseja encerrar a sessão e APAGAR permanentemente a sua conta?",
    );

    if (!confirmarExclusao) return;

    try {
      // Pega o token correto que você já está usando no useEffect
      const token = localStorage.getItem("token_sistema");

      if (!token) {
        alert("Sessão não encontrada. Redirecionando...");
        window.location.href = "./";
        return;
      }

      // 2. Faz a chamada HTTP DELETE para o seu backend Node.js
      const resposta = await fetch(
        "http://localhost:3000/api/auth/delete-current",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const dados = await resposta.json();

      if (resposta.ok) {
        // 3. Limpa o armazenamento local apenas após o banco deletar com sucesso
        localStorage.removeItem("token_sistema");
        localStorage.removeItem("usuario_logado");
        sessionStorage.clear();

        alert(
          dados.message || "Conta excluída e sessão encerrada com sucesso.",
        );
        window.location.href = "./"; // Redireciona para o login
      } else {
        alert(dados.error || "Não foi possível eliminar a conta do servidor.");
      }
    } catch (error) {
      console.error("Erro ao tentar eliminar conta:", error);
      alert("Erro ao conectar com o servidor para excluir a conta.");
    }
  };

  // Tela de carregamento
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600 font-medium animate-pulse">
          Carregando painel...
        </p>
      </div>
    );
  }

  // Tela de erro caso a API falhe
  if (erro) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-red-600 font-medium">Ocorreu um erro: {erro}</p>
      </div>
    );
  }

  const renderConteudoPrincipal = () => {
    switch (abaAtiva) {
      case "perfil":
        return <Perfil />;
      case "configuracoes":
        return <Configuracoes />;
      case "documentos":
      default:
        return <Documentos />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Barra Lateral / Sidebar */}
      <aside className="w-64 bg-[#062869] text-white p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2 font-bold text-xl tracking-wide border-b border-slate-800 pb-4">
          <img src={logoNetline} className="w-1/4 " />
          <span>Netline Serv</span>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setAbaAtiva("perfil")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left font-medium ${
                  abaAtiva === "perfil"
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <IconUsuario /> Meu Perfil
              </button>
            </li>
            <li>
              <button
                onClick={() => setAbaAtiva("documentos")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left font-medium ${
                  abaAtiva === "documentos"
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Documentos
              </button>
            </li>
            <li>
              <button
                onClick={() => setAbaAtiva("config")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left font-medium ${
                  abaAtiva === "config"
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Configurações
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-auto flex flex-col gap-1">
          <button
            onClick={lidarComLogout}
            className=" flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors font-medium text-left"
          >
            <IconLogout />
            Sair da Conta
          </button>
          <button
            onClick={terminarSeccao}
            className=" flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors font-medium text-left"
          >
            <IconTerminarSeccao/>
            Terminar Secção
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800">
            Painel Principal
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Olá,{" "}
            <span className="font-semibold text-slate-800">
              {usuario?.nome || "Usuário"}
            </span>
          </div>
        </header>

        {/* Cards Informativos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Total de Arquivos
            </h4>
            <p className="text-3xl font-bold text-slate-800 mt-2">
              {usuario?.totalArquivos ?? 0}
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Espaço Usado
            </h4>
            <p className="text-3xl font-bold text-slate-800 mt-2">
              {usuario?.espacoUsado || "0 GB"}
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Último Upload
            </h4>
            <p className="text-lg font-semibold text-slate-700 mt-3">
              {usuario?.ultimoUpload || "Sem uploads"}
            </p>
          </div>
        </div>
        <div className="mt-4">{renderConteudoPrincipal()}</div>
      </main>
    </div>
  );
}
