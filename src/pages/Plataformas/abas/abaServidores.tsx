import { useNavigate } from "react-router-dom";
import AcoesItem from "../../../components/plataformas/acoesItem";
import EstadoVazio from "../../../components/plataformas/estadoVazio";
import {
  CLASSE_ESTADO_SERVIDOR,
  ROTULO_ESTADO_SERVIDOR,
  caminhoDetalheServidor,
} from "../../../utils/servidor";
import type {
  AoEditarItem,
  AoEliminarItem,
} from "../../../types/plataformaTipos";
import type { Plataforma, Servidor } from "../../../types/plataforma";

interface AbaServidoresProps {
  servidores: Servidor[];
  plataformas: Plataforma[];
  ehAdmin: boolean;
  aoEditar: AoEditarItem;
  aoEliminar: AoEliminarItem;
}

// Lista resumida: os recursos, o sistema operativo, o acesso SSH e os sistemas
// hospedados estão na página de detalhes do servidor (botão "olho" ou clique na linha)
export default function AbaServidores({
  servidores,
  plataformas,
  ehAdmin,
  aoEditar,
  aoEliminar,
}: AbaServidoresProps) {
  const navigate = useNavigate();

  if (servidores.length === 0) {
    return <EstadoVazio mensagem="Nenhum servidor registado." />;
  }

  // O que a linha da tabela e o cartão do telemóvel partilham
  const linhas = servidores.map((servidor) => {
    const abrirDetalhes = () => navigate(caminhoDetalheServidor(servidor.id));
    return {
      servidor,
      nomePlataforma:
        servidor.plataforma?.nome ??
        plataformas.find((p) => p.id === servidor.plataformaId)?.nome ??
        "-",
      totalSistemas: servidor.totais?.sistemas ?? 0,
      abrirDetalhes,
      acoes: (
        <AcoesItem
          tituloVer={`Ver detalhes do servidor ${servidor.nome}`}
          onVer={abrirDetalhes}
          {...(ehAdmin && {
            tituloEditar: `Editar servidor ${servidor.nome}`,
            tituloEliminar: `Eliminar servidor ${servidor.nome}`,
            onEditar: () => aoEditar("servidor", servidor),
            onEliminar: () => aoEliminar("servidor", servidor.id, servidor.nome),
          })}
        />
      ),
    };
  });

  const seloEstado = (servidor: Servidor) => (
    <span
      className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold whitespace-nowrap ${CLASSE_ESTADO_SERVIDOR[servidor.estado]}`}
    >
      {ROTULO_ESTADO_SERVIDOR[servidor.estado]}
    </span>
  );

  // A troca cartões/tabela depende da largura disponível (container query), não do ecrã:
  // a lista partilha a linha com a coluna de filtros e o menu lateral
  return (
    <div className="@container">
      {/* Espaço estreito: um cartão por servidor (a tabela não cabe) */}
      <ul className="@2xl:hidden divide-y divide-slate-100">
        {linhas.map(({ servidor, nomePlataforma, totalSistemas, abrirDetalhes, acoes }) => (
          <li
            key={servidor.id}
            onClick={abrirDetalhes}
            className="py-3.5 first:pt-1 last:pb-1 flex items-start gap-3 cursor-pointer"
          >
            <div className="min-w-0 flex-1 space-y-1.5">
              <div>
                <p className="font-bold text-slate-800 text-sm break-words">{servidor.nome}</p>
                <p className="text-slate-400 font-mono text-[11px] break-all">{servidor.hostname}</p>
              </div>
              <p className="font-mono text-xs text-slate-600 break-all">{servidor.ip || "-"}</p>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                  {nomePlataforma}
                </span>
                {seloEstado(servidor)}
                <span className="text-[11px] text-slate-500">
                  {totalSistemas} sistema{totalSistemas === 1 ? "" : "s"}
                </span>
              </div>
            </div>
            {/* Os botões não abrem os detalhes: o clique fica neles */}
            <div className="shrink-0 -mr-1" onClick={(e) => e.stopPropagation()}>
              {acoes}
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden @2xl:block overflow-x-auto">
        <table className="w-full min-w-140 text-left text-xs">
          <thead className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-4 py-3">Servidor</th>
              <th className="px-4 py-3">Endereço IP</th>
              <th className="px-4 py-3">Plataforma</th>
              <th className="px-4 py-3 text-center">Sistemas</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {linhas.map(({ servidor, nomePlataforma, totalSistemas, abrirDetalhes, acoes }) => (
              <tr
                key={servidor.id}
                onClick={abrirDetalhes}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3.5">
                  <p className="font-bold text-slate-800 text-sm">{servidor.nome}</p>
                  <p className="text-slate-400 font-mono text-[11px]">{servidor.hostname}</p>
                </td>

                {/* Um IPv6 é comprido: pode quebrar para não empurrar as ações para fora */}
                <td className="px-4 py-3.5 font-mono text-slate-600 break-all max-w-44">
                  {servidor.ip || "-"}
                </td>

                <td className="px-4 py-3.5">
                  <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                    {nomePlataforma}
                  </span>
                </td>

                <td className="px-4 py-3.5 text-center">
                  <span
                    className={`inline-flex min-w-7 justify-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      totalSistemas > 0 ? "bg-blue-50 text-blue-900" : "bg-slate-100 text-slate-400"
                    }`}
                    title={`${totalSistemas} sistema(s) hospedado(s)`}
                  >
                    {totalSistemas}
                  </span>
                </td>

                <td className="px-4 py-3.5">{seloEstado(servidor)}</td>

                {/* Os botões não abrem os detalhes: o clique fica neles */}
                <td className="px-4 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  {acoes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
