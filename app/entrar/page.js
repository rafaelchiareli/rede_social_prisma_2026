import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { criarUsuario } from "@/app/actions";
import Avatar from "@/components/Avatar";

export default async function Entrar({ searchParams }) {
  const { erro } = await searchParams;

  // Todos os usuários, cada um com a lista dos seus posts
  const usuarios = await prisma.usuario.findMany({
    include: { posts: true },
    orderBy: { criadoEm: "asc" },
  });

  return (
    <main>
      <h1>Usuários</h1>

      <form action={criarUsuario} className="caixa">
        <h2>Criar usuário</h2>
        <input name="nome" placeholder="Seu nome" required maxLength={20} />
        <button type="submit">Criar e entrar</button>
        {erro === "nome" && <p className="erro">Esse nome já existe. Escolha outro.</p>}
      </form>

      <ul className="lista-usuarios">
        {usuarios.map((u) => (
          <li key={u.id}>
            <Link href={`/usuario/${u.id}`} className="autor">
              <Avatar usuario={u} />
              <strong>{u.nome}</strong>
            </Link>
            <span>{u.posts.length} posts</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
