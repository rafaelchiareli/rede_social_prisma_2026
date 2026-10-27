import { prisma } from "@/lib/prisma";
import { usuarioAtual } from "@/lib/usuarioAtual";
import NovoPostForm from "@/components/NovoPostForm";
import PostCard from "@/components/PostCard";

export default async function Feed() {
  const eu = await usuarioAtual();

  // Todos os posts, do mais novo para o mais antigo, com o autor junto
  const posts = await prisma.post.findMany({
    include: { autor: true },
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
        <PostCard key={post.id} post={post} />
      ))}
    </main>
  );
}
