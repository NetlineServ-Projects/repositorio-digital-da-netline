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
  adicionarCredencial,
  atualizarCredencial,
  buscarInfraestrutura,
  type TipoAmbiente,
  type TipoCredencial,
} from "../../../../hooks/useSistemasData";
import { AcessoCancelado, useAcessoInfraestrutura } from "../acessoInfraestrutura";
import {
  CLASSE_CAMPO,
  CLASSE_ROTULO,
  TIPOS_CREDENCIAL,
  caminhosInfraestrutura,
  rotuloAmbiente,
} from "../constantes";
import SelectPesquisavel from "../../../../components/selectPesquisavel";

interface DashboardContext {
  usuario: { nome: string; perfil?: string } | null;
}

export default function CredencialPage() {
  const {
    id,
    ambiente: parametroAmbiente,
    credencialId,
  } = useParams<{ id: string; ambiente: string; credencialId?: string }>();
  const navigate = useNavigate();
  const { usuario } = useOutletContext<DashboardContext>();
  const ehAdmin = usuario?.perfil === "ADMIN";
  const { comAcesso } = useAcessoInfraestrutura();

  const sistemaId = id ?? "";
  const ambiente: TipoAmbiente = parametroAmbiente === "TESTES" ? "TESTES" : "PRODUCAO";
  const caminhos = caminhosInfraestrutura(sistemaId, ambiente);
  const emEdicao = credencialId !== undefined;

  const [tipo, setTipo] = useState<TipoCredencial>("ENV_VARIAVEIS");
  const [label, setLabel] = useState("");
  const [valor, setValor] = useState("");
  const [carregando, setCarregando] = useState(emEdicao);
  const [salvando, setSalvando] = useState(false);

  // Em edição, vai buscar a credencial (já desencriptada) para preencher o formulário
  useEffect(() => {
    if (!ehAdmin || !emEdicao) return;
    let cancelado = false;

    async function carregar() {
      try {
        const dados = await comAcesso((token) =>
          buscarInfraestrutura(sistemaId, ambiente, token),
        );
        if (cancelado) return;

        const credencial = dados?.credenciais.find((c) => String(c.id) === credencialId);
        if (!credencial) {
          toast.error("Credencial não encontrada.");
          navigate(caminhosInfraestrutura(sistemaId, ambiente).sistema, { replace: true });
          return;
        }
        setTipo(credencial.tipo);
        setLabel(credencial.label);
        setValor(credencial.valor ?? "");
      } catch (erro) {
        if (cancelado) return;
        if (!(erro instanceof AcessoCancelado)) {
          toast.error(erro instanceof Error ? erro.message : "Erro ao carregar a credencial.");
        }
        navigate(caminhosInfraestrutura(sistemaId, ambiente).sistema, { replace: true });
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [ehAdmin, emEdicao, credencialId, sistemaId, ambiente, comAcesso, navigate]);

  if (!ehAdmin) return <Navigate to={caminhos.sistema} replace />;

  const formularioInvalido = label.trim().length < 2 || !valor.trim();

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formularioInvalido) return;

    // O valor segue como foi escrito: uma chave privada precisa do fim de linha
    const dados = { tipo, label: label.trim(), valor };

    setSalvando(true);
    try {
      await comAcesso((token) =>
        emEdicao
          ? atualizarCredencial(sistemaId, ambiente, Number(credencialId), dados, token)
          : adicionarCredencial(sistemaId, ambiente, dados, token),
      );
      toast.success(emEdicao ? "Credencial atualizada com sucesso." : "Credencial adicionada com sucesso.");
      navigate(caminhos.sistema);
    } catch (erro) {
      if (erro instanceof AcessoCancelado) return; // fica na página, sem perder nada
      toast.error(erro instanceof Error ? erro.message : "Erro ao guardar a credencial.");
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
    <div className="space-y-6 max-w-xl">
      <Link
        to={caminhos.sistema}
        className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
      >
        ← Voltar ao sistema
      </Link>

      <form
        onSubmit={handleSalvar}
        className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-5"
      >
        <h1 className="font-bold text-slate-800 text-lg">
          {emEdicao ? "Editar credencial" : "Nova credencial"} — Backend, {rotuloAmbiente(ambiente)}
        </h1>

        <div className="space-y-1.5">
          <label htmlFor="credencial-tipo" className={CLASSE_ROTULO}>Tipo</label>
          <SelectPesquisavel
            id="credencial-tipo"
            valor={tipo}
            onChange={(v) => setTipo(v as TipoCredencial)}
            opcoes={TIPOS_CREDENCIAL.map((t) => ({ valor: t.valor, label: t.label }))}
          />
        </div>

        <div className="space-y-1.5">
          <label className={CLASSE_ROTULO}>Rótulo</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Ex: .env do backend"
            className={CLASSE_CAMPO}
          />
        </div>

        <div className="space-y-1.5">
          <label className={CLASSE_ROTULO}>Valor</label>
          <textarea
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            rows={10}
            spellCheck={false}
            autoComplete="off"
            placeholder="Cole aqui o conteúdo (variáveis de ambiente, chave, token...)"
            className={`${CLASSE_CAMPO} font-mono`}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            to={caminhos.sistema}
            className="flex-1 text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-sm font-semibold rounded-lg transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={salvando || formularioInvalido}
            className="flex-1 py-2.5 bg-[#18357a] hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {salvando ? "A guardar..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}