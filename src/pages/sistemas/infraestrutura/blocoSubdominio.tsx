import {
  TIPOS_DNS,
  type OpcaoHospedagem,
  type TipoDns,
} from "../../../hooks/useSistemasData";
import {
  CLASSE_CAMPO,
  CLASSE_ROTULO,
  montarEndereco,
  registoUsaServidor,
} from "./constantes";
import { useId } from "react";
import SelectPesquisavel from "../../../components/selectPesquisavel";
import { useTranslation } from "react-i18next";

interface BlocoSubdominioProps {
  dominios: OpcaoHospedagem[];
  servidores: OpcaoHospedagem[];
  dominioId: string;
  onDominioId: (valor: string) => void;
  nome: string;
  onNome: (valor: string) => void;
  tipoDns: TipoDns;
  onTipoDns: (valor: TipoDns) => void;
  servidorId: string;
  onServidorId: (valor: string) => void;
  destino: string;
  onDestino: (valor: string) => void;
}

// Os campos de um subdomínio. A e AAAA pedem o servidor; os outros tipos pedem o destino.
export default function BlocoSubdominio({
  dominios,
  servidores,
  dominioId,
  onDominioId,
  nome,
  onNome,
  tipoDns,
  onTipoDns,
  servidorId,
  onServidorId,
  destino,
  onDestino,
}: BlocoSubdominioProps) {
  const { t } = useTranslation();
  const usaServidor = registoUsaServidor(tipoDns);
  const dominio = dominios.find((d) => String(d.id) === dominioId);
  const endereco = montarEndereco(nome, dominio?.nome);
  // O bloco pode aparecer várias vezes na mesma página, por isso os ids são gerados
  const idBase = useId();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label htmlFor={`${idBase}-dominio`} className={CLASSE_ROTULO}>{t("sistemas.subdominio.dominio")}</label>
        <SelectPesquisavel
          id={`${idBase}-dominio`}
          valor={dominioId}
          onChange={onDominioId}
          opcaoVazia={t("sistemas.comum.selecionar")}
          opcoes={dominios.map((d) => ({ valor: String(d.id), label: d.nome }))}
        />
        {dominios.length === 0 && (
          <p className="text-[11px] text-slate-400">
            {t("sistemas.subdominio.semDominios")}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className={CLASSE_ROTULO}>{t("sistemas.subdominio.nome")}</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => onNome(e.target.value.toLowerCase())}
          placeholder={t("sistemas.subdominio.nomePlaceholder")}
          className={CLASSE_CAMPO}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${idBase}-tipo`} className={CLASSE_ROTULO}>{t("sistemas.subdominio.tipoRegisto")}</label>
        <SelectPesquisavel
          id={`${idBase}-tipo`}
          valor={tipoDns}
          onChange={(v) => onTipoDns(v as TipoDns)}
          opcoes={TIPOS_DNS.map((t) => ({ valor: t, label: t }))}
        />
      </div>

      {usaServidor ? (
        <div className="space-y-1.5">
          <label htmlFor={`${idBase}-servidor`} className={CLASSE_ROTULO}>{t("sistemas.subdominio.servidor")}</label>
          <SelectPesquisavel
            id={`${idBase}-servidor`}
            valor={servidorId}
            onChange={onServidorId}
            opcaoVazia={t("sistemas.comum.selecionar")}
            opcoes={servidores.map((s) => ({ valor: String(s.id), label: s.nome }))}
          />
          {servidores.length === 0 && (
            <p className="text-[11px] text-slate-400">
              {t("sistemas.subdominio.semServidores")}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          <label className={CLASSE_ROTULO}>{t("sistemas.subdominio.destino")}</label>
          <input
            type="text"
            value={destino}
            onChange={(e) => onDestino(e.target.value)}
            placeholder={t("sistemas.subdominio.destinoPlaceholder")}
            className={`${CLASSE_CAMPO} font-mono`}
          />
        </div>
      )}

      {endereco && (
        <p className="sm:col-span-2 text-sm text-slate-600">
          {t("sistemas.subdominio.endereco")} <span className="font-mono font-semibold break-all">{endereco}</span>
        </p>
      )}
    </div>
  );
}