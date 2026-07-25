import React, { useState, useEffect } from "react";
import { 
  IconSistema, 
  IconPasta, 
  IconPesquisa, 
  IconVoltar, 
  IconVer 
} from "../components/icons";

interface Documento {
  id: string | number;
  titulo?: string;
  nome?: string;
  autor?: string;
  usuario?: { nome: string };
  tamanho?: string;
  dataUpload?: string;
  createdAt?: string;
  status?: "Pendente" | "Aprovado" | "Rejeitado" | string;
  sistemaId?: string | number;
  caminho?: string;
}

interface Sistema {
  id: string | number;
  nome: string;
  desenvolvedores: string[];
  empresasClientes: string[];
  descricaoCurta?: string;
  descricaoLonga?: string;
  dataInicio?: string;
  dataEntrega?: string;
  status: "Em Produção" | "Em Desenvolvimento" | "Manutenção" | string;
  tecnologias: string[];
  totalDocumentos?: number;
}

export default function SistemasDesenvolvidos() {
  const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de Navegação
  const [sistemaAtivo, setSistemaAtivo] = useState<Sistema | null>(null);
  const [criandoSistema, setCriandoSistema] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Estados para Upload de Documento
  const [ficheiroUpload, setFicheiroUpload] = useState<File | null>(null);
  const [enviandoDoc, setEnviandoDoc] = useState(false);

  // Filtros
  const [busca, setBusca] = useState("");
  const [buscaDoc, setBuscaDoc] = useState("");

  // Estado do Formulário para Novo Sistema
  const [formNome, setFormNome] = useState("");
  const [formDescCurta, setFormDescCurta] = useState("");
  const [formDescLonga, setFormDescLonga] = useState("");
  const [formStatus, setFormStatus] = useState("Em Desenvolvimento");
  const [formDataInicio, setFormDataInicio] = useState("");
  const [formDataEntrega, setFormDataEntrega] = useState("");

  // Listas dinâmicas do formulário
  const [inputDev, setInputDev] = useState("");
  const [formDevs, setFormDevs] = useState<string[]>([]);

  const [inputCliente, setInputCliente] = useState("");
  const [formClientes, setFormClientes] = useState<string[]>([]);

  const [inputTech, setInputTech] = useState("");
  const [formTechs, setFormTechs] = useState<string[]>([]);

  // Carregar Sistemas e Documentos do Backend
  const fetchDados = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token_sistema") || localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [resSist, resDocs] = await Promise.all([
        fetch("http://localhost:3000/api/sistemas", { headers }),
        fetch("http://localhost:3000/api/documentos", { headers }),
      ]);

      if (resSist.ok) {
        const dadosSist = await resSist.json();
        setSistemas(Array.isArray(dadosSist) ? dadosSist : []);
      }

      if (resDocs.ok) {
        const dadosDocs = await resDocs.json();
        setDocumentos(Array.isArray(dadosDocs) ? dadosDocs : []);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do servidor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  // Formatador auxiliar de datas
  const formatarData = (dataStr?: string) => {
    if (!dataStr) return "-";
    const data = new Date(dataStr);
    return isNaN(data.getTime()) ? dataStr : data.toLocaleDateString("pt-PT");
  };

  // Badge de Status Colorido
  const renderBadgeStatus = (status: string) => {
    switch (status) {
      case "Em Produção":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Manutenção":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  // Funções Auxiliares do Formulário
  const adicionarDev = () => {
    if (inputDev.trim() && !formDevs.includes(inputDev.trim())) {
      setFormDevs([...formDevs, inputDev.trim()]);
      setInputDev("");
    }
  };

  const removerDev = (index: number) => {
    setFormDevs(formDevs.filter((_, i) => i !== index));
  };

  const adicionarCliente = () => {
    if (inputCliente.trim() && !formClientes.includes(inputCliente.trim())) {
      setFormClientes([...formClientes, inputCliente.trim()]);
      setInputCliente("");
    }
  };

  const removerCliente = (index: number) => {
    setFormClientes(formClientes.filter((_, i) => i !== index));
  };

  const adicionarTech = () => {
    if (inputTech.trim() && !formTechs.includes(inputTech.trim())) {
      setFormTechs([...formTechs, inputTech.trim()]);
      setInputTech("");
    }
  };

  const removerTech = (index: number) => {
    setFormTechs(formTechs.filter((_, i) => i !== index));
  };

  const limpaFormulario = () => {
    setFormNome("");
    setFormDescCurta("");
    setFormDescLonga("");
    setFormStatus("Em Desenvolvimento");
    setFormDataInicio("");
    setFormDataEntrega("");
    setInputDev("");
    setFormDevs([]);
    setInputCliente("");
    setFormClientes([]);
    setInputTech("");
    setFormTechs([]);
  };

  // Submeter formulário de novo sistema
  const handleCriarSistema = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNome.trim()) return alert("O nome do sistema é obrigatório!");

    setSalvando(true);
    try {
      const token = localStorage.getItem("token_sistema") || localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/sistemas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: formNome,
          descricaoCurta: formDescCurta,
          descricaoLonga: formDescLonga,
          status: formStatus,
          dataInicio: formDataInicio || null,
          dataEntrega: formDataEntrega || null,
          desenvolvedores: formDevs,
          empresasClientes: formClientes,
          tecnologias: formTechs,
        }),
      });

      if (res.ok) {
        await fetchDados();
        limpaFormulario();
        setCriandoSistema(false);
      } else {
        alert("Erro ao registar o sistema.");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Falha de conexão com o servidor.");
    } finally {
      setSalvando(false);
    }
  };

  // Anexar Documento ao Sistema Ativo
  const handleUploadDocumento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ficheiroUpload || !sistemaAtivo) return alert("Selecione um ficheiro primeiro!");

    setEnviandoDoc(true);
    try {
      const token = localStorage.getItem("token_sistema") || localStorage.getItem("token");
      const formData = new FormData();
      formData.append("ficheiro", ficheiroUpload);
      formData.append("sistemaId", String(sistemaAtivo.id));

      const res = await fetch("http://localhost:3000/api/documentos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const novoDoc = await res.json();
        setDocumentos((prev) => [...prev, novoDoc]);
        setFicheiroUpload(null);
        // Reseta o input file HTML
        const fileInput = document.getElementById("input-file-doc") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        alert("Erro ao anexar o documento.");
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Falha de conexão com o servidor.");
    } finally {
      setEnviandoDoc(false);
    }
  };

  // Filtros
  const sistemasFiltrados = sistemas.filter(
    (sis) =>
      sis.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (sis.descricaoCurta && sis.descricaoCurta.toLowerCase().includes(busca.toLowerCase())) ||
      (sis.desenvolvedores && sis.desenvolvedores.some((d) => d.toLowerCase().includes(busca.toLowerCase()))) ||
      (sis.empresasClientes && sis.empresasClientes.some((c) => c.toLowerCase().includes(busca.toLowerCase())))
  );

  const documentosDoSistema = sistemaAtivo
    ? documentos
        .filter((doc) => Number(doc.sistemaId) === Number(sistemaAtivo.id))
        .filter((doc) => {
          const nomeDoc = doc.titulo || doc.nome || "";
          return nomeDoc.toLowerCase().includes(buscaDoc.toLowerCase());
        })
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <p className="text-slate-500 text-sm animate-pulse">A carregar sistemas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* VISTA 1: FORMULÁRIO DE CRIAÇÃO */}
      {criandoSistema ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setCriandoSistema(false);
                  limpaFormulario();
                }}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <IconVoltar />
                <span>Cancelar</span>
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Registar Novo Sistema</h2>
                <p className="text-xs text-slate-500">Preencha a ficha técnica do novo projeto</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleCriarSistema} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome do Sistema */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Nome do Sistema *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Repositório Digital de Documentos"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Status do Projeto
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                >
                  <option value="Em Desenvolvimento">Em Desenvolvimento</option>
                  <option value="Em Produção">Em Produção</option>
                  <option value="Manutenção">Manutenção</option>
                </select>
              </div>

              {/* Datas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Data Início
                  </label>
                  <input
                    type="date"
                    value={formDataInicio}
                    onChange={(e) => setFormDataInicio(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Data Entrega
                  </label>
                  <input
                    type="date"
                    value={formDataEntrega}
                    onChange={(e) => setFormDataEntrega(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                </div>
              </div>

              {/* Descrição Curta */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Descrição Curta (Resumo)
                </label>
                <input
                  type="text"
                  placeholder="Resumo em uma frase para o cartão do sistema..."
                  value={formDescCurta}
                  onChange={(e) => setFormDescCurta(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              {/* Descrição Longa */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Descrição Completa / Objetivo do Sistema
                </label>
                <textarea
                  rows={3}
                  placeholder="Explique detalhadamente qual problema este sistema resolve e o seu funcionamento..."
                  value={formDescLonga}
                  onChange={(e) => setFormDescLonga(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 resize-none"
                />
              </div>

              {/* Adicionar Desenvolvedores */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Equipa de Desenvolvedores
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Nome do dev..."
                    value={inputDev}
                    onChange={(e) => setInputDev(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), adicionarDev())}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                  <button
                    type="button"
                    onClick={adicionarDev}
                    className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900"
                  >
                    + Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formDevs.map((dev, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-900 text-xs font-medium rounded-full border border-blue-200 flex items-center gap-1.5">
                      {dev}
                      <button type="button" onClick={() => removerDev(idx)} className="text-blue-500 hover:text-red-600 font-bold">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Adicionar Empresas Clientes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Empresas Clientes / Utilizadores
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Nome da empresa..."
                    value={inputCliente}
                    onChange={(e) => setInputCliente(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), adicionarCliente())}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                  <button
                    type="button"
                    onClick={adicionarCliente}
                    className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900"
                  >
                    + Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formClientes.map((cliente, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-medium rounded-full border border-emerald-200 flex items-center gap-1.5">
                      {cliente}
                      <button type="button" onClick={() => removerCliente(idx)} className="text-emerald-600 hover:text-red-600 font-bold">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Adicionar Tecnologias */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Tecnologias Utilizadas
                </label>
                <div className="flex gap-2 mb-2 w-full md:w-1/2">
                  <input
                    type="text"
                    placeholder="Ex: React, Node.js, MySQL..."
                    value={inputTech}
                    onChange={(e) => setInputTech(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), adicionarTech())}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                  />
                  <button
                    type="button"
                    onClick={adicionarTech}
                    className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900"
                  >
                    + Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formTechs.map((tech, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-200 flex items-center gap-1.5">
                      {tech}
                      <button type="button" onClick={() => removerTech(idx)} className="text-slate-400 hover:text-red-600 font-bold">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Submissão */}
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setCriandoSistema(false);
                  limpaFormulario();
                }}
                className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {salvando ? "A Guardar..." : "Guardar Sistema"}
              </button>
            </div>
          </form>
        </div>
      ) : !sistemaAtivo ? (
        /* VISTA 2: LISTA DE SISTEMAS */
        <>
          {/* Cabeçalho */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Sistemas Desenvolvidos</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Consulte os projetos, equipas envolvidas, clientes e documentações técnicas
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                Total: <span className="text-blue-900 font-bold">{sistemas.length}</span>
              </div>
              <button
                onClick={() => setCriandoSistema(true)}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>+ Novo Sistema</span>
              </button>
            </div>
          </div>

          {/* Barra de Pesquisa */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Pesquisar por sistema, cliente ou dev..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
              />
              <span className="absolute left-3 top-2.5 text-slate-400">
                <IconPesquisa />
              </span>
            </div>
          </div>

          {/* Grelha de Cartões */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sistemasFiltrados.length > 0 ? (
              sistemasFiltrados.map((sis) => {
                const totalDocs = sis.totalDocumentos ?? documentos.filter((d) => Number(d.sistemaId) === Number(sis.id)).length;
                const devs = Array.isArray(sis.desenvolvedores) ? sis.desenvolvedores : [];
                const clientes = Array.isArray(sis.empresasClientes) ? sis.empresasClientes : [];
                const techs = Array.isArray(sis.tecnologias) ? sis.tecnologias : [];

                return (
                  <div
                    key={sis.id}
                    className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Topo do Cartão */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg">
                          <IconSistema className="w-5 h-5 text-blue-900" />
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${renderBadgeStatus(sis.status)}`}>
                          {sis.status || "Em Desenvolvimento"}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-800 text-base">{sis.nome}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {sis.descricaoCurta || sis.descricaoLonga || "Sem descrição disponível."}
                      </p>

                      {/* Clientes */}
                      {clientes.length > 0 && (
                        <div className="mt-3">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                            Clientes / Empresas:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {clientes.map((c, i) => (
                              <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-medium rounded border border-emerald-200">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Desenvolvedores */}
                      {devs.length > 0 && (
                        <div className="mt-3">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                            Equipa Dev:
                          </span>
                          <p className="text-xs font-medium text-slate-700">
                            {devs.join(", ")}
                          </p>
                        </div>
                      )}

                      {/* Tecnologias */}
                      {techs.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {techs.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] rounded-md font-medium border border-slate-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Rodapé do Cartão */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        Ficheiros: <strong className="text-slate-700">{totalDocs}</strong>
                      </span>

                      <button
                        onClick={() => {
                          setSistemaAtivo(sis);
                          setBuscaDoc("");
                        }}
                        className="flex items-center gap-1.5 py-1.5 px-3 bg-slate-50 hover:bg-blue-900 hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200 hover:border-blue-900"
                      >
                        <IconVer />
                        <span>Ver detalhes</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-400 text-sm">
                Nenhum sistema encontrado com os termos pesquisados.
              </div>
            )}
          </div>
        </>
      ) : (
        /* VISTA 3: DETALHES DO SISTEMA / DOCUMENTOS ASSOCIADOS */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSistemaAtivo(null)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <IconVoltar />
                <span>Voltar</span>
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <IconSistema className="w-5 h-5 text-blue-900" />
                  <h2 className="text-xl font-bold text-slate-800">{sistemaAtivo.nome}</h2>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${renderBadgeStatus(sistemaAtivo.status)}`}>
                    {sistemaAtivo.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {sistemaAtivo.descricaoLonga || sistemaAtivo.descricaoCurta || "Sem descrição detalhada."}
                </p>
              </div>
            </div>
          </div>

          {/* Cartão de Ficha Técnica */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Desenvolvedores:
              </span>
              <p className="text-slate-800 font-medium">
                {Array.isArray(sistemaAtivo.desenvolvedores) && sistemaAtivo.desenvolvedores.length > 0
                  ? sistemaAtivo.desenvolvedores.join(", ")
                  : "Não especificado"}
              </p>
            </div>
            <div>
              <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Empresas Clientes:
              </span>
              <p className="text-slate-800 font-medium">
                {Array.isArray(sistemaAtivo.empresasClientes) && sistemaAtivo.empresasClientes.length > 0
                  ? sistemaAtivo.empresasClientes.join(", ")
                  : "Uso Interno"}
              </p>
            </div>
            <div>
              <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Datas do Projeto:
              </span>
              <p className="text-slate-800 font-medium">
                Início: {formatarData(sistemaAtivo.dataInicio)} | Entrega: {formatarData(sistemaAtivo.dataEntrega)}
              </p>
            </div>
          </div>

          {/* Área de Anexo de Novo Documento */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">Anexar Novo Ficheiro</h3>
            <form onSubmit={handleUploadDocumento} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                id="input-file-doc"
                type="file"
                onChange={(e) => setFicheiroUpload(e.target.files?.[0] || null)}
                className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 cursor-pointer"
              />
              <button
                type="submit"
                disabled={!ficheiroUpload || enviandoDoc}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {enviandoDoc ? "A Anexar..." : "Anexar Ficheiro"}
              </button>
            </form>
          </div>

          {/* Filtro e Tabela de Ficheiros do Sistema */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">
                Documentos do Sistema ({documentosDoSistema.length})
              </h3>
              <div className="w-64 relative">
                <input
                  type="text"
                  placeholder="Pesquisar ficheiro..."
                  value={buscaDoc}
                  onChange={(e) => setBuscaDoc(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
                />
                <span className="absolute left-2.5 top-2 text-slate-400 scale-75">
                  <IconPesquisa />
                </span>
              </div>
            </div>

            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase text-xs border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Documento</th>
                  <th className="py-3.5 px-4 font-semibold">Autor</th>
                  <th className="py-3.5 px-4 font-semibold">Tamanho</th>
                  <th className="py-3.5 px-4 font-semibold">Data</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documentosDoSistema.length > 0 ? (
                  documentosDoSistema.map((doc) => {
                    const nomeDoc = doc.titulo || doc.nome || "Ficheiro sem nome";
                    const autorDoc = doc.autor || doc.usuario?.nome || "Sistema";
                    const dataDoc = formatarData(doc.dataUpload || doc.createdAt);
                    const statusDoc = doc.status || "Aprovado";

                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                          <IconPasta className="text-blue-900" />
                          <span>{nomeDoc}</span>
                        </td>
                        <td className="py-3.5 px-4 text-xs">{autorDoc}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-500">{doc.tamanho || "N/D"}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-500">{dataDoc}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              statusDoc === "Aprovado" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
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
                    <td colSpan={5} className="text-center py-8 text-slate-400 text-xs">
                      Nenhum documento encontrado para este sistema.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}