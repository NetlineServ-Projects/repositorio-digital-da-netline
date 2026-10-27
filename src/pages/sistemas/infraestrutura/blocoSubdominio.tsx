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
  const usaServidor = registoUsaServidor(tipoDns);
  const dominio = dominios.find((d) => String(d.id) === dominioId);
  const endereco = montarEndereco(nome, dominio?.nome);
  // O bloco pode aparecer várias vezes na mesma página, por isso os ids são gerados
  const idBase = useId();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label htmlFor={`${idBase}-dominio`} className={CLASSE_ROTULO}>Domínio</label>
        <SelectPesquisavel
          id={`${idBase}-dominio`}
          valor={dominioId}
          onChange={onDominioId}
          opcaoVazia="Selecionar..."
          opcoes={dominios.map((d) => ({ valor: String(d.id), label: d.nome }))}
        />
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
          placeholder="Ex: repositorio (use @ para a raiz do domínio)"
          className={CLASSE_CAMPO}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${idBase}-tipo`} className={CLASSE_ROTULO}>Tipo de registo</label>
        <SelectPesquisavel
          id={`${idBase}-tipo`}
          valor={tipoDns}
          onChange={(v) => onTipoDns(v as TipoDns)}
          opcoes={TIPOS_DNS.map((t) => ({ valor: t, label: t }))}
        />
      </div>

      {usaServidor ? (
        <div className="space-y-1.5">
          <label htmlFor={`${idBase}-servidor`} className={CLASSE_ROTULO}>Servidor</label>
          <SelectPesquisavel
            id={`${idBase}-servidor`}
            valor={servidorId}
            onChange={onServidorId}
            opcaoVazia="Selecionar..."
            opcoes={servidores.map((s) => ({ valor: String(s.id), label: s.nome }))}
          />
          {servidores.length === 0 && (
            <p className="text-[11px] text-slate-400">
              Ainda não há servidores registados.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          <label className={CLASSE_ROTULO}>Destino</label>
          <input
            type="text"
            value={destino}
            onChange={(e) => onDestino(e.target.value)}
            placeholder="Ex: cname.vercel-dns.com (sem https://)"
            className={`${CLASSE_CAMPO} font-mono`}
          />
        </div>
      )}

      {endereco && (
        <p className="sm:col-span-2 text-sm text-slate-600">
          Endereço: <span className="font-mono font-semibold break-all">{endereco}</span>
        </p>
      )}
    </div>
  );
}