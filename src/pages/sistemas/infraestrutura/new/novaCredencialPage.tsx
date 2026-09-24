import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function NovaCredencialPage() {
  const { t } = useTranslation();
  const { sistemaId } = useParams<{ sistemaId: string }>();
  const navigate = useNavigate();

  const [tipo, setTipo] = useState("ENV");
  const [rotulo, setRotulo] = useState("");
  const [valor, setValor] = useState("");
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rotulo.trim() || !valor.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setSalvando(true);
      // Chamada da sua API (ex: await criarCredencial(sistemaId, { tipo, rotulo, valor }))
      
      toast.success("Credencial adicionada com sucesso!");
      // Redireciona de volta para a aba de credenciais do sistema
      navigate(`/dashboard/sistemas/${sistemaId}?tab=credenciais`);
    } catch (err) {
      toast.error("Erro ao salvar a credencial.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-[#18357a] text-white p-6 md:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">Sistemas</p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Nova Credencial</h1>
          <p className="text-sm text-blue-100/80 mt-1">Adicione variáveis de ambiente, chaves SSH ou acessos ao sistema.</p>
        </div>

        <Link
          to={`/dashboard/sistemas/${sistemaId}`}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-colors self-start md:self-auto"
        >
          Voltar ao Sistema
        </Link>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSalvar} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Tipo
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#18357a]"
          >
            <option value="ENV">Variáveis de Ambiente (.env)</option>
            <option value="SSH">Chave SSH / Acesso Servidor</option>
            <option value="DATABASE">Base de Dados</option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Rótulo <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={rotulo}
            onChange={(e) => setRotulo(e.target.value)}
            placeholder="Ex: Chave SSH — servidor principal"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#18357a]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Valor <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={6}
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Cole aqui o conteúdo (ex: variáveis de ambiente, chave, token...)"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-[#18357a]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate(`/dashboard/sistemas/${sistemaId}`)}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando}
            className="px-5 py-2.5 bg-[#18357a] hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {salvando ? "A guardar..." : "Guardar Credencial"}
          </button>
        </div>
      </form>
    </div>
  );
}