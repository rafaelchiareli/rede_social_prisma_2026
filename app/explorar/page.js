import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Explorar() {
  // As hashtags mais usadas: ordena pela quantidade de posts de cada uma
  const tags = await prisma.tag.findMany({
    where: { posts: { some: {} } }, // só tags que ainda têm algum post
    include: { _count: { select: { posts: true } } },
    orderBy: { posts: { _count: "desc" } },
    take: 20,
  });

  return (
    <main>
      <h1>Hashtags em alta</h1>

      {tags.length === 0 && (
        <p className="vazio">Nenhuma hashtag ainda. Use #algumacoisa na legenda de um post!</p>
      )}

      <ul className="lista-tags">
        {tags.map((tag) => (
          <li key={tag.id}>
            <Link href={`/tag/${encodeURIComponent(tag.nome)}`} className="hashtag">
              #{tag.nome}
            </Link>
            <span>{tag._count.posts} posts</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
