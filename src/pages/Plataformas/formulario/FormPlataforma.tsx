import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Plataforma, TipoPlataforma } from "../../../types/plataforma";

interface FormPlataformaProps {
  plataformaExistente?: Plataforma | null;
  salvando: boolean;
  onCancelar: () => void;
  onSubmit: (dados: {
    nome: string;
    tipo: TipoPlataforma;
    urlPainel?: string | null;
    ativo?: boolean;
  }) => Promise<void>;
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

  useEffect(() => {
    if (plataformaExistente) {
      setNome(plataformaExistente.nome);
      setTipo(plataformaExistente.tipo);
      setUrlPainel(plataformaExistente.urlPainel ?? "");
      setAtivo(plataformaExistente.ativo);
    }
  }, [plataformaExistente]);

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

    await onSubmit({
      nome: nome.trim(),
      tipo,
      urlPainel: urlPainel.trim() ? urlPainel.trim() : null,
      ativo,
    });
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
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Nome da Plataforma *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Hetzner Cloud, Cloudflare, DigitalOcean"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-slate-800"
          />
        </div>

        {/* Tipo da Plataforma */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Tipo de Plataforma *
          </label>
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
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            URL do Painel de Acesso (Opcional)
          </label>
          <input
            type="url"
            placeholder="https://dash.cloudflare.com ou https://console.hetzner.cloud"
            value={urlPainel}
            onChange={(e) => setUrlPainel(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 transition-all text-slate-800"
          />
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

