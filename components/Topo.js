import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { usuarioAtual } from "@/lib/usuarioAtual";
import { entrarComo } from "@/app/actions";
import Avatar from "./Avatar";

export default async function Topo() {
  const eu = await usuarioAtual();
  const usuarios = await prisma.usuario.findMany({ orderBy: { nome: "asc" } });

  return (
    <header className="topo">
      <Link href="/" className="logo">
        Turmagram
      </Link>

      <nav className="menu">
        <Link href="/">Feed</Link>
        <Link href="/explorar">Explorar</Link>
        <Link href="/ranking">Ranking</Link>
        <Link href="/entrar">Usuários</Link>
      </nav>

      <form action={entrarComo} className="entrar-como">
        <select name="usuarioId" defaultValue={eu?.id ?? ""} required>
          <option value="" disabled>
            Entrar como...
          </option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nome}
            </option>
          ))}
        </select>
        <button type="submit">Entrar</button>
      </form>

      {eu && (
        <Link href={`/usuario/${eu.id}`} title="Meu perfil">
          <Avatar usuario={eu} tamanho={32} />
        </Link>
      )}
    </header>
  );
}
