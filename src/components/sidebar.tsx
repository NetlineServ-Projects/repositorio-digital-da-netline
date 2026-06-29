import React from 'react';

interface SidebarProps {
  abaAtiva: string;
  setAbaAtiva: (aba: string) => void;
}

export default function Sidebar({ abaAtiva, setAbaAtiva }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#092565] text-white flex flex-col justify-between p-4">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-blue-900">
          <span className="font-bold text-lg">Netline Serv</span>
        </div>

        {/* Links de Navegação */}
        <nav className="space-y-1">
          {/* Botão Meu Perfil */}
          <button
            onClick={() => setAbaAtiva('perfil')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition text-left ${
              abaAtiva === 'perfil' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-blue-900/50'
            }`}
          >
            <span>Meu Perfil</span>
          </button>
          
          {/* Botão Documentos */}
          <button
            onClick={() => setAbaAtiva('documentos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition text-left ${
              abaAtiva === 'documentos' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-blue-900/50'
            }`}
          >
            <span>Documentos</span>
          </button>

          {/* Botão Configurações */}
          <button
            onClick={() => setAbaAtiva('configuracoes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition text-left ${
              abaAtiva === 'configuracoes' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-blue-900/50'
            }`}
          >
            <span>Configurações</span>
          </button>
        </nav>
      </div>
      
      {/* Botão Sair */}
      <button className="text-red-400 p-4 text-left">Sair da Conta</button>
    </aside>
  );
}