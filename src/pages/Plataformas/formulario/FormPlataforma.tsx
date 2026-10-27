import { useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  CatalogoFornecedores,
  DadosPlataforma,
  Plataforma,
  TipoPlataforma,
} from "../../../types/plataforma";
import { API_URL } from "../../../utils/api";
import SegredoRevelavel from "../../../components/segredoRevelavel";
import {
  listarFornecedores,
  revelarTokenPlataforma,
} from "../../../hooks/usePlataformasData";
import { IconOlhoAberto, IconOlhoFechado } from "../../../components/icons";
import SelectPesquisavel from "../../../components/selectPesquisavel";

interface FormPlataformaProps {
  plataformaExistente?: Plataforma | null;
  salvando: boolean;
  onCancelar: () => void;
  onSubmit: (dados: DadosPlataforma, logotipo: File | null) => Promise<void>;
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

const FORNECEDOR_OUTRO = "OUTRO";
const FORMATOS_LOGOTIPO = ["image/png", "image/jpeg", "image/webp"];
const TAMANHO_MAXIMO_LOGOTIPO = 2 * 1024 * 1024; // 2 MB

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
  // Lista de fornecedores de cada tipo (vem do backend)
  const [catalogo, setCatalogo] = useState<CatalogoFornecedores | null>(null);

  const [tipo, setTipo] = useState<TipoPlataforma>(
    plataformaExistente?.tipo ?? "CONTAINERIZACAO",
  );
  const [fornecedor, setFornecedor] = useState(plataformaExistente?.fornecedor ?? "");
  // O nome só se escreve quando o fornecedor é "Outro"; nos restantes vem do fornecedor
  const [nome, setNome] = useState(
    plataformaExistente?.fornecedor === FORNECEDOR_OUTRO ? plataformaExistente.nome : "",
  );
  const [urlPainel, setUrlPainel] = useState(plataformaExistente?.urlPainel ?? "");
  const [ativo, setAtivo] = useState(plataformaExistente?.ativo ?? true);

  // Credenciais de acesso (todos os tipos)
  const [utilizador, setUtilizador] = useState(plataformaExistente?.utilizador ?? "");
  const [token, setToken] = useState("");
  const [mostrarToken, setMostrarToken] = useState(false);

  // Registry (só containerização)
  const [registryUrl, setRegistryUrl] = useState(plataformaExistente?.registryUrl ?? "");
  const [namespace, setNamespace] = useState(plataformaExistente?.namespace ?? "");

  // Logótipo
  const [logotipo, setLogotipo] = useState<File | null>(null);
  const [previewLogotipo, setPreviewLogotipo] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    listarFornecedores()
      .then((dados) => {
        if (!cancelado) setCatalogo(dados);
      })
      .catch(() => toast.error("Não foi possível carregar a lista de fornecedores."));
    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    if (!logotipo) {
      setPreviewLogotipo(null);
      return;
    }
    const url = URL.createObjectURL(logotipo);
    setPreviewLogotipo(url);
    return () => URL.revokeObjectURL(url);
  }, [logotipo]);

  const ehContainerizacao = tipo === "CONTAINERIZACAO";
  const ehOutro = fornecedor === FORNECEDOR_OUTRO;
  const opcoes = catalogo?.[tipo] ?? [];
  const fornecedorEscolhido = opcoes.find((o) => o.valor === fornecedor);

  const logotipoMostrado =
    previewLogotipo ??
    (plataformaExistente?.logotipo ? `${API_URL}${plataformaExistente.logotipo}` : null);

  const escolherTipo = (novo: TipoPlataforma) => {
    setTipo(novo);
    // O fornecedor escolhido tem de pertencer ao novo tipo
    if (fornecedor && !catalogo?.[novo]?.some((o) => o.valor === fornecedor)) {
      setFornecedor("");
    }
  };

  // O fornecedor preenche o URL do painel e o do registry, sem apagar o que a pessoa escreveu
  const escolherFornecedor = (valor: string) => {
    const anterior = opcoes.find((o) => o.valor === fornecedor);
    const novo = opcoes.find((o) => o.valor === valor);

    setFornecedor(valor);

    if (!urlPainel.trim() || urlPainel === anterior?.urlPainel) {
      setUrlPainel(novo?.urlPainel ?? "");
    }
    if (ehContainerizacao && (!registryUrl.trim() || registryUrl === anterior?.registryUrl)) {
      setRegistryUrl(novo?.registryUrl ?? "");
    }
  };

  const escolherLogotipo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ficheiro = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!ficheiro) return;

    if (!FORMATOS_LOGOTIPO.includes(ficheiro.type)) {
      toast.error("O logótipo deve ser PNG, JPEG ou WebP.");
      return;
    }
    if (ficheiro.size > TAMANHO_MAXIMO_LOGOTIPO) {
      toast.error("O logótipo não pode ter mais de 2 MB.");
      return;
    }
    setLogotipo(ficheiro);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fornecedor) {
      toast.error("Escolha o fornecedor.");
      return;
    }
    if (ehOutro && nome.trim().length < 2) {
      toast.error('Indique o nome da plataforma (o fornecedor é "Outro").');
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
      tipo,
      fornecedor,
      urlPainel: urlPainel.trim() || null,
      ativo,
      utilizador: utilizador.trim() || null,
    };

    if (ehOutro) dados.nome = nome.trim();

    // Em branco = manter o token atual
    if (token) dados.token = token;

    // Nos outros tipos estes campos nem são enviados (o backend recusa-os)
    if (ehContainerizacao) {
      dados.registryUrl = registryUrl.trim() || null;
      dados.namespace = namespace.trim() || null;
    }

    await onSubmit(dados, logotipo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">
            {plataformaExistente ? "Editar Plataforma" : "Nova Plataforma"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre os provedores de infraestrutura, servidores ou gestores de domínio da Netline
          </p>
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
                    onChange={() => escolherTipo(op.valor)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-bold text-slate-800">{op.rotulo}</span>
                </div>
                <p className="text-xs text-slate-500 pl-5 leading-relaxed">{op.descricao}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Fornecedor (dele sai o nome) */}
        <div>
          <label htmlFor="plataforma-fornecedor" className={CLASSE_ROTULO}>Fornecedor *</label>
          <SelectPesquisavel
            id="plataforma-fornecedor"
            valor={fornecedor}
            onChange={escolherFornecedor}
            disabled={!catalogo}
            placeholder={catalogo ? "Selecione o fornecedor..." : "A carregar..."}
            opcoes={opcoes.map((o) => ({ valor: o.valor, label: o.rotulo }))}
          />
          {fornecedorEscolhido && !ehOutro && (
            <p className="text-xs text-slate-500 mt-1.5">
              Nome da plataforma: <strong>{fornecedorEscolhido.rotulo}</strong>
            </p>
          )}
        </div>

        {/* Nome (só quando o fornecedor é "Outro") */}
        {ehOutro && (
          <div>
            <label className={CLASSE_ROTULO}>Nome da Plataforma *</label>
            <input
              type="text"
              placeholder="Ex: Servidores da Netline"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={CLASSE_CAMPO}
            />
          </div>
        )}

        {/* URL Painel */}
        <div>
          <label className={CLASSE_ROTULO}>URL do Painel de Acesso (Opcional)</label>
          <input
            type="url"
            placeholder="https://dash.cloudflare.com ou https://console.hetzner.cloud"
            value={urlPainel}
            onChange={(e) => setUrlPainel(e.target.value)}
            className={CLASSE_CAMPO}
          />
        </div>

        {/* Credenciais de acesso (todos os tipos) */}
        <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-4">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Credenciais de Acesso
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Utilizador
              </label>
              <input
                type="text"
                placeholder="Utilizador da conta"
                value={utilizador}
                onChange={(e) => setUtilizador(e.target.value)}
                autoComplete="off"
                className={`${CLASSE_CAMPO} bg-white`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Token ou senha
              </label>
              <div className="relative">
                <input
                  type={mostrarToken ? "text" : "password"}
                  placeholder={
                    plataformaExistente?.temToken
                      ? "Deixe em branco para manter"
                      : "Token ou senha de acesso"
                  }
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
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

          {plataformaExistente?.temToken && (
            <div className="space-y-1 bg-white border border-slate-200 rounded-lg p-2.5">
              <p className="text-[11px] font-semibold text-slate-500">Token guardado</p>
              <SegredoRevelavel
                descricao={`token da plataforma ${plataformaExistente.nome}`}
                obter={(tokenElevado) =>
                  revelarTokenPlataforma(plataformaExistente.id, tokenElevado)
                }
              />
            </div>
          )}
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
                  URL do Registry
                </label>
                <input
                  type="text"
                  placeholder="Ex: docker.io ou ghcr.io/netline"
                  value={registryUrl}
                  onChange={(e) => setRegistryUrl(e.target.value)}
                  className={`${CLASSE_CAMPO} bg-white`}
                />
                <p className="text-[11px] text-slate-400 mt-1">Sem http:// nem https://.</p>
              </div>
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
            </div>
          </div>
        )}

        {/* Logótipo */}
        <div>
          <label className={CLASSE_ROTULO}>Logótipo (Opcional)</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
              {logotipoMostrado ? (
                <img
                  src={logotipoMostrado}
                  alt="Logótipo da plataforma"
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <span className="text-[11px] text-slate-400">Sem logo</span>
              )}
            </div>
            <div className="space-y-1 min-w-0">
              <input
                type="file"
                accept={FORMATOS_LOGOTIPO.join(",")}
                onChange={escolherLogotipo}
                className="w-full text-xs text-slate-600 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 file:font-semibold hover:file:bg-slate-200 file:cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">PNG, JPEG ou WebP, até 2 MB.</p>
            </div>
          </div>
        </div>

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
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
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