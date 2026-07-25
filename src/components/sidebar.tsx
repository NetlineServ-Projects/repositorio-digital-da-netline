import React from "react";
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
  fechada?: boolean; // prop de controle enviada pelo Dashboard
}

interface ItemMenu {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SeccaoMenu {
  titulo?: string;
  itens: ItemMenu[];
}

export default function Sidebar({
  abaAtiva,
  setAbaAtiva,
  onDeletarConta,
  fechada = false, // Padrão é visível/aberta
}: SidebarProps) {
  const lidarComLogout = () => {
    localStorage.removeItem("token_sistema");
    localStorage.removeItem("usuario_logado");
    window.location.href = "./";
  };

  const seccoesMenu: SeccaoMenu[] = [
    {
      titulo: "PRINCIPAL",
      itens: [
        { id: "dashboard", label: "Dashboard", icon: <IconHome /> },
        { id: "documentos", label: "Documentos", icon: <IconDocumento /> },
        { id: "categorias", label: "Categorias", icon: <IconPasta /> },
        { id: "aprovacoes", label: "Aprovações", icon: <IconBarras /> },
        { id: "lixeira", label: "Lixeira", icon: <IconLixeira /> },
      ],
    },
    {
      titulo: "SISTEMAS DA NETLINE",
      itens: [
        { id: "sistemas", label: "Sistemas Desenvolvidos", icon: <IconSistemas /> },
      ],
    },
    {
      titulo: "CONFIGURAÇÕES",
      itens: [
        { id: "perfil", label: "Meu Perfil", icon: <IconUsuario /> },
        { id: "usuarios", label: "Usuários", icon: <IconUsuarios /> },
        { id: "configuracoes", label: "Configurações", icon: <IconConfig /> },
      ],
    },
  ];

  return (
    <aside
      className={`bg-[#092565] text-white flex flex-col justify-between p-4 min-h-screen select-none shadow-lg transition-all duration-300 ${
        fechada ? "w-20" : "w-64"
      }`}
    >
      <div>
        {/* Logo e Cabeçalho */}
        <div
          className={`flex items-center gap-3 font-bold text-xl tracking-wide border-b border-blue-900/60 pb-4 mb-6 ${
            fechada ? "justify-center" : ""
          }`}
        >
          <img
            src={logoNetline}
            alt="Logo Netline"
            className="w-8 h-8 rounded object-cover shadow-sm shrink-0"
          />
          {!fechada && <span className="text-white truncate">Netline Serv</span>}
        </div>

        {/* Navegação Principal */}
        <nav className="space-y-6">
          {seccoesMenu.map((seccao, idx) => (
            <div key={idx} className="space-y-2">
              {seccao.titulo && !fechada && (
                <p className="px-3 text-xs font-bold text-slate-400 tracking-wider uppercase transition-all">
                  {seccao.titulo}
                </p>
              )}
              <ul className="space-y-1">
                {seccao.itens.map((item) => {
                  const isAtivo = abaAtiva === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setAbaAtiva(item.id)}
                        title={fechada ? item.label : undefined}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left relative cursor-pointer ${
                          fechada ? "justify-center" : ""
                        } ${
                          isAtivo
                            ? "bg-white/15 text-white font-semibold border border-white/10 shadow-sm backdrop-blur-sm"
                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {/* Indicador lateral no item ativo */}
                        {isAtivo && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-400 rounded-r-md" />
                        )}
                        <span className="text-lg shrink-0">{item.icon}</span>
                        {!fechada && <span className="truncate">{item.label}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Rodapé / Ações de Sessão */}
      <div className="pt-4 border-t border-blue-900/60 flex flex-col gap-1">
        <button
          type="button"
          onClick={lidarComLogout}
          title={fechada ? "Sair da Conta" : undefined}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium text-left cursor-pointer ${
            fechada ? "justify-center" : ""
          }`}
        >
          <span className="text-lg shrink-0">
            <IconLogout />
          </span>
          {!fechada && <span>Sair da Conta</span>}
        </button>

        {onDeletarConta && (
          <button
            type="button"
            onClick={onDeletarConta}
            title={fechada ? "Terminar Sessão" : undefined}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors text-sm font-medium text-left cursor-pointer ${
              fechada ? "justify-center" : ""
            }`}
          >
            <span className="text-lg shrink-0">
              <IconTerminarSeccao />
            </span>
            {!fechada && <span>Terminar Sessão</span>}
          </button>
        )}
      </div>
    </aside>
  );
}