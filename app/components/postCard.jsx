import Link from "next/link";
import Avatar from "./avatar";

export default function PostCard({post}){
    return (
        <article className="post">
            <header className="post-topo">
                <Link href={`/usuario/${post.autor.id}`} className="autor">
                    <Avatar usuario={post.autor} />
                    <strong>{post.autor.nome}</strong>
                </Link>
                <span className="data">{post.criadoEm.toLocaleDateString("pt-BR")}</span>
            </header>
            <img src={post.imagem} alt={post.legenda} className="post-imagem" />
            <p className="legenda">
                <strong>{post.autor.nome}</strong> {post.legenda}
            </p>
        </article>
    )
}