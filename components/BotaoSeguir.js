import { seguir } from "@/app/actions";

export default function BotaoSeguir({ usuario, jaSigo }) {
  return (
    <form action={seguir}>
      <input type="hidden" name="usuarioId" value={usuario.id} />
      <input type="hidden" name="jaSigo" value={String(jaSigo)} />
      <button type="submit" className={jaSigo ? "botao-seguir seguindo" : "botao-seguir"}>
        {jaSigo ? "Seguindo" : "Seguir"}
      </button>
    </form>
  );
}
