import Link from "next/link";
import Avatar from "./Avatar";
import BotaoSeguir from "./BotaoSeguir";

export default function Sugestoes({ usuarios }) {
  if (usuarios.length === 0) return null;

  return (
    <section className="sugestoes">
      <h2>Sugestões para seguir</h2>
      {usuarios.map((u) => (
        <div key={u.id} className="sugestao">
          <Link href={`/usuario/${u.id}`} className="autor">
            <Avatar usuario={u} tamanho={32} />
            <strong>{u.nome}</strong>
          </Link>
          <BotaoSeguir usuario={u} jaSigo={false} />
        </div>
      ))}
    </section>
  );
}
