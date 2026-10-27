import { prisma } from "@/lib/prisma";
import { usuarioAtual } from "@/lib/usuarioAtual";
import { dadosDoPost } from "@/lib/consultas";
import PostCard from "@/components/PostCard";

export default async function PaginaTag({ params }) {
  const { nome } = await params;
  const tag = decodeURIComponent(nome);
  const eu = await usuarioAtual();

  // Posts que têm ALGUMA tag com esse nome
  const posts = await prisma.post.findMany({
    where: { tags: { some: { nome: tag } } },
    include: dadosDoPost(eu),
    orderBy: { criadoEm: "desc" },
  });

  return (
    <main>
      <h1>#{tag}</h1>
      <p>{posts.length} posts</p>

      {posts.length === 0 && <p className="vazio">Nenhum post com essa hashtag.</p>}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} eu={eu} />
      ))}
    </main>
  );
}
