import { useState } from "react";
import Button from "../components/button";
import Fundo1 from "../assets/fundo.jpg";
import logoNetline from "../assets/netline.jpg";
import {
  IconOlhoAberto,
  IconOlhoFechado,
  IconEmail,
} from "../components/icons";
import { API_URL } from "../utils/api";

export default function Autenticacao() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const corpo = await resposta.json();

      if (!resposta.ok) {
        throw new Error(corpo?.mensagem || "E-mail ou senha incorretos");
      }

      // A resposta vem como { sucesso, mensagem, data: { token, user } }
      const { token, user } = corpo.data;

      localStorage.setItem("token_sistema", token);
      localStorage.setItem("usuario_logado", JSON.stringify(user));

      window.location.href = "/dashboard";
    } catch (err: any) {
      setErro(err.message || "Ocorreu um erro ao tentar entrar.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      <div
        className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 text-white bg-cover bg-center relative"
        style={{ backgroundImage: `url(${Fundo1})` }}
      >
        <div className="absolute inset-0 bg-blue-950/85 backdrop-blur-sm"></div>

        <div className="relative z-10 text-center max-w-xl">
          <h2 className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-2">
            Netline Serv
          </h2>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Ligar Pessoas, Partilhar Conhecimento.
          </h1>
          <p className="text-lg opacity-90 leading-relaxed">
            Bem-vindo ao Repositório Interno da Netline. Este é o seu portal
            centralizado para aceder a documentos técnicos, recursos partilhados e
            ferramentas exclusivas. Autentique-se para aceder ao sistema com
            segurança.
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 md:p-12">
        <div className="w-full max-w-md p-10 bg-white border border-gray-100 rounded-2xl shadow-lg transition-all">
          <div className="flex flex-col items-center mb-8">
            <img
              src={logoNetline}
              alt="Logotipo Netline"
              className="h-16 w-auto object-contain mb-5 rounded-lg"
            />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-700 mb-1">
              Painel de Acesso
            </h2>
            <h1 className="text-2xl font-bold text-gray-800">
              Aceda à Sua Conta
            </h1>
          </div>

          <form onSubmit={entrar} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                E-mail Profissional
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  placeholder="nome@netline.co.mz"
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <IconEmail className="absolute right-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Palavra-passe
              </label>
              <div className="relative flex items-center">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {mostrarSenha ? (
                    <IconOlhoAberto className="w-5 h-5" />
                  ) : (
                    <IconOlhoFechado className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {erro && (
              <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg text-center font-medium animate-fade-in">
                {erro}
              </div>
            )}

            <div className="pt-3">
              <Button
                title={carregando ? "A processar..." : "Entrar"}
                type="submit"
                disabled={carregando}
              />
            </div>
          </form>

          <p className="text-xs text-center text-gray-400 mt-10">
            © {new Date().getFullYear()} Netline.Serv,Lda. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}