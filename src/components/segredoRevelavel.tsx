import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { AcessoCancelado, useAcessoElevado } from "./acessoElevado";

interface SegredoRevelavelProps {
  // Vai buscar o valor à API com o token elevado (ex: password do servidor, token da plataforma)
  obter: (tokenElevado: string) => Promise<string>;
  // Para leitores de ecrã: "password do servidor X", "token da plataforma Y"
  descricao: string;
}

// Mostra um segredo mascarado. "Mostrar" pede a palavra-passe (reautenticação) se o acesso
// tiver expirado, e o valor volta a ser ocultado sozinho quando o acesso de 3 minutos termina.
export default function SegredoRevelavel({ obter, descricao }: SegredoRevelavelProps) {
  const { t } = useTranslation();
  const { comAcesso, temAcesso } = useAcessoElevado();
  const [valor, setValor] = useState<string | null>(null);
  const [aCarregar, setACarregar] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!temAcesso) setValor(null);
  }, [temAcesso]);

  const mostrar = async () => {
    setACarregar(true);
    try {
      setValor(await comAcesso(obter));
    } catch (erro) {
      if (erro instanceof AcessoCancelado) return;
      toast.error(erro instanceof Error ? erro.message : t("componentes.segredo.erroObter"));
    } finally {
      setACarregar(false);
    }
  };

  const copiar = async () => {
    if (valor === null) return;
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(true);
      toast.success(t("componentes.segredo.copiadoSucesso"));
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast.error(t("componentes.segredo.erroCopiar"));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
      <span className={`font-mono text-[11px] text-slate-700 ${valor === null ? "whitespace-nowrap" : "break-all"}`}>
        {/* Máscara de comprimento fixo, para não revelar o tamanho do segredo */}
        {valor === null ? "•".repeat(12) : valor || t("componentes.segredo.vazio")}
      </span>
      {valor === null ? (
        <button
          type="button"
          onClick={mostrar}
          disabled={aCarregar}
          aria-label={t("componentes.segredo.mostrarAria", { descricao })}
          className="text-[11px] font-semibold text-blue-900 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors cursor-pointer disabled:opacity-50"
        >
          {aCarregar ? t("componentes.segredo.aObter") : t("componentes.segredo.mostrar")}
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={copiar}
            aria-label={t("componentes.segredo.copiarAria", { descricao })}
            className="text-[11px] text-slate-500 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors cursor-pointer"
          >
            {copiado ? t("componentes.segredo.copiado") : t("componentes.segredo.copiar")}
          </button>
          <button
            type="button"
            onClick={() => setValor(null)}
            aria-label={t("componentes.segredo.ocultarAria", { descricao })}
            className="text-[11px] text-slate-500 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors cursor-pointer"
          >
            {t("componentes.segredo.ocultar")}
          </button>
        </>
      )}
    </div>
  );
}
