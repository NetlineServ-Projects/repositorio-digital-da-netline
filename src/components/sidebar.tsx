import React from "react";
import { useState, useEffect } from "react";
import logoNetline from "../assets/netline.jpg";
import {
  IconUsuario,
  IconLogout,
  IconTerminarSeccao,
  IconHome,
  IconDocumento,
  IconConfig,
  IconPasta,
  IconLixeira,
  IconBarras,
  IconSistemas,
  IconUsuarios,
} from "../components/icons";

interface SidebarProps {
  abaAtiva: string;
  setAbaAtiva: (aba: string) => void;
  onDeletarConta?: () => void;
}

export default function Sidebar({
  abaAtiva,
  setAbaAtiva,
  onDeletarConta,
}: SidebarProps) {
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
  };

  // Função auxiliar para evitar repetição de classes Tailwind
  const getClassBotao = (nomeAba: string) =>
    `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left font-medium ${
      abaAtiva === nomeAba
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="w-64 bg-[#092565] text-white flex flex-col justify-between p-4 min-h-screen">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 font-bold text-xl tracking-wide border-b border-blue-900/50 pb-4 mb-6">
          <img
            src={logoNetline}
            alt="Logo Netline"
            className="w-8 h-8 rounded"
          />
          <span>Netline Serv</span>
        </div>

        {/* Menu de Navegação */}
        <nav>
          <p className=" text-gray-400 text-xs from-neutral-800 mb-1.5">
            PRINCIPAL
          </p>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setAbaAtiva("dashboard")}
                className={getClassBotao("dashboard")}
              >
                <IconHome /> Dashboard
              </button>
            </li>

            <li>
              <button
                onClick={() => setAbaAtiva("documentos")}
                className={getClassBotao("documentos")}
              >
                <IconDocumento /> Documentos
              </button>
            </li>

            <li>
              <button
                onClick={() => setAbaAtiva("categorias")}
                className={getClassBotao("categorias")}
              >
                <IconPasta /> Categorias
              </button>
            </li>
            <li>
              <button
                onClick={() => setAbaAtiva("aprovacoes")}
                className={getClassBotao("aprovacoes")}
              >
                <IconBarras /> Aprovações
              </button>
            </li>
            <li>
              <button
                onClick={() => setAbaAtiva("lixeira")}
                className={getClassBotao("lixeira")}
              >
                <IconLixeira /> Lixeira
              </button>
            </li>
            <p className=" text-gray-400 text-xs from-neutral-800 mb-1.5">
              SISTEMAS DA NETLINE{" "}
            </p>
            <li>
              <button
                onClick={() => setAbaAtiva("sistemas")}
                className={getClassBotao("sistemas")}
              >
                <IconSistemas /> Sistemas Desenvolvidos
              </button>
            </li>

            <p className=" text-gray-400 text-xs from-neutral-800 mb-1.5">
              CONFIGURAÇÕES{" "}
            </p>
            <li>
              <button
                onClick={() => setAbaAtiva("perfil")}
                className={getClassBotao("perfil")}
              >
                <IconUsuario /> Meu Perfil
              </button>
            </li>
             <li>
              <button
                onClick={() => setAbaAtiva("usuarios")}
                className={getClassBotao("usuarios")}
              >
                <IconUsuarios /> Usuários
              </button>
            </li>
            <li>
              <button
                onClick={() => setAbaAtiva("configuracoes")}
                className={getClassBotao("configuracoes")}
              >
                <IconConfig /> Configurações
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Ações de Sessão/Conta */}
      <div className="mt-auto pt-4 border-t border-blue-900/50 flex flex-col gap-1">
        <button
          onClick={lidarComLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium text-left"
        >
          <IconLogout /> Sair da Conta
        </button>

        {onDeletarConta && (
          <button
            onClick={onDeletarConta}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors font-medium text-left"
          >
            <IconTerminarSeccao /> Terminar Sessão
          </button>
        )}
      </div>
    </aside>
  );
}
