
import { prisma } from '../lib/prisma';
import { usuarioAtual } from '../lib/usuarioAtual';
import { dadosDoPost } from '@/lib/consultas';
import NovoPostForm from './components/novoPostForm';
import PostCard from './components/postCard';
export default async function Feed() {
  const eu = await usuarioAtual();
  //todos os posts do mais novo para o mais antigo
  const posts = await prisma.post.findMany({
    include: { autor: true },
    orderBy: { criadoEm: "desc" }
  });
  return (
    <main>
      {eu ? (
        <NovoPostForm />
      ) : (<p className="aviso">Escolha um usuario no topo (ou crie um) para postar</p>
      )}

      {posts.length === 0 && <p className='vazio'>Nenhum post ainda, seja o primeiro a postar!</p>}
      {posts.map((p) => (
        <PostCard key={p.id} post={p} eu={eu}/>
      ))}
    </main>
  )

}