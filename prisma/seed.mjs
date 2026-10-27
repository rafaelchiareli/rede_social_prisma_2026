// Popula o banco com usuários, perfis, posts com hashtags, curtidas, comentários e seguidores.
// Rode com: npx prisma db seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const avatar = (nome) => `https://api.dicebear.com/9.x/thumbs/svg?seed=${nome}`;
const foto = (n) => `https://picsum.photos/seed/turmagram${n}/600/600`;

// Acha as #hashtags da legenda (igual ao lib/hashtags.js)
function hashtags(texto) {
  const nomes = (texto.match(/#[\p{L}\p{N}_]+/gu) ?? []).map((h) => h.slice(1).toLowerCase());
  return [...new Set(nomes)];
}

// Monta um post já ligado às suas hashtags (connectOrCreate)
function post(legenda, n) {
  return {
    legenda,
    imagem: foto(n),
    tags: {
      connectOrCreate: hashtags(legenda).map((nome) => ({ where: { nome }, create: { nome } })),
    },
  };
}

// Cria um usuário já com o perfil e os posts dele (create aninhado)
function criarUsuario(nome, bio, posts = []) {
  return prisma.usuario.create({
    data: {
      nome,
      avatar: avatar(nome),
      perfil: { create: { bio } },
      posts: { create: posts },
    },
    include: { posts: true },
  });
}

// Faz "quem" seguir cada usuário da lista
function seguir(quem, lista) {
  return prisma.usuario.update({
    where: { id: quem.id },
    data: { seguindo: { connect: lista.map((u) => ({ id: u.id })) } },
  });
}

async function main() {
  // Apagar os usuários apaga junto perfis, posts, curtidas e comentários (cascata)
  await prisma.usuario.deleteMany();
  await prisma.tag.deleteMany();

  const ana = await criarUsuario("ana", "Fotografia e praia 📷", [
    post("Primeiro post no Turmagram! #turma", 1),
    post("Fim de semana na praia #praia #ferias", 2),
  ]);
  const bruno = await criarUsuario("bruno", "Futebol todo dia ⚽", [
    post("Treino de hoje concluído #futebol", 3),
    post("Alguém joga hoje à noite? #games #turma", 4),
  ]);
  const carla = await criarUsuario("carla", "Desenho e música", [
    post("Meu desenho novo #arte", 5),
  ]);
  const davi = await criarUsuario("davi", "Novo por aqui!");

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

  // Quem segue quem (connect na relação com a própria tabela)
  await seguir(ana, [bruno, carla]);
  await seguir(bruno, [ana]);
  await seguir(carla, [ana, bruno]);
  await seguir(davi, [ana]);

  console.log("Banco populado com usuários, perfis, posts, hashtags, curtidas, comentários e seguidores!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (erro) => {
    console.error(erro);
    await prisma.$disconnect();
    process.exit(1);
  });
