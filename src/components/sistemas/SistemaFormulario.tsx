import { useState } from "react";
import { IconVoltar } from "../icons";
import { toast } from "sonner";

interface SistemaFormularioProps {
  salvando: boolean;
  onCancelar: () => void;
  onSubmit: (dados: Record<string, unknown>) => Promise<void>;
}

function ListaEditavel({ label, placeholder, itens, onAdicionar, onRemover, corTag }: {
  label: string; placeholder: string; itens: string[];
  onAdicionar: (v: string) => void; onRemover: (i: number) => void; corTag: string;
}) {
  const [input, setInput] = useState("");
  const adicionar = () => {
    if (input.trim() && !itens.includes(input.trim())) {
      onAdicionar(input.trim());
      setInput("");
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), adicionar())}
          className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20"
        />
        <button type="button" onClick={adicionar} className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900">+ Add</button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {itens.map((item, idx) => (
          <span key={idx} className={`px-2.5 py-1 text-xs font-medium rounded-full border flex items-center gap-1.5 ${corTag}`}>
            {item}
            <button type="button" onClick={() => onRemover(idx)} className="hover:text-red-600 font-bold">×</button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SistemaFormulario({ salvando, onCancelar, onSubmit }: SistemaFormularioProps) {
  const [nome, setNome] = useState("");
  const [descCurta, setDescCurta] = useState("");
  const [descLonga, setDescLonga] = useState("");
  const [status, setStatus] = useState("Em Desenvolvimento");
  const [dataInicio, setDataInicio] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [repositorioUrl, setRepositorioUrl] = useState("");
  const [urlProducao, setUrlProducao] = useState("");
  const [responsavelTecnico, setResponsavelTecnico] = useState("");
  const [versaoAtual, setVersaoAtual] = useState("");

  const [devs, setDevs] = useState<string[]>([]);
  const [clientes, setClientes] = useState<string[]>([]);
  const [techsFrontend, setTechsFrontend] = useState<string[]>([]);
  const [techsBackend, setTechsBackend] = useState<string[]>([]);
  const [techsInfra, setTechsInfra] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return toast.error("O nome do sistema é obrigatório!");

    await onSubmit({
      nome,
      descricaoCurta: descCurta,
      descricaoLonga: descLonga,
      status,
      dataInicio: dataInicio || null,
      dataEntrega: dataEntrega || null,
      desenvolvedores: devs,
      empresasClientes: clientes,
      tecnologiasFrontend: techsFrontend,
      tecnologiasBackend: techsBackend,
      tecnologiasInfraestrutura: techsInfra,
      repositorioUrl: repositorioUrl || undefined,
      urlProducao: urlProducao || undefined,
      responsavelTecnico: responsavelTecnico || undefined,
      versaoAtual: versaoAtual || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onCancelar} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <IconVoltar /><span>Cancelar</span>
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Registar Novo Sistema</h2>
            <p className="text-xs text-slate-500">Preencha a ficha técnica do novo projeto</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Nome do Sistema *</label>
            <input type="text" required placeholder="Ex: Repositório Digital de Documentos" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Status do Projeto</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20">
              <option value="Em Desenvolvimento">Em Desenvolvimento</option>
              <option value="Em Produção">Em Produção</option>
              <option value="Manutenção">Manutenção</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Data Início</label>
              <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Data Entrega</label>
              <input type="date" value={dataEntrega} onChange={(e) => setDataEntrega(e.target.value)} className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Descrição Curta (Resumo)</label>
            <input type="text" placeholder="Resumo em uma frase para o cartão do sistema..." value={descCurta} onChange={(e) => setDescCurta(e.target.value)} className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Descrição Completa / Objetivo do Sistema</label>
            <textarea rows={3} placeholder="Explique detalhadamente qual problema este sistema resolve..." value={descLonga} onChange={(e) => setDescLonga(e.target.value)} className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 resize-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Link do Repositório</label>
            <input type="url" placeholder="https://github.com/..." value={repositorioUrl} onChange={(e) => setRepositorioUrl(e.target.value)} className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">URL de Produção</label>
            <input type="url" placeholder="https://sistema.empresa.com" value={urlProducao} onChange={(e) => setUrlProducao(e.target.value)} className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Responsável Técnico</label>
            <input type="text" placeholder="Nome do responsável atual" value={responsavelTecnico} onChange={(e) => setResponsavelTecnico(e.target.value)} className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Versão Atual</label>
            <input type="text" placeholder="Ex: v2.3.1" value={versaoAtual} onChange={(e) => setVersaoAtual(e.target.value)} className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20" />
          </div>

          <ListaEditavel label="Equipa de Desenvolvedores" placeholder="Nome do dev..." itens={devs} onAdicionar={(v) => setDevs([...devs, v])} onRemover={(i) => setDevs(devs.filter((_, idx) => idx !== i))} corTag="bg-blue-50 text-blue-900 border-blue-200" />
          <ListaEditavel label="Empresas Clientes / Utilizadores" placeholder="Nome da empresa..." itens={clientes} onAdicionar={(v) => setClientes([...clientes, v])} onRemover={(i) => setClientes(clientes.filter((_, idx) => idx !== i))} corTag="bg-emerald-50 text-emerald-800 border-emerald-200" />

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <ListaEditavel label="Tecnologias Frontend" placeholder="Ex: React, TypeScript..." itens={techsFrontend} onAdicionar={(v) => setTechsFrontend([...techsFrontend, v])} onRemover={(i) => setTechsFrontend(techsFrontend.filter((_, idx) => idx !== i))} corTag="bg-slate-100 text-slate-700 border-slate-200" />
            <ListaEditavel label="Tecnologias Backend" placeholder="Ex: Node.js, Prisma..." itens={techsBackend} onAdicionar={(v) => setTechsBackend([...techsBackend, v])} onRemover={(i) => setTechsBackend(techsBackend.filter((_, idx) => idx !== i))} corTag="bg-slate-100 text-slate-700 border-slate-200" />
            <ListaEditavel label="Infraestrutura" placeholder="Ex: MySQL, Docker..." itens={techsInfra} onAdicionar={(v) => setTechsInfra([...techsInfra, v])} onRemover={(i) => setTechsInfra(techsInfra.filter((_, idx) => idx !== i))} corTag="bg-slate-100 text-slate-700 border-slate-200" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <button type="button" onClick={onCancelar} className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors">Cancelar</button>
          <button type="submit" disabled={salvando} className="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50">
            {salvando ? "A Guardar..." : "Guardar Sistema"}
          </button>
        </div>
      </form>
    </div>
  );
}