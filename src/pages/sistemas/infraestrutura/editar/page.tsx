import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { toast } from "sonner";
import {
  buscarInfraestrutura,
  listarDominios,
  listarImagens,
  listarPlataformas,
  listarServidores,
  salvarInfraestrutura,
  type ImagemOpcao,
  type OpcaoHospedagem,
  type TipoAmbiente,
  type TipoDns,
} from "../../../../hooks/useSistemasData";
import { AcessoCancelado, useAcessoInfraestrutura } from "../acessoInfraestrutura";
import BlocoSubdominio from "../blocoSubdominio";
import {
  CLASSE_CAMPO,
  CLASSE_ROTULO,
  TIPO_DNS_PADRAO,
  TIPOS_DNS_COM_SERVIDOR,
  caminhosInfraestrutura,
  registoUsaServidor,
  rotuloAmbiente,
} from "../constantes";

interface DashboardContext {
  usuario: { nome: string; perfil?: string } | null;
}

export default function EditarInfraestruturaPage() {
  const { id, ambiente: parametroAmbiente } = useParams<{ id: string; ambiente: string }>();
  const navigate = useNavigate();
  const { usuario } = useOutletContext<DashboardContext>();
  const ehAdmin = usuario?.perfil === "ADMIN";
  const { comAcesso } = useAcessoInfraestrutura();

  const sistemaId = id ?? "";
  const ambiente: TipoAmbiente = parametroAmbiente === "TESTES" ? "TESTES" : "PRODUCAO";
  const caminhos = caminhosInfraestrutura(sistemaId, ambiente);

  // Listas dos dropdowns
  const [plataformas, setPlataformas] = useState<OpcaoHospedagem[]>([]);
  const [servidores, setServidores] = useState<OpcaoHospedagem[]>([]);
  const [imagens, setImagens] = useState<ImagemOpcao[]>([]);
  const [dominios, setDominios] = useState<OpcaoHospedagem[]>([]);

  // Campos do formulário
  const [plataformaId, setPlataformaId] = useState("");
  const [servidorId, setServidorId] = useState("");
  const [imagemId, setImagemId] = useState("");
  const [url, setUrl] = useState("");
  const [temSubdominio, setTemSubdominio] = useState(false);
  const [dominioId, setDominioId] = useState("");
  const [nomeSubdominio, setNomeSubdominio] = useState("");
  const [tipoDns, setTipoDns] = useState<TipoDns>(TIPO_DNS_PADRAO);
  const [destino, setDestino] = useState("");
  const [existiaSubdominio, setExistiaSubdominio] = useState(false);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!ehAdmin) return;
    let cancelado = false;

    async function carregar() {
      try {
        const [plt, srv, img, dom] = await Promise.all([
          listarPlataformas(),
          listarServidores(),
          listarImagens().catch(() => []), // sem imagens a página continua a funcionar
          listarDominios(),
        ]);
        const dados = await comAcesso((token) =>
          buscarInfraestrutura(sistemaId, ambiente, token),
        );
        if (cancelado) return;

        setPlataformas(plt.filter((p) => p.tipo !== "GESTAO_DOMINIO"));
        setServidores(srv);
        setImagens(img);
        setDominios(dom);

        if (dados) {
          setPlataformaId(dados.plataformaId != null ? String(dados.plataformaId) : "");
          setServidorId(dados.servidorId != null ? String(dados.servidorId) : "");
          setImagemId(dados.imagemId != null ? String(dados.imagemId) : "");
          setUrl(dados.url ?? "");

          const sub = dados.subdominio ?? null;
          setExistiaSubdominio(sub !== null);
          setTemSubdominio(sub !== null);
          setDominioId(sub ? String(sub.dominio?.id ?? sub.dominioId ?? "") : "");
          setNomeSubdominio(sub?.nome ?? "");
          setTipoDns(sub?.tipoDns ?? TIPO_DNS_PADRAO);
          setDestino(sub?.destino ?? "");
        }
      } catch (erro) {
        if (cancelado) return;
        if (erro instanceof AcessoCancelado) {
          navigate(caminhosInfraestrutura(sistemaId, ambiente).sistema, { replace: true });
          return;
        }
        toast.error(erro instanceof Error ? erro.message : "Erro ao carregar a infraestrutura.");
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [ehAdmin, sistemaId, ambiente, comAcesso, navigate]);

  if (!ehAdmin) return <Navigate to={caminhos.sistema} replace />;

  // Valores derivados da plataforma escolhida
  const plataforma = plataformas.find((p) => String(p.id) === plataformaId);
  const servidoresDaPlataforma = servidores.filter(
    (s) => String(s.plataforma) === plataformaId,
  );
  const eContainerizacao = plataforma?.tipo === "CONTAINERIZACAO";
  const imagensDaPlataforma = imagens.filter(
    (i) => String(i.plataformaId ?? i.plataforma?.id) === plataformaId,
  );
  const temServidor = servidorId !== "";

  // Ao mudar de plataforma, o servidor e a imagem anteriores deixam de servir
  const escolherPlataforma = (valor: string) => {
    setPlataformaId(valor);
    setServidorId("");
    setImagemId("");
    if (TIPOS_DNS_COM_SERVIDOR.includes(tipoDns)) setTipoDns(TIPO_DNS_PADRAO);
  };

  const escolherServidor = (valor: string) => {
    setServidorId(valor);
    if (valor === "" && TIPOS_DNS_COM_SERVIDOR.includes(tipoDns)) setTipoDns(TIPO_DNS_PADRAO);
  };

  const alternarSubdominio = (ligado: boolean) => {
    setTemSubdominio(ligado);
    if (ligado && !existiaSubdominio) setTipoDns(temServidor ? "A" : TIPO_DNS_PADRAO);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plataformaId) {
      toast.error("Escolha a plataforma.");
      return;
    }

    if (temSubdominio) {
      if (!dominioId) {
        toast.error("Escolha o domínio do subdomínio.");
        return;
      }
      if (!nomeSubdominio.trim()) {
        toast.error('Indique o nome do subdomínio (ou "@" para a raiz do domínio).');
        return;
      }
      if (!registoUsaServidor(tipoDns, temServidor) && !destino.trim()) {
        toast.error("Indique o destino do registo.");
        return;
      }
    }

    const dados: Record<string, unknown> = {
      plataformaId: Number(plataformaId),
      servidorId: temServidor ? Number(servidorId) : null,
      imagemId: eContainerizacao && imagemId ? Number(imagemId) : null,
      // Com subdomínio, o endereço calcula-se sozinho: o URL à parte não é usado
      url: temSubdominio ? null : url.trim() || null,
    };

    // omitido = não mexer | null = remover | objeto = criar ou atualizar
    if (temSubdominio) {
      dados.subdominio = {
        dominioId: Number(dominioId),
        nome: nomeSubdominio.trim().toLowerCase(),
        tipoDns,
        destino: registoUsaServidor(tipoDns, temServidor) ? null : destino.trim(),
      };
    } else if (existiaSubdominio) {
      dados.subdominio = null;
    }

    setSalvando(true);
    try {
      await comAcesso((token) => salvarInfraestrutura(sistemaId, ambiente, dados, token));
      toast.success("Infraestrutura guardada com sucesso.");
      navigate(caminhos.sistema);
    } catch (erro) {
      if (erro instanceof AcessoCancelado) return; // fica na página, sem perder nada
      toast.error(erro instanceof Error ? erro.message : "Erro ao guardar a infraestrutura.");
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-slate-500 font-medium animate-pulse text-sm">A carregar...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Link
        to={caminhos.sistema}
        className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
      >
        ← Voltar ao sistema
      </Link>

      <form
        onSubmit={handleSalvar}
        className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-5"
      >
        <h1 className="font-bold text-slate-800 text-lg">
          Infraestrutura do Backend — {rotuloAmbiente(ambiente)}
        </h1>

        <div className="space-y-1.5">
          <label className={CLASSE_ROTULO}>Plataforma</label>
          <select
            value={plataformaId}
            onChange={(e) => escolherPlataforma(e.target.value)}
            className={CLASSE_CAMPO}
          >
            <option value="">Selecionar...</option>
            {plataformas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        {plataformaId &&
          (servidoresDaPlataforma.length > 0 ? (
            <div className="space-y-1.5">
              <label className={CLASSE_ROTULO}>Servidor (opcional)</label>
              <select
                value={servidorId}
                onChange={(e) => escolherServidor(e.target.value)}
                className={CLASSE_CAMPO}
              >
                <option value="">Sem servidor</option>
                {servidoresDaPlataforma.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Esta plataforma não tem servidores registados: o backend fica ligado diretamente a ela.
            </p>
          ))}

        {eContainerizacao &&
          (imagensDaPlataforma.length > 0 ? (
            <div className="space-y-1.5">
              <label className={CLASSE_ROTULO}>Imagem (opcional)</label>
              <select
                value={imagemId}
                onChange={(e) => setImagemId(e.target.value)}
                className={CLASSE_CAMPO}
              >
                <option value="">Sem imagem</option>
                {imagensDaPlataforma.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.nome}:{i.tag}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Esta plataforma ainda não tem imagens registadas.
            </p>
          ))}

        {!temSubdominio && (
          <div className="space-y-1.5">
            <label className={CLASSE_ROTULO}>Endereço do backend (opcional)</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className={CLASSE_CAMPO}
            />
          </div>
        )}

        <BlocoSubdominio
          ligado={temSubdominio}
          onAlternar={alternarSubdominio}
          dominios={dominios}
          dominioId={dominioId}
          onDominioId={setDominioId}
          nome={nomeSubdominio}
          onNome={setNomeSubdominio}
          tipoDns={tipoDns}
          onTipoDns={setTipoDns}
          destino={destino}
          onDestino={setDestino}
          temServidor={temServidor}
        />

        <div className="flex gap-3 pt-2">
          <Link
            to={caminhos.sistema}
            className="flex-1 text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-sm font-semibold rounded-lg transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={salvando || !plataformaId}
            className="flex-1 py-2.5 bg-[#18357a] hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {salvando ? "A guardar..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}