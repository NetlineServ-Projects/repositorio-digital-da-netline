import { useState } from "react";
import { toast } from "sonner";
import {
  IconVoltar,
  IconPlataforma,
  IconServer,
  IconDominio,
  IconRede,
} from "../../../components/icons";
import { usePlataformasData } from "../../../hooks/usePlataformasData";
import type {
  Plataforma,
  Servidor,
  Dominio,
  Subdominio,
  TipoPlataforma,
} from "../../../types/plataforma";
import FormPlataforma from "./FormPlataforma";
import FormServidor from "./FormServidor";
import FormDominio from "./FormDominio";
import FormSubdominio from "./FormSubdominio";

export type TipoFormularioPlataforma =
  | "plataforma"
  | "servidor"
  | "dominio"
  | "subdominio";

interface PlataformaFormularioPageProps {
  tipoInicial?: TipoFormularioPlataforma;
  itemEdicao?: {
    tipo: TipoFormularioPlataforma;
    dados: Plataforma | Servidor | Dominio | Subdominio;
  } | null;
  onVoltar: () => void;
  onSucesso?: () => void;
}

export default function PlataformaFormularioPage({
  tipoInicial = "plataforma",
  itemEdicao = null,
  onVoltar,
  onSucesso,
}: PlataformaFormularioPageProps) {
  const [tipoAtivo, setTipoAtivo] = useState<TipoFormularioPlataforma>(
    itemEdicao?.tipo ?? tipoInicial
  );
  const [salvando, setSalvando] = useState(false);

  const {
    plataformas,
    servidores,
    dominios,
    criarPlataforma,
    atualizarPlataforma,
    criarServidor,
    atualizarServidor,
    criarDominio,
    atualizarDominio,
    criarSubdominio,
    atualizarSubdominio,
  } = usePlataformasData();

  const emEdicao = Boolean(itemEdicao);

  // Submissão: Plataforma
  const handleSalvarPlataforma = async (dados: {
    nome: string;
    tipo: TipoPlataforma;
    urlPainel?: string | null;
    ativo?: boolean;
  }) => {
    setSalvando(true);
    try {
      if (itemEdicao?.tipo === "plataforma") {
        await atualizarPlataforma(itemEdicao.dados.id, dados);
        toast.success("Plataforma atualizada com sucesso!");
      } else {
        await criarPlataforma(dados);
        toast.success("Plataforma cadastrada com sucesso!");
      }
      onSucesso?.();
      onVoltar();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar plataforma.";
      toast.error(msg);
    } finally {
      setSalvando(false);
    }
  };

  // Submissão: Servidor
  const handleSalvarServidor = async (dados: Record<string, unknown>) => {
    setSalvando(true);
    try {
      if (itemEdicao?.tipo === "servidor") {
        await atualizarServidor(itemEdicao.dados.id, dados);
        toast.success("Servidor atualizado com sucesso!");
      } else {
        await criarServidor(dados);
        toast.success("Servidor cadastrado com sucesso!");
      }
      onSucesso?.();
      onVoltar();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar servidor.";
      toast.error(msg);
    } finally {
      setSalvando(false);
    }
  };

  // Submissão: Domínio
  const handleSalvarDominio = async (dados: {
    nome: string;
    dataExpiracao: string;
    plataformaId: number;
  }) => {
    setSalvando(true);
    try {
      if (itemEdicao?.tipo === "dominio") {
        await atualizarDominio(itemEdicao.dados.id, dados);
        toast.success("Domínio atualizado com sucesso!");
      } else {
        await criarDominio(dados);
        toast.success("Domínio cadastrado com sucesso!");
      }
      onSucesso?.();
      onVoltar();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar domínio.";
      toast.error(msg);
    } finally {
      setSalvando(false);
    }
  };

  // Submissão: Subdomínio
  const handleSalvarSubdominio = async (dados: {
    dominioId: number;
    nome: string;
    tipoDns: string;
    servidorId?: number | null;
    destino?: string | null;
  }) => {
    setSalvando(true);
    try {
      if (itemEdicao?.tipo === "subdominio") {
        await atualizarSubdominio(itemEdicao.dados.id, dados);
        toast.success("Registo DNS atualizado com sucesso!");
      } else {
        await criarSubdominio(dados);
        toast.success("Registo DNS cadastrado com sucesso!");
      }
      onSucesso?.();
      onVoltar();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar registo DNS.";
      toast.error(msg);
    } finally {
      setSalvando(false);
    }
  };

  const tabsConfig = [
    {
      tipo: "plataforma" as const,
      label: "Plataforma",
      icon: <IconPlataforma className="w-4 h-4" />,
      sublabel: "Provedor / Nuvem",
    },
    {
      tipo: "servidor" as const,
      label: "Servidor",
      icon: <IconServer className="w-4 h-4" />,
      sublabel: "VPS / Máquina",
    },
    {
      tipo: "dominio" as const,
      label: "Domínio",
      icon: <IconDominio className="w-4 h-4" />,
      sublabel: "Zona DNS Principal",
    },
    {
      tipo: "subdominio" as const,
      label: "Subdomínio / DNS",
      icon: <IconRede className="w-4 h-4" />,
      sublabel: "Apontamento de Registo",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Botão Voltar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onVoltar}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <IconVoltar className="w-4 h-4" />
          <span>Voltar para Plataformas</span>
        </button>

        {emEdicao && (
          <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
            Modo Edição
          </span>
        )}
      </div>

      {/* Selector de Abas do Formulário (apenas em modo de criação) */}
      {!emEdicao ? (
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-2">
          {tabsConfig.map((tab) => {
            const ativa = tipoAtivo === tab.tipo;
            return (
              <button
                key={tab.tipo}
                type="button"
                onClick={() => setTipoAtivo(tab.tipo)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left ${
                  ativa
                    ? "bg-[#18357a] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    ativa ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.icon}
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight">{tab.label}</p>
                  <p
                    className={`text-[11px] ${
                      ativa ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {tab.sublabel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Renderização do Formulário Activo */}
      {tipoAtivo === "plataforma" && (
        <FormPlataforma
          plataformaExistente={
            itemEdicao?.tipo === "plataforma"
              ? (itemEdicao.dados as Plataforma)
              : null
          }
          salvando={salvando}
          onCancelar={onVoltar}
          onSubmit={handleSalvarPlataforma}
        />
      )}

      {tipoAtivo === "servidor" && (
        <FormServidor
          servidorExistente={
            itemEdicao?.tipo === "servidor"
              ? (itemEdicao.dados as Servidor)
              : null
          }
          plataformas={plataformas}
          salvando={salvando}
          onCancelar={onVoltar}
          onSubmit={handleSalvarServidor}
        />
      )}

      {tipoAtivo === "dominio" && (
        <FormDominio
          dominioExistente={
            itemEdicao?.tipo === "dominio"
              ? (itemEdicao.dados as Dominio)
              : null
          }
          plataformas={plataformas}
          salvando={salvando}
          onCancelar={onVoltar}
          onSubmit={handleSalvarDominio}
        />
      )}

      {tipoAtivo === "subdominio" && (
        <FormSubdominio
          subdominioExistente={
            itemEdicao?.tipo === "subdominio"
              ? (itemEdicao.dados as Subdominio)
              : null
          }
          dominios={dominios}
          servidores={servidores}
          salvando={salvando}
          onCancelar={onVoltar}
          onSubmit={handleSalvarSubdominio}
        />
      )}
    </div>
  );
}

