import { useState } from "react";
import {
  useUsuariosData,
  type Usuario,
  type UsuarioFormData,
} from "../../../hooks/useUsuariosData";

import UsuariosHeader from "../../../components/usuarios/usuariosHeader";
import UsuariosBusca from "../../../components/usuarios/usuariosBusca";
import UsuariosTabela from "../../../components/usuarios/usuariosTabela";
import UsuarioFormulario from "../../../components/usuarios/usuarioFormulario";

const FORM_VAZIO: UsuarioFormData = {
  nome: "",
  email: "",
  senha: "",
  numero: "",
  cargo: "",
  perfil: "FUNCIONARIO",
};

export default function UsuariosPage() {
  const {
    usuarios,
    carregando,
    salvarUsuario,
    eliminarUsuario,
  } = useUsuariosData();

  const [formAberto, setFormAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [formData, setFormData] =
    useState<UsuarioFormData>(FORM_VAZIO);

  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  // =========================================================
  // NOVO UTILIZADOR
  // =========================================================

  const abrirNovoForm = () => {
    setFormData({ ...FORM_VAZIO });
    setEditandoId(null);
    setErro(null);
    setSucesso(null);
    setFormAberto(true);
  };

  // =========================================================
  // EDITAR UTILIZADOR
  // =========================================================

  const abrirEditar = (usuario: Usuario) => {
    setEditandoId(usuario.id);

    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: "",
      numero: usuario.numero || "",
      cargo: usuario.cargo || "",
      perfil: usuario.perfil,
    });

    setErro(null);
    setSucesso(null);
    setFormAberto(true);
  };

  // =========================================================
  // FECHAR FORMULÁRIO
  // =========================================================

  const fecharFormulario = () => {
    setFormAberto(false);
    setEditandoId(null);
    setFormData({ ...FORM_VAZIO });
    setErro(null);
  };

  // =========================================================
  // SALVAR UTILIZADOR
  // =========================================================

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setSalvando(true);
    setErro(null);
    setSucesso(null);

    try {
      const resultado = await salvarUsuario(
        formData,
        editandoId,
      );

      const nome =
        resultado?.nome || formData.nome;

      setSucesso(
        `Utilizador "${nome}" ${
          editandoId
            ? "atualizado"
            : "criado"
        } com sucesso.`,
      );

      setFormAberto(false);
      setEditandoId(null);
      setFormData({ ...FORM_VAZIO });
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao guardar utilizador.",
      );
    } finally {
      setSalvando(false);
    }
  };

  // =========================================================
  // ELIMINAR UTILIZADOR
  // =========================================================

  const handleEliminar = async (
    id: number,
    nome: string,
  ) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja eliminar o utilizador "${nome}"?`,
    );

    if (!confirmar) {
      return;
    }

    setErro(null);
    setSucesso(null);

    try {
      await eliminarUsuario(id);

      setSucesso(
        `Utilizador "${nome}" eliminado com sucesso.`,
      );
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao eliminar utilizador.",
      );
    }
  };

  // =========================================================
  // PESQUISA
  // =========================================================

  const termoBusca = busca
    .trim()
    .toLowerCase();

  const usuariosFiltrados =
    usuarios.filter((usuario) => {
      if (!termoBusca) {
        return true;
      }

      return (
        usuario.nome
          .toLowerCase()
          .includes(termoBusca) ||
        usuario.email
          .toLowerCase()
          .includes(termoBusca) ||
        usuario.cargo
          ?.toLowerCase()
          .includes(termoBusca)
      );
    });

  // =========================================================
  // FORMULÁRIO
  // =========================================================

  if (formAberto) {
    return (
      <UsuarioFormulario
        editandoId={editandoId}
        formData={formData}
        onFormDataChange={setFormData}
        salvando={salvando}
        erro={erro}
        onVoltar={fecharFormulario}
        onSubmit={handleSubmit}
      />
    );
  }

  // =========================================================
  // PÁGINA
  // =========================================================

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}

      <UsuariosHeader
        total={usuarios.length}
        onNovoUsuario={abrirNovoForm}
      />

      {/* Mensagem de erro */}

      {erro && (
        <div className="p-4 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl">
          {erro}
        </div>
      )}

      {/* Mensagem de sucesso */}

      {sucesso && (
        <div className="p-4 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
          {sucesso}
        </div>
      )}

      {/* Pesquisa */}

      <UsuariosBusca
        busca={busca}
        onBuscaChange={setBusca}
      />

      {/* Tabela */}

      <UsuariosTabela
        usuarios={usuariosFiltrados}
        carregando={carregando}
        onEditar={abrirEditar}
        onEliminar={handleEliminar}
      />

    </div>
  );
}