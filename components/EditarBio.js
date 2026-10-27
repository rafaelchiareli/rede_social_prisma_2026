import { salvarBio } from "@/app/actions";

export default function EditarBio({ bio }) {
  return (
    <form action={salvarBio} className="form-bio">
      <textarea name="bio" defaultValue={bio} placeholder="Escreva algo sobre você" maxLength={150} />
      <button type="submit">Salvar bio</button>
    </form>
  );
}
