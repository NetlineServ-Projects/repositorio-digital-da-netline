import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

export interface OpcaoSelect {
  valor: string;
  label: string;
  descricao?: string; // linha secundária, mais pequena (ex: tipo da plataforma)
  desativada?: boolean;
}

interface SelectPesquisavelProps {
  valor: string;
  onChange: (valor: string) => void;
  opcoes: OpcaoSelect[];
  placeholder?: string;
  // Opção "vazia" no topo da lista (ex: "Sem categoria"). Escolhê-la devolve "".
  opcaoVazia?: string;
  comBusca?: boolean;
  disabled?: boolean;
  required?: boolean; // usa a validação nativa do formulário, como um select nativo com required
  id?: string; // para ligar a um <label htmlFor>
  tamanho?: "sm" | "md";
  className?: string; // largura/posição do contentor (por defeito ocupa a linha toda)
  "aria-label"?: string;
}

const ALTURA_MAXIMA_MENU = 288;

// Dropdown de escolha única com pesquisa, no mesmo estilo do FilterSelect dos documentos.
// O menu abre num portal (position: fixed) para não ser cortado por cartões com overflow.
export default function SelectPesquisavel({
  valor,
  onChange,
  opcoes,
  placeholder,
  opcaoVazia,
  comBusca = true,
  disabled = false,
  required = false,
  id,
  tamanho = "md",
  className = "w-full",
  "aria-label": ariaLabel,
}: SelectPesquisavelProps) {
  const { t } = useTranslation();
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [destacado, setDestacado] = useState(0);
  const [posicao, setPosicao] = useState<{ top: number; left: number; width: number; paraCima: boolean }>();
  const botaoRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buscaRef = useRef<HTMLInputElement>(null);
  const listaRef = useRef<HTMLUListElement>(null);
  const idLista = useId();

  const todas = useMemo<OpcaoSelect[]>(
    () => (opcaoVazia !== undefined ? [{ valor: "", label: opcaoVazia }, ...opcoes] : opcoes),
    [opcoes, opcaoVazia],
  );

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return todas;
    return todas.filter(
      (o) => o.label.toLowerCase().includes(termo) || o.descricao?.toLowerCase().includes(termo),
    );
  }, [todas, busca]);

  const selecionada = todas.find((o) => o.valor === valor);

  const calcularPosicao = () => {
    const r = botaoRef.current?.getBoundingClientRect();
    if (!r) return;
    const espacoAbaixo = window.innerHeight - r.bottom;
    const paraCima = espacoAbaixo < ALTURA_MAXIMA_MENU && r.top > espacoAbaixo;
    setPosicao({
      top: paraCima ? r.top - 4 : r.bottom + 4,
      left: r.left,
      width: Math.max(r.width, 200),
      paraCima,
    });
  };

  const abrir = () => {
    if (disabled) return;
    calcularPosicao();
    setBusca("");
    setDestacado(Math.max(0, todas.findIndex((o) => o.valor === valor)));
    setAberto(true);
  };

  const fechar = (devolverFoco = true) => {
    setAberto(false);
    if (devolverFoco) botaoRef.current?.focus();
  };

  const escolher = (opcao: OpcaoSelect) => {
    if (opcao.desativada) return;
    onChange(opcao.valor);
    fechar();
  };

  // Acompanha o botão quando a página faz scroll ou muda de tamanho
  useLayoutEffect(() => {
    if (!aberto) return;
    const atualizar = () => calcularPosicao();
    window.addEventListener("resize", atualizar);
    window.addEventListener("scroll", atualizar, true);
    return () => {
      window.removeEventListener("resize", atualizar);
      window.removeEventListener("scroll", atualizar, true);
    };
  }, [aberto]);

  // Fecha ao clicar fora
  useEffect(() => {
    if (!aberto) return;
    const aoClicar = (e: MouseEvent) => {
      const alvo = e.target as Node;
      if (!menuRef.current?.contains(alvo) && !botaoRef.current?.contains(alvo)) fechar(false);
    };
    document.addEventListener("mousedown", aoClicar);
    return () => document.removeEventListener("mousedown", aoClicar);
  }, [aberto]);

  useEffect(() => {
    if (aberto) (comBusca ? buscaRef.current : listaRef.current)?.focus();
  }, [aberto, comBusca]);

  // Mantém a opção destacada visível ao navegar com as setas
  useEffect(() => {
    if (!aberto) return;
    listaRef.current
      ?.querySelector<HTMLElement>(`[data-indice="${destacado}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [destacado, aberto]);

  const mover = (passo: 1 | -1) => {
    if (filtradas.length === 0) return;
    let i = destacado;
    for (let n = 0; n < filtradas.length; n++) {
      i = (i + passo + filtradas.length) % filtradas.length;
      if (!filtradas[i].desativada) break;
    }
    setDestacado(i);
  };

  const aoTeclarMenu = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); mover(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); mover(-1); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (filtradas[destacado]) escolher(filtradas[destacado]);
    } else if (e.key === "Escape") { e.preventDefault(); fechar(); }
    else if (e.key === "Tab") fechar(false);
  };

  const aoTeclarBotao = (e: React.KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      abrir();
    }
  };

  const pequeno = tamanho === "sm";

  return (
    <div className={`relative ${className}`}>
      <button
        ref={botaoRef}
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => (aberto ? fechar() : abrir())}
        onKeyDown={aoTeclarBotao}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-controls={aberto ? idLista : undefined}
        aria-label={ariaLabel}
        className={`w-full flex items-center justify-between gap-2 bg-slate-50 border rounded-xl text-left transition-all cursor-pointer hover:bg-slate-100/80 focus:outline-none focus:ring-2 focus:ring-netline-azul/20 focus:border-netline-azul disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-slate-50 ${
          aberto ? "border-netline-azul ring-2 ring-netline-azul/20" : "border-slate-200"
        } ${pequeno ? "px-3 py-2 text-xs" : "px-3.5 py-2.5 text-sm"}`}
      >
        <span className={`truncate ${selecionada && selecionada.valor !== "" ? "font-medium text-slate-800" : "text-slate-400"}`}>
          {selecionada?.label ?? placeholder ?? t("componentes.select.selecionar")}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${aberto ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Campo escondido só para a validação "required" do formulário */}
      {required && (
        <input
          tabIndex={-1}
          aria-hidden="true"
          required
          value={valor}
          onChange={() => {}}
          onFocus={() => botaoRef.current?.focus()}
          className="absolute inset-x-0 bottom-0 h-px opacity-0 pointer-events-none"
        />
      )}

      {aberto &&
        posicao &&
        createPortal(
          <div
            ref={menuRef}
            onKeyDown={aoTeclarMenu}
            style={{
              position: "fixed",
              left: posicao.left,
              width: posicao.width,
              ...(posicao.paraCima
                ? { bottom: window.innerHeight - posicao.top }
                : { top: posicao.top }),
            }}
            className="z-[1000] bg-white border border-slate-200 rounded-xl shadow-lg p-2 space-y-2"
          >
            {comBusca && (
              <div className="relative">
                <svg
                  className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={buscaRef}
                  type="text"
                  placeholder={t("componentes.select.pesquisar")}
                  value={busca}
                  onChange={(e) => {
                    setBusca(e.target.value);
                    setDestacado(0);
                  }}
                  aria-label={t("componentes.select.pesquisarOpcoes")}
                  aria-controls={idLista}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-slate-300"
                />
              </div>
            )}

            <ul
              ref={listaRef}
              id={idLista}
              role="listbox"
              tabIndex={-1}
              aria-activedescendant={filtradas[destacado] ? `${idLista}-${destacado}` : undefined}
              className="max-h-60 overflow-y-auto space-y-0.5 focus:outline-none"
            >
              {filtradas.length === 0 ? (
                <li className="p-2 text-xs text-center text-slate-400">{t("componentes.select.semResultados")}</li>
              ) : (
                filtradas.map((opcao, indice) => {
                  const marcada = opcao.valor === valor;
                  const emFoco = indice === destacado;
                  return (
                    <li
                      key={opcao.valor || "__vazia"}
                      id={`${idLista}-${indice}`}
                      data-indice={indice}
                      role="option"
                      aria-selected={marcada}
                      aria-disabled={opcao.desativada}
                      onMouseEnter={() => setDestacado(indice)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => escolher(opcao)}
                      className={`flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-lg transition-colors ${
                        opcao.desativada
                          ? "text-slate-300 cursor-not-allowed"
                          : marcada
                            ? "bg-netline-dourado/10 text-[#b07a14] font-semibold cursor-pointer"
                            : emFoco
                              ? "bg-slate-100 text-slate-800 cursor-pointer"
                              : "text-slate-600 cursor-pointer"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className={`block truncate ${opcao.valor === "" ? "italic" : ""}`}>{opcao.label}</span>
                        {opcao.descricao && (
                          <span className="block truncate text-[10px] text-slate-400 font-normal">{opcao.descricao}</span>
                        )}
                      </span>
                      {marcada && (
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
}
