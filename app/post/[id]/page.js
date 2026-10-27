import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { usuarioAtual } from "@/lib/usuarioAtual";
import { dadosDoPost } from "@/lib/consultas";
import PostCard from "@/components/PostCard";
import Comentarios from "@/components/Comentarios";

export default async function PaginaPost({ params }) {
  const { id } = await params;
  const idNumero = Number(id);
  if (!Number.isInteger(idNumero)) notFound();

  const eu = await usuarioAtual();

  const post = await prisma.post.findUnique({
    where: { id: idNumero },
    include: {
      ...dadosDoPost(eu),
      // include dentro de include: os comentários E o autor de cada um
      comentarios: {
        include: { autor: true },
        orderBy: { criadoEm: "asc" },
      },
    },
  });

  if (!post) notFound();

  return (
    <main>
      <PostCard post={post} eu={eu} />
      <Comentarios post={post} eu={eu} />
    </main>
  );
}
