import AcoesItem from "../../../components/plataformas/acoesItem";
import EstadoVazio from "../../../components/plataformas/estadoVazio";
import type { AoEditarItem, AoEliminarItem } from "../../../types/plataformaTipos";
import type { ImagemContainer } from "../../../types/plataforma";
import {
  ROTULOS_VISIBILIDADE_IMAGEM,
  ROTULOS_ORIGEM_IMAGEM,
} from "../../../types/plataformaConstantes";

interface AbaImagensProps {
  imagens: ImagemContainer[];
  ehAdmin: boolean;
  aoEditar: AoEditarItem;
  aoEliminar: AoEliminarItem;
}

function formatarData(data: string | null): string {
  return data ? new Date(data).toLocaleDateString("pt-PT") : "-";
}

export default function AbaImagens({
  imagens,
  ehAdmin,
  aoEditar,
  aoEliminar,
}: AbaImagensProps) {
  if (imagens.length === 0) {
    return <EstadoVazio mensagem="Nenhuma imagem registada." />;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-5 py-3.5">Imagem</th>
              <th className="px-5 py-3.5">Origem</th>
              <th className="px-5 py-3.5">Visibilidade</th>
              <th className="px-5 py-3.5">Porta</th>
              <th className="px-5 py-3.5">Último Push</th>
              <th className="px-5 py-3.5">Estado</th>
              {ehAdmin && <th className="px-5 py-3.5 text-right">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {imagens.map((imagem) => (
              <tr
                key={imagem.id}
                className="hover:bg-slate-50/60 transition-colors"
              >
                <td className="px-5 py-3.5">
                  <p className="font-bold text-slate-800 text-sm">{imagem.nome}</p>
                  <p className="text-slate-400 font-mono text-[11px]">
                    :{imagem.tag}
                  </p>
                </td>
                <td className="px-5 py-3.5">
                  {ROTULOS_ORIGEM_IMAGEM[imagem.origem]}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                      imagem.visibilidade === "PRIVADA"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {ROTULOS_VISIBILIDADE_IMAGEM[imagem.visibilidade]}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-mono text-slate-600">
                  {imagem.portaExposta ?? "-"}
                </td>
                <td className="px-5 py-3.5">{formatarData(imagem.ultimoPushEm)}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      imagem.ativo
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    {imagem.ativo ? "Ativa" : "Inativa"}
                  </span>
                </td>
                {ehAdmin && (
                  <td className="px-5 py-3.5 text-right">
                    <AcoesItem
                      tituloEditar="Editar imagem"
                      tituloEliminar="Eliminar imagem"
                      onEditar={() => aoEditar("imagem", imagem)}
                      onEliminar={() =>
                        aoEliminar("imagem", imagem.id, `${imagem.nome}:${imagem.tag}`)
                      }
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}