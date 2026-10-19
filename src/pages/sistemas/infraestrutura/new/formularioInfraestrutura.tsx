import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type {
  SistemaInfraestrutura,
  ComponenteSistema,
} from "../../../../hooks/useSistemasData";
import type { TipoDns } from "../../../../hooks/useSistemasData";
import type {
  ComponenteInfraestruturaProps,
  EstadoSubdominio,
} from "../../../../types/infraestrutura";
import {
  CLASSE_CAMPO_BRANCO,
  CLASSE_LABEL,
  SUBDOMINIO_VAZIO,
  TIPOS_DNS_COM_SERVIDOR,
  TIPO_DNS_PADRAO,
  apontaParaServidor,
} from "../constantes";
import { idDeHospedagem, tipoDeHospedagem } from "../../../../utils/infraestrutura";
import SeletorHospedagem from "../selectorHospedagem";
import SecaoSubdominio from "../secaoSubdominio";
import CredenciaisComponente from "../credenciaisComponente";

type Props = ComponenteInfraestruturaProps & {
  componente: ComponenteSistema;
  onVoltar: () => void;
};

export default function FormularioInfraestrutura({
  sistemaId,
  ambiente,
  componente,
  tokenElevado,
  servidores,
  plataformas,
  dominios,
  api,
  tratarErro,
  onAlterado,
  onVoltar,
}: Props) {
  const { buscarInfraestrutura, salvarInfraestrutura } = api;

  const titulo = componente.charAt(0) + componente.slice(1).toLowerCase();
  const nomeAmbiente = ambiente === "PRODUCAO" ? "Produção" : "Testes";

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [infraestrutura, setInfraestrutura] =
    useState<SistemaInfraestrutura | null>(null);

  const [hospedagem, setHospedagem] = useState(""); // "servidor:3" | "plataforma:2"
  const [url, setUrl] = useState("");
  const [sub, setSub] = useState<EstadoSubdominio>(SUBDOMINIO_VAZIO);

  const tipoHospedagem = tipoDeHospedagem(hospedagem);
  const hospedagemId = idDeHospedagem(hospedagem);
  const configurado = infraestrutura !== null;

  const alterarSub = (parcial: Partial<EstadoSubdominio>) =>
    setSub((prev) => ({ ...prev, ...parcial }));

  const carregar = useCallback(
    async (silencioso = false) => {
      if (!silencioso) setCarregando(true);
      try {
        const dados = await buscarInfraestrutura(sistemaId, ambiente, componente, tokenElevado);
        setInfraestrutura(dados);

        const servidorId = dados?.servidorId ?? dados?.servidor?.id ?? null;
        const plataformaId = dados?.plataformaId ?? dados?.plataforma?.id ?? null;
        if (plataformaId != null) setHospedagem(`plataforma:${plataformaId}`);
        else if (servidorId != null) setHospedagem(`servidor:${servidorId}`);
        else setHospedagem("");

        setUrl(dados?.url || "");

        const s = dados?.subdominio ?? null;
        setSub({
          ativo: s !== null,
          dominioId: s ? String(s.dominio?.id ?? s.dominioId ?? "") : "",
          nome: s?.nome ?? "",
          tipoDns: s?.tipoDns ?? TIPO_DNS_PADRAO,
          destino: s?.destino ?? "",
        });
      } catch (error) {
        tratarErro(error, `Erro ao carregar o ${titulo.toLowerCase()}.`);
      } finally {
        setCarregando(false);
      }
    },
    [sistemaId, ambiente, componente, tokenElevado, buscarInfraestrutura, tratarErro, titulo],
  );

  useEffect(() => {
    carregar();
  }, [carregar]);

  const escolherHospedagem = (valor: string) => {
    setHospedagem(valor);
    // Numa plataforma não há IP de servidor: A e AAAA deixam de se aplicar
    if (valor.startsWith("plataforma:") && TIPOS_DNS_COM_SERVIDOR.includes(sub.tipoDns)) {
      alterarSub({ tipoDns: TIPO_DNS_PADRAO });
    }
  };

  const alternarSubdominio = (ligado: boolean) => {
    const dnsInicial: TipoDns = tipoHospedagem === "servidor" ? "A" : TIPO_DNS_PADRAO;
    // Ao ligar pela primeira vez, sugere um tipo de registo coerente com a hospedagem
    if (ligado && !infraestrutura?.subdominio) {
      alterarSub({ ativo: true, tipoDns: dnsInicial });
    } else {
      alterarSub({ ativo: ligado });
    }
  };

  const validar = (): string | null => {
    if (!hospedagemId) return "Escolha onde o componente está hospedado.";
    if (!sub.ativo) return null;
    if (!sub.dominioId) return "Escolha o domínio do subdomínio.";
    if (!sub.nome.trim())
      return 'Indique o nome do subdomínio (ou "@" para a raiz do domínio).';
    if (!apontaParaServidor(tipoHospedagem, sub.tipoDns) && !sub.destino.trim())
      return "Indique o destino do registo.";
    return null;
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    const erro = validar();
    if (erro) {
      toast.error(erro);
      return;
    }

    setSalvando(true);
    try {
      const dados: Record<string, unknown> = {
        servidorId: tipoHospedagem === "servidor" ? Number(hospedagemId) : null,
        plataformaId: tipoHospedagem === "plataforma" ? Number(hospedagemId) : null,
        // Com subdomínio o endereço calcula-se sozinho
        url: sub.ativo ? null : url.trim() || null,
      };

      // omitida = não mexer | null = remover | objeto = criar ou atualizar
      if (sub.ativo) {
        dados.subdominio = {
          dominioId: Number(sub.dominioId),
          nome: sub.nome.trim().toLowerCase(),
          tipoDns: sub.tipoDns,
          destino: apontaParaServidor(tipoHospedagem, sub.tipoDns)
            ? null
            : sub.destino.trim(),
        };
      } else if (infraestrutura?.subdominio) {
        dados.subdominio = null;
      }

      await salvarInfraestrutura(sistemaId, ambiente, componente, dados, tokenElevado);
      toast.success("Infraestrutura guardada com sucesso.");
      onAlterado();

      // Já existia: volta ao painel. Primeira vez: fica, para poder juntar credenciais
      if (configurado) {
        onVoltar();
        return;
      }
      await carregar(true);
    } catch (error) {
      tratarErro(error, "Erro ao guardar a infraestrutura.");
    } finally {
      setSalvando(false);
    }
  };

  const aposAlterarCredenciais = async () => {
    await carregar(true);
    onAlterado();
  };

  if (carregando) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center">
        <p className="text-slate-500 text-xs animate-pulse">A carregar formulário...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <button
          type="button"
          onClick={onVoltar}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          ← Voltar para a visualização
        </button>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          Infraestrutura — {titulo} ({nomeAmbiente})
        </h3>
      </div>

      <form onSubmit={handleSalvar} className="space-y-4">
        <SeletorHospedagem
          valor={hospedagem}
          aoEscolher={escolherHospedagem}
          servidores={servidores}
          plataformas={plataformas}
        />

        {!sub.ativo && (
          <div>
            <label className={CLASSE_LABEL}>Endereço do sistema (opcional)</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className={CLASSE_CAMPO_BRANCO}
            />
          </div>
        )}

        <SecaoSubdominio
          valor={sub}
          tipoHospedagem={tipoHospedagem}
          dominios={dominios}
          aoAlternar={alternarSubdominio}
          aoAlterar={alterarSub}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onVoltar}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {salvando ? "A guardar..." : "Guardar infraestrutura"}
          </button>
        </div>
      </form>

      <CredenciaisComponente
        titulo={titulo}
        sistemaId={sistemaId}
        ambiente={ambiente}
        componente={componente}
        tokenElevado={tokenElevado}
        credenciais={infraestrutura?.credenciais ?? []}
        configurado={configurado}
        api={api}
        tratarErro={tratarErro}
        aoAlterar={aposAlterarCredenciais}
      />
    </div>
  );
}