import Link from "next/link";
import { comentar } from "@/app/actions";
import Avatar from "./Avatar";

export default function Comentarios({ post, eu }) {
  return (
    <section className="comentarios">
      <h2>Comentários ({post.comentarios.length})</h2>

      {post.comentarios.length === 0 && <p className="vazio">Ninguém comentou ainda.</p>}

      {post.comentarios.map((c) => (
        <div key={c.id} className="comentario">
          <Avatar usuario={c.autor} tamanho={28} />
          <p>
            <Link href={`/usuario/${c.autor.id}`}>
              <strong>{c.autor.nome}</strong>
            </Link>{" "}
            {c.texto}
          </p>
        </div>
      ))}

      {eu ? (
        <form action={comentar} className="form-comentario">
          <input type="hidden" name="postId" value={post.id} />
          <input name="texto" placeholder="Escreva um comentário..." required maxLength={200} />
          <button type="submit">Enviar</button>
        </form>
      ) : (
        <p className="aviso">Entre com um usuário para comentar.</p>
      )}
    </section>
  );
}
