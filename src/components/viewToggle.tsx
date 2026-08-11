interface ViewToggleProps {
  modo: "tabela" | "cards";
  onChange: (modo: "tabela" | "cards") => void;
}

export default function ViewToggle({ modo, onChange }: ViewToggleProps) {
  return (
    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 ml-auto md:ml-0">
      <button onClick={() => onChange("tabela")} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${modo === "tabela" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>Tabela</button>
      <button onClick={() => onChange("cards")} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${modo === "cards" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>Grelha</button>
    </div>
  );
}