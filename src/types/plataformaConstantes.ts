import type { TipoPlataforma,FornecedorContainer, VisibilidadeImagem, OrigemImagem } from "./plataforma";

export const ROTULOS_TIPO_PLATAFORMA: Record<TipoPlataforma, string> = {
  CLOUD_BASE_DADOS: "Cloud Base de Dados",
  CONTAINERIZACAO: "Containerização & Nuvem",
  GESTAO_DOMINIO: "Gestão de Domínio",
};
export const ROTULOS_FORNECEDOR_CONTAINER: Record<FornecedorContainer, string> = {
  DOCKER_HUB: "Docker Hub",
  GITHUB_CONTAINER_REGISTRY: "GitHub Container Registry",
  AWS_ECR: "AWS ECR",
  GOOGLE_ARTIFACT_REGISTRY: "Google Artifact Registry",
  AZURE_CONTAINER_REGISTRY: "Azure Container Registry",
  GITLAB_REGISTRY: "GitLab Registry",
  KUBERNETES: "Kubernetes",
  DOCKER_SWARM: "Docker Swarm",
  PORTAINER: "Portainer",
  OUTRO: "Outro",
};

export const ROTULOS_VISIBILIDADE_IMAGEM: Record<VisibilidadeImagem, string> = {
  PUBLICA: "Pública",
  PRIVADA: "Privada",
};

export const ROTULOS_ORIGEM_IMAGEM: Record<OrigemImagem, string> = {
  PROPRIA: "Própria",
  TERCEIROS: "Terceiros",
};