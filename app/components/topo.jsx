import Link from "next/link";
import { prisma } from '../../lib/prisma'
import { usuiarioAtual } from "../lib/usuarioAtual";
import { entrarComo } from "../actions";
import Avatar from "./avatar";

export default async function Topo() {
    const eu = await usuiarioAtual();
    const usuarios = await prisma.usuario.findMany({
        orderBy: {
            nome: "asc"
        }
    });
    return (
        <header className="topo">
            <Link href="/" className="logo">
                TurmaGram
            </Link>
            <nav className="menu">
                <Link href="/">Feed</Link>
                <Link href="/entrar">Usuarios</Link>
            </nav>
            <form action={entrarComo} className="entrar-como">
                <select name="usuarioId" defaultValue={eu?.id ?? ""} required >
                    <option value="" disabled>
                        Entrar como...
                    </option>
                    {usuarios.map((u) => (
                        <option key={u.id} value={u.id}>{u.nome}</option>
                    ))}
                </select>
                <button type="submit">Entrar</button>

            </form>
            {eu && <Link href={`usuario/${eu.id}`} title="Meu Pefil">
                <Avatar usuario={eu} tamanho={32} />
            </Link>
            }

        </header>

    )
}