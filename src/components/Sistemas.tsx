import React, { useState } from "react";
// Importas diretamente da tua pasta de ícones!
import { 
  IconSistema, 
  IconPasta, 
  IconPesquisa, 
  IconVoltar, 
  IconVer 
} from "../components/icons";

interface Documento {
  id: string | number;
  nome: string;
  autor: string;
  tamanho: string;
  dataUpload: string;
  status: "Pendente" | "Aprovado" | "Rejeitado";
}

interface Sistema {
  id: string | number;
  nome: string;
  descricao: string;
  versao: string;
  status: "Em Produção" | "Em Desenvolvimento" | "Manutenção";
  tecnologias: string[];
  totalDocumentos: number;
}

export default function SistemasDesenvolvidos() {
  const [sistemas] = useState<Sistema[]>([
    {
      id: "1",
      nome: "Repositório Digital de Documentos",
      descricao: "Plataforma para gestão, aprovação e arquivamento de ficheiros internos.",
      versao: "v1.0 (MVP)",
      status: "Em Desenvolvimento",
      tecnologias: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
      totalDocumentos: 18,
    },
    {
      id: "2",
      nome: "Plataforma UniMaterial",
      descricao: "Sistema de troca e gestão de manuais e recursos de estudo.",
      versao: "v1.2",
      status: "Em Produção",
      tecnologias: ["React", "Express", "MySQL"],
      totalDocumentos: 9,
    },
  ]);

  const [documentosPorSistema] = useState<Record<string, Documento[]>>({
    "Repositório Digital de Documentos": [
      {
        id: "101",
        nome: "Especificacao_Tecnica_Repositorio.pdf",
        autor: "Elisa Nhamuanzo",
        tamanho: "1.8 MB",
        dataUpload: "21/07/2026",
        status: "Aprovado",
      },
    ],
  });

  const [sistemaAtivo, setSistemaAtivo] = useState<Sistema | null>(null);
  const [busca, setBusca] = useState("");
  const [buscaDoc, setBuscaDoc] = useState("");

  const sistemasFiltrados = sistemas.filter(
    (sis) =>
      sis.nome.toLowerCase().includes(busca.toLowerCase()) ||
      sis.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  const documentosDoSistema = sistemaAtivo
    ? (documentosPorSistema[sistemaAtivo.nome] || []).filter((doc) =>
        doc.nome.toLowerCase().includes(buscaDoc.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      {!sistemaAtivo ? (
        <>
          {/* Cabeçalho */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Sistemas Desenvolvidos</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Consulte os projetos e documentações técnicas associadas
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              Total: <span className="text-blue-900 font-bold">{sistemas.length}</span>
            </div>
          </div>

          {/* Pesquisa */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Pesquisar sistema..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
              />
              <span className="absolute left-3 top-2.5 text-slate-400">
                <IconPesquisa />
              </span>
            </div>
          </div>

          {/* Grelha */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sistemasFiltrados.map((sis) => (
              <div
                key={sis.id}
                className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg">
                      <IconSistema className="w-5 h-5 text-blue-900" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                      {sis.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-base">{sis.nome}</h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{sis.descricao}</p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {sis.tecnologias.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] rounded-md font-medium border border-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Ficheiros: <strong className="text-slate-700">{sis.totalDocumentos}</strong>
                  </span>

                  <button
                    onClick={() => setSistemaAtivo(sis)}
                    className="flex items-center gap-1.5 py-1.5 px-3 bg-slate-50 hover:bg-blue-900 hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200 hover:border-blue-900"
                  >
                    <IconVer />
                    <span>Ver detalhes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* VISTA DE DOCUMENTOS DO SISTEMA */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSistemaAtivo(null)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <IconVoltar />
                <span>Voltar</span>
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <IconSistema className="w-5 h-5 text-blue-900" />
                  <h2 className="text-xl font-bold text-slate-800">{sistemaAtivo.nome}</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{sistemaAtivo.descricao}</p>
              </div>
            </div>
          </div>

          {/* Tabela de Ficheiros */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase text-xs border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Documento</th>
                  <th className="py-3.5 px-4 font-semibold">Autor</th>
                  <th className="py-3.5 px-4 font-semibold">Tamanho</th>
                  <th className="py-3.5 px-4 font-semibold">Data</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documentosDoSistema.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                      <IconPasta className="text-blue-900" />
                      <span>{doc.nome}</span>
                    </td>
                    <td className="py-3.5 px-4">{doc.autor}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">{doc.tamanho}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">{doc.dataUpload}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}