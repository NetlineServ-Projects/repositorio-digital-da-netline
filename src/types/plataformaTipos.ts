
import type { TipoFormularioPlataforma } from "../pages/Plataformas/formulario/page";
import type {
  Plataforma,
  Servidor,
  Dominio,
  Subdominio,
  ImagemContainer
} from "./plataforma";
 
export type DadosItemEdicao = Plataforma | Servidor | Dominio | Subdominio | ImagemContainer;
 
export type AoEditarItem = (
  tipo: TipoFormularioPlataforma,
  dados: DadosItemEdicao
) => void;
 
export type AoEliminarItem = (
  tipo: TipoFormularioPlataforma,
  id: number,
  nome: string
) => void;
 
