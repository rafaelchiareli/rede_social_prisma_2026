import { criarPost } from "../actions";
export default function NovoPostForm(){
    return (
        <form action={criarPost} className="novo-post">
            <textarea 
                name="legenda"
                placeholder="O que você quer compatilhar"
                required
                maxLength={300} />
                <input name="imagem" placeholder="Link de uma imagem (opcional" />
                <button type="submit">Publicar</button>
        </form>
    )
}