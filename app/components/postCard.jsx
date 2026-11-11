import Link from "next/link";
import Avatar from "./avatar";
import BotaoCurtir from "./botaoCurtir";
import BotaoApagar from "./botaoApagar";
import Legenda from "./legenda";

export default function PostCard({ post, eu }) {
    const curtido = post.curtidas.length > 0;
    const souAutor = eu?.id === post.autorId;

    return (
        <article className="post">
            <header className="post-topo">
                <Link href={`/usuario/${post.autor.id}`} className="autor">
                    <Avatar usuario={post.autor} />
                    <strong>{post.autor.nome}</strong>
                </Link>
                <span className="data">{post.criadoEm.toLocaleDateString("pt-BR")}</span>
            </header>
            <Link href={`/post/${post.id}`}>
                <img src={post.imagem} alt={post.legenda} className="post-imagem" />
            </Link>

            <div className="acoes">
                <BotaoCurtir post={post} curtido={curtido} />
                <Link href={`/post/${post.id}`} className='link-comentarios'>
                    {post._count.comentarios} comentarios
                </Link>
                {souAutor && <BotaoApagar post={post} />}
            </div>
            <p className="legenda">
                <strong>{post.autor.nome}</strong><Legenda texto={post.legenda} />
            </p>
        </article>
    )
}
