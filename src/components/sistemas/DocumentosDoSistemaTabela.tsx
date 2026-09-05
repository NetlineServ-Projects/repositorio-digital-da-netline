import { useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { IconPasta, IconDownload, IconVer } from "../icons";
import FilterSelect from "../filterSelect";
import type { Documento } from "../../hooks/useSistemasData";
import type { Categoria } from "../../types/documento";
import { formatarTamanho, obterUrlFicheiro } from "../../utils/documentos";
import { classificarTipo, OPCOES_TIPO } from "../../utils/tipoDocumento";
import { API_URL } from "../../utils/api";

interface DocumentosDoSistemaTabelaProps {
  documentos: Documento[];
  categorias: Categoria[];
  busca: string;
  onBuscaChange: (v: string) => void;
  onEditar: (doc: Documento) => void;
  onApagar: (id: number) => void;
}

export default function DocumentosDoSistemaTabela({
  documentos,
  categorias,
  busca,
  onBuscaChange,
  onEditar,
  onApagar,
}: DocumentosDoSistemaTabelaProps) {
  const [categoriaFiltro, setCategoriaFiltro] = useState<string[]>([]);
  const [autorFiltro, setAutorFiltro] = useState<string[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState<string[]>([]);

  // Opções formatadas para o FilterSelect ({ valor, label })
  const opcoesCategorias = useMemo(
    () => categorias.map((c) => ({ valor: c.nome, label: c.nome })),
    [categorias],
  );

  const opcoesAutores = useMemo(() => {
    const nomes = documentos
      .map((d) => d.usuario?.nome)
      .filter((n): n is string => Boolean(n));
    return Array.from(new Set(nomes))
      .sort()
      .map((nome) => ({ valor: nome, label: nome }));
  }, [documentos]);

  const opcoesTipos = useMemo(
    () =>
      OPCOES_TIPO.filter((t) => t.valor !== "TODOS").map((t) => ({
        valor: t.valor,
        label: t.label,
      })),
    [],
  );

  const documentosFiltrados = useMemo(() => {
    return documentos.filter((doc) => {
      const catDoc = doc.categoria?.nome || "";
      const autorDoc = doc.usuario?.nome || "";

      const atendeCategoria =
        categoriaFiltro.length === 0 || categoriaFiltro.includes(catDoc);
      const atendeAutor =
        autorFiltro.length === 0 || autorFiltro.includes(autorDoc);
      const atendeTipo =
        tipoFiltro.length === 0 ||
        tipoFiltro.includes(classificarTipo(doc.tipoArquivo));

      return atendeCategoria && atendeAutor && atendeTipo;
    });
  }, [documentos, categoriaFiltro, autorFiltro, tipoFiltro]);

  const possuiFiltrosAtivos =
    categoriaFiltro.length > 0 ||
    autorFiltro.length > 0 ||
    tipoFiltro.length > 0;

  const limparFiltros = useCallback(() => {
    setCategoriaFiltro([]);
    setAutorFiltro([]);
    setTipoFiltro([]);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
      {/* Barra de Pesquisa e Filtros Customizados */}
      <div className="p-4 border-b border-slate-100 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="font-bold text-slate-800 text-sm">
            Documentos do Sistema ({documentosFiltrados.length})
          </h3>

          <div className="w-full sm:w-64 relative">
            <input
              type="text"
              placeholder="Pesquisar ficheiro..."
              value={busca}
              onChange={(e) => onBuscaChange(e.target.value)}
              className="w-full pl-3 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 text-slate-800 placeholder-slate-400 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div className="w-48">
            <FilterSelect
              label="Categoria"
              placeholder="Todas as Categorias"
              opcoes={opcoesCategorias}
              selecionados={categoriaFiltro}
              onChange={setCategoriaFiltro}
            />
          </div>

          <div className="w-48">
            <FilterSelect
              label="Autor"
              placeholder="Todos os Autores"
              opcoes={opcoesAutores}
              selecionados={autorFiltro}
              onChange={setAutorFiltro}
            />
          </div>

          <div className="w-48">
            <FilterSelect
              label="Tipo"
              placeholder="Todos os Tipos"
              opcoes={opcoesTipos}
              selecionados={tipoFiltro}
              onChange={setTipoFiltro}
            />
          </div>

          {possuiFiltrosAtivos && (
            <button
              onClick={limparFiltros}
              className="text-xs text-rose-600 font-semibold hover:underline px-1 py-1 rounded transition-colors self-end mb-1"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabela de Listagem de Documentos */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-400 uppercase text-[11px] border-b border-slate-100 tracking-wider">
            <tr>
              <th className="py-3 px-4 font-semibold">Documento</th>
              <th className="py-3 px-4 font-semibold">Autor</th>
              <th className="py-3 px-4 font-semibold">Tamanho</th>
              <th className="py-3 px-4 font-semibold">Data</th>
              <th className="py-3 px-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documentosFiltrados.length > 0 ? (
              documentosFiltrados.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2.5">
                    <IconPasta className="text-blue-900 shrink-0" />
                    <span className="truncate max-w-xs sm:max-w-md">
                      {doc.titulo || doc.nomeArquivo || "Ficheiro sem nome"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    {doc.usuario?.nome || "Sistema"}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                    {formatarTamanho(doc.tamanho)}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                    {doc.dataSubmissao
                      ? new Date(doc.dataSubmissao).toLocaleDateString("pt-PT")
                      : "-"}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/dashboard/documentos/${doc.id}`}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-200/60"
                        title="Ver documento"
                        aria-label="Ver documento"
                      >
                        <IconVer />
                      </Link>
                      <a
                        href={obterUrlFicheiro(doc.caminho, API_URL)}
                        download={doc.nomeArquivo}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg transition-colors border border-blue-100"
                        title="Descarregar ficheiro"
                        aria-label="Descarregar ficheiro"
                      >
                        <IconDownload />
                      </a>
                      <button
                        onClick={() => onEditar(doc)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-semibold rounded-lg transition-colors border border-blue-100"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onApagar(doc.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Apagar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10 text-slate-400 text-xs"
                >
                  Nenhum documento encontrado para este sistema com os critérios
                  selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
