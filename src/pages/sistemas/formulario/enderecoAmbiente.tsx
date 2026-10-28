import type { OpcaoHospedagem } from "../../../hooks/useSistemasData";
import BlocoSubdominio from "../infraestrutura/blocoSubdominio";
import { CLASSE_CAMPO, CLASSE_ROTULO } from "../infraestrutura/constantes";
import type { EstadoEndereco } from "./enderecos";
import { useTranslation } from "react-i18next";

interface EnderecoAmbienteProps {
  titulo: string; // nome do ambiente, já traduzido
  estado: EstadoEndereco;
  onChange: (alteracoes: Partial<EstadoEndereco>) => void;
  dominios: OpcaoHospedagem[];
  servidores: OpcaoHospedagem[];
  // true quando o sistema já tinha subdomínio neste ambiente antes da edição
  tinhaSubdominio?: boolean;
}

export default function EnderecoAmbiente({
  titulo,
  estado,
  onChange,
  dominios,
  servidores,
  tinhaSubdominio = false,
}: EnderecoAmbienteProps) {
  const { t } = useTranslation();
  return (
    <section className="md:col-span-2 space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
        {t("sistemas.endereco.titulo", { ambiente: titulo })}
      </h3>

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={estado.temSubdominio}
          onChange={(e) => onChange({ temSubdominio: e.target.checked })}
        />
        {t("sistemas.endereco.temSubdominio")}
      </label>

      {tinhaSubdominio && !estado.temSubdominio && (
        <p className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          {t("sistemas.endereco.avisoRemocao")}
        </p>
      )}

      {estado.temSubdominio ? (
        <BlocoSubdominio
          dominios={dominios}
          servidores={servidores}
          dominioId={estado.dominioId}
          onDominioId={(valor) => onChange({ dominioId: valor })}
          nome={estado.nome}
          onNome={(valor) => onChange({ nome: valor })}
          tipoDns={estado.tipoDns}
          onTipoDns={(valor) => onChange({ tipoDns: valor })}
          servidorId={estado.servidorId}
          onServidorId={(valor) => onChange({ servidorId: valor })}
          destino={estado.destino}
          onDestino={(valor) => onChange({ destino: valor })}
        />
      ) : (
        <div className="space-y-1.5">
          <label className={CLASSE_ROTULO}>{t("sistemas.endereco.enderecoSistema")}</label>
          <input
            type="url"
            value={estado.url}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="https://sistema.empresa.com"
            className={CLASSE_CAMPO}
          />
          <p className="text-[11px] text-slate-400">
            {t("sistemas.endereco.enderecoAjuda")}
          </p>
        </div>
      )}
    </section>
  );
}