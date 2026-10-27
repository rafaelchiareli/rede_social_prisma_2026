# Turmagram

Uma mini rede social feita com **Next.js** e **Prisma** em 4 aulas. A turma cria usuários, publica fotos, curte, comenta, usa hashtags e segue os colegas, e em cada aula aprende recursos novos do Prisma.

## Como rodar

Precisa do Node.js 20 ou mais novo.

```bash
npm install
npx prisma migrate dev --name inicio
npx prisma db seed
npm run dev
```

Abra http://localhost:3000 e escolha um usuário no topo da página, em **Entrar como...**

- `migrate dev` cria o banco (`prisma/dev.db`) com as tabelas do `schema.prisma`.
- `db seed` coloca usuários e posts de exemplo no banco. Pode rodar de novo sempre que quiser começar do zero.
- Para ver o banco como uma planilha: `npx prisma studio`.

> Não existe login de verdade: o usuário escolhido fica guardado num cookie. Assim a aula foca no Prisma.

## As 4 aulas

Cada aula tem uma **branch** no Git com o projeto pronto até aquele ponto. A `main` tem o projeto completo.

| Aula | Branch | O que a rede social ganha | Recursos do Prisma |
|---|---|---|---|
| 1 | `aula-1` | Usuários, posts, feed e perfil | Relação 1 para N, `include`, `connect`, `@unique`, `create` aninhado no seed |
| 2 | `aula-2` | Curtidas, comentários e apagar post | Chave composta `@@id`, `_count`, `include` aninhado, cascata (`onDelete: Cascade`), filtro por relação |
| 3 | `aula-3` | Hashtags, página Explorar e bio no perfil | Relação N para N, `connectOrCreate`, filtros `some`, relação 1 para 1, `upsert`, ordenar por `_count` |
| 4 | `aula-4` | Seguir colegas, feed "Seguindo", sugestões e ranking | Relação com a mesma tabela, `connect`/`disconnect`, filtros `some` e `none`, `$transaction` |

Para ver o projeto como estava ao final de uma aula:

```bash
git checkout aula-2
npx prisma migrate dev --name aula2
npx prisma db seed
```

Para voltar para a versão completa: `git checkout main`.

## Onde fica cada coisa

| Pasta / arquivo | O que tem |
|---|---|
| `prisma/schema.prisma` | As tabelas do banco |
| `prisma/seed.mjs` | Os dados de exemplo |
| `lib/` | Conexão com o banco, usuário atual e funções de apoio |
| `app/actions.js` | Tudo que **muda** o banco (criar, curtir, comentar, seguir...) |
| `app/**/page.js` | As páginas |
| `components/` | Os pedaços da tela |
| `app/globals.css` | O visual de todas as aulas (não precisa mexer) |

## Problemas comuns

| O que aparece | Como resolver |
|---|---|
| `@prisma/client did not initialize yet` | Rode `npx prisma generate`, apague a pasta `.next` e rode `npm run dev` de novo. |
| Aviso `install scripts not yet covered by allowScripts` | Rode `npm install-scripts approve prisma @prisma/client @prisma/engines` e depois `npm install`. |
| `The table ... does not exist` | Faltou `npx prisma migrate dev`. |
| `Invalid redirect arguments` | O `redirect` foi importado do lugar errado. O certo é `import { redirect } from "next/navigation"`. |
| Mudei o `schema.prisma` e deu erro | Toda mudança no schema precisa de um novo `npx prisma migrate dev`. |
