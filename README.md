# Pokedex do Wesley

Pokédex inspirada no visual clássico do aparelho do universo Pokémon, desenvolvida com `Next.js`, `React`, `TypeScript`, integração com a `PokeAPI` e ambiente pronto para `Docker`.

O foco do projeto é unir:

- interface temática e visualmente fiel à ideia de uma Pokédex
- busca por nome ou número
- navegação entre pokémons com `Anterior` e `Próximo`
- animação leve do personagem na tela
- exibição de informações extras apenas quando o usuário quiser ver

## Visão geral

O projeto foi construído como uma aplicação moderna com `Next.js App Router`, renderização no servidor e consumo de dados externos da `PokeAPI`.

Na tela principal, o usuário visualiza:

- o aparelho da Pokédex com visual customizado
- a imagem do pokémon em destaque
- campo de busca por nome ou número
- botões de navegação entre pokémons
- botões de modo para abrir informações extras:
  - `Ver`
  - `Stats`
  - `Dados`
  - `Evol.`

As informações extras só aparecem quando o usuário clica em um desses botões, mantendo a interface limpa.

## Tecnologias utilizadas

### Next.js

O projeto utiliza `Next.js 16` com `App Router`.

Recursos usados do Next:

- `app/` directory
- páginas server-side com componentes assíncronos
- roteamento com `searchParams`
- rotas de API em `app/api`
- `next/image` para exibição das imagens dos pokémons
- `next/link` para navegação entre pokémons e modos da Pokédex
- `Metadata` no layout principal
- revalidação de dados com `fetch(..., { next: { revalidate } })`

### React

O projeto utiliza `React 19`.

Conceitos usados:

- componentes funcionais
- renderização baseada em estado vindo da URL
- composição de interface por blocos
- atualização da visualização através de query params, sem necessidade de estado complexo no cliente

Observação:
Apesar de usar React, esta versão da Pokédex foi pensada para funcionar majoritariamente com renderização no servidor, aproveitando bem os recursos do `Next.js`.

### TypeScript

O projeto usa `TypeScript` para:

- tipar os dados retornados pela `PokeAPI`
- organizar melhor os modelos de Pokémon
- evitar erros em propriedades como stats, tipos, habilidades e evoluções

### CSS

O projeto usa `CSS` puro em arquivo global:

- [`src/app/globals.css`](./src/app/globals.css)

Foi escolhida uma abordagem com CSS manual para permitir um visual mais personalizado, detalhado e artístico, especialmente no layout do aparelho da Pokédex.

Recursos de CSS aplicados:

- gradientes
- sombras internas e externas
- bordas customizadas
- pseudo-elementos
- animações com `@keyframes`
- layout responsivo com `media queries`
- efeitos visuais como scanline na tela

### Tailwind CSS

Este projeto **não usa Tailwind CSS**.

A estilização foi feita com `CSS` puro porque isso deu mais liberdade para criar um layout específico e detalhado no estilo da Pokédex clássica.

### Docker

O projeto já está preparado para rodar em container com:

- `Dockerfile`
- `docker-compose.yml`

Isso permite:

- subir o projeto sem precisar instalar tudo manualmente no sistema
- padronizar o ambiente
- facilitar testes e execução em outras máquinas

## API utilizada

O projeto consome a `PokeAPI`:

- Site: https://pokeapi.co/
- Base utilizada: `https://pokeapi.co/api/v2`

Endpoints usados no projeto:

- `/pokemon/:id-ou-nome`
- `/pokemon-species/:id-ou-nome`
- `/type/:type`
- `/pokemon?limit=151`

Esses endpoints fornecem:

- nome
- número
- imagem oficial
- tipos
- stats
- habilidades
- altura
- peso
- descrição
- fraquezas
- cadeia de evolução

## API interna do projeto

Além da API externa, o projeto também possui rotas internas com `Next.js`:

- `GET /api/pokemon`
- `GET /api/pokemon/[name]`

Arquivos:

- [`src/app/api/pokemon/route.ts`](./src/app/api/pokemon/route.ts)
- [`src/app/api/pokemon/[name]/route.ts`](./src/app/api/pokemon/[name]/route.ts)

Essas rotas funcionam como uma camada intermediária e podem ser úteis para:

- centralizar regras de negócio
- padronizar respostas
- facilitar expansão futura

## Estrutura do projeto

```text
pokedex-next/
├─ public/
│  └─ fundo.jpeg
├─ src/
│  ├─ app/
│  │  ├─ api/
│  │  │  └─ pokemon/
│  │  ├─ pokemon/
│  │  │  └─ [slug]/
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components/
│  └─ lib/
│     └─ pokemon.ts
├─ Dockerfile
├─ docker-compose.yml
├─ next.config.ts
├─ package.json
└─ README.md
```

## Arquivos principais

### `src/app/page.tsx`

Tela principal da Pokédex.

Responsável por:

- buscar o pokémon atual a partir da URL
- renderizar o aparelho
- exibir imagem, nome e número
- processar os modos `Ver`, `Stats`, `Dados` e `Evol.`
- manter a navegação entre pokémons

### `src/lib/pokemon.ts`

Camada de dados do projeto.

Responsável por:

- consumir a `PokeAPI`
- tipar as respostas
- montar o objeto completo do pokémon
- calcular fraquezas
- organizar stats
- buscar evolução e descrição

### `src/app/globals.css`

Estilo visual completo da interface.

Responsável por:

- layout do aparelho
- tela interna
- botões e abas
- animação do pokémon
- animação de leitura na tela
- responsividade

## Funcionalidades implementadas

- busca por nome ou número
- exibição do pokémon principal
- navegação com `Anterior` e `Próximo`
- animação suave no pokémon
- scanline sutil na tela
- visual temático de Pokédex
- exibição condicional de detalhes por aba
- tipos do pokémon
- stats principais
- dados básicos
- evolução
- tratamento de busca inválida com fallback para o pokémon `#1`

## Animações usadas

O projeto possui animações simples para melhorar a experiência sem exagerar:

- `pokemon-float`
  - faz o pokémon subir e descer levemente
- `scan`
  - cria uma linha de leitura passando sobre a tela

Essas animações foram feitas com `CSS`, sem bibliotecas extras.

## Como rodar localmente

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

## Como rodar com Docker

Suba os containers:

```bash
docker compose up --build
```

Acesse:

```text
http://localhost:3001
```

## Scripts disponíveis

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Variáveis de ambiente

Arquivo de exemplo:

- [`.env.example`](./.env.example)

Variável usada:

```env
POKEDEX_LIMIT=151
```

Ela define quantos pokémons base serão considerados no projeto.

## Configuração de imagens

As imagens dos pokémons são carregadas com `next/image`.

Configuração aplicada:

- `images.unoptimized = true`

Isso foi adotado para evitar problemas com sprites remotos e simplificar a exibição das artes oficiais vindas da `PokeAPI`.

## Decisões técnicas

### Por que usar App Router?

Porque ele organiza melhor as páginas, layouts e rotas de API no padrão atual do `Next.js`.

### Por que CSS puro em vez de Tailwind?

Porque o projeto precisava de um visual muito específico de hardware/interface temática. Nesse caso, `CSS` puro ficou mais controlável e mais adequado.

### Por que usar query params para os modos?

Porque isso permite:

- manter a interface simples
- refletir o estado da tela na URL
- trocar o conteúdo sem criar uma camada client desnecessária

### Por que usar a PokeAPI?

Porque é uma API pública, bem documentada e perfeita para projetos de Pokédex.



