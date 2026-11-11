import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { usuarioAtual } from "@/lib/usuarioAtual";
import { dadosDoPost } from "@/lib/consultas";
import PostCard from "@/app/components/postCard";
import Comentarios from "@/app/components/comentarios";

export default async function PaginaPost({ params }) {
    const { id } = await params;
    const idNumero = Number(id);
    if (!Number.isInteger(idNumero)) notFound();

    const eu = await usuarioAtual();

    const post = await prisma.post.findUnique({
        where: { id: idNumero },
        include: {
            ...dadosDoPost(eu),
            comentarios: {
                include: { autor: true },
                orderBy: { criadoEm: "asc" }
            }
        }
    });
    if (!post) notFound();

    return (
        <main>
            <PostCard post={post} eu={eu} />
            <Comentarios post={post} eu={eu} />
        </main>
    )

}