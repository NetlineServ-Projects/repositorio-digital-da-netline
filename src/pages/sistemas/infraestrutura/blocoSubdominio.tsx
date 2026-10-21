import type { OpcaoHospedagem, TipoDns } from "../../../hooks/useSistemasData";
import {
  CLASSE_CAMPO,
  CLASSE_ROTULO,
  montarEndereco,
  registoUsaServidor,
  tiposDnsDisponiveis,
} from "./constantes";

interface BlocoSubdominioProps {
  ligado: boolean;
  onAlternar: (ligado: boolean) => void;
  dominios: OpcaoHospedagem[];
  dominioId: string;
  onDominioId: (valor: string) => void;
  nome: string;
  onNome: (valor: string) => void;
  tipoDns: TipoDns;
  onTipoDns: (valor: TipoDns) => void;
  destino: string;
  onDestino: (valor: string) => void;
  temServidor: boolean; // com servidor, o registo A/AAAA usa o IP dele
}

export default function BlocoSubdominio({
  ligado,
  onAlternar,
  dominios,
  dominioId,
  onDominioId,
  nome,
  onNome,
  tipoDns,
  onTipoDns,
  destino,
  onDestino,
  temServidor,
}: BlocoSubdominioProps) {
  const usaServidor = registoUsaServidor(tipoDns, temServidor);
  const dominio = dominios.find((d) => String(d.id) === dominioId);
  const endereco = montarEndereco(nome, dominio?.nome);

  return (
    <div className="space-y-4 border-t border-slate-100 pt-5">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={ligado}
          onChange={(e) => onAlternar(e.target.checked)}
        />
        Este backend tem subdomínio
      </label>

      {ligado && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={CLASSE_ROTULO}>Domínio</label>
            <select
              value={dominioId}
              onChange={(e) => onDominioId(e.target.value)}
              className={CLASSE_CAMPO}
            >
              <option value="">Selecionar...</option>
              {dominios.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nome}
                </option>
              ))}
            </select>
            {dominios.length === 0 && (
              <p className="text-[11px] text-slate-400">
                Ainda não há domínios registados. Registe-os na página Plataformas.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className={CLASSE_ROTULO}>Nome (só o prefixo)</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => onNome(e.target.value.toLowerCase())}
              placeholder="Ex: api (use @ para a raiz do domínio)"
              className={CLASSE_CAMPO}
            />
          </div>

          <div className="space-y-1.5">
            <label className={CLASSE_ROTULO}>Tipo de registo</label>
            <select
              value={tipoDns}
              onChange={(e) => onTipoDns(e.target.value as TipoDns)}
              className={CLASSE_CAMPO}
            >
              {tiposDnsDisponiveis(temServidor).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {usaServidor ? (
            <p className="text-xs text-slate-500 self-end pb-2">
              O registo usa o IP do servidor escolhido acima.
            </p>
          ) : (
            <div className="space-y-1.5">
              <label className={CLASSE_ROTULO}>Destino</label>
              <input
                type="text"
                value={destino}
                onChange={(e) => onDestino(e.target.value)}
                placeholder="Ex: cname.exemplo.com (sem https://)"
                className={`${CLASSE_CAMPO} font-mono`}
              />
            </div>
          )}

          {endereco && (
            <p className="sm:col-span-2 text-sm text-slate-600">
              Endereço: <span className="font-mono font-semibold">{endereco}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}