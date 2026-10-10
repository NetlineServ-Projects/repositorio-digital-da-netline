import AbaServidores from "../abas/abaServidores";
import AbaDominios from "../abas/abadominios";
import { ROTULOS_TIPO_PLATAFORMA } from "../../../types/plataformaConstantes";
import type { AoEditarItem, AoEliminarItem } from "../../../types/plataformaTipos";
import type {
  Plataforma,
  Servidor,
  Dominio,
  Subdominio,
} from "../../../types/plataforma";

interface DetalhesPlataformaProps {
  plataforma: Plataforma;
  plataformas: Plataforma[];
  servidores: Servidor[];
  dominios: Dominio[];
  subdominios: Subdominio[];
  ehAdmin: boolean;
  aoVoltar: () => void;
  aoEditar: AoEditarItem;
  aoEliminar: AoEliminarItem;
}

export default function DetalhesPlataforma({
  plataforma,
  plataformas,
  servidores,
  dominios,
  subdominios,
  ehAdmin,
  aoVoltar,
  aoEditar,
  aoEliminar,
}: DetalhesPlataformaProps) {
  const servidoresDaPlataforma = servidores.filter(
    (s) => s.plataformaId === plataforma.id
  );
  const dominiosDaPlataforma = dominios.filter(
    (d) => d.plataformaId === plataforma.id
  );

  const idsDominiosDaPlataforma = new Set(dominiosDaPlataforma.map((d) => d.id));
  const totalRegistosDns = subdominios.filter((s) =>
    idsDominiosDaPlataforma.has(s.dominioId)
  ).length;

  const indicadores = [
    { rotulo: "Servidores", valor: servidoresDaPlataforma.length },
    { rotulo: "Domínios", valor: dominiosDaPlataforma.length },
    { rotulo: "Registos DNS", valor: totalRegistosDns },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ================= HEADER ================= */}
      <div className="bg-[#18357a] text-white p-6 sm:p-8 rounded-2xl shadow-sm space-y-5">
        <button
          onClick={aoVoltar}
          className="text-xs font-semibold text-blue-100/80 hover:text-white transition-colors cursor-pointer"
        >
          ← Voltar às plataformas
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs uppercase font-semibold text-blue-200/80 tracking-widest block mb-1">
              {ROTULOS_TIPO_PLATAFORMA[plataforma.tipo]}
            </span>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold">
                {plataforma.nome}
              </h2>
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  plataforma.ativo
                    ? "bg-emerald-500/20 text-emerald-200"
                    : "bg-white/10 text-blue-100/80"
                }`}
              >
                {plataforma.ativo ? "Ativa" : "Inativa"}
              </span>
            </div>
            {plataforma.urlPainel && (
              <a
                href={plataforma.urlPainel}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-100/80 hover:text-white hover:underline mt-1 inline-block"
              >
                {plataforma.urlPainel} ↗
              </a>
            )}
          </div>

          {ehAdmin && (
            <button
              onClick={() => aoEditar("plataforma", plataforma)}
              className="bg-white text-[#18357a] hover:bg-slate-100 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              Editar plataforma
            </button>
          )}
        </div>
      </div>

      {/* ================= INDICADORES ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {indicadores.map((indicador) => (
          <div
            key={indicador.rotulo}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs"
          >
            <p className="text-xs text-slate-500 font-medium">
              {indicador.rotulo}
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {indicador.valor}
            </p>
          </div>
        ))}
      </div>

      {/* ================= SERVIDORES ================= */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Servidores
        </h3>
        <AbaServidores
          servidores={servidoresDaPlataforma}
          plataformas={plataformas}
          ehAdmin={ehAdmin}
          aoEditar={aoEditar}
          aoEliminar={aoEliminar}
        />
      </section>

      {/* ================= DOMÍNIOS ================= */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Domínios & DNS
        </h3>
        <AbaDominios
          dominios={dominiosDaPlataforma}
          subdominios={subdominios}
          servidores={servidores}
          ehAdmin={ehAdmin}
          aoEditar={aoEditar}
          aoEliminar={aoEliminar}
        />
      </section>
    </div>
  );
}