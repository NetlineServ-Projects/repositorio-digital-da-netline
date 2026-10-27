import { useEffect, useState } from "react";
import { toast } from "sonner";
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
      toast.error(erro instanceof Error ? erro.message : "Não foi possível obter o valor.");
    } finally {
      setACarregar(false);
    }
  };

  const copiar = async () => {
    if (valor === null) return;
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(true);
      toast.success("Valor copiado para a área de transferência.");
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o valor.");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
      <span className={`font-mono text-[11px] text-slate-700 ${valor === null ? "whitespace-nowrap" : "break-all"}`}>
        {/* Máscara de comprimento fixo, para não revelar o tamanho do segredo */}
        {valor === null ? "•".repeat(12) : valor || "(vazio)"}
      </span>
      {valor === null ? (
        <button
          type="button"
          onClick={mostrar}
          disabled={aCarregar}
          aria-label={`Mostrar ${descricao}`}
          className="text-[11px] font-semibold text-blue-900 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors cursor-pointer disabled:opacity-50"
        >
          {aCarregar ? "A obter..." : "Mostrar"}
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={copiar}
            aria-label={`Copiar ${descricao}`}
            className="text-[11px] text-slate-500 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors cursor-pointer"
          >
            {copiado ? "Copiado!" : "Copiar"}
          </button>
          <button
            type="button"
            onClick={() => setValor(null)}
            aria-label={`Ocultar ${descricao}`}
            className="text-[11px] text-slate-500 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors cursor-pointer"
          >
            Ocultar
          </button>
        </>
      )}
    </div>
  );
}
