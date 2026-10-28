import { IconPesquisa } from "./icons";

interface searchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function searchInput({ value, onChange, placeholder }: searchInputProps) {
  return (
    <div className="relative w-full">
      <IconPesquisa className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
      />
    </div>
  );
}
