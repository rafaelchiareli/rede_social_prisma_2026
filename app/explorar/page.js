import Link from 'next/link';
import {prisma } from '../../lib/prisma';

export default async function Explorar(){
    //as hashtags mais usadas: ordena pela orderm de quantidade de posts
    const tags = await prisma.tag.findMany({
        where: {posts: {some :{}}} , //carregas so as tags que tem algum posti
        include: {_count :{select: {posts: true}}},
        orderBy: {posts: {_count : "desc"}},
        take : 20,
    });

    return (
        <main>
            <h1>hashtags em alta</h1>
            {tags.length === 0 && (
                <p className='vazio'>Nenhuma hashtag ainda. use #alguma coisa na legenda de um post</p>
            ) }
            <ul className='lista-tags'>
                {tags.map((tag) => (
                    <li key={tag.id}>
                        <Link href={`/tag/${encodeURIComponent(tag.nome)}`} className='hastag'>
                        #{tag.nome}
                        </Link>
                        <span>{tag._count.posts} posts</span>
                    </li>
                ))}
            </ul>
        </main>
    )
} 