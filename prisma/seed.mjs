// Popula o banco com usuários, posts, curtidas e comentários de exemplo.
// Rode com: npx prisma db seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const avatar = (nome) => `https://api.dicebear.com/9.x/thumbs/svg?seed=${nome}`;
const foto = (n) => `https://picsum.photos/seed/turmagram${n}/600/600`;

// Cria um usuário já com os posts dele (create aninhado)
function criarUsuario(nome, posts = []) {
  return prisma.usuario.create({
    data: { nome, avatar: avatar(nome), posts: { create: posts } },
    include: { posts: true },
  });
}

async function main() {
  // Apagar os usuários apaga junto os posts, curtidas e comentários (cascata)
  await prisma.usuario.deleteMany();

  const ana = await criarUsuario("ana", [
    { legenda: "Primeiro post no Turmagram!", imagem: foto(1) },
    { legenda: "Fim de semana na praia", imagem: foto(2) },
  ]);
  const bruno = await criarUsuario("bruno", [
    { legenda: "Treino de hoje concluído", imagem: foto(3) },
    { legenda: "Alguém joga hoje à noite?", imagem: foto(4) },
  ]);
  const carla = await criarUsuario("carla", [
    { legenda: "Meu desenho novo", imagem: foto(5) },
  ]);
  const davi = await criarUsuario("davi");

  // Curtidas: quem curtiu qual post
  await prisma.curtida.createMany({
    data: [
      { usuarioId: bruno.id, postId: ana.posts[0].id },
      { usuarioId: carla.id, postId: ana.posts[0].id },
      { usuarioId: davi.id, postId: ana.posts[0].id },
      { usuarioId: ana.id, postId: bruno.posts[1].id },
      { usuarioId: ana.id, postId: carla.posts[0].id },
      { usuarioId: bruno.id, postId: carla.posts[0].id },
    ],
  });

  // Comentários
  await prisma.comentario.createMany({
    data: [
      { texto: "Bem-vinda!", autorId: bruno.id, postId: ana.posts[0].id },
      { texto: "Que lugar lindo", autorId: carla.id, postId: ana.posts[1].id },
      { texto: "Eu jogo! Que horas?", autorId: davi.id, postId: bruno.posts[1].id },
      { texto: "Ficou incrível!", autorId: ana.id, postId: carla.posts[0].id },
    ],
  });

  console.log("Banco populado com usuários, posts, curtidas e comentários!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (erro) => {
    console.error(erro);
    await prisma.$disconnect();
    process.exit(1);
  });
