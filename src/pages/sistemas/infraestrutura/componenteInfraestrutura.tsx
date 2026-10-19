import { useState } from "react";
import type { ComponenteSistema } from "../../../hooks/useSistemasData";
import type { ComponenteInfraestruturaProps } from "../../../types/infraestrutura";
import PainelInfraestrutura from "./painelInfraestrutura";
import FormularioInfraestrutura from "./new/formularioInfraestrutura";

export type {
  InfraestruturaApi,
  ComponenteInfraestruturaProps,
} from "../../../types/infraestrutura";


// Só coordena: painel de leitura (2 cartões) ou página do formulário.
// O ambiente (Produção/Testes) vem do pai, que já tem o seletor com contadores.
export default function ComponenteInfraestrutura(props: ComponenteInfraestruturaProps) {
  const [componenteParaEditar, setComponenteParaEditar] =
    useState<ComponenteSistema | null>(null);

  if (componenteParaEditar) {
    return (
      <FormularioInfraestrutura
        {...props}
        componente={componenteParaEditar}
        onVoltar={() => setComponenteParaEditar(null)}
      />
    );
  }

  return <PainelInfraestrutura {...props} onAbrirFormulario={setComponenteParaEditar} />;
}