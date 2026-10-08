import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Dominio, Servidor, Subdominio, TipoDns } from "../../../types/plataforma";

interface FormSubdominioProps {
  subdominioExistente?: Subdominio | null;
  dominios: Dominio[];
  servidores: Servidor[];
  salvando: boolean;
  onCancelar: () => void;
  onSubmit: (dados: {
    dominioId: number;
    nome: string;
    tipoDns: string;
    servidorId?: number | null;
    destino?: string | null;
  }) => Promise<void>;
}

const TIPOS_DNS_COMUNS: TipoDns[] = [
  "A",
  "CNAME",
  "AAAA",
  "MX",
  "TXT",
  "NS",
  "SRV",
  "CAA",
];

export default function FormSubdominio({
  subdominioExistente,
  dominios,
  servidores,
  salvando,
  onCancelar,
  onSubmit,
}: FormSubdominioProps) {
  const [dominioId, setDominioId] = useState<number | string>(
    subdominioExistente?.dominioId ?? (dominios[0]?.id || "")
  );
  const [nome, setNome] = useState(subdominioExistente?.nome ?? "");
  const [tipoDns, setTipoDns] = useState<TipoDns>(
    subdominioExistente?.tipoDns ?? "A"
  );
  const [apontarParaServidor, setApontarParaServidor] = useState(
    Boolean(subdominioExistente?.servidorId) || (!subdominioExistente && servidores.length > 0)
  );
  const [servidorId, setServidorId] = useState<number | string>(
    subdominioExistente?.servidorId ?? (servidores[0]?.id || "")
  );
  const [destino, setDestino] = useState(subdominioExistente?.destino ?? "");

  useEffect(() => {
    if (subdominioExistente) {
      setDominioId(subdominioExistente.dominioId);
      setNome(subdominioExistente.nome);
      setTipoDns(subdominioExistente.tipoDns);
      if (subdominioExistente.servidorId) {
        setApontarParaServidor(true);
        setServidorId(subdominioExistente.servidorId);
      } else {
        setApontarParaServidor(false);
        setDestino(subdominioExistente.destino ?? "");
      }
    }
  }, [subdominioExistente]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dominioId) {
      toast.error("Selecione o domínio ao qual este registo pertence.");
      return;
    }
    if (!nome.trim()) {
      toast.error("O prefixo ou nome do registo é obrigatório (use @ para raiz).");
      return;
    }

    if (apontarParaServidor && !servidorId) {
      toast.error("Selecione um servidor para apontar este registo.");
      return;
    }

    if (!apontarParaServidor && !destino.trim()) {
      toast.error("Indique o destino ou valor do registo DNS.");
      return;
    }

    await onSubmit({
      dominioId: Number(dominioId),
      nome: nome.trim().toLowerCase(),
      tipoDns,
      servidorId: apontarParaServidor && servidorId ? Number(servidorId) : null,
      destino: !apontarParaServidor && destino.trim() ? destino.trim() : null,
    });
  };

  const dominioSelecionado = dominios.find((d) => String(d.id) === String(dominioId));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">
            {subdominioExistente ? "Editar Registo DNS / Subdomínio" : "Novo Registo DNS / Subdomínio"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure apontamentos de subdomínios para servidores ou serviços externos
          </p>
        </div>

        {/* Domínio Pai */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Domínio Base *
          </label>
          <select
            value={dominioId}
            onChange={(e) => setDominioId(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
          >
            <option value="" disabled>Selecione o domínio...</option>
            {dominios.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Prefixo e Tipo DNS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Prefixo / Nome do Registo *
            </label>
            <div className="flex items-center">
              <input
                type="text"
                required
                placeholder="ex: app, api, portal, @ (para raiz), * (wildcard)"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
              />
              <span className="px-3.5 py-2.5 text-xs font-semibold text-slate-500 bg-slate-100 border border-l-0 border-slate-200 rounded-r-xl select-none">
                .{dominioSelecionado ? dominioSelecionado.nome : "dominio.com"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Tipo de Registo DNS *
            </label>
            <select
              value={tipoDns}
              onChange={(e) => setTipoDns(e.target.value as TipoDns)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800 font-bold"
            >
              {TIPOS_DNS_COMUNS.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modo de Apontamento: Servidor vs Destino Livre */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
              <input
                type="radio"
                name="modoDestino"
                checked={apontarParaServidor}
                onChange={() => setApontarParaServidor(true)}
                className="text-blue-600 focus:ring-blue-500"
              />
              Apontar para um Servidor Netline
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
              <input
                type="radio"
                name="modoDestino"
                checked={!apontarParaServidor}
                onChange={() => setApontarParaServidor(false)}
                className="text-blue-600 focus:ring-blue-500"
              />
              Destino Personalizado (IP, Hostname ou Texto)
            </label>
          </div>

          {apontarParaServidor ? (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Selecione o Servidor Alvo *
              </label>
              <select
                value={servidorId}
                onChange={(e) => setServidorId(e.target.value)}
                required={apontarParaServidor}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
              >
                <option value="" disabled>Selecione um servidor...</option>
                {servidores.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.nome} — {srv.hostname} ({srv.ip || "IP protegido"})
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1">
                Ao selecionar o servidor, o IP configurado nele será associado automaticamente.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Endereço de Destino / Valor do Registo *
              </label>
              <input
                type="text"
                required={!apontarParaServidor}
                placeholder={
                  tipoDns === "A"
                    ? "ex: 197.234.12.80"
                    : tipoDns === "CNAME"
                    ? "ex: netlineserv.github.io"
                    : tipoDns === "TXT"
                    ? "ex: v=spf1 include:_spf.google.com ~all"
                    : "Destino do registo"
                }
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
              />
            </div>
          )}
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
          {salvando ? "A salvar..." : subdominioExistente ? "Atualizar Registo" : "Criar Registo"}
        </button>
      </div>
    </form>
  );
}

