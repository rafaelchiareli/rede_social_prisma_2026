import { apagarPost } from "../actions";

export default function BotaoApagar({post}){
    return (
        <form action={apagarPost} className="botao-apagar-form">
            <input type='hidden' name="postId" value={post.id} />r
            <button type='submit' className="botao-apagar">
                Apagar
            </button>
        </form>
    )
}