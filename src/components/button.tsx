

interface Props {
  title: string;
  icon?: any;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClickButton?: () => void;
}

function Button({ title, icon, onClickButton, className, type = "button", disabled = false }: Props) {
  return (
    <button 
      onClick={onClickButton} 
      type={type} 
      disabled={disabled}
      className={`w-full p-3 bg-[#0066CC] hover:bg-[#007acc] rounded-2xl text-white font-bold text-center flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {icon && <span>{icon}</span>}
      {title}
    </button>
  );
}


export default Button;
