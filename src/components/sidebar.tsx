import React from "react";
import { NavLink } from "react-router-dom";
import { useUsuario } from "./usuarioContext";
import logoNetline from "../assets/netline.jpg";
import {
  IconHome, IconDocumento, IconConfig, IconPasta,
  IconLixeira, IconBarras, IconSistemas, IconUsuarios,
} from "../components/icons";

interface SidebarProps {
  fechada?: boolean;
}

interface ItemMenu {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface SeccaoMenu {
  titulo?: string;
  itens: ItemMenu[];
}

export default function Sidebar({ fechada = false }: SidebarProps) {
  const { usuarioLogado } = useUsuario();
  const ehAdmin = usuarioLogado?.perfil === "ADMIN";

  const seccoesMenu: SeccaoMenu[] = [
    {
      titulo: "PRINCIPAL",
      itens: [
        { path: "/dashboard", label: "Dashboard", icon: <IconHome /> },
        { path: "/dashboard/documentos", label: "Documentos", icon: <IconDocumento /> },
        { path: "/dashboard/categorias", label: "Categorias", icon: <IconPasta /> },
        ...(ehAdmin ? [{ path: "/dashboard/aprovacoes", label: "Aprovações", icon: <IconBarras /> }] : []),
        ...(ehAdmin ? [{ path: "/dashboard/lixeira", label: "Lixeira", icon: <IconLixeira /> }] : []),
      ],
    },
    {
      titulo: "SISTEMAS DA NETLINE",
      itens: [{ path: "/dashboard/sistemas", label: "Sistemas Desenvolvidos", icon: <IconSistemas /> }],
    },
    {
      titulo: "CONFIGURAÇÕES",
      itens: [
        ...(ehAdmin ? [{ path: "/dashboard/usuarios", label: "Usuários", icon: <IconUsuarios /> }] : []),
        { path: "/dashboard/configuracoes", label: "Configurações", icon: <IconConfig /> },
      ],
    },
  ];

  return (
    <aside
      className={`bg-[#092565] text-white flex flex-col p-4 min-h-screen select-none shadow-lg transition-all duration-300 ${
        fechada ? "w-20" : "w-64"
      }`}
    >
      <div className={`flex items-center gap-3 font-bold text-xl tracking-wide border-b border-blue-900/60 pb-4 mb-6 ${fechada ? "justify-center" : ""}`}>
        <img src={logoNetline} alt="Logo Netline" className="w-8 h-8 rounded object-cover shadow-sm shrink-0" />
        {!fechada && <span className="text-white truncate">Netline Serv</span>}
      </div>

      <nav className="space-y-6">
        {seccoesMenu.map((seccao, idx) => (
          <div key={idx} className="space-y-2">
            {seccao.titulo && !fechada && (
              <p className="px-3 text-xs font-bold text-slate-400 tracking-wider uppercase transition-all">
                {seccao.titulo}
              </p>
            )}
            <ul className="space-y-1">
              {seccao.itens.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/dashboard"}
                    title={fechada ? item.label : undefined}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left relative ${
                        fechada ? "justify-center" : ""
                      } ${
                        isActive
                          ? "bg-white/15 text-white font-semibold border border-white/10 shadow-sm backdrop-blur-sm"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-400 rounded-r-md" />
                        )}
                        <span className="text-lg shrink-0">{item.icon}</span>
                        {!fechada && <span className="truncate">{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}