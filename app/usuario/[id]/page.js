import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { usuarioAtual } from "@/lib/usuarioAtual";
import Avatar from "@/components/Avatar";
import GradePosts from "@/components/GradePosts";
import EditarBio from "@/components/EditarBio";

export default async function PaginaUsuario({ params }) {
  const { id } = await params;
  const idNumero = Number(id);
  if (!Number.isInteger(idNumero)) notFound();

  const eu = await usuarioAtual();

  const usuario = await prisma.usuario.findUnique({
    where: { id: idNumero },
    include: {
      perfil: true, // relação 1 para 1: vem um objeto (ou null)
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

  const souEu = eu?.id === usuario.id;

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
          {usuario.perfil && <p className="bio">{usuario.perfil.bio}</p>}
        </div>
      </section>

      {souEu && <EditarBio bio={usuario.perfil?.bio ?? ""} />}

      <GradePosts posts={usuario.posts} />
    </main>
  );
}
