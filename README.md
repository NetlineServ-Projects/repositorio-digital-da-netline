# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# NETLINE-REPOSITORIO — Frontend

SPA React/TypeScript para o sistema de gestão de documentos. Consome a API do **API-PRISMA**.

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Build tool | Vite |
| Linguagem | TypeScript |
| UI | React |
| Estilos | Tailwind CSS v4 (`@tailwindcss/vite`, `@custom-variant dark`) |
| HTTP client | Axios (`http-client.ts`) |
| Autenticação | httpOnly cookies (não localStorage — padrão de segurança da empresa) |
| i18n | i18next, react-i18next, i18next-browser-languagedetector |
| PDF preview | react-pdf (canvas, controlo próprio — funciona bem em mobile/tablet, ao contrário do iframe nativo) |
| Notificações | sonner (substituiu `alert()`/`confirm()` nativos) |
| Gestor de pacotes | Yarn |

## Estrutura do Projeto

```
NETLINE-REPOSITORIO/
├── src/
│   ├── pages/
│   │   ├── auth/               # autenticacao.tsx
│   │   ├── home/                # home.tsx (página pública)
│   │   ├── admin/               # páginas exclusivas de ADMIN
│   │   │   ├── aprovacoes/
│   │   │   │   ├── details/     # revisão completa de um documento pendente
│   │   │   │   ├── edit/        # editar titulo/descricao/categoria antes de aprovar
│   │   │   │   └── page.tsx
│   │   │   ├── usuarios/        # (a migrar para este padrão)
│   │   │   └── lixeira/         # (a migrar para este padrão)
│   │   ├── categorias/
│   │   ├── documentos/
│   │   │   └── (DocumentoDetalhesPage em rota própria /dashboard/documentos/:id)
│   │   ├── sistemas/
│   │   ├── perfil/
│   │   ├── configuracoes/
│   │   └── dashboard.tsx, dashboardHome.tsx  # shell autenticado, ficam soltos em pages/
│   ├── components/               # só peças reutilizadas em MAIS DE UMA página
│   │   ├── DocumentoCard, DocumentoRow, StatusBadge, SearchInput, ViewToggle
│   │   ├── documentoModal.tsx    # partilhado entre Documentos e Categorias
│   │   └── ModalConfirmacao.tsx  # substitui window.confirm()
│   ├── hooks/
│   │   ├── useAprovacoesData, useDashboardData, useDocumentosData,
│   │   │   useSistemasData, useUsuariosData
│   ├── data/client/
│   │   ├── endpoint.ts
│   │   ├── http-client.ts       # axios + interceptor Accept-Language
│   │   └── token.utils.ts
│   ├── lang/
│   │   ├── i18n.ts
│   │   └── resources/{pt,en}.json
│   ├── config/
│   └── utils/
├── index.html                    # script inline anti-flash de dark mode
└── App.tsx                       # rotas
```

## Convenção Página vs. Componente

- **`pages/<nome>/`** — pasta por página; subpastas dentro dela (ex: `aprovacoes/details`, `aprovacoes/edit`) são para peças usadas **só naquela página**.
- **`components/`** (raiz, global) — só para peças reutilizadas em **mais do que uma** página.
- **`pages/admin/`** — agrupa páginas exclusivas de ADMIN (Aprovações já migrada; Usuários e Lixeira ainda usam os componentes antigos e estão pendentes de migração para este padrão).

## Rotas

- Todas as rotas autenticadas ficam sob o prefixo **`/dashboard`** (ex: `/dashboard/documentos`, `/dashboard/aprovacoes`, `/dashboard/documentos/:id`).
- `RotaProtegida` — exige apenas autenticação.
- `RotaAdmin` — exige autenticação **e** `perfil === ADMIN`; usada para embrulhar o grupo de rotas `admin/`.
- Auto-registo (`/cadastro`) foi removido — só existe criação de conta pelo ADMIN.

## Páginas — Regras de Negócio no Frontend

| Página | Regras |
|---|---|
| **Documentos** | Mostra só documentos `APROVADO`. Ações: Ver, Editar, Apagar (sem Aprovar). Criar/editar via `DocumentoModal` na própria página (sem subrotas). Botão "+ Novo Documento" visível para ADMIN e FUNCIONARIO (a criação de documentos não é exclusiva de admin). |
| **Aprovações** | Só ADMIN. `details/` para revisão completa; `edit/` para corrigir metadados antes de aprovar; motivo de rejeição obrigatório e visível ao FUNCIONARIO depois. |
| **Categorias** | Drill-down: clicar numa categoria mostra os seus documentos (lista) e permite criar/editar/apagar a partir daí, reaproveitando `DocumentoModal` com a prop `categoriaIdPredefinida`. Reutiliza `useDocumentosData` (não tem hook próprio, para não duplicar o tipo `Documento`). |
| **Sistemas** | Formulário de anexar documento também recolhe `título` (opcional, default = nome do ficheiro) e `descrição`. Dropdown de categoria mostra só as não sensíveis (filtro de UX, não de permissão — o backend já filtra por permissão). |
| **Lixeira** | Lista documentos com `apagadoEm` definido; permite restaurar. |
| **Perfil** | FUNCIONARIO só pode alterar a própria senha e fotografia. ADMIN pode alterar todos os campos, para si e para outros utilizadores (via páginas de Usuários). |
| **Configurações** | Idioma (pt/en) e tema (claro/escuro), persistidos em `localStorage` (`idioma`, `temaEscuro`) e sincronizados com o backend via `PATCH`. |
| **Novo Documento** | Texto do botão e do toast varia por papel: ADMIN → "Guardar" / "Documento publicado com sucesso"; FUNCIONARIO → "Submeter Documento" / "Documento submetido para aprovação" + aviso explicando o fluxo de aprovação. |

## Internacionalização (i18n)

- Deteção de idioma via `i18next-browser-languagedetector`, chave `localStorage` **`idioma`** (mesma chave usada pelo header `Accept-Language` no `http-client.ts`, para o frontend e o backend ficarem sincronizados).
- Idioma por defeito: `pt`.
- **Atenção às chaves de plural**: usar sempre os sufixos fixos do CLDR/i18next — **`_one` / `_other`** (não `_um`/`_outros`) — em qualquer idioma.
- Seletor de idioma (PT | EN) disponível tanto na página de login como em Configurações.

## Dark Mode

- Script inline no `index.html`, executado **antes** do React montar, lê `localStorage("temaEscuro")` e adiciona a classe `dark` ao `<html>` para evitar flash de tema errado.
- Tailwind v4 com `@custom-variant dark (&:where(.dark, .dark *))`.

## Preview de Documentos

- Rota dedicada `/dashboard/documentos/:id` (`DocumentoDetalhesPage`) em vez de modal — mostra preview + metadados (categoria, submetido por, data, tamanho, download).
- `DocumentoViewerFactory`: um componente de viewer por tipo de ficheiro (imagem, PDF via react-pdf, fallback genérico).

## Instalação

```bash
yarn install
yarn dev
```

