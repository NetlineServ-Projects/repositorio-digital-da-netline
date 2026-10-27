// O tema escuro é a classe .dark no <html> (ver index.css). A preferência vive no
// backend (usuario.temaEscuro) e fica também em localStorage, para o script do
// index.html a aplicar antes de o React montar e evitar o flash de tema claro.
const CHAVE_TEMA = "temaEscuro";

export function aplicarTema(escuro: boolean) {
  document.documentElement.classList.toggle("dark", escuro);
  localStorage.setItem(CHAVE_TEMA, String(escuro));
}

// No logout: o próximo utilizador neste browser não herda o tema de quem saiu
export function limparTema() {
  document.documentElement.classList.remove("dark");
  localStorage.removeItem(CHAVE_TEMA);
}
