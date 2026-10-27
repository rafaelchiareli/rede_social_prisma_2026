import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { usuarioAtual } from "@/lib/usuarioAtual";
import Avatar from "@/components/Avatar";
import GradePosts from "@/components/GradePosts";
import EditarBio from "@/components/EditarBio";
import BotaoSeguir from "@/components/BotaoSeguir";

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
      // Quantos posts, seguidores e seguindo
      _count: { select: { posts: true, seguidores: true, seguindo: true } },
      // Traz só EU da lista de seguidores (para saber se eu sigo esse usuário)
      seguidores: { where: { id: eu?.id ?? 0 } },
    },
  });

  if (!usuario) notFound();

  // Filtro por relação: curtidas em posts cujo autor é este usuário
  const curtidasRecebidas = await prisma.curtida.count({
    where: { post: { autorId: usuario.id } },
  });

  const souEu = eu?.id === usuario.id;
  const jaSigo = usuario.seguidores.length > 0;

  return (
    <main>
      <section className="perfil">
        <Avatar usuario={usuario} tamanho={96} />
        <div>
          <h1>{usuario.nome}</h1>
          <p className="numeros">
            <span>
              <strong>{usuario._count.posts}</strong> posts
            </span>
            <span>
              <strong>{usuario._count.seguidores}</strong> seguidores
            </span>
            <span>
              <strong>{usuario._count.seguindo}</strong> seguindo
            </span>
            <span>
              <strong>{curtidasRecebidas}</strong> curtidas recebidas
            </span>
          </p>
          {usuario.perfil && <p className="bio">{usuario.perfil.bio}</p>}
          {eu && !souEu && <BotaoSeguir usuario={usuario} jaSigo={jaSigo} />}
        </div>
      </section>

      {souEu && <EditarBio bio={usuario.perfil?.bio ?? ""} />}

      <GradePosts posts={usuario.posts} />
    </main>
  );
}
