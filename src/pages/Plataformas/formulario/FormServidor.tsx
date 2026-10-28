import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { Plataforma, Servidor } from "../../../types/plataforma";
import { IconOlhoAberto, IconOlhoFechado } from "../../../components/icons";
import { ROTULOS_TIPO_PLATAFORMA } from "../../../types/plataformaConstantes";
import SelectPesquisavel from "../../../components/selectPesquisavel";

type EstadoServidor = "ATIVO" | "INATIVO";
interface FormServidorProps {
  servidorExistente?: Servidor | null;
  plataformas: Plataforma[];
  salvando: boolean;
  onCancelar: () => void;
  onSubmit: (dados: Record<string, unknown>) => Promise<void>;
}

const OPCOES_UNIDADE_ARMAZENAMENTO = [
  { valor: "MB", label: "MB" },
  { valor: "GB", label: "GB" },
  { valor: "TB", label: "TB" },
];

export default function FormServidor({
  servidorExistente,
  plataformas,
  salvando,
  onCancelar,
  onSubmit,
}: FormServidorProps) {
  const { t } = useTranslation();
  // Só a Cloud/Base de dados aloja servidores (containerização é um registo de imagens)
  const plataformasCloud = plataformas.filter((p) => p.tipo === "CLOUD_BASE_DADOS");
  // Um servidor antigo numa plataforma que já não é válida obriga a escolher outra
  const plataformaInicial = plataformasCloud.some((p) => p.id === servidorExistente?.plataformaId)
    ? servidorExistente?.plataformaId
    : servidorExistente
      ? ""
      : plataformasCloud[0]?.id;
  const [plataformaId, setPlataformaId] = useState<number | string>(plataformaInicial ?? "");
  const [nome, setNome] = useState(servidorExistente?.nome ?? "");
  const [hostname, setHostname] = useState(servidorExistente?.hostname ?? "");
  const [ip, setIp] = useState(servidorExistente?.ip ?? "");
  const [usernameSsh, setUsernameSsh] = useState(
    servidorExistente?.usernameSsh ?? "root",
  );
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [numeroCpu, setNumeroCpu] = useState(
    servidorExistente?.numeroCpu?.toString() ?? "2",
  );
  const [memoriaRam, setMemoriaRam] = useState(
    servidorExistente?.memoriaRam?.toString() ?? "4",
  );
  const [memoriaRamUnidade, setMemoriaRamUnidade] = useState<
    "MB" | "GB" | "TB"
  >(servidorExistente?.memoriaRamUnidade ?? "GB");
  const [disco, setDisco] = useState(
    servidorExistente?.disco?.toString() ?? "40",
  );
  const [discoUnidade, setDiscoUnidade] = useState<"MB" | "GB" | "TB">(
    servidorExistente?.discoUnidade ?? "GB",
  );
  const [larguraBanda, setLarguraBanda] = useState(
    servidorExistente?.larguraBanda?.toString() ?? "1000",
  );
  const [larguraBandaUnidade, setLarguraBandaUnidade] = useState<
    "MBPS" | "GBPS"
  >(servidorExistente?.larguraBandaUnidade ?? "MBPS");

  const [sistemaOperativo, setSistemaOperativo] = useState(
    servidorExistente?.sistemaOperativo ?? "Ubuntu Server",
  );
  const [versaoSo, setVersaoSo] = useState(
    servidorExistente?.versaoSo ?? "24.04 LTS",
  );
  const [cloud, setCloud] = useState(servidorExistente?.cloud ?? "");
  const [regiao, setRegiao] = useState(servidorExistente?.regiao ?? "");

  const [estado, setEstado] = useState<EstadoServidor>(
    servidorExistente?.estado ?? "INATIVO",
  );

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
      setEstado(servidorExistente.estado ?? "INATIVO");
    }
  }, [servidorExistente]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!plataformaId) {
      toast.error(t("plataformas.form.servidor.selecionePlataforma"));
      return;
    }
    if (!nome.trim()) {
      toast.error(t("plataformas.form.servidor.nomeObrigatorio"));
      return;
    }
    if (!hostname.trim()) {
      toast.error(t("plataformas.form.servidor.hostnameObrigatorio"));
      return;
    }
    if (!ip.trim()) {
      toast.error(t("plataformas.form.servidor.ipObrigatorio"));
      return;
    }
    if (!servidorExistente && !password.trim()) {
      toast.error(t("plataformas.form.servidor.passwordObrigatoria"));
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
      estado: estado,
    };

    // Envia a password tal como foi escrita: pode começar ou acabar com espaços
    if (password.trim()) {
      payload.password = password;
    }

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">
            {servidorExistente ? t("plataformas.form.servidor.tituloEditar") : t("plataformas.form.servidor.tituloNovo")}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t("plataformas.form.servidor.descricao")}
          </p>
        </div>

        {/* Plataforma Pai */}
        <div>
          <label htmlFor="servidor-plataforma" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            {t("plataformas.form.plataformaAssociada")}
          </label>
          <SelectPesquisavel
            id="servidor-plataforma"
            valor={String(plataformaId)}
            onChange={setPlataformaId}
            required
            placeholder={t("plataformas.form.selecionePlataforma")}
            opcoes={plataformasCloud.map((plat) => ({
              valor: String(plat.id),
              label: plat.nome,
              descricao: ROTULOS_TIPO_PLATAFORMA[plat.tipo] ?? plat.tipo,
            }))}
          />
        </div>
        {/* Estado do Servidor */}
        <div>
          <label htmlFor="servidor-estado" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            {t("plataformas.form.servidor.estado")}
          </label>
          <SelectPesquisavel
            id="servidor-estado"
            valor={estado}
            onChange={(v) => setEstado(v as EstadoServidor)}
            opcoes={[
              { valor: "INATIVO", label: t("plataformas.estadoServidor.INATIVO") },
              { valor: "ATIVO", label: t("plataformas.estadoServidor.ATIVO") },
            ]}
          />
        </div>

        {/* Dados Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {t("plataformas.form.servidor.nome")}
            </label>
            <input
              type="text"
              required
              placeholder={t("plataformas.form.servidor.nomePlaceholder")}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {t("plataformas.form.servidor.hostname")}
            </label>
            <input
              type="text"
              required
              placeholder={t("plataformas.form.servidor.hostnamePlaceholder")}
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {t("plataformas.form.servidor.ip")}
            </label>
            <input
              type="text"
              required
              placeholder={t("plataformas.form.servidor.ipPlaceholder")}
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
            />
          </div>
        </div>

        {/* Credenciais SSH */}
        <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            {t("plataformas.form.servidor.acessoSsh")}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t("plataformas.form.servidor.utilizadorSsh")}
              </label>
              <input
                type="text"
                required
                placeholder={t("plataformas.form.servidor.utilizadorSshPlaceholder")}
                value={usernameSsh}
                onChange={(e) => setUsernameSsh(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t("plataformas.form.servidor.passwordSsh")}{" "}
                {servidorExistente ? t("plataformas.form.servidor.passwordManter") : "*"}
              </label>
              <div className="relative">
                <input
                  type={mostrarPassword ? "text" : "password"}
                  required={!servidorExistente}
                  placeholder={
                    servidorExistente ? "••••••••••••" : t("plataformas.form.servidor.passwordPlaceholder")
                  }
                  value={password}
                  // Impede o browser de preencher aqui a password de login da app
                  autoComplete="new-password"
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
            {t("plataformas.form.servidor.recursos")}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* CPU */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t("plataformas.form.servidor.nucleosCpu")}
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
                {t("plataformas.form.servidor.memoriaRam")}
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="1"
                  required
                  value={memoriaRam}
                  onChange={(e) => setMemoriaRam(e.target.value)}
                  className="w-full min-w-0 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
                />
                <SelectPesquisavel
                  aria-label={t("plataformas.form.servidor.unidadeRam")}
                  comBusca={false}
                  className="w-24 shrink-0"
                  valor={memoriaRamUnidade}
                  onChange={(v) => setMemoriaRamUnidade(v as "MB" | "GB" | "TB")}
                  opcoes={OPCOES_UNIDADE_ARMAZENAMENTO}
                />
              </div>
            </div>

            {/* Disco */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t("plataformas.form.servidor.disco")}
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="1"
                  required
                  value={disco}
                  onChange={(e) => setDisco(e.target.value)}
                  className="w-full min-w-0 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
                />
                <SelectPesquisavel
                  aria-label={t("plataformas.form.servidor.unidadeDisco")}
                  comBusca={false}
                  className="w-24 shrink-0"
                  valor={discoUnidade}
                  onChange={(v) => setDiscoUnidade(v as "MB" | "GB" | "TB")}
                  opcoes={OPCOES_UNIDADE_ARMAZENAMENTO}
                />
              </div>
            </div>

            {/* Largura de Banda */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t("plataformas.form.servidor.larguraBanda")}
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="1"
                  required
                  value={larguraBanda}
                  onChange={(e) => setLarguraBanda(e.target.value)}
                  className="w-full min-w-0 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
                />
                <SelectPesquisavel
                  aria-label={t("plataformas.form.servidor.unidadeBanda")}
                  comBusca={false}
                  className="w-24 shrink-0"
                  valor={larguraBandaUnidade}
                  onChange={(v) => setLarguraBandaUnidade(v as "MBPS" | "GBPS")}
                  opcoes={[
                    { valor: "MBPS", label: "Mbps" },
                    { valor: "GBPS", label: "Gbps" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sistema Operativo & Cloud */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {t("plataformas.form.servidor.sistemaOperativo")}
            </label>
            <input
              type="text"
              required
              placeholder={t("plataformas.form.servidor.sistemaOperativoPlaceholder")}
              value={sistemaOperativo}
              onChange={(e) => setSistemaOperativo(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {t("plataformas.form.servidor.versaoSo")}
            </label>
            <input
              type="text"
              placeholder={t("plataformas.form.servidor.versaoSoPlaceholder")}
              value={versaoSo}
              onChange={(e) => setVersaoSo(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {t("plataformas.form.servidor.fornecedorCloud")}
            </label>
            <input
              type="text"
              placeholder={t("plataformas.form.servidor.fornecedorCloudPlaceholder")}
              value={cloud}
              onChange={(e) => setCloud(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {t("plataformas.form.servidor.regiao")}
            </label>
            <input
              type="text"
              placeholder={t("plataformas.form.servidor.regiaoPlaceholder")}
              value={regiao}
              onChange={(e) => setRegiao(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800"
            />
          </div>
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
          {t("plataformas.comum.cancelar")}
        </button>
        <button
          type="submit"
          disabled={salvando}
          className="px-6 py-2.5 bg-netline-azul hover:bg-blue-900 text-white font-semibold text-sm rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          {salvando
            ? t("plataformas.comum.aGuardar")
            : servidorExistente
              ? t("plataformas.form.servidor.atualizar")
              : t("plataformas.form.servidor.criar")}
        </button>
      </div>
    </form>
  );
}
