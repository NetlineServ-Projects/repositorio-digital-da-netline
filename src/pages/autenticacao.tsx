import Button from "../components/button";
import Fundo1 from "../assets/fundo.jpg";
import logoNetline from "../assets/netline.jpg";
import {  useState} from "react";
//import { useUsuario } from "../components/UsuarioContext";

import {
  IconOlhoAberto,
  IconOlhoFechado,
  IconEmail,
} from "../components/icons";

export default function autenticacao() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(""); // Estado para guardar mensagens de erro do backend
  const [carregando, setCarregando] = useState(false); // Estado para controlar o clique duplo no botão
  const [mostrarSenha, setMostrarSenha] = useState(false);
  //const {fazerLogin} = useUsuario();  //puxa a funcao do contextp

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue ao enviar o formulário

    setErro("");
    setCarregando(true);

    try {
      // Faz o pedido para o backend
      const resposta = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email:email , senha: senha }),
      });
     console.log("resposta", resposta);

      const dados = await resposta.json();
      console.log("dados", dados);

      if (!resposta.ok) {
        // Se o backend retornar erro (ex: res.status(401)), joga para o catch
        throw new Error(dados?.erro ||dados?.message ||dados?.mensagem|| "Email ou senha incorrectos");
      }

      // SE DEU CERTO: Guarda o token recebido no localStorage do navegador
      localStorage.setItem("token_sistema", dados.token);
      localStorage.setItem("usuario_logado", JSON.stringify(dados.user));


     // Passamos o nome que veio lá de dentro do 'dados.funcionario' (ex: dados.funcionario.name)
      // fazerLogin(dados.funcionario.name || dados.funcionario.nome);

      alert("Autenticação bem-sucedida!");

      // Redireciona o utilizador para a página principal/home
      window.location.href = "/dashboard";
    } catch (err: any) {
      // Guarda a mensagem de erro que veio do backend ("E-mail ou senha incorretos")
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat "
      style={{ backgroundImage: `url(${Fundo1})` }}
    >
      <div className="w-1/4 h-2/4 flex flex-col items-center justify-center bg-gray-50 rounded-2xl">
        <form onSubmit={entrar}>
          <div className=" flex justify-center items-center">
            <img src={logoNetline} alt="Logotipo Netline" className="w-1/5 " />
          </div>
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-3xl text-shadow-mist-600 font-bold">
              <span>Repositorio Interno da Netline</span>
            </h2>
            <h1 className="text-2xl font-bold"> Acesse o sistema</h1>
          </div>

          <div>
            <p>E-mail</p>
            <div className="relative flex items-center w-full">
              <input
                type="email"
                placeholder="Digite seu E-mail"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={email} //garante que esta ligado ao useState
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <IconEmail className="absolute right-3 text-gray-600 " />
            </div>
          </div>
          <div>
            <p>Senha</p>
            <div className="relative flex items-center w-full">
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Digite a sua senha"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />

              {mostrarSenha ? (
                <IconOlhoAberto
                  onClick={() => setMostrarSenha(false)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer "
                />
              ) : (
                <IconOlhoFechado
                  onClick={() => setMostrarSenha(true)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                />
              )}
            </div>
          </div>
          {erro && (
            <div className="text-red-600 text-sm font-semibold text-center mt-2">
              {erro}
            </div>
          )}
          <br></br>

          <div className="text-center">
            <Button
             title={carregando? "a carregar..." : "Entrar"} 
             type="submit"
             disabled={carregando}
            />
          </div>

          <div className="signup-link text-center mt-4">
            <p className="text-gray-600">Não tem uma conta?</p>
            <a href="./cadastro" className="text-blue-700">
              Regista-te
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
