interface searchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function searchInput({ value, onChange, placeholder }: searchInputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
    />
  );
}