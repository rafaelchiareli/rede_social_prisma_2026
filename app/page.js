import { prisma } from "@/lib/prisma";
import { usuarioAtual } from "@/lib/usuarioAtual";
import { dadosDoPost } from "@/lib/consultas";
import NovoPostForm from "@/components/NovoPostForm";
import PostCard from "@/components/PostCard";
import Abas from "@/components/Abas";
import Sugestoes from "@/components/Sugestoes";

export default async function Feed({ searchParams }) {
  const { aba } = await searchParams;
  const eu = await usuarioAtual();

  // Aba "Seguindo": só posts de autores que têm EU entre os seguidores
  const filtro =
    aba === "seguindo" && eu ? { autor: { seguidores: { some: { id: eu.id } } } } : {};

  const posts = await prisma.post.findMany({
    where: filtro,
    include: dadosDoPost(eu),
    orderBy: { criadoEm: "desc" },
  });

  // Sugestões: usuários que não sou eu e que eu NÃO sigo
  const sugestoes = eu
    ? await prisma.usuario.findMany({
        where: {
          id: { not: eu.id },
          seguidores: { none: { id: eu.id } },
        },
        take: 3,
      })
    : [];

  return (
    <main>
      {eu ? (
        <NovoPostForm />
      ) : (
        <p className="aviso">Escolha um usuário no topo (ou crie um) para postar.</p>
      )}

      <Sugestoes usuarios={sugestoes} />

      {eu && <Abas aba={aba} />}

      {posts.length === 0 && (
        <p className="vazio">
          {aba === "seguindo" ? "Siga alguém para ver os posts aqui." : "Nenhum post ainda."}
        </p>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} eu={eu} />
      ))}
    </main>
  );
}
