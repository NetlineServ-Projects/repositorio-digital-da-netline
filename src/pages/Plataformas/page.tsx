import { useState, useMemo } from "react";
import { toast } from "sonner";
import { usePlataformasData } from "../../hooks/usePlataformasData";
import { useUsuario } from "../../components/usuarioContext";
import ModalConfirmacao from "../../components/modalConfirmacaoprops";
import {
  IconPlataforma,
  IconServer,
  IconDominio,
  IconRede,
  IconPesquisa,
  IconCaneta,
  IconLixeira,
} from "../../components/icons";
import PlataformaFormularioPage, {
  type TipoFormularioPlataforma,
} from "./formulario/page";
import type {
  Plataforma,
  Servidor,
  Dominio,
  Subdominio,
} from "../../types/plataforma";

type AbaPrincipal = "arvore" | "plataformas" | "servidores" | "dominios";

export default function PlataformasPage() {
  const { usuarioLogado } = useUsuario();
  const ehAdmin = usuarioLogado?.perfil === "ADMIN";

  const {
    plataformas,
    arvore,
    servidores,
    dominios,
    subdominios,
    loading,
    carregarTodos,
    eliminarPlataforma,
    eliminarServidor,
    eliminarDominio,
    eliminarSubdominio,
  } = usePlataformasData();

  // Estados de navegação interna e busca
  const [abaAtiva, setAbaAtiva] = useState<AbaPrincipal>("plataformas");
  const [busca, setBusca] = useState("");

  // Estado para formulário aberto (criação ou edição)
  const [formularioAberto, setFormularioAberto] = useState<{
    aberto: boolean;
    tipo: TipoFormularioPlataforma;
    itemEdicao?: {
      tipo: TipoFormularioPlataforma;
      dados: Plataforma | Servidor | Dominio | Subdominio;
    } | null;
  } | null>(null);

  // Estado para modal de exclusão
  const [modalExclusao, setModalExclusao] = useState<{
    aberto: boolean;
    tipo: TipoFormularioPlataforma;
    id: number;
    nome: string;
  } | null>(null);

  // Filtros de busca
  const plataformasFiltradas = useMemo(() => {
    if (!busca.trim()) return plataformas;
    const termo = busca.toLowerCase();
    return plataformas.filter(
      (p) =>
        p.nome.toLowerCase().includes(termo) ||
        p.tipo.toLowerCase().includes(termo)
    );
  }, [plataformas, busca]);

  const servidoresFiltrados = useMemo(() => {
    if (!busca.trim()) return servidores;
    const termo = busca.toLowerCase();
    return servidores.filter(
      (s) =>
        s.nome.toLowerCase().includes(termo) ||
        s.hostname.toLowerCase().includes(termo) ||
        (s.ip && s.ip.toLowerCase().includes(termo)) ||
        s.sistemaOperativo.toLowerCase().includes(termo)
    );
  }, [servidores, busca]);

  const dominiosFiltrados = useMemo(() => {
    if (!busca.trim()) return dominios;
    const termo = busca.toLowerCase();
    return dominios.filter((d) => d.nome.toLowerCase().includes(termo));
  }, [dominios, busca]);

  // Ações de Exclusão
  const handleConfirmarExclusao = async () => {
    if (!modalExclusao) return;
    try {
      if (modalExclusao.tipo === "plataforma") {
        await eliminarPlataforma(modalExclusao.id);
        toast.success("Plataforma eliminada com sucesso.");
      } else if (modalExclusao.tipo === "servidor") {
        await eliminarServidor(modalExclusao.id);
        toast.success("Servidor eliminado com sucesso.");
      } else if (modalExclusao.tipo === "dominio") {
        await eliminarDominio(modalExclusao.id);
        toast.success("Domínio eliminado com sucesso.");
      } else if (modalExclusao.tipo === "subdominio") {
        await eliminarSubdominio(modalExclusao.id);
        toast.success("Registo DNS eliminado com sucesso.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao eliminar recurso.";
      toast.error(msg);
    } finally {
      setModalExclusao(null);
    }
  };

  // Se o formulário estiver aberto, renderiza o componente de formulários
  if (formularioAberto?.aberto) {
    return (
      <PlataformaFormularioPage
        tipoInicial={formularioAberto.tipo}
        itemEdicao={formularioAberto.itemEdicao}
        onVoltar={() => setFormularioAberto(null)}
        onSucesso={() => carregarTodos()}
      />
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ================= HEADER BANNER ================= */}
      <div className="bg-[#18357a] text-white p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs uppercase font-semibold text-blue-200/80 tracking-widest block mb-1">
            INFRAESTRUTURA & OPERAÇÕES
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Plataformas & Servidores
          </h2>
          <p className="text-sm text-blue-100/80 mt-1 max-w-xl">
            Gerencie provedores de nuvem, servidores virtuais, zonas DNS e domínios corporativos da Netline.
          </p>
        </div>

        {/* Contadores e Ação */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#14203A]/70 border border-white/10 px-3.5 py-2 rounded-xl text-xs font-medium text-blue-100">
            Plataformas: <span className="font-bold text-white">{plataformas.length}</span>
          </div>
          <div className="bg-[#14203A]/70 border border-white/10 px-3.5 py-2 rounded-xl text-xs font-medium text-blue-100">
            Servidores: <span className="font-bold text-white">{servidores.length}</span>
          </div>
          <div className="bg-[#14203A]/70 border border-white/10 px-3.5 py-2 rounded-xl text-xs font-medium text-blue-100">
            Domínios: <span className="font-bold text-white">{dominios.length}</span>
          </div>

          {ehAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setFormularioAberto({
                    aberto: true,
                    tipo: "plataforma",
                  })
                }
                className="bg-white text-[#18357a] hover:bg-slate-100 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
              >
                + Nova Plataforma
              </button>
              <button
                onClick={() =>
                  setFormularioAberto({
                    aberto: true,
                    tipo: "servidor",
                  })
                }
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
              >
                + Servidor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= BARRA DE CONTROLE & ABAS ================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Abas */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          <button
            onClick={() => setAbaAtiva("plataformas")}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              abaAtiva === "plataformas"
                ? "bg-white text-slate-800 shadow-xs"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <IconPlataforma className="w-4 h-4 text-blue-600" />
            <span>Plataformas ({plataformas.length})</span>
          </button>

          <button
            onClick={() => setAbaAtiva("servidores")}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              abaAtiva === "servidores"
                ? "bg-white text-slate-800 shadow-xs"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <IconServer className="w-4 h-4 text-emerald-600" />
            <span>Servidores ({servidores.length})</span>
          </button>

          <button
            onClick={() => setAbaAtiva("dominios")}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              abaAtiva === "dominios"
                ? "bg-white text-slate-800 shadow-xs"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <IconDominio className="w-4 h-4 text-indigo-600" />
            <span>Domínios & DNS ({dominios.length})</span>
          </button>

          <button
            onClick={() => setAbaAtiva("arvore")}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              abaAtiva === "arvore"
                ? "bg-white text-slate-800 shadow-xs"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <IconRede className="w-4 h-4 text-amber-600" />
            <span>Topologia / Árvore</span>
          </button>
        </div>

        {/* Campo de Busca */}
        <div className="relative min-w-[260px]">
          <input
            type="text"
            placeholder="Pesquisar por nome, IP, hostname..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
          />
          <IconPesquisa className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* ================= ESTADO DE CARREGAMENTO ================= */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-sm animate-pulse bg-white rounded-2xl border border-slate-100">
          A carregar infraestrutura de plataformas...
        </div>
      ) : (
        <>
          {/* ================= ABA 1: PLATAFORMAS ================= */}
          {abaAtiva === "plataformas" && (
            <div className="space-y-4">
              {plataformasFiltradas.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 text-slate-500 text-sm">
                  Nenhuma plataforma cadastrada.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {plataformasFiltradas.map((plat) => {
                    const tipoRotulo =
                      plat.tipo === "CONTAINERIZACAO"
                        ? "Containerização & Nuvem"
                        : plat.tipo === "CLOUD_BASE_DADOS"
                        ? "Cloud Base de Dados"
                        : "Gestão de Domínio";

                    const badgeCor =
                      plat.tipo === "CONTAINERIZACAO"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : plat.tipo === "CLOUD_BASE_DADOS"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-indigo-50 text-indigo-700 border-indigo-200";

                    return (
                      <div
                        key={plat.id}
                        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeCor}`}
                              >
                                {tipoRotulo}
                              </span>
                              <h3 className="text-base font-bold text-slate-800 mt-2">
                                {plat.nome}
                              </h3>
                            </div>
                            <span
                              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                plat.ativo ? "bg-emerald-500" : "bg-slate-300"
                              }`}
                              title={plat.ativo ? "Ativa" : "Inativa"}
                            />
                          </div>

                          {plat.urlPainel && (
                            <a
                              href={plat.urlPainel}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium truncate"
                            >
                              🔗 {plat.urlPainel}
                            </a>
                          )}

                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                            <div>
                              Servidores:{" "}
                              <span className="font-bold text-slate-800">
                                {plat._count?.servidores ??
                                  servidores.filter((s) => s.plataformaId === plat.id).length}
                              </span>
                            </div>
                            <div>
                              Domínios:{" "}
                              <span className="font-bold text-slate-800">
                                {plat._count?.dominios ??
                                  dominios.filter((d) => d.plataformaId === plat.id).length}
                              </span>
                            </div>
                          </div>
                        </div>

                        {ehAdmin && (
                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                            <button
                              onClick={() =>
                                setFormularioAberto({
                                  aberto: true,
                                  tipo: "plataforma",
                                  itemEdicao: {
                                    tipo: "plataforma",
                                    dados: plat,
                                  },
                                })
                              }
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                              title="Editar plataforma"
                            >
                              <IconCaneta className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setModalExclusao({
                                  aberto: true,
                                  tipo: "plataforma",
                                  id: plat.id,
                                  nome: plat.nome,
                                })
                              }
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar plataforma"
                            >
                              <IconLixeira className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= ABA 2: SERVIDORES ================= */}
          {abaAtiva === "servidores" && (
            <div className="space-y-4">
              {servidoresFiltrados.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 text-slate-500 text-sm">
                  Nenhum servidor cadastrado.
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="px-5 py-3.5">Servidor</th>
                          <th className="px-5 py-3.5">Endereço IP</th>
                          <th className="px-5 py-3.5">Recursos (CPU / RAM / Disco)</th>
                          <th className="px-5 py-3.5">Sistema Operativo</th>
                          <th className="px-5 py-3.5">Plataforma</th>
                          {ehAdmin && <th className="px-5 py-3.5 text-right">Ações</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {servidoresFiltrados.map((srv) => (
                          <tr key={srv.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-3.5">
                              <p className="font-bold text-slate-800 text-sm">{srv.nome}</p>
                              <p className="text-slate-400 font-mono text-[11px]">{srv.hostname}</p>
                            </td>
                            <td className="px-5 py-3.5 font-mono text-slate-600">
                              {srv.ip || "Protegido"}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="font-semibold text-slate-800">{srv.numeroCpu} vCPU</span>
                              {" • "}
                              <span>
                                {srv.memoriaRam} {srv.memoriaRamUnidade ?? "GB"} RAM
                              </span>
                              {" • "}
                              <span>
                                {srv.disco} {srv.discoUnidade ?? "GB"}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <p className="font-medium text-slate-800">{srv.sistemaOperativo}</p>
                              {srv.versaoSo && (
                                <p className="text-slate-400 text-[11px]">{srv.versaoSo}</p>
                              )}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                                {srv.plataforma?.nome ??
                                  plataformas.find((p) => p.id === srv.plataformaId)?.nome ??
                                  "-"}
                              </span>
                            </td>
                            {ehAdmin && (
                              <td className="px-5 py-3.5 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    onClick={() =>
                                      setFormularioAberto({
                                        aberto: true,
                                        tipo: "servidor",
                                        itemEdicao: {
                                          tipo: "servidor",
                                          dados: srv,
                                        },
                                      })
                                    }
                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                    title="Editar servidor"
                                  >
                                    <IconCaneta className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      setModalExclusao({
                                        aberto: true,
                                        tipo: "servidor",
                                        id: srv.id,
                                        nome: srv.nome,
                                      })
                                    }
                                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                    title="Eliminar servidor"
                                  >
                                    <IconLixeira className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= ABA 3: DOMÍNIOS & DNS ================= */}
          {abaAtiva === "dominios" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Gerenciamento de domínios corporativos e apontamentos de registos DNS (A, CNAME, etc.)
                </p>
                {ehAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setFormularioAberto({
                          aberto: true,
                          tipo: "dominio",
                        })
                      }
                      className="px-3.5 py-1.5 bg-[#18357a] hover:bg-blue-900 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-all"
                    >
                      + Novo Domínio
                    </button>
                    <button
                      onClick={() =>
                        setFormularioAberto({
                          aberto: true,
                          tipo: "subdominio",
                        })
                      }
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-all"
                    >
                      + Novo Registo DNS
                    </button>
                  </div>
                )}
              </div>

              {dominiosFiltrados.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 text-slate-500 text-sm">
                  Nenhum domínio cadastrado.
                </div>
              ) : (
                <div className="space-y-5">
                  {dominiosFiltrados.map((dom) => {
                    const subsDoDominio = subdominios.filter(
                      (s) => s.dominioId === dom.id
                    );

                    const dataFormatada = dom.dataExpiracao
                      ? new Date(dom.dataExpiracao).toLocaleDateString("pt-PT")
                      : "-";

                    return (
                      <div
                        key={dom.id}
                        className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden"
                      >
                        {/* Header do Domínio */}
                        <div className="p-5 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              DOMÍNIO PRINCIPAL
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <h3 className="text-base font-extrabold text-slate-800">
                                {dom.nome}
                              </h3>
                              <span className="text-[11px] font-medium px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                                Expira em: {dataFormatada}
                              </span>
                            </div>
                          </div>

                          {ehAdmin && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() =>
                                  setFormularioAberto({
                                    aberto: true,
                                    tipo: "subdominio",
                                    itemEdicao: null,
                                  })
                                }
                                className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                              >
                                + Adicionar Apontamento
                              </button>
                              <button
                                onClick={() =>
                                  setFormularioAberto({
                                    aberto: true,
                                    tipo: "dominio",
                                    itemEdicao: {
                                      tipo: "dominio",
                                      dados: dom,
                                    },
                                  })
                                }
                                className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg cursor-pointer"
                                title="Editar domínio"
                              >
                                <IconCaneta className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  setModalExclusao({
                                    aberto: true,
                                    tipo: "dominio",
                                    id: dom.id,
                                    nome: dom.nome,
                                  })
                                }
                                className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg cursor-pointer"
                                title="Eliminar domínio"
                              >
                                <IconLixeira className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Registos DNS / Subdomínios do Domínio */}
                        <div className="p-5">
                          {subsDoDominio.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">
                              Nenhum registo ou subdomínio configurado neste domínio.
                            </p>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                <thead className="text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 pb-2">
                                  <tr>
                                    <th className="py-2">Registo / Subdomínio</th>
                                    <th className="py-2">Tipo DNS</th>
                                    <th className="py-2">Destino / Apontamento</th>
                                    {ehAdmin && <th className="py-2 text-right">Ação</th>}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                  {subsDoDominio.map((sub) => {
                                    const nomeCompleto =
                                      sub.nome === "@"
                                        ? dom.nome
                                        : `${sub.nome}.${dom.nome}`;

                                    const srvDestino = servidores.find(
                                      (s) => s.id === sub.servidorId
                                    );

                                    return (
                                      <tr key={sub.id} className="hover:bg-slate-50/50">
                                        <td className="py-2.5 font-bold text-slate-800">
                                          {nomeCompleto}
                                          <span className="text-slate-400 font-normal ml-1">
                                            ({sub.nome})
                                          </span>
                                        </td>
                                        <td className="py-2.5">
                                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-mono font-bold rounded text-[11px]">
                                            {sub.tipoDns}
                                          </span>
                                        </td>
                                        <td className="py-2.5 font-mono text-slate-600">
                                          {srvDestino ? (
                                            <span className="text-emerald-700 font-medium">
                                              🖥️ {srvDestino.nome} ({srvDestino.ip || srvDestino.hostname})
                                            </span>
                                          ) : (
                                            sub.destino || "-"
                                          )}
                                        </td>
                                        {ehAdmin && (
                                          <td className="py-2.5 text-right">
                                            <div className="inline-flex items-center gap-1">
                                              <button
                                                onClick={() =>
                                                  setFormularioAberto({
                                                    aberto: true,
                                                    tipo: "subdominio",
                                                    itemEdicao: {
                                                      tipo: "subdominio",
                                                      dados: sub,
                                                    },
                                                  })
                                                }
                                                className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                                                title="Editar registo"
                                              >
                                                <IconCaneta className="w-3.5 h-3.5" />
                                              </button>
                                              <button
                                                onClick={() =>
                                                  setModalExclusao({
                                                    aberto: true,
                                                    tipo: "subdominio",
                                                    id: sub.id,
                                                    nome: nomeCompleto,
                                                  })
                                                }
                                                className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                                                title="Eliminar registo"
                                              >
                                                <IconLixeira className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </td>
                                        )}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= ABA 4: TOPOLOGIA & ÁRVORE ================= */}
          {abaAtiva === "arvore" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Visualização hierárquica completa dos provedores, servidores conectados e serviços.
              </p>

              {arvore.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 text-slate-500 text-sm">
                  Nenhuma árvore de infraestrutura disponível no momento.
                </div>
              ) : (
                <div className="space-y-4">
                  {arvore.map((plat) => (
                    <div
                      key={plat.id}
                      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-blue-50 text-[#18357a] rounded-xl font-bold">
                            <IconPlataforma className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 text-base">{plat.nome}</h3>
                            <span className="text-[11px] text-slate-400 font-medium">
                              Tipo: {plat.tipo}
                            </span>
                          </div>
                        </div>

                        {plat.urlPainel && (
                          <a
                            href={plat.urlPainel}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline font-semibold"
                          >
                            Abrir Painel ↗
                          </a>
                        )}
                      </div>

                      {/* Filhos: Domínios ou Servidores */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-blue-100">
                        {/* Seção Domínios */}
                        {plat.dominios && plat.dominios.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                              🌐 Domínios & DNS Vinculados
                            </span>
                            <div className="space-y-1.5">
                              {plat.dominios.map((d) => (
                                <div
                                  key={d.id}
                                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs"
                                >
                                  <p className="font-bold text-slate-800">{d.nome}</p>
                                  <p className="text-[11px] text-slate-500">
                                    Subdomínios / Registos: {d.subdominios?.length || 0}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Seção Servidores */}
                        {plat.servidores && plat.servidores.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                              🖥️ Servidores Hospedados
                            </span>
                            <div className="space-y-1.5">
                              {plat.servidores.map((s) => (
                                <div
                                  key={s.id}
                                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs space-y-1"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-800">{s.nome}</span>
                                    <span className="font-mono text-[11px] text-slate-500">{s.ip || s.hostname}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-400">
                                    {s.numeroCpu} vCPU • {s.memoriaRam} {s.memoriaRamUnidade ?? "GB"} RAM • {s.disco} {s.discoUnidade ?? "GB"} Disco
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ================= MODAL DE EXCLUSÃO ================= */}
      <ModalConfirmacao
        aberto={Boolean(modalExclusao?.aberto)}
        perigoso
        titulo={`Eliminar ${
          modalExclusao?.tipo === "plataforma"
            ? "Plataforma"
            : modalExclusao?.tipo === "servidor"
            ? "Servidor"
            : modalExclusao?.tipo === "dominio"
            ? "Domínio"
            : "Registo DNS"
        }`}
        mensagem={`Tens a certeza de que desejas eliminar "${modalExclusao?.nome}"? Esta ação é irreversível.`}
        textoConfirmar="Eliminar Definitivamente"
        onConfirmar={handleConfirmarExclusao}
        onCancelar={() => setModalExclusao(null)}
      />
    </div>
  );
}

