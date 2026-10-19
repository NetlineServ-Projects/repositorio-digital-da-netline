import type { OpcaoHospedagem } from "../../../hooks/useSistemasData";
import { TIPOS_DNS, type TipoDns } from "../../../hooks/useSistemasData";
import type { EstadoSubdominio, TipoHospedagem } from "../../../types/infraestrutura";
import {
  CLASSE_CAMPO_BRANCO,
  CLASSE_LABEL,
  TIPOS_DNS_COM_SERVIDOR,
  apontaParaServidor,
} from "./constantes";
import { montarEndereco } from "../../../utils/infraestrutura";

interface Props {
  valor: EstadoSubdominio;
  tipoHospedagem: TipoHospedagem;
  dominios: OpcaoHospedagem[];
  aoAlternar: (ligado: boolean) => void;
  aoAlterar: (parcial: Partial<EstadoSubdominio>) => void;
}

export default function SecaoSubdominio({
  valor,
  tipoHospedagem,
  dominios,
  aoAlternar,
  aoAlterar,
}: Props) {
  const usaIpDoServidor = apontaParaServidor(tipoHospedagem, valor.tipoDns);
  const tiposDisponiveis =
    tipoHospedagem === "servidor"
      ? TIPOS_DNS
      : TIPOS_DNS.filter((t) => !TIPOS_DNS_COM_SERVIDOR.includes(t));
  const dominio = dominios.find((d) => String(d.id) === valor.dominioId);
  const endereco = montarEndereco(valor.nome, dominio?.nome);

  return (
    <div className="border-t border-slate-100 pt-3 space-y-3">
      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={valor.ativo}
          onChange={(e) => aoAlternar(e.target.checked)}
        />
        Este componente tem subdomínio
      </label>

      {valor.ativo && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={CLASSE_LABEL}>Domínio</label>
            <select
              value={valor.dominioId}
              onChange={(e) => aoAlterar({ dominioId: e.target.value })}
              className={CLASSE_CAMPO_BRANCO}
            >
              <option value="">Selecionar...</option>
              {dominios.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nome}
                </option>
              ))}
            </select>
            {dominios.length === 0 && (
              <p className="text-[11px] text-slate-400 mt-1">
                Ainda não há domínios registados. Registe-os na página Plataformas.
              </p>
            )}
          </div>

          <div>
            <label className={CLASSE_LABEL}>Nome (só o prefixo)</label>
            <input
              type="text"
              value={valor.nome}
              onChange={(e) => aoAlterar({ nome: e.target.value.toLowerCase() })}
              placeholder="Ex: app (use @ para a raiz do domínio)"
              className={CLASSE_CAMPO_BRANCO}
            />
          </div>

          <div>
            <label className={CLASSE_LABEL}>Tipo de registo</label>
            <select
              value={valor.tipoDns}
              onChange={(e) => aoAlterar({ tipoDns: e.target.value as TipoDns })}
              className={CLASSE_CAMPO_BRANCO}
            >
              {tiposDisponiveis.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {usaIpDoServidor ? (
            <p className="text-[11px] text-slate-500 self-end pb-2">
              O registo usa o IP do servidor escolhido acima.
            </p>
          ) : (
            <div>
              <label className={CLASSE_LABEL}>Destino</label>
              <input
                type="text"
                value={valor.destino}
                onChange={(e) => aoAlterar({ destino: e.target.value })}
                placeholder="Ex: cname.vercel-dns.com (sem https://)"
                className={`${CLASSE_CAMPO_BRANCO} font-mono`}
              />
            </div>
          )}

          {endereco && (
            <p className="sm:col-span-2 text-xs text-slate-600">
              Endereço: <span className="font-mono font-semibold">{endereco}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}