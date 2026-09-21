import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

const Card = ({ title, description, icon }: Props) => {
  return (
    <div className="mt-4 px-4 mx-auto">
      <div className="grid grid-cols-1 gap-6">
        <div className="p-6 text-center rounded-lg bg-white w-full shadow-sm hover:shadow-md transition-shadow">

          {icon && (
            <div className="flex justify-center mb-4 text-[#0066CC] text-4xl">
              {icon}
            </div>
          )}

          <p className="text-3xl font-bold">{title}</p>

          {description && (
            <p className="text-sm text-muted-foreground mt-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;