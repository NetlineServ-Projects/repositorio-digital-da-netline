import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type {
  SistemaInfraestrutura,
  Credencial,
  TipoCredencial,
} from "../../../hooks/useSistemasData";
import { ErroApi } from "../../../utils/api";

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
  buscarInfraestrutura: (
    sistemaId: string | number,
    tokenElevado: string,
  ) => Promise<SistemaInfraestrutura | null>;
  salvarInfraestrutura: (
    sistemaId: string | number,
    dados: { ipServidor?: string; cloudProvedor?: string },
    tokenElevado: string,
  ) => Promise<unknown>;
  adicionarCredencial: (
    sistemaId: string | number,
    dados: { tipo: TipoCredencial; label: string; valor: string },
    tokenElevado: string,
  ) => Promise<unknown>;
  atualizarCredencial: (
    credencialId: number,
    dados: Partial<{ tipo: TipoCredencial; label: string; valor: string }>,
    tokenElevado: string,
  ) => Promise<unknown>;
  apagarCredencial: (
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
  buscarInfraestrutura,
  salvarInfraestrutura,
  adicionarCredencial,
  atualizarCredencial,
  apagarCredencial,
}: InfraestruturaTabProps) {
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

  // Tratamento centralizado e robusto de erros de API
  const tratarErro = useCallback(
    (error: unknown, mensagemGenerica: string) => {
      const isErroApi = error instanceof ErroApi;
      const status = isErroApi ? error.status : null;
      const mensagem =
        error instanceof Error ? error.message.toLowerCase() : "";

      if (
        status === 401 ||
        status === 403 ||
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
    setCarregando(true);
    try {
      const dados = await buscarInfraestrutura(sistemaId, tokenElevado);
      setInfraestrutura(dados);
      setIpServidor(dados?.ipServidor || "");
      setCloudProvedor(dados?.cloudProvedor || "");
    } catch (error) {
      tratarErro(error, "Erro ao carregar dados de infraestrutura.");
    } finally {
      setCarregando(false);
    }
  }, [sistemaId, tokenElevado, buscarInfraestrutura, tratarErro]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Fechar modal ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && formularioAberto) {
        setFormularioAberto(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [formularioAberto]);

  const handleSalvarInfra = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoInfra(true);
    try {
      await salvarInfraestrutura(
        sistemaId,
        { ipServidor: ipServidor.trim(), cloudProvedor: cloudProvedor.trim() },
        tokenElevado,
      );
      toast.success("Dados de infraestrutura guardados com sucesso.");
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
        await atualizarCredencial(formularioAberto.id, payload, tokenElevado);
        toast.success("Credencial atualizada com sucesso.");
      } else {
        await adicionarCredencial(sistemaId, payload, tokenElevado);
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
            await apagarCredencial(credencial.id, tokenElevado);
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
      novo.has(id) ? novo.delete(id) : novo.add(id);
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

  if (carregando) {
    return (
      <div className="flex justify-center items-center p-12">
        <p className="text-slate-500 text-sm animate-pulse">
          A carregar dados de infraestrutura...
        </p>
      </div>
    );
  }

  const formInvalido =
    !campoCredencial.label.trim() || !campoCredencial.valor.trim();

  return (
    <div className="space-y-6">
      {/* Dados rápidos de servidor */}
      <form
        onSubmit={handleSalvarInfra}
        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4"
      >
        <h3 className="text-sm font-semibold text-slate-800">
          Dados do Servidor
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
              placeholder="ex: 192.168.1.10"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800 transition-all"
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
              placeholder="ex: AWS (eu-west-1)"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end">
          {ehAdmin && (
            <button
              type="submit"
              disabled={salvandoInfra}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {salvandoInfra ? "A guardar..." : "Guardar"}
            </button>
          )}
        </div>
      </form>

      {/* Lista de Credenciais */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Credenciais</h3>
          <button
            type="button"
            onClick={abrirNovaCredencial}
            className="text-xs font-semibold text-blue-900 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            + Adicionar Credencial
          </button>
        </div>

        {(!infraestrutura || infraestrutura.credenciais.length === 0) && (
          <p className="text-xs text-slate-400 italic">
            Nenhuma credencial registada ainda.
          </p>
        )}

        <div className="space-y-2">
          {infraestrutura?.credenciais.map((credencial) => {
            const isRevelado = revelados.has(credencial.id);
            const isCopiado = copiadoId === credencial.id;

            return (
              <div
                key={credencial.id}
                className="border border-slate-100 rounded-lg p-3 space-y-2 hover:border-slate-200 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      {credencial.label}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {labelTipo(credencial.tipo)}
                    </p>
                  </div>
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
                </div>

                <div className="bg-slate-50 rounded-md p-2 flex items-start justify-between gap-2">
                  <pre className="text-[11px] text-slate-700 whitespace-pre-wrap break-all font-mono">
                    {isRevelado
                      ? credencial.valor
                      : "•".repeat(
                          Math.min(credencial.valor?.length || 24, 40),
                        )}
                  </pre>
                  <div className="flex gap-1 shrink-0">
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

      {/* Formulário Modal de adicionar/editar credencial */}
      {formularioAberto && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setFormularioAberto(null)}
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleSalvarCredencial}
            onClick={(e) => e.stopPropagation()} // Impede fechar ao clicar no corpo do form
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <h3 className="text-sm font-semibold text-slate-800">
              {formularioAberto === "novo"
                ? "Nova Credencial"
                : "Editar Credencial"}
            </h3>

            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">
                Tipo
              </label>
              <select
                value={campoCredencial.tipo}
                onChange={(e) =>
                  setCampoCredencial((prev) => ({
                    ...prev,
                    tipo: e.target.value as TipoCredencial,
                  }))
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
              >
                {TIPOS_CREDENCIAL.map((t) => (
                  <option key={t.valor} value={t.valor}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">
                Rótulo
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
                placeholder='ex: "Chave SSH — servidor principal"'
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">
                Valor
              </label>
              <textarea
                value={campoCredencial.valor}
                onChange={(e) =>
                  setCampoCredencial((prev) => ({
                    ...prev,
                    valor: e.target.value,
                  }))
                }
                rows={6}
                placeholder="Cole aqui o conteúdo (ex: variáveis de ambiente, chave, token...)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setFormularioAberto(null)}
                disabled={salvandoCredencial}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvandoCredencial || formInvalido}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {salvandoCredencial ? "A guardar..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
