import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Avatar from "@/components/Avatar";
import GradePosts from "@/components/GradePosts";

export default async function PaginaUsuario({ params }) {
  const { id } = await params;
  const idNumero = Number(id);
  if (!Number.isInteger(idNumero)) notFound();

  const usuario = await prisma.usuario.findUnique({
    where: { id: idNumero },
    include: {
      posts: {
        orderBy: { criadoEm: "desc" },
        // Cada post já vem com os seus contadores
        include: { _count: { select: { curtidas: true, comentarios: true } } },
      },
    },
  });

  if (!usuario) notFound();

  // Filtro por relação: curtidas em posts cujo autor é este usuário
  const curtidasRecebidas = await prisma.curtida.count({
    where: { post: { autorId: usuario.id } },
  });

  return (
    <main>
      <section className="perfil">
        <Avatar usuario={usuario} tamanho={96} />
        <div>
          <h1>{usuario.nome}</h1>
          <p className="numeros">
            <span>
              <strong>{usuario.posts.length}</strong> posts
            </span>
            <span>
              <strong>{curtidasRecebidas}</strong> curtidas recebidas
            </span>
          </p>
        </div>
      </section>

      <GradePosts posts={usuario.posts} />
    </main>
  );
}
