import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Perfil from "../components/Perfil";
import Configuracoes from "../components/Configuracoes";
import Documentos from "../components/Documentos";
import Categorias from "../components/Categorias";
import Lixeira from "../components/Lixeira";
import Aprovacoes from "../components/Aprovacoes";
import { IconDocumento } from "../components/icons";

interface UsuarioData {
  nome: string;
  totalDocumentos: number;
  pendentesAprovacao: number;
  categorias: number;
  totalSistema: number;
  totalAprovado: number;
}

export default function Dashboard() {
  const [abaAtiva, setAbaAtiva] = useState<string>("dashboard");
  const [usuario, setUsuario] = useState<UsuarioData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscarDadosDaAPI = async () => {
    setLoading(true);
    setErro(null);

    try {
      const token = localStorage.getItem("token_sistema");

      const resposta = await fetch("http://localhost:3000/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resposta.ok) {
        throw new Error("Não foi possível carregar os dados do usuário.");
      }

      const dados: UsuarioData = await resposta.json();
      setUsuario(dados);
    } catch (error) {
      console.error("Erro na requisição:", error);
      const mensagem =
        error instanceof Error
          ? error.message
          : "Erro ao conectar com o servidor.";
      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarDadosDaAPI();
  }, []);

  const handleDeletarConta = async () => {
    const confirmarExclusao = window.confirm(
      "Atenção: Tem certeza que deseja encerrar a sessão e APAGAR permanentemente a sua conta?",
    );

    if (!confirmarExclusao) return;

    try {
      const token = localStorage.getItem("token_sistema");

      if (!token) {
        alert("Sessão não encontrada.");
        window.location.href = "/";
        return;
      }

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
        localStorage.clear();
        sessionStorage.clear();
        alert(dados.message || "Conta excluída com sucesso.");
        window.location.href = "/";
      } else {
        alert(dados.error || "Não foi possível eliminar a conta.");
      }
    } catch (error) {
      console.error("Erro ao eliminar conta:", error);
      alert("Erro ao conectar com o servidor para excluir a conta.");
    }
  };

  // Renderiza a aba correspondente no centro da tela
  const renderConteudoPrincipal = () => {
    switch (abaAtiva) {
      case "perfil":
        return <Perfil />;
      case "documentos":
        return <Documentos />;
      case "aprovacoes":
        return <Aprovacoes />;
      case "categorias":
        return <Categorias />;
      case "lixeira":
        return <Lixeira />;
      case "configuracoes":
        return <Configuracoes />;
      case "dashboard":
      default:
        return (
          <div className="space-y-6">
            <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Olá,{" "}
                <span className="font-semibold text-slate-800">
                  {usuario?.nome || "Usuário"}
                </span>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total de Documentos
                  </h4>
                  <p className="text-3xl font-extrabold text-slate-800 mt-1">
                    {usuario?.totalDocumentos ?? 10}
                  </p>
                </div>

                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/50 flex items-center justify-center">
                  <IconDocumento className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                  Pendentes de Aprovacao
                </h4>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {usuario?.pendentesAprovacao ?? 4}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                  Aprovados
                </h4>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {usuario?.totalAprovado ?? 0}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                  Total de Sistemas
                </h4>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {usuario?.totalSistema || "11"}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                  Categorias
                </h4>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {usuario?.categorias || "14"}
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600 font-medium animate-pulse">
          Carregando painel...
        </p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 gap-4">
        <p className="text-red-600 font-medium">Ocorreu um erro: {erro}</p>
        <button
          onClick={buscarDadosDaAPI}
          className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
        onDeletarConta={handleDeletarConta}
      />
      <main className="flex-1 p-8">{renderConteudoPrincipal()}</main>
    </div>
  );
}
