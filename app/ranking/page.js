import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Avatar from "@/components/Avatar";

export default async function Ranking() {
  // $transaction com uma lista: as três consultas rodam juntas,
  // como se fossem uma só, e o resultado volta na mesma ordem
  const [maisCurtidos, maisComentados, maisSeguidos] = await prisma.$transaction([
    prisma.post.findMany({
      include: { autor: true, _count: { select: { curtidas: true } } },
      orderBy: { curtidas: { _count: "desc" } },
      take: 5,
    }),
    prisma.post.findMany({
      include: { autor: true, _count: { select: { comentarios: true } } },
      orderBy: { comentarios: { _count: "desc" } },
      take: 5,
    }),
    prisma.usuario.findMany({
      include: { _count: { select: { seguidores: true } } },
      orderBy: { seguidores: { _count: "desc" } },
      take: 5,
    }),
  ]);

  return (
    <main>
      <h1>Ranking</h1>

      <h2>Posts mais curtidos</h2>
      <ol className="ranking">
        {maisCurtidos.map((post) => (
          <li key={post.id}>
            <Link href={`/post/${post.id}`}>
              <img src={post.imagem} alt={post.legenda} className="miniatura" />
            </Link>
            <span>{post.autor.nome}</span>
            <span className="valor">♥ {post._count.curtidas}</span>
          </li>
        ))}
      </ol>

      <h2>Posts mais comentados</h2>
      <ol className="ranking">
        {maisComentados.map((post) => (
          <li key={post.id}>
            <Link href={`/post/${post.id}`}>
              <img src={post.imagem} alt={post.legenda} className="miniatura" />
            </Link>
            <span>{post.autor.nome}</span>
            <span className="valor">💬 {post._count.comentarios}</span>
          </li>
        ))}
      </ol>

      <h2>Usuários mais seguidos</h2>
      <ol className="ranking">
        {maisSeguidos.map((u) => (
          <li key={u.id}>
            <Link href={`/usuario/${u.id}`} className="autor">
              <Avatar usuario={u} />
              <strong>{u.nome}</strong>
            </Link>
            <span className="valor">{u._count.seguidores} seguidores</span>
          </li>
        ))}
      </ol>
    </main>
  );
}
