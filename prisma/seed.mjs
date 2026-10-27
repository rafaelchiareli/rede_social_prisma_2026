// Popula o banco com usuários e posts de exemplo.
// Rode com: npx prisma db seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const avatar = (nome) => `https://api.dicebear.com/9.x/thumbs/svg?seed=${nome}`;
const foto = (n) => `https://picsum.photos/seed/turmagram${n}/600/600`;

async function main() {
  // Limpa o banco antes (primeiro os posts, depois os usuários)
  await prisma.post.deleteMany();
  await prisma.usuario.deleteMany();

  // Cada usuário já é criado com os posts dele (create aninhado)
  await prisma.usuario.create({
    data: {
      nome: "ana",
      avatar: avatar("ana"),
      posts: {
        create: [
          { legenda: "Primeiro post no Turmagram!", imagem: foto(1) },
          { legenda: "Fim de semana na praia", imagem: foto(2) },
        ],
      },
    },
  });

  await prisma.usuario.create({
    data: {
      nome: "bruno",
      avatar: avatar("bruno"),
      posts: {
        create: [
          { legenda: "Treino de hoje concluído", imagem: foto(3) },
          { legenda: "Alguém joga hoje à noite?", imagem: foto(4) },
        ],
      },
    },
  });

  await prisma.usuario.create({
    data: {
      nome: "carla",
      avatar: avatar("carla"),
      posts: { create: [{ legenda: "Meu desenho novo", imagem: foto(5) }] },
    },
  });

  await prisma.usuario.create({
    data: { nome: "davi", avatar: avatar("davi") },
  });

  console.log("Banco populado com 4 usuários e 5 posts!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (erro) => {
    console.error(erro);
    await prisma.$disconnect();
    process.exit(1);
  });
