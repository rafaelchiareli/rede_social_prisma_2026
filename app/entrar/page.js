import Link from 'next/link'
import { prisma } from '../../lib/prisma';
import { criarUsuario } from '../actions';
import Avatar  from '../components/avatar'

export default async function Entrar({searchParams}){
    const {erro } = await searchParams;
    const usuarios = await prisma.usuario.findMany({
        include: {_count : {select : {posts: true}}},
        orderBy: {criadoEm: "desc"} 
    });
    return (
        <main>
            <h1>Usuários</h1>
            <form action={criarUsuario} className='caixa'>
                <h2>Criar usuário</h2>
                <input name="nome" placeholder='seu nome' required maxLength={20} />
                <button type='submit'>Criar usuario</button>
                {erro === "nome" && <p className='erro'>Esse nome já existe</p>}
            </form>
            <ul className='lista-usuarios'>
                {usuarios.map((u) => (
                    <li key={u.id}>
                        <Link href={`/usuario/${u.id}`} className='autor'>
                            <Avatar usuario={u} />
                            <strong>{u.nome}</strong>
                        </Link>
                        <span>{u._count.posts} posts</span>
                    </li>
                ))}
            </ul>
        </main>
    )
}

