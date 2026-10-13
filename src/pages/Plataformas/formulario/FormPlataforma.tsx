import { useState, useEffect } from "react";
import { toast } from "sonner";
import type {
  Plataforma,
  TipoPlataforma,
  FornecedorContainer,
  DadosPlataforma,
} from "../../../types/plataforma";
import { ROTULOS_FORNECEDOR_CONTAINER } from "../../../types/plataformaConstantes";
import { IconOlhoAberto, IconOlhoFechado } from "../../../components/icons";

interface FormPlataformaProps {
  plataformaExistente?: Plataforma | null;
  salvando: boolean;
  onCancelar: () => void;
  onSubmit: (dados: DadosPlataforma) => Promise<void>;
}

const OPCOES_TIPO: { valor: TipoPlataforma; rotulo: string; descricao: string }[] = [
  {
    valor: "CONTAINERIZACAO",
    rotulo: "Containerização & Nuvem",
    descricao: "Docker, Kubernetes, Portainer, VPS, Servidores dedicados",
  },
  {
    valor: "CLOUD_BASE_DADOS",
    rotulo: "Cloud Base de Dados",
    descricao: "Clusters de banco de dados gerenciados, backups na nuvem",
  },
  {
    valor: "GESTAO_DOMINIO",
    rotulo: "Gestão de Domínio & DNS",
    descricao: "Cloudflare, cPanel, Registradores de domínios e zonas DNS",
  },
];

// Endereço de registry sugerido quando o campo ainda está vazio
const REGISTRY_POR_FORNECEDOR: Partial<Record<FornecedorContainer, string>> = {
  DOCKER_HUB: "docker.io",
  GITHUB_CONTAINER_REGISTRY: "ghcr.io",
  GITLAB_REGISTRY: "registry.gitlab.com",
};

const CLASSE_CAMPO =
  "w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-slate-800";
const CLASSE_ROTULO =
  "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2";

export default function FormPlataforma({
  plataformaExistente,
  salvando,
  onCancelar,
  onSubmit,
}: FormPlataformaProps) {
  const [nome, setNome] = useState(plataformaExistente?.nome ?? "");
  const [tipo, setTipo] = useState<TipoPlataforma>(
    plataformaExistente?.tipo ?? "CONTAINERIZACAO"
  );
  const [urlPainel, setUrlPainel] = useState(
    plataformaExistente?.urlPainel ?? ""
  );
  const [ativo, setAtivo] = useState(plataformaExistente?.ativo ?? true);

  // Registry (só para containerização)
  const [fornecedor, setFornecedor] = useState<FornecedorContainer | "">(
    plataformaExistente?.fornecedorContainer ?? ""
  );
  const [registryUrl, setRegistryUrl] = useState(
    plataformaExistente?.registryUrl ?? ""
  );
  const [namespace, setNamespace] = useState(
    plataformaExistente?.namespace ?? ""
  );
  const [registryUtilizador, setRegistryUtilizador] = useState(
    plataformaExistente?.registryUtilizador ?? ""
  );
  const [registryToken, setRegistryToken] = useState("");
  const [mostrarToken, setMostrarToken] = useState(false);

  const ehContainerizacao = tipo === "CONTAINERIZACAO";

  useEffect(() => {
    if (plataformaExistente) {
      setNome(plataformaExistente.nome);
      setTipo(plataformaExistente.tipo);
      setUrlPainel(plataformaExistente.urlPainel ?? "");
      setAtivo(plataformaExistente.ativo);
      setFornecedor(plataformaExistente.fornecedorContainer ?? "");
      setRegistryUrl(plataformaExistente.registryUrl ?? "");
      setNamespace(plataformaExistente.namespace ?? "");
      setRegistryUtilizador(plataformaExistente.registryUtilizador ?? "");
    }
  }, [plataformaExistente]);

  const handleFornecedor = (valor: FornecedorContainer | "") => {
    setFornecedor(valor);
    const sugestao = valor ? REGISTRY_POR_FORNECEDOR[valor] : undefined;
    if (sugestao && !registryUrl.trim()) {
      setRegistryUrl(sugestao);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error("O nome da plataforma é obrigatório.");
      return;
    }

    if (urlPainel.trim()) {
      try {
        const url = new URL(urlPainel.trim());
        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error();
        }
      } catch {
        toast.error("O URL do painel deve ser válido (ex: https://painel.netline.co.mz).");
        return;
      }
    }

    const dados: DadosPlataforma = {
      nome: nome.trim(),
      tipo,
      urlPainel: urlPainel.trim() ? urlPainel.trim() : null,
      ativo,
    };

    // Noutros tipos os campos de registry nem são enviados (o backend recusa-os)
    if (ehContainerizacao) {
      dados.fornecedorContainer = fornecedor || null;
      dados.registryUrl = registryUrl.trim() || null;
      dados.namespace = namespace.trim() || null;
      dados.registryUtilizador = registryUtilizador.trim() || null;
      // Em branco = manter o token atual
      if (registryToken) {
        dados.registryToken = registryToken;
      }
    }

    await onSubmit(dados);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">
            {plataformaExistente ? "Editar Plataforma" : "Nova Plataforma"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre os provedores de infraestrutura, servidores ou gestores de domínio da Netline
          </p>
        </div>

        {/* Nome */}
        <div>
          <label className={CLASSE_ROTULO}>Nome da Plataforma *</label>
          <input
            type="text"
            required
            placeholder="Ex: Hetzner Cloud, Cloudflare, DigitalOcean"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={CLASSE_CAMPO}
          />
        </div>

        {/* Tipo da Plataforma */}
        <div>
          <label className={CLASSE_ROTULO}>Tipo de Plataforma *</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {OPCOES_TIPO.map((op) => (
              <label
                key={op.valor}
                className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                  tipo === op.valor
                    ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/10 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <input
                    type="radio"
                    name="tipoPlataforma"
                    value={op.valor}
                    checked={tipo === op.valor}
                    onChange={() => setTipo(op.valor)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-bold text-slate-800">
                    {op.rotulo}
                  </span>
                </div>
                <p className="text-xs text-slate-500 pl-5 leading-relaxed">
                  {op.descricao}
                </p>
              </label>
            ))}
          </div>
        </div>

        {/* URL Painel */}
        <div>
          <label className={CLASSE_ROTULO}>
            URL do Painel de Acesso (Opcional)
          </label>
          <input
            type="url"
            placeholder="https://dash.cloudflare.com ou https://console.hetzner.cloud"
            value={urlPainel}
            onChange={(e) => setUrlPainel(e.target.value)}
            className={CLASSE_CAMPO}
          />
        </div>

        {/* Registry (só containerização) */}
        {ehContainerizacao && (
          <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-4">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Registry de Imagens
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Fornecedor
                </label>
                <select
                  value={fornecedor}
                  onChange={(e) =>
                    handleFornecedor(e.target.value as FornecedorContainer | "")
                  }
                  className={`${CLASSE_CAMPO} bg-white`}
                >
                  <option value="">Selecione o fornecedor...</option>
                  {(
                    Object.keys(ROTULOS_FORNECEDOR_CONTAINER) as FornecedorContainer[]
                  ).map((valor) => (
                    <option key={valor} value={valor}>
                      {ROTULOS_FORNECEDOR_CONTAINER[valor]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  URL do Registry
                </label>
                <input
                  type="text"
                  placeholder="Ex: docker.io ou ghcr.io/netline"
                  value={registryUrl}
                  onChange={(e) => setRegistryUrl(e.target.value)}
                  className={`${CLASSE_CAMPO} bg-white`}
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Sem http:// nem https://.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Namespace
                </label>
                <input
                  type="text"
                  placeholder="Ex: netline"
                  value={namespace}
                  onChange={(e) => setNamespace(e.target.value)}
                  className={`${CLASSE_CAMPO} bg-white`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Utilizador
                </label>
                <input
                  type="text"
                  placeholder="Utilizador do registry"
                  value={registryUtilizador}
                  onChange={(e) => setRegistryUtilizador(e.target.value)}
                  className={`${CLASSE_CAMPO} bg-white`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Token
                </label>
                <div className="relative">
                  <input
                    type={mostrarToken ? "text" : "password"}
                    placeholder={
                      plataformaExistente?.temTokenRegistry
                        ? "Deixe em branco para manter"
                        : "Token de acesso"
                    }
                    value={registryToken}
                    onChange={(e) => setRegistryToken(e.target.value)}
                    autoComplete="new-password"
                    className={`${CLASSE_CAMPO} bg-white pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarToken(!mostrarToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {mostrarToken ? <IconOlhoFechado /> : <IconOlhoAberto />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ativo */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="platAtivo"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="platAtivo" className="text-sm font-medium text-slate-700 cursor-pointer">
            Plataforma ativa e operacional
          </label>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancelar}
          disabled={salvando}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={salvando}
          className="px-6 py-2.5 bg-[#18357a] hover:bg-blue-900 text-white font-semibold text-sm rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          {salvando ? "A salvar..." : plataformaExistente ? "Atualizar Plataforma" : "Criar Plataforma"}
        </button>
      </div>
    </form>
  );
}