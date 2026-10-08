import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Plataforma, Servidor } from "../../../types/plataforma";
import { IconOlhoAberto, IconOlhoFechado } from "../../../components/icons";

interface FormServidorProps {
  servidorExistente?: Servidor | null;
  plataformas: Plataforma[];
  salvando: boolean;
  onCancelar: () => void;
  onSubmit: (dados: Record<string, unknown>) => Promise<void>;
}

export default function FormServidor({
  servidorExistente,
  plataformas,
  salvando,
  onCancelar,
  onSubmit,
}: FormServidorProps) {
  const [plataformaId, setPlataformaId] = useState<number | string>(
    servidorExistente?.plataformaId ?? (plataformas[0]?.id || "")
  );
  const [nome, setNome] = useState(servidorExistente?.nome ?? "");
  const [hostname, setHostname] = useState(servidorExistente?.hostname ?? "");
  const [ip, setIp] = useState(servidorExistente?.ip ?? "");
  const [usernameSsh, setUsernameSsh] = useState(
    servidorExistente?.usernameSsh ?? "root"
  );
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [numeroCpu, setNumeroCpu] = useState(
    servidorExistente?.numeroCpu?.toString() ?? "2"
  );
  const [memoriaRam, setMemoriaRam] = useState(
    servidorExistente?.memoriaRam?.toString() ?? "4"
  );
  const [memoriaRamUnidade, setMemoriaRamUnidade] = useState<"MB" | "GB" | "TB">(
    servidorExistente?.memoriaRamUnidade ?? "GB"
  );
  const [disco, setDisco] = useState(
    servidorExistente?.disco?.toString() ?? "40"
  );
  const [discoUnidade, setDiscoUnidade] = useState<"MB" | "GB" | "TB">(
    servidorExistente?.discoUnidade ?? "GB"
  );
  const [larguraBanda, setLarguraBanda] = useState(
    servidorExistente?.larguraBanda?.toString() ?? "1000"
  );
  const [larguraBandaUnidade, setLarguraBandaUnidade] = useState<
    "MBPS" | "GBPS"
  >(servidorExistente?.larguraBandaUnidade ?? "MBPS");

  const [sistemaOperativo, setSistemaOperativo] = useState(
    servidorExistente?.sistemaOperativo ?? "Ubuntu Server"
  );
  const [versaoSo, setVersaoSo] = useState(servidorExistente?.versaoSo ?? "24.04 LTS");
  const [cloud, setCloud] = useState(servidorExistente?.cloud ?? "");
  const [regiao, setRegiao] = useState(servidorExistente?.regiao ?? "");

  useEffect(() => {
    if (servidorExistente) {
      setPlataformaId(servidorExistente.plataformaId);
      setNome(servidorExistente.nome);
      setHostname(servidorExistente.hostname);
      setIp(servidorExistente.ip ?? "");
      setUsernameSsh(servidorExistente.usernameSsh);
      setNumeroCpu(servidorExistente.numeroCpu.toString());
      setMemoriaRam(servidorExistente.memoriaRam.toString());
      setMemoriaRamUnidade(servidorExistente.memoriaRamUnidade ?? "GB");
      setDisco(servidorExistente.disco.toString());
      setDiscoUnidade(servidorExistente.discoUnidade ?? "GB");
      setLarguraBanda(servidorExistente.larguraBanda.toString());
      setLarguraBandaUnidade(servidorExistente.larguraBandaUnidade ?? "MBPS");
      setSistemaOperativo(servidorExistente.sistemaOperativo);
      setVersaoSo(servidorExistente.versaoSo ?? "");
      setCloud(servidorExistente.cloud ?? "");
      setRegiao(servidorExistente.regiao ?? "");
    }
  }, [servidorExistente]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!plataformaId) {
      toast.error("Selecione uma plataforma para o servidor.");
      return;
    }
    if (!nome.trim()) {
      toast.error("O nome do servidor é obrigatório.");
      return;
    }
    if (!hostname.trim()) {
      toast.error("O hostname é obrigatório.");
      return;
    }
    if (!ip.trim()) {
      toast.error("O IP do servidor é obrigatório.");
      return;
    }
    if (!servidorExistente && !password.trim()) {
      toast.error("A password de acesso SSH é obrigatória para novo servidor.");
      return;
    }

    const payload: Record<string, unknown> = {
      plataformaId: Number(plataformaId),
      nome: nome.trim(),
      hostname: hostname.trim(),
      ip: ip.trim(),
      usernameSsh: usernameSsh.trim(),
      numeroCpu: Number(numeroCpu),
      memoriaRam: Number(memoriaRam),
      memoriaRamUnidade,
      disco: Number(disco),
      discoUnidade,
      larguraBanda: Number(larguraBanda),
      larguraBandaUnidade,
      sistemaOperativo: sistemaOperativo.trim(),
      versaoSo: versaoSo.trim() || null,
      cloud: cloud.trim() || null,
      regiao: regiao.trim() || null,
    };

    if (password.trim()) {
      payload.password = password.trim();
    }

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">
            {servidorExistente ? "Editar Servidor" : "Novo Servidor"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastre um servidor físico ou máquina virtual com as suas credenciais e recursos
          </p>
        </div>

        {/* Plataforma Pai */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Plataforma Associada *
          </label>
          <select
            value={plataformaId}
            onChange={(e) => setPlataformaId(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 text-slate-800"
          >
            <option value="" disabled>Selecione a plataforma...</option>
            {plataformas.map((plat) => (
              <option key={plat.id} value={plat.id}>
                {plat.nome} ({plat.tipo})
              </option>
            ))}
          </select>
        </div>

        {/* Dados Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Nome de Exibição *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Servidor Produção Apps"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Hostname *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: srv01.netline.co.mz"
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Endereço IP (IPv4 ou IPv6) *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: 197.234.12.80"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
            />
          </div>
        </div>

        {/* Credenciais SSH */}
        <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Acesso SSH Seguro
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Utilizador SSH *
              </label>
              <input
                type="text"
                required
                placeholder="root ou ubuntu"
                value={usernameSsh}
                onChange={(e) => setUsernameSsh(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Password SSH {servidorExistente ? "(Deixe em branco para manter)" : "*"}
              </label>
              <div className="relative">
                <input
                  type={mostrarPassword ? "text" : "password"}
                  required={!servidorExistente}
                  placeholder={servidorExistente ? "••••••••••••" : "Palavra-passe segura"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 pr-10 text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {mostrarPassword ? <IconOlhoFechado /> : <IconOlhoAberto />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recursos de Hardware */}
        <div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
            Recursos e Especificações de Hardware
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* CPU */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Núcleos CPU *
              </label>
              <input
                type="number"
                min="1"
                required
                value={numeroCpu}
                onChange={(e) => setNumeroCpu(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
              />
            </div>

            {/* RAM */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Memória RAM *
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="1"
                  required
                  value={memoriaRam}
                  onChange={(e) => setMemoriaRam(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
                />
                <select
                  value={memoriaRamUnidade}
                  onChange={(e) => setMemoriaRamUnidade(e.target.value as "MB" | "GB" | "TB")}
                  className="px-2.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700"
                >
                  <option value="MB">MB</option>
                  <option value="GB">GB</option>
                  <option value="TB">TB</option>
                </select>
              </div>
            </div>

            {/* Disco */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Disco / Armazenamento *
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="1"
                  required
                  value={disco}
                  onChange={(e) => setDisco(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
                />
                <select
                  value={discoUnidade}
                  onChange={(e) => setDiscoUnidade(e.target.value as "MB" | "GB" | "TB")}
                  className="px-2.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700"
                >
                  <option value="MB">MB</option>
                  <option value="GB">GB</option>
                  <option value="TB">TB</option>
                </select>
              </div>
            </div>

            {/* Largura de Banda */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Largura de Banda *
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="1"
                  required
                  value={larguraBanda}
                  onChange={(e) => setLarguraBanda(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
                />
                <select
                  value={larguraBandaUnidade}
                  onChange={(e) => setLarguraBandaUnidade(e.target.value as "MBPS" | "GBPS")}
                  className="px-2.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700"
                >
                  <option value="MBPS">Mbps</option>
                  <option value="GBPS">Gbps</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sistema Operativo & Cloud */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Sistema Operativo *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Ubuntu, Debian, Rocky Linux"
              value={sistemaOperativo}
              onChange={(e) => setSistemaOperativo(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Versão do SO
            </label>
            <input
              type="text"
              placeholder="Ex: 22.04 LTS"
              value={versaoSo}
              onChange={(e) => setVersaoSo(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Provedor Cloud
            </label>
            <input
              type="text"
              placeholder="Ex: Hetzner, AWS, On-Premise"
              value={cloud}
              onChange={(e) => setCloud(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Região / Datacenter
            </label>
            <input
              type="text"
              placeholder="Ex: Falkenstein, eu-central-1"
              value={regiao}
              onChange={(e) => setRegiao(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
            />
          </div>
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
          {salvando ? "A salvar..." : servidorExistente ? "Atualizar Servidor" : "Criar Servidor"}
        </button>
      </div>
    </form>
  );
}

