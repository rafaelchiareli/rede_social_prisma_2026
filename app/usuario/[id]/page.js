import { notFound } from "next/navigation";
import { prisma } from '../../../lib/prisma'
import Avatar from "../../components/avatar"
import GradePosts from "../../components/gradePosts";

export default async function PaginaUsuario({ params }) {
    const { id } = await params;
    const idNumero = Number(id);
    if (!Number.isInteger(idNumero)) notFound();
    //um usuario com os posts dele
    const usuario = await prisma.usuario.findUnique({
        where: { id: idNumero },
        include: { posts: { orderBy: { criadoEm: "desc" } } }
    });
    if (!usuario) notFound();

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
                    </p>
                </div>
            </section>
            <GradePosts posts={usuario.posts} />
        </main>
    )


} 