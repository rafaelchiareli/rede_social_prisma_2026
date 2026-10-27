import { curtir } from "@/app/actions";

export default function BotaoCurtir({ post, curtido }) {
  return (
    <form action={curtir}>
      <input type="hidden" name="postId" value={post.id} />
      <button
        type="submit"
        className={curtido ? "botao-curtir curtido" : "botao-curtir"}
        title={curtido ? "Descurtir" : "Curtir"}
      >
        {curtido ? "♥" : "♡"} {post._count.curtidas}
      </button>
    </form>
  );
}
