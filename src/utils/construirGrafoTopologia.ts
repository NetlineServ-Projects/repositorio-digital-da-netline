import dagre from "@dagrejs/dagre";
import { Position, type Edge, type Node } from "@xyflow/react";
import { ROTULOS_TIPO_PLATAFORMA } from "../types/plataformaConstantes";
import type {
  PlataformaArvore,
  ServidorArvore,
  InfraestruturaArvore,
  DominioArvore,
} from "../types/plataformaArvore";

export type TipoNo =
  | "raiz"
  | "plataforma"
  | "dominio"
  | "subdominio"
  | "servidor"
  | "sistema"
  | "imagem";

export type DirecaoTopologia = "TB" | "LR";

/** Tipo de relação entre dois nós, que define o estilo da linha. */
export type RelacaoLigacao = "estrutura" | "dns" | "hospedagem";

export interface DadosNo extends Record<string, unknown> {
  tipo: TipoNo;
  titulo: string;
  subtitulo?: string;
  detalhe?: string;
  inativo?: boolean;
}

export type NoGrafo = Node<DadosNo, "topologia">;

export const LARGURA_NO = 240;
export const ALTURA_NO = 84;

// Peso alto mantém as plataformas todas na mesma linha, logo abaixo da raiz
const PESO_LIGACAO_DA_RAIZ = 10;

const ROTULO_AMBIENTE: Record<string, string> = {
  PRODUCAO: "Produção",
  TESTES: "Testes",
  DESENVOLVIMENTO: "Desenvolvimento",
};

const ESTILO_LIGACAO: Record<
  RelacaoLigacao,
  { stroke: string; strokeDasharray?: string }
> = {
  estrutura: { stroke: "#94a3b8" },
  dns: { stroke: "#4f46e5" },
  hospedagem: { stroke: "#059669", strokeDasharray: "6 4" },
};

function descreverExpiracao(dominio: DominioArvore): string {
  if (dominio.diasParaExpirar === null) return "";
  if (dominio.expirado) return "Expirado";
  return `Expira em ${dominio.diasParaExpirar} dias`;
}

export function construirGrafoTopologia(
  arvore: PlataformaArvore[],
  direcao: DirecaoTopologia = "TB",
): {
  nos: NoGrafo[];
  ligacoes: Edge[];
} {
  if (arvore.length === 0) return { nos: [], ligacoes: [] };

  const nos = new Map<string, NoGrafo>();
  const ligacoes = new Map<string, Edge>();

  const adicionarNo = (id: string, dados: DadosNo) => {
    if (nos.has(id)) return;
    nos.set(id, { id, type: "topologia", position: { x: 0, y: 0 }, data: dados });
  };

  const ligar = (
    origem: string,
    destino: string,
    relacao: RelacaoLigacao = "estrutura",
    rotulo?: string,
  ) => {
    const id = `${origem}->${destino}${rotulo ? `:${rotulo}` : ""}`;
    if (ligacoes.has(id)) return;
    ligacoes.set(id, {
      id,
      source: origem,
      target: destino,
      type: "smoothstep",
      label: rotulo,
      labelStyle: { fontSize: 10, fill: "#64748b" },
      style: ESTILO_LIGACAO[relacao],
    });
  };

  const adicionarSistema = (infra: InfraestruturaArvore, idPai: string) => {
    const idSistema = `sistema-${infra.sistema.id}`;
    adicionarNo(idSistema, {
      tipo: "sistema",
      titulo: infra.sistema.nome,
      subtitulo: infra.sistema.status,
      detalhe: infra.url ?? undefined,
    });
    ligar(
      idPai,
      idSistema,
      "hospedagem",
      ROTULO_AMBIENTE[infra.ambiente] ?? infra.ambiente,
    );
  };

  const adicionarServidor = (
    servidor: ServidorArvore,
    idPai: string,
    relacao: RelacaoLigacao,
  ) => {
    const idServidor = `servidor-${servidor.id}`;
    adicionarNo(idServidor, {
      tipo: "servidor",
      titulo: servidor.nome,
      subtitulo: servidor.ip ?? servidor.hostname,
      detalhe: `${servidor.numeroCpu} vCPU • ${servidor.memoriaRam} ${
        servidor.memoriaRamUnidade ?? "GB"
      } RAM • ${servidor.disco} ${servidor.discoUnidade ?? "GB"}`,
    });
    ligar(
      idPai,
      idServidor,
      relacao,
      relacao === "dns" ? "aponta para" : "hospeda",
    );
    servidor.infraestruturas?.forEach((infra) =>
      adicionarSistema(infra, idServidor),
    );
  };

  adicionarNo("raiz", {
    tipo: "raiz",
    titulo: "Netline",
    subtitulo: "Infraestrutura",
  });

  arvore.forEach((plataforma) => {
    const idPlataforma = `plataforma-${plataforma.id}`;
    adicionarNo(idPlataforma, {
      tipo: "plataforma",
      titulo: plataforma.nome,
      subtitulo: ROTULOS_TIPO_PLATAFORMA[plataforma.tipo],
      inativo: !plataforma.ativo,
    });
    ligar("raiz", idPlataforma);

    plataforma.dominios?.forEach((dominio) => {
      const idDominio = `dominio-${dominio.id}`;
      adicionarNo(idDominio, {
        tipo: "dominio",
        titulo: dominio.nome,
        subtitulo: descreverExpiracao(dominio),
      });
      ligar(idPlataforma, idDominio);

      dominio.subdominios.forEach((sub) => {
        const idSub = `subdominio-${sub.id}`;
        adicionarNo(idSub, {
          tipo: "subdominio",
          titulo: sub.nomeCompleto,
          subtitulo: sub.tipoDns,
          detalhe: sub.destino ?? undefined,
        });
        ligar(idDominio, idSub);
        if (sub.servidor) adicionarServidor(sub.servidor, idSub, "dns");
      });
    });

    plataforma.servidores?.forEach((servidor) =>
      adicionarServidor(servidor, idPlataforma, "hospedagem"),
    );

    plataforma.infraestruturas?.forEach((infra) =>
      adicionarSistema(infra, idPlataforma),
    );

    plataforma.imagens?.forEach((imagem) => {
      const idImagem = `imagem-${imagem.id}`;
      adicionarNo(idImagem, {
        tipo: "imagem",
        titulo: imagem.nome,
        subtitulo: `:${imagem.tag}`,
        detalhe: `${imagem.origem === "PROPRIA" ? "Própria" : "Terceiros"} • ${
          imagem.visibilidade === "PRIVADA" ? "Privada" : "Pública"
        }`,
        inativo: !imagem.ativo,
      });
      ligar(idPlataforma, idImagem);
    });
  });

  // Posições calculadas pelo dagre
  const grafo = new dagre.graphlib.Graph();
  grafo.setGraph({ rankdir: direcao, nodesep: 32, ranksep: 90 });
  grafo.setDefaultEdgeLabel(() => ({}));

  nos.forEach((no) =>
    grafo.setNode(no.id, { width: LARGURA_NO, height: ALTURA_NO }),
  );
  ligacoes.forEach((ligacao) =>
    grafo.setEdge(ligacao.source, ligacao.target, {
      weight: ligacao.source === "raiz" ? PESO_LIGACAO_DA_RAIZ : 1,
    }),
  );
  dagre.layout(grafo);

  const ehVertical = direcao === "TB";

  const nosPosicionados = Array.from(nos.values()).map((no) => {
    const posicao = grafo.node(no.id);
    return {
      ...no,
      sourcePosition: ehVertical ? Position.Bottom : Position.Right,
      targetPosition: ehVertical ? Position.Top : Position.Left,
      position: {
        x: posicao.x - LARGURA_NO / 2,
        y: posicao.y - ALTURA_NO / 2,
      },
    };
  });

  return { nos: nosPosicionados, ligacoes: Array.from(ligacoes.values()) };
}