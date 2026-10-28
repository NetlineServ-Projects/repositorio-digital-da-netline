import type { Rect } from "@xyflow/react";
import { getViewportForBounds } from "@xyflow/react";
import type { PlataformaArvore } from "../types/plataformaArvore";
import i18n from "../lang/i18n";
import {
  ROTULOS_TIPO_PLATAFORMA,
  ROTULOS_ORIGEM_IMAGEM,
  ROTULOS_VISIBILIDADE_IMAGEM,
  localeDatas,
} from "../types/plataformaConstantes";

// As bibliotecas (html-to-image, jspdf, exceljs) só se carregam quando alguém exporta,
// para não pesarem no carregamento normal da aplicação

const AZUL_NETLINE = "18357A";

function nomeFicheiro(extensao: string) {
  const data = new Date().toISOString().slice(0, 10);
  return `topologia-netline-${data}.${extensao}`;
}

function descarregar(blob: Blob, nome: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nome;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* -------------------------------------------------------------------------- */
/*  Excel: uma linha por elemento, com a plataforma de onde vem                 */
/* -------------------------------------------------------------------------- */

interface LinhaTopologia {
  plataforma: string;
  tipo: string;
  estado: string;
  elemento: string;
  nome: string;
  detalhe: string;
  sistema: string;
  ambiente: string;
  endereco: string;
}

// Textos no idioma ativo; um ambiente desconhecido sai tal como vem da API
const t = (chave: string, opcoes?: Record<string, unknown>) => i18n.t(`plataformas.exportar.${chave}`, opcoes);
const rotuloAmbiente = (ambiente: string) => i18n.t(`plataformas.ambientes.${ambiente}`, { defaultValue: ambiente });
const rotuloAtivo = (ativo: boolean) => i18n.t(ativo ? "plataformas.comum.ativa" : "plataformas.comum.inativa");

function linhasDaArvore(arvore: PlataformaArvore[]): LinhaTopologia[] {
  const linhas: LinhaTopologia[] = [];

  for (const p of arvore) {
    const base = {
      plataforma: p.nome,
      tipo: ROTULOS_TIPO_PLATAFORMA[p.tipo] ?? p.tipo,
      estado: rotuloAtivo(p.ativo),
    };
    const vazio = { detalhe: "", sistema: "", ambiente: "", endereco: "" };
    const inicio = linhas.length;

    for (const s of p.servidores ?? []) {
      linhas.push({
        ...base,
        ...vazio,
        elemento: t("elementos.servidor"),
        nome: s.nome,
        detalhe: [
          s.hostname,
          s.ip,
          `${s.numeroCpu} vCPU · ${s.memoriaRam} ${s.memoriaRamUnidade ?? "GB"} RAM · ${s.disco} ${s.discoUnidade ?? "GB"}`,
        ]
          .filter(Boolean)
          .join(" · "),
      });
      for (const i of s.infraestruturas ?? []) {
        linhas.push({
          ...base,
          elemento: t("elementos.sistemaNoServidor"),
          nome: s.nome,
          detalhe: "",
          sistema: i.sistema.nome,
          ambiente: rotuloAmbiente(i.ambiente),
          endereco: i.url ?? "",
        });
      }
    }

    for (const i of p.infraestruturas ?? []) {
      linhas.push({
        ...base,
        elemento: t("elementos.sistema"),
        nome: i.sistema.nome,
        detalhe: i.sistema.versaoAtual ? t("versao", { versao: i.sistema.versaoAtual }) : "",
        sistema: i.sistema.nome,
        ambiente: rotuloAmbiente(i.ambiente),
        endereco: i.url ?? "",
      });
    }

    for (const d of p.dominios ?? []) {
      linhas.push({
        ...base,
        ...vazio,
        elemento: t("elementos.dominio"),
        nome: d.nome,
        detalhe: d.expirado
          ? i18n.t("plataformas.topologia.expirado")
          : d.diasParaExpirar != null
            ? i18n.t("plataformas.topologia.expiraEmDias", { count: d.diasParaExpirar })
            : "",
      });
      for (const r of d.subdominios ?? []) {
        linhas.push({
          ...base,
          ...vazio,
          elemento: t("elementos.registoDns", { tipo: r.tipoDns }),
          nome: r.nomeCompleto,
          detalhe: r.servidor ? t("paraServidor", { nome: r.servidor.nome }) : r.destino ? `→ ${r.destino}` : "",
        });
      }
    }

    for (const img of p.imagens ?? []) {
      const nomeImagem = `${img.nome}:${img.tag}`;
      linhas.push({
        ...base,
        ...vazio,
        elemento: t("elementos.imagem"),
        nome: nomeImagem,
        detalhe: [
          ROTULOS_VISIBILIDADE_IMAGEM[img.visibilidade === "PRIVADA" ? "PRIVADA" : "PUBLICA"],
          ROTULOS_ORIGEM_IMAGEM[img.origem === "PROPRIA" ? "PROPRIA" : "TERCEIROS"],
          rotuloAtivo(img.ativo),
        ].join(" · "),
      });
      for (const i of img.infraestruturas ?? []) {
        linhas.push({
          ...base,
          elemento: t("elementos.sistemaUsaImagem"),
          nome: nomeImagem,
          detalhe: "",
          sistema: i.sistema.nome,
          ambiente: rotuloAmbiente(i.ambiente),
          endereco: i.url ?? "",
        });
      }
    }

    for (const s of p.sistemasFrontend ?? []) {
      linhas.push({
        ...base,
        ...vazio,
        elemento: t("elementos.frontend"),
        nome: s.nome,
        detalhe: s.versaoAtual ? t("versao", { versao: s.versaoAtual }) : "",
        sistema: s.nome,
        ambiente: t("todos"),
      });
    }

    // Uma plataforma sem nada associado também aparece, para a lista ficar completa
    if (linhas.length === inicio) linhas.push({ ...base, ...vazio, elemento: "—", nome: "" });
  }

  return linhas;
}

export async function exportarTopologiaExcel(arvore: PlataformaArvore[]) {
  const { default: ExcelJS } = await import("exceljs");
  const livro = new ExcelJS.Workbook();
  livro.creator = t("criador");
  livro.created = new Date();

  const folha = livro.addWorksheet(t("folha"), { views: [{ state: "frozen", ySplit: 1 }] });
  folha.columns = [
    { header: t("colunas.plataforma"), key: "plataforma", width: 26 },
    { header: t("colunas.tipo"), key: "tipo", width: 24 },
    { header: t("colunas.estado"), key: "estado", width: 10 },
    { header: t("colunas.elemento"), key: "elemento", width: 22 },
    { header: t("colunas.nome"), key: "nome", width: 32 },
    { header: t("colunas.detalhe"), key: "detalhe", width: 48 },
    { header: t("colunas.sistema"), key: "sistema", width: 30 },
    { header: t("colunas.ambiente"), key: "ambiente", width: 12 },
    { header: t("colunas.endereco"), key: "endereco", width: 40 },
  ];
  folha.addRows(linhasDaArvore(arvore));

  const cabecalho = folha.getRow(1);
  cabecalho.font = { bold: true, color: { argb: "FFFFFFFF" } };
  cabecalho.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${AZUL_NETLINE}` } };
  cabecalho.alignment = { vertical: "middle" };
  cabecalho.height = 22;
  folha.autoFilter = { from: "A1", to: "I1" };

  const buffer = await livro.xlsx.writeBuffer();
  descarregar(
    new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    nomeFicheiro("xlsx"),
  );
}

/* -------------------------------------------------------------------------- */
/*  PDF: a imagem do diagrama, enquadrada em todos os nós                       */
/* -------------------------------------------------------------------------- */

// limites: a caixa de todos os nós (vem do useReactFlow().getNodesBounds no componente)
export async function exportarTopologiaPdf(contentor: HTMLElement, limites: Rect) {
  const viewport = contentor.querySelector<HTMLElement>(".react-flow__viewport");
  if (!viewport || limites.width === 0) throw new Error(t("nadaParaExportar"));

  const [{ toJpeg }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);
  await document.fonts.ready;

  // Enquadra todos os nós (e não só o que está visível no ecrã), com margem
  // Largura fixa e moderada: chega para ler os nós no A4 e mantém o PDF leve
  const largura = 2000;
  const altura = Math.round((largura * (limites.height + 160)) / (limites.width + 160));
  const { x, y, zoom } = getViewportForBounds(limites, largura, altura, 0.1, 2, 0.05);

  // O PDF sai sempre com as cores do tema claro
  const raiz = document.documentElement;
  const estavaEscuro = raiz.classList.contains("dark");
  if (estavaEscuro) raiz.classList.remove("dark");

  let imagem: string;
  try {
    const opcoes = {
      quality: 0.92,
      // Não incorpora as fontes do Google Fonts (pedido extra e lento); usa as já carregadas
      skipFonts: true,
      backgroundColor: "#ffffff",
      width: largura,
      height: altura,
      pixelRatio: 1.5,
      style: {
        width: `${largura}px`,
        height: `${altura}px`,
        transform: `translate(${x}px, ${y}px) scale(${zoom})`,
      },
    };
    // No Chrome o html-to-image devolve às vezes uma captura vazia (sobretudo a primeira).
    // Uma imagem vazia comprime muito mais, por isso fica-se com a maior de até 3 tentativas.
    imagem = await toJpeg(viewport, opcoes);
    for (let tentativa = 1; tentativa < 3; tentativa++) {
      const outra = await toJpeg(viewport, opcoes);
      if (outra.length > imagem.length * 1.5) imagem = outra;
      else if (imagem.length >= outra.length * 1.5) continue;
      else break; // duas capturas parecidas: a imagem estabilizou
    }
  } finally {
    if (estavaEscuro) raiz.classList.add("dark");
  }

  const pdf = new jsPDF({ orientation: largura >= altura ? "landscape" : "portrait", unit: "mm", format: "a4" });
  const larguraPagina = pdf.internal.pageSize.getWidth();
  const alturaPagina = pdf.internal.pageSize.getHeight();
  const margem = 12;

  pdf.setFillColor(24, 53, 122);
  pdf.rect(0, 0, larguraPagina, 18, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text(t("pdfTitulo"), margem, 11.5);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text(new Date().toLocaleString(localeDatas()), larguraPagina - margem, 11.5, { align: "right" });

  // A imagem ocupa o espaço livre sem deformar
  const topo = 24;
  const espacoL = larguraPagina - margem * 2;
  const espacoA = alturaPagina - topo - margem - 8;
  const escala = Math.min(espacoL / largura, espacoA / altura);
  const w = largura * escala;
  const h = altura * escala;
  pdf.addImage(imagem, "JPEG", (larguraPagina - w) / 2, topo, w, h);

  pdf.setTextColor(100, 116, 139);
  pdf.setFontSize(8);
  pdf.text(
    t("pdfLegenda"),
    margem,
    alturaPagina - margem + 2,
  );

  pdf.save(nomeFicheiro("pdf"));
}
