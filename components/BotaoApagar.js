import { apagarPost } from "@/app/actions";

export default function BotaoApagar({ post }) {
  return (
    <form action={apagarPost} className="botao-apagar-form">
      <input type="hidden" name="postId" value={post.id} />
      <button type="submit" className="botao-apagar">
        Apagar
      </button>
    </form>
  );
}
