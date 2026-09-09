import React, { useState } from "react";
import logoNetline from "../assets/netline.jpg";
import { Link } from "react-router-dom";

interface HeaderProps {
  onPlanosClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onPlanosClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-xs border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo Container */}
          <div className="flex items-center gap-2.5 text-xl sm:text-2xl font-bold">
            <img
              src={logoNetline}
              alt="Logotipo Netline"
              className="h-8 sm:h-10 w-auto block object-contain"
            />
            <span className="text-slate-800">
              Net<span className="text-blue-600">line Serv</span>
            </span>
          </div>

          {/* Navegação Desktop (Escondida no Mobile) */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#inicio"
              className="text-slate-600 font-medium text-sm lg:text-base hover:text-blue-600 transition-colors"
            >
              Início
            </a>
            <a
              href="#sobrenos"
              className="text-slate-600 font-medium text-sm lg:text-base hover:text-blue-600 transition-colors"
            >
              Sobre a plataforma
            </a>
            <a
              href="#suporte"
              className="text-slate-600 font-medium text-sm lg:text-base hover:text-blue-600 transition-colors"
            >
              Suporte
            </a>
          </nav>

          {/* Botão Desktop */}
          <div className="hidden md:flex items-center">
            <Link
              to="/autenticacao"
              className="bg-blue-900 text-white px-5 py-2.5 rounded-md font-semibold text-sm hover:bg-blue-800 transition-all shadow-xs"
            >
              Iniciar secção
            </Link>
          </div>

          {/* Botão Hambúrguer (Visível apenas no Mobile) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              type="button"
              className="p-2 rounded-md text-slate-700 hover:text-blue-600 hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Abrir menu"
            >
              {isMenuOpen ? (
                /* Ícone Fechar (X) */
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                /* Ícone Hambúrguer */
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Dropdown do Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <a
            href="#inicio"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
          >
            Início
          </a>
          <a
            href="#sobrenos"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
          >
            Sobre a plataforma
          </a>
          <a
            href="#suporte"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
          >
            Suporte
          </a>
          <div className="pt-2">
            <Link
              to="/autenticacao"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-center bg-blue-900 text-white px-4 py-2.5 rounded-md font-semibold text-sm hover:bg-blue-800 transition-all"
            >
              Iniciar secção
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;