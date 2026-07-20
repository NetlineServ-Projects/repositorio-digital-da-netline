import React, { useState } from "react";
import Button from "../components/button";
import Fundo1 from "../assets/fundo.jpg";
import { useForm, Watch } from "react-hook-form";
import logoNetline from "../assets/netline.jpg";
import axios from "axios";
import {
  IconOlhoAberto,
  IconOlhoFechado,
  IconUsuario,
  IconEmail,
  IconTelefone,
} from "../components/icons";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

type DadosDoForm = {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
};

export default function Cadastro() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<DadosDoForm>({ mode: "onChange" });

  const senhaAtual = watch("senha");

  const salvarCadastro = async (dados: DadosDoForm) => {
    try {
      const response = await api.post("/api/auth/register", dados);

      alert("Funcionário cadastrado com sucesso!");
      console.log(response.data);

      reset();
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message || "Erro ao cadastrar.");
      } else {
        alert("Erro ao conectar com o servidor.");
      }
    }
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat "
      style={{ backgroundImage: `url(${Fundo1})` }}
    >
      <div className="w-1/4 h-auto flex flex-col items-center justify-center bg-gray-50  rounded-2xl ">
        <form onSubmit={handleSubmit(salvarCadastro)}>
          <div className=" flex justify-center items-center mt-1">
            <img src={logoNetline} alt="Logotipo Netline" className="w-1/5 " />
          </div>
          <div className="flex flex-col gap-4 text-center mt-10">
            <h2 className="text-3xl text-shadow-mist-600 font-bold">
              <span>Repositorio Interno da Netline</span>
            </h2>
            <h1 className="font-bold text-2xl"> Faça o seu cadastro</h1>
          </div>
          <div>
            <p>Nome Completo</p>
            <div className="relative flex items-center w-full">
              <input
                type="text"
                placeholder="Elisa Cesario Nhamuanzo"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                {...register("nome", {
                  required: "Campo vazio.Preencha este campo!",
                })}
              />
              <IconUsuario className="absolute right-3 text-gray-600 cursor-pointer" />
            </div>

            {errors.nome && (
              <span className="text-red-500 text-sm">
                {errors.nome.message}
              </span>
            )}
          </div>

          <br />
          <div>
            <p>E-mail</p>
            <div className="relative flex items-center w-full">
              <input
                type="email"
                placeholder="Digite seu E-mail"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                {...register("email", {
                  required: "Campo vazio.Preencha este campo!",
                })}
              />
              <IconEmail className="absolute right-3 text-gray-600 cursor-pointer" />
            </div>
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <br />
          <div>
            <p>Número</p>
            <div className="relative flex items-center w-full" >
              <input
                type="tel"
                placeholder="(+258) 845-377-999"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                {...register("telefone", {
                  required: "Campo vazio.Preencha este campo!",
                })}
              />
              <IconTelefone className="absolute right-3 text-gray-600 cursor-pointer" />
            </div>
            {errors.telefone && (
              <span className="text-red-500 text-sm">
                {errors.telefone.message}
              </span>
            )}
          </div>
          <br />
          <div>
            <p>Senha</p>
            <div className="relative flex items-center w-full">
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Digite a sua senha"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                {...register("senha", {
                  required: "Campo vazio. Preencha este campo!",
                  minLength: {
                    value: 6,
                    message: "A senha deve ter pelo menos 6 caracteres!",
                  },
                })}
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

            {errors.senha && (
              <span className="text-red-500 text-sm">
                {errors.senha.message}
              </span>
            )}
          </div>
          <br />
          {/* <div>
            <p>Confirme a sua senha</p>
            <div className="relative flex items-center w-full">
              <input
                type={mostrarConfirmarSenha ? "text" : "password"}
                placeholder="Digite a sua senha novamente"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                {...register("confirmaSenha", {
                  required: "Por favor, confirme a sua senha!",
                  validate: (valorDoCampo) => {
                    return (
                      valorDoCampo === senhaAtual || "As senhas não coincidem!"
                    );
                  },
                })}
              />
              {mostrarConfirmarSenha ? (
                <IconOlhoAberto
                  onClick={() => setMostrarConfirmarSenha(false)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer "
                />
              ) : (
                <IconOlhoFechado
                  onClick={() => setMostrarConfirmarSenha(true)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                />
              )}
            </div>
            {errors.confirmaSenha && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.confirmaSenha.message}
              </span>
            )}
          </div> */}
          <br />

          <br></br>

          <div className="text-center">
            <Button
              title="Cadastrar"
              type="submit"
              onClickButton={() => {
                Cadastro;
              }}
            />
          </div>

          <div className="signup-link text-center mt-4 mb-15 ">
            <a href="./" className="text-blue-600">
              Voltar a pagina inicial
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
