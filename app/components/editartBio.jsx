import { salvarBio } from "../actions";
export default function EditarBio({bio}){
    return (
        <form action={salvarBio} className="form-bio">
            <textarea name="bio"
             defaultValue={bio}
             placeholder="Escreve algo sobre você"
             maxLength={150} />
             <button type="submit">Salvar</button>
        </form>
    )
}