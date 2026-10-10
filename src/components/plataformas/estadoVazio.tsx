interface EstadoVazioProps {
  mensagem: string;
}

export default function EstadoVazio({ mensagem }: EstadoVazioProps) {
  return (
    <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 text-slate-500 text-sm">
      {mensagem}
    </div>
  );
}