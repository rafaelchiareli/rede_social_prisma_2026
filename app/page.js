import { prisma } from "@/lib/prisma";
import { usuarioAtual } from "@/lib/usuarioAtual";
import { dadosDoPost } from "@/lib/consultas";
import NovoPostForm from "@/components/NovoPostForm";
import PostCard from "@/components/PostCard";

export default async function Feed() {
  const eu = await usuarioAtual();

  // Todos os posts, com autor, contadores e a minha curtida
  const posts = await prisma.post.findMany({
    include: dadosDoPost(eu),
    orderBy: { criadoEm: "desc" },
  });

  return (
    <main>
      {eu ? (
        <NovoPostForm />
      ) : (
        <p className="aviso">Escolha um usuário no topo (ou crie um) para postar.</p>
      )}

      {posts.length === 0 && <p className="vazio">Nenhum post ainda. Seja o primeiro!</p>}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} eu={eu} />
      ))}
    </main>
  );
}
