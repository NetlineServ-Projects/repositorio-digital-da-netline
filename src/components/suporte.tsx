import SuporteTecnico from "../assets/suporte tecnio2.jpg";

export default function Suporte() {
  return (
    <section className=" bg-[#031e55] py-16 px-4 md:px-8 rounded-[40px] max-w-7xl mx-auto  ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Entre em contacto pelos meios abaixo
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <a
              href="tel:+258844907372"
              className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800/50 hover:shadow-md transition-all"
            >
              <div>
                <p className="text-sm font-medium text-zinc-500">Telefone</p>
                <span className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                  (258)844-907-372
                </span>
              </div>
            </a>

            <div className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800/50">
              <div>
                <p className="text-sm font-medium text-zinc-500">Localização</p>
                <span className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                  Av. Acordos de Lusaka, Malhangalene 'B', KaMpfumo
                </span>
              </div>
            </div>

            <a
              href="mailto:Ecnhamuanzo25@gmail.com"
              className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800/50 hover:shadow-md transition-all"
            >
              <div>
                <p className="text-sm font-medium text-zinc-500">E-mail</p>
                <span className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                  Ecnhamuanzo25@gmail.com
                </span>
              </div>
            </a>

            <a
              href="https://wa.me/258844907372"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800/50 hover:shadow-md transition-all"
            >
              <div>
                <p className="text-sm font-medium text-zinc-500">whatsapp</p>
                <span className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                  (258) 844907372
                </span>
              </div>
            </a>
          </div>
        </div>
        <div>
          <div className=" flex justify-center items-center overflow-hidden">
            <img
              src={SuporteTecnico}
              alt="Suporte tecnico"
            className=" w-3/4 rounded-2xl object-coverabsolute inset-0 bg-blue-900/30 mix-blend-multiply"/>
          </div>
        </div>
      </div>
    </section>
  );
}
