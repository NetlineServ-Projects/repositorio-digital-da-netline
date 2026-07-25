import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import HeaderDashboard from "../components/HeaderDashboard"; // Importação do componente externo
import Perfil from "../components/Perfil";
import Configuracoes from "../components/Configuracoes";
import Documentos from "../components/Documentos";
import Categorias from "../components/Categorias";
import Lixeira from "../components/Lixeira";
import Aprovacoes from "../components/Aprovacoes";
import Sistemas from "../components/Sistemas";
import Usuarios from "../components/Usuarios";
import {
  IconDocumento,
  IconRelogio,
  IconAprovado,
  IconSistemas,
  IconPasta,
} from "../components/icons";

// Interfaces de dados reais
interface UsuarioData {
  nome: string;
  email?: string;
}

interface Documento {
  id: string | number;
  titulo?: string;
  nome?: string;
  autor?: string;
  usuario?: { nome: string };
  createdAt?: string;
  dataUpload?: string;
  status?: "Pendente" | "Aprovado" | "Rejeitado" | string;
  categoria?: { nome: string };
  categoriaNome?: string;
}

interface Atividade {
  id: string;
  usuario: string;
  acao: string;
  alvo: string;
  tempo: string;
}

// --- COMPONENTE PRINCIPAL ---
export default function Dashboard() {
  const [abaAtiva, setAbaAtiva] = useState<string>("dashboard");
  const [sidebarFechada, setSidebarFechada] = useState<boolean>(false);
  const [usuario, setUsuario] = useState<UsuarioData | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [totalCategorias, setTotalCategorias] = useState<number>(0);
  const [totalSistemas, setTotalSistemas] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const [atividades] = useState<Atividade[]>([
    {
      id: "1",
      usuario: "Sistema Netline",
      acao: "repositório atualizado com sucesso",
      alvo: "Métricas da API",
      tempo: "Agora",
    },
  ]);

  const buscarDadosDaAPI = async () => {
    setLoading(true);
    setErro(null);

    try {
      const token =
        localStorage.getItem("token_sistema") || localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const [resAuth, resDocs, resCats, resSist] = await Promise.all([
        fetch("http://localhost:3000/api/auth/me", { headers }),
        fetch("http://localhost:3000/api/documentos", { headers }),
        fetch("http://localhost:3000/api/categorias", { headers }),
        fetch("http://localhost:3000/api/sistemas", { headers }).catch(
          () => null
        ),
      ]);

      if (resAuth && resAuth.ok) {
        const dadosAuth = await resAuth.json();
        setUsuario(dadosAuth);
      }

      if (resDocs && resDocs.ok) {
        const dadosDocs = await resDocs.json();
        setDocumentos(dadosDocs);
      }

      if (resCats && resCats.ok) {
        const dadosCats = await resCats.json();
        setTotalCategorias(dadosCats.length);
      }

      if (resSist && resSist.ok) {
        const dadosSist = await resSist.json();
        setTotalSistemas(dadosSist.length);
      }
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
      "Atenção: Tem certeza que deseja encerrar a sessão e APAGAR permanentemente a sua conta?"
    );

    if (!confirmarExclusao) return;

    try {
      const token =
        localStorage.getItem("token_sistema") || localStorage.getItem("token");

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
        }
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

  // Cálculos dinâmicos
  const totalDocumentos = documentos.length;
  const pendentesAprovacao = documentos.filter(
    (d) => d.status?.toLowerCase() === "pendente"
  ).length;
  const totalAprovados = documentos.filter(
    (d) => d.status?.toLowerCase() === "aprovado" || !d.status
  ).length;

  const documentosRecentes = [...documentos].reverse().slice(0, 5);

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
      case "sistemas":
        return <Sistemas />;
      case "usuarios":
        return <Usuarios />;
      case "lixeira":
        return <Lixeira />;
      case "configuracoes":
        return <Configuracoes />;
      case "dashboard":
      default:
        return (
          <div className="space-y-6">
            {/* Banner Destaque (Hero) em tom Azul Netline */}
            <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
                  Repositório Digital
                </span>
                <h2 className="text-2xl font-bold mt-1">
                  Explore os Documentos da Netline
                </h2>
                <p className="text-xs text-blue-100 mt-1">
                  {totalDocumentos} documentos disponíveis · {totalSistemas}{" "}
                  sistemas integrados
                </p>
              </div>

              <button
                onClick={() => setAbaAtiva("documentos")}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-white transition-colors flex items-center gap-2 backdrop-blur-xs cursor-pointer"
              >
                <IconDocumento className="w-4 h-4" />
                Ver Todos Documentos
              </button>
            </div>

            {/* Cards Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Card 1: Total de Documentos */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total de Documentos
                  </h4>
                  <p className="text-3xl font-extrabold text-slate-800 mt-1">
                    {totalDocumentos}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/50 flex items-center justify-center">
                  <IconDocumento className="w-6 h-6" />
                </div>
              </div>

              {/* Card 2: Pendentes de Aprovação */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 border-t-4 border-t-amber-500 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Pendentes de Aprovação
                  </h4>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    {pendentesAprovacao}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100/50 flex items-center justify-center">
                  <IconRelogio className="w-6 h-6" />
                </div>
              </div>

              {/* Card 3: Aprovados */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 border-t-4 border-t-emerald-500 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Aprovados
                  </h4>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    {totalAprovados}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/50 flex items-center justify-center">
                  <IconAprovado className="w-6 h-6" />
                </div>
              </div>

              {/* Card 4: Total de Sistemas */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 border-t-4 border-t-indigo-600 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total de Sistemas
                  </h4>
                  <p className="text-3xl font-bold text-slate-800 mt-2">
                    {totalSistemas}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-100/50 flex items-center justify-center">
                  <IconSistemas className="w-6 h-6" />
                </div>
              </div>

              {/* Card 5: Categorias */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 border-t-4 border-t-cyan-700 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Categorias
                  </h4>
                  <p className="text-3xl font-bold text-slate-800 mt-2">
                    {totalCategorias}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 text-cyan-800 rounded-xl border border-blue-100/50 flex items-center justify-center">
                  <IconPasta className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">
                Ações Rápidas:
              </span>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setAbaAtiva("aprovacoes")}
                  className="px-4 py-2 bg-blue-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  Gerir Aprovações
                </button>
                <button
                  onClick={() => setAbaAtiva("categorias")}
                  className="px-4 py-2 bg-blue-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Ver Categorias
                </button>
                <button
                  onClick={() => setAbaAtiva("sistemas")}
                  className="px-4 py-2 bg-blue-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Gerir Sistemas
                </button>
              </div>
            </div>

            {/* Tabela de Documentos + Feed de Atividades */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800">
                    Documentos Recentes
                  </h3>
                  <button
                    onClick={() => setAbaAtiva("documentos")}
                    className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    Ver Todos
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-400 uppercase text-xs">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Nome</th>
                        <th className="py-3 px-4 font-semibold">Categoria</th>
                        <th className="py-3 px-4 font-semibold">Data</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {documentosRecentes.length > 0 ? (
                        documentosRecentes.map((doc) => {
                          const nomeDoc =
                            doc.titulo || doc.nome || "Documento sem nome";
                          const catDoc =
                            doc.categoria?.nome || doc.categoriaNome || "Geral";
                          const dataDoc =
                            doc.dataUpload ||
                            (doc.createdAt
                              ? new Date(doc.createdAt).toLocaleDateString(
                                  "pt-PT"
                                )
                              : "-");
                          const statusDoc = doc.status || "Aprovado";

                          return (
                            <tr
                              key={doc.id}
                              className="hover:bg-slate-50/50 transition-colors"
                            >
                              <td
                                className="py-3 px-4 font-medium text-slate-800 truncate max-w-xs"
                                title={nomeDoc}
                              >
                                {nomeDoc}
                              </td>
                              <td className="py-3 px-4">{catDoc}</td>
                              <td className="py-3 px-4 text-xs">{dataDoc}</td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    statusDoc === "Aprovado"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : statusDoc === "Pendente"
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {statusDoc}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-6 text-slate-400 text-xs"
                          >
                            Nenhum documento registado no repositório.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Feed de Atividade Recente */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Atividade Recente
                </h3>
                <div className="space-y-4">
                  {atividades.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 text-xs"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-slate-700">
                          <strong className="text-slate-900">
                            {item.usuario}
                          </strong>{" "}
                          {item.acao}{" "}
                          <span className="italic text-slate-500">
                            "{item.alvo}"
                          </span>
                        </p>
                        <span className="text-slate-400 text-[10px]">
                          {item.tempo}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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
          className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
        onDeletarConta={handleDeletarConta}
        fechada={sidebarFechada}
      />

      {/* Conteúdo à Direita: Header Fixo + Páginas */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <HeaderDashboard
          sidebarFechada={sidebarFechada}
          setSidebarFechada={setSidebarFechada}
          usuario={usuario}
        />
        <main className="p-8 flex-1">{renderConteudoPrincipal()}</main>
      </div>
    </div>
  );
}