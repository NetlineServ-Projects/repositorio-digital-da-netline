import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import type {
  SistemaInfraestrutura,
  AmbienteResumo,
  Credencial,
  TipoAmbiente,
  TipoCredencial,
} from "../../../hooks/useSistemasData";
import { ErroApi } from "../../../utils/api";

const AMBIENTES: { valor: TipoAmbiente; label: string }[] = [
  { valor: "PRODUCAO", label: "Produção" },
  { valor: "TESTES", label: "Testes" },
  { valor: "DESENVOLVIMENTO", label: "Desenvolvimento" },
];

const TIPOS_CREDENCIAL: { valor: TipoCredencial; label: string }[] = [
  { valor: "ENV_VARIAVEIS", label: "Variáveis de Ambiente (.env)" },
  { valor: "CREDENCIAIS_BD", label: "Credenciais de Base de Dados" },
  { valor: "CHAVE_TOKEN_API", label: "Chave/Token de API" },
  { valor: "CHAVE_SSH", label: "Chave SSH" },
  { valor: "CERTIFICADO_SSL", label: "Certificado SSL/TLS" },
  { valor: "CREDENCIAIS_DNS", label: "Credenciais de DNS/Domínio" },
  { valor: "ACESSO_CONSOLA_CLOUD", label: "Acesso à Consola Cloud (root/IAM)" },
  { valor: "CREDENCIAIS_CICD", label: "Credenciais CI/CD" },
  { valor: "CONFIGURACAO_VPN_FIREWALL", label: "Configuração VPN/Firewall" },
  { valor: "CREDENCIAIS_SMTP", label: "Credenciais SMTP/E-mail" },
  { valor: "BACKUP_ACESSO", label: "Backup — localização e acesso" },
  { valor: "OUTRO", label: "Outro" },
];

function labelTipo(tipo: TipoCredencial) {
  return TIPOS_CREDENCIAL.find((t) => t.valor === tipo)?.label || tipo;
}

interface InfraestruturaTabProps {
  sistemaId: string | number;
  tokenElevado: string;
  ehAdmin: boolean;
  onSessaoExpirada: () => void;
  listarInfraestruturas: (
    sistemaId: string | number,
    tokenElevado: string,
  ) => Promise<AmbienteResumo[]>;
  buscarInfraestrutura: (
    sistemaId: string | number,
    ambiente: TipoAmbiente,
    tokenElevado: string,
  ) => Promise<SistemaInfraestrutura | null>;
  salvarInfraestrutura: (
    sistemaId: string | number,
    ambiente: TipoAmbiente,
    dados: { ipServidor?: string; cloudProvedor?: string },
    tokenElevado: string,
  ) => Promise<unknown>;
  adicionarCredencial: (
    sistemaId: string | number,
    ambiente: TipoAmbiente,
    dados: { tipo: TipoCredencial; label: string; valor: string },
    tokenElevado: string,
  ) => Promise<unknown>;
  atualizarCredencial: (
    sistemaId: string | number,
    ambiente: TipoAmbiente,
    credencialId: number,
    dados: Partial<{ tipo: TipoCredencial; label: string; valor: string }>,
    tokenElevado: string,
  ) => Promise<unknown>;
  apagarCredencial: (
    sistemaId: string | number,
    ambiente: TipoAmbiente,
    credencialId: number,
    tokenElevado: string,
  ) => Promise<unknown>;
}

const CAMPO_VAZIO: { tipo: TipoCredencial; label: string; valor: string } = {
  tipo: "ENV_VARIAVEIS",
  label: "",
  valor: "",
};

export default function InfraestruturaTab({
  sistemaId,
  tokenElevado,
  ehAdmin,
  onSessaoExpirada,
  listarInfraestruturas,
  buscarInfraestrutura,
  salvarInfraestrutura,
  adicionarCredencial,
  atualizarCredencial,
  apagarCredencial,
}: InfraestruturaTabProps) {
  const [ambiente, setAmbiente] = useState<TipoAmbiente>("PRODUCAO");
  const [resumo, setResumo] = useState<AmbienteResumo[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [infraestrutura, setInfraestrutura] =
    useState<SistemaInfraestrutura | null>(null);

  const [ipServidor, setIpServidor] = useState("");
  const [cloudProvedor, setCloudProvedor] = useState("");
  const [salvandoInfra, setSalvandoInfra] = useState(false);

  const [formularioAberto, setFormularioAberto] = useState<
    "novo" | Credencial | null
  >(null);
  const [campoCredencial, setCampoCredencial] = useState(CAMPO_VAZIO);
  const [salvandoCredencial, setSalvandoCredencial] = useState(false);

  const [revelados, setRevelados] = useState<Set<number>>(new Set());
  const [copiadoId, setCopiadoId] = useState<number | null>(null);

  // Só o último pedido pode atualizar o ecrã — evita que a resposta de um
  // ambiente anterior apareça depois de o utilizador já ter mudado de ambiente
  const pedidoAtual = useRef(0);

  const labelAmbiente =
    AMBIENTES.find((a) => a.valor === ambiente)?.label ?? ambiente;

  const tratarErro = useCallback(
    (error: unknown, mensagemGenerica: string) => {
      const isErroApi = error instanceof ErroApi;
      const status = isErroApi ? error.status : null;
      const mensagem =
        error instanceof Error ? error.message.toLowerCase() : "";

      // 401 = sem token elevado ou token expirado. 403 (perfil sem permissão)
      // não é sessão expirada: mostra a mensagem do servidor.
      if (
        status === 401 ||
        mensagem.includes("reautenticaç") ||
        mensagem.includes("token elevado")
      ) {
        toast.error("A sua sessão de acesso expirou. Reautentique-se.");
        onSessaoExpirada();
        return;
      }

      toast.error(error instanceof Error ? error.message : mensagemGenerica);
    },
    [onSessaoExpirada],
  );

  const carregar = useCallback(async () => {
    const pedido = ++pedidoAtual.current;
    setCarregando(true);
    try {
      const [dados, lista] = await Promise.all([
        buscarInfraestrutura(sistemaId, ambiente, tokenElevado),
        listarInfraestruturas(sistemaId, tokenElevado),
      ]);
      if (pedido !== pedidoAtual.current) return;
      setInfraestrutura(dados);
      setIpServidor(dados?.ipServidor || "");
      setCloudProvedor(dados?.cloudProvedor || "");
      setResumo(lista);
    } catch (error) {
      if (pedido === pedidoAtual.current) {
        tratarErro(error, "Erro ao carregar dados de infraestrutura.");
      }
    } finally {
      if (pedido === pedidoAtual.current) setCarregando(false);
    }
  }, [
    sistemaId,
    ambiente,
    tokenElevado,
    buscarInfraestrutura,
    listarInfraestruturas,
    tratarErro,
  ]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const mudarAmbiente = (novo: TipoAmbiente) => {
    if (novo === ambiente) return;
    // Os valores desencriptados do ambiente anterior não ficam em memória
    setInfraestrutura(null);
    setIpServidor("");
    setCloudProvedor("");
    setFormularioAberto(null);
    setCampoCredencial(CAMPO_VAZIO);
    setRevelados(new Set());
    setCopiadoId(null);
    setAmbiente(novo);
  };

  const handleSalvarInfra = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoInfra(true);
    try {
      await salvarInfraestrutura(
        sistemaId,
        ambiente,
        { ipServidor: ipServidor.trim(), cloudProvedor: cloudProvedor.trim() },
        tokenElevado,
      );
      toast.success(`Dados de ${labelAmbiente} guardados com sucesso.`);
      await carregar();
    } catch (error) {
      tratarErro(error, "Erro ao guardar dados de infraestrutura.");
    } finally {
      setSalvandoInfra(false);
    }
  };

  const abrirNovaCredencial = () => {
    setCampoCredencial(CAMPO_VAZIO);
    setFormularioAberto("novo");
  };

  const abrirEditarCredencial = (credencial: Credencial) => {
    setCampoCredencial({
      tipo: credencial.tipo,
      label: credencial.label,
      valor: credencial.valor || "",
    });
    setFormularioAberto(credencial);
  };

  const handleSalvarCredencial = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      tipo: campoCredencial.tipo,
      label: campoCredencial.label.trim(),
      valor: campoCredencial.valor.trim(),
    };

    if (!payload.label || !payload.valor) {
      toast.error("Preencha todos os campos da credencial.");
      return;
    }

    setSalvandoCredencial(true);
    try {
      if (formularioAberto && formularioAberto !== "novo") {
        await atualizarCredencial(
          sistemaId,
          ambiente,
          formularioAberto.id,
          payload,
          tokenElevado,
        );
        toast.success("Credencial atualizada com sucesso.");
      } else {
        await adicionarCredencial(sistemaId, ambiente, payload, tokenElevado);
        toast.success("Credencial adicionada com sucesso.");
      }
      setFormularioAberto(null);
      await carregar();
    } catch (error) {
      tratarErro(error, "Erro ao guardar a credencial.");
    } finally {
      setSalvandoCredencial(false);
    }
  };

  const handleApagarCredencial = (credencial: Credencial) => {
    toast(`Apagar a credencial "${credencial.label}"?`, {
      description: "Esta ação não pode ser desfeita.",
      action: {
        label: "Apagar",
        onClick: async () => {
          try {
            await apagarCredencial(
              sistemaId,
              ambiente,
              credencial.id,
              tokenElevado,
            );
            toast.success("Credencial apagada.");
            await carregar();
          } catch (error) {
            tratarErro(error, "Erro ao apagar credencial.");
          }
        },
      },
      cancel: { label: "Cancelar", onClick: () => {} },
    });
  };

  const alternarRevelado = (id: number) => {
    setRevelados((prev) => {
      const novo = new Set(prev);
      if (novo.has(id)) {
        novo.delete(id);
      } else {
        novo.add(id);
      }
      return novo;
    });
  };

  const copiarValor = async (id: number, valor: string) => {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiadoId(id);
      toast.success("Valor copiado para a área de transferência.");
      setTimeout(() => setCopiadoId(null), 2000);
    } catch {
      toast.error("Não foi possível copiar o valor.");
    }
  };

  const formInvalido =
    !campoCredencial.label.trim() || !campoCredencial.valor.trim();

  const semCredenciais =
    !infraestrutura || infraestrutura.credenciais.length === 0;

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      {/* Seletor de ambiente */}
      <div
        role="group"
        aria-label="Ambiente"
        className="flex flex-wrap gap-2"
      >
        {AMBIENTES.map((a) => {
          const ativo = a.valor === ambiente;
          const total = resumo.find(
            (r) => r.ambiente === a.valor,
          )?.totalCredenciais;

          return (
            <button
              key={a.valor}
              type="button"
              onClick={() => mudarAmbiente(a.valor)}
              aria-pressed={ativo}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900/40 ${
                ativo
                  ? "bg-blue-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {a.label}
              {total !== undefined && (
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full font-normal ${
                    ativo
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-500"
                  }`}
                >
                  {total}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {carregando ? (
        <div className="flex justify-center items-center p-8 sm:p-12">
          <p className="text-slate-500 text-xs sm:text-sm animate-pulse">
            A carregar {labelAmbiente}...
          </p>
        </div>
      ) : (
        <>
          {/* Dados rápidos de servidor */}
          <form
            onSubmit={handleSalvarInfra}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4"
          >
            <h3 className="text-sm font-semibold text-slate-800">
              Dados do Servidor — {labelAmbiente}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">
                  IP do Servidor
                </label>
                <input
                  type="text"
                  value={ipServidor}
                  onChange={(e) => setIpServidor(e.target.value)}
                  readOnly={!ehAdmin}
                  placeholder={ehAdmin ? "ex: 192.168.1.10" : "—"}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800 transition-all read-only:text-slate-600"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">
                  Fornecedor de Cloud
                </label>
                <input
                  type="text"
                  value={cloudProvedor}
                  onChange={(e) => setCloudProvedor(e.target.value)}
                  readOnly={!ehAdmin}
                  placeholder={ehAdmin ? "ex: AWS (eu-west-1)" : "—"}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800 transition-all read-only:text-slate-600"
                />
              </div>
            </div>

            {ehAdmin && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={salvandoInfra}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {salvandoInfra ? "A guardar..." : "Guardar"}
                </button>
              </div>
            )}
          </form>

          {/* Lista de Credenciais */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-800">
                Credenciais
              </h3>
              {ehAdmin && !formularioAberto && (
                <button
                  type="button"
                  onClick={abrirNovaCredencial}
                  className="text-xs font-semibold text-blue-900 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-left sm:text-right"
                >
                  + Adicionar Credencial
                </button>
              )}
            </div>

            {semCredenciais && !formularioAberto && (
              <p className="text-xs text-slate-400 italic">
                {ehAdmin
                  ? `Ainda não há credenciais em ${labelAmbiente}. Adicione a primeira.`
                  : `Não há credenciais registadas em ${labelAmbiente}.`}
              </p>
            )}

            <div className="space-y-3">
              {infraestrutura?.credenciais.map((credencial) => {
                const isRevelado = revelados.has(credencial.id);
                const isCopiado = copiadoId === credencial.id;

                return (
                  <div
                    key={credencial.id}
                    className="border border-slate-100 rounded-lg p-3 space-y-2 hover:border-slate-200 transition-all"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {credencial.label}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {labelTipo(credencial.tipo)}
                        </p>
                      </div>
                      {ehAdmin && (
                        <div className="flex gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => abrirEditarCredencial(credencial)}
                            className="text-[11px] text-slate-500 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApagarCredencial(credencial)}
                            className="text-[11px] text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
                          >
                            Apagar
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-50 rounded-md p-2 flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-2 overflow-hidden">
                      <pre className="text-[11px] text-slate-700 whitespace-pre-wrap break-all font-mono max-w-full overflow-x-auto">
                        {isRevelado
                          ? credencial.valor
                          : "•".repeat(
                              Math.min(credencial.valor?.length || 24, 30),
                            )}
                      </pre>
                      <div className="flex justify-end gap-1 shrink-0 pt-1 sm:pt-0 border-t sm:border-0 border-slate-200/60">
                        <button
                          type="button"
                          onClick={() => alternarRevelado(credencial.id)}
                          className="text-[11px] text-slate-500 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
                        >
                          {isRevelado ? "Ocultar" : "Mostrar"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            credencial.valor &&
                            copiarValor(credencial.id, credencial.valor)
                          }
                          className="text-[11px] text-slate-500 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors cursor-pointer"
                        >
                          {isCopiado ? "Copiado!" : "Copiar"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Formulário Integrado na Página */}
          {ehAdmin && formularioAberto && (
            <form
              onSubmit={handleSalvarCredencial}
              className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4"
            >
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                {formularioAberto === "novo"
                  ? `Nova credencial — ${labelAmbiente}`
                  : `Editar credencial — ${labelAmbiente}`}
              </h3>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    TIPO
                  </label>
                  <select
                    value={campoCredencial.tipo}
                    onChange={(e) =>
                      setCampoCredencial((prev) => ({
                        ...prev,
                        tipo: e.target.value as TipoCredencial,
                      }))
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800 transition-all"
                  >
                    {TIPOS_CREDENCIAL.map((t) => (
                      <option key={t.valor} value={t.valor}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    RÓTULO <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={campoCredencial.label}
                    onChange={(e) =>
                      setCampoCredencial((prev) => ({
                        ...prev,
                        label: e.target.value,
                      }))
                    }
                    placeholder="Ex: Chave SSH — servidor principal"
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    VALOR <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={campoCredencial.valor}
                    onChange={(e) =>
                      setCampoCredencial((prev) => ({
                        ...prev,
                        valor: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Cole aqui o conteúdo (ex: variáveis de ambiente, chave, token...)"
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800 font-mono transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFormularioAberto(null)}
                  disabled={salvandoCredencial}
                  className="w-full py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoCredencial || formInvalido}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center"
                >
                  {salvandoCredencial ? "A guardar..." : "Guardar"}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}