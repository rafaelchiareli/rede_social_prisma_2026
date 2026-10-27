"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { usuarioAtual } from "@/lib/usuarioAtual";
import { avatarPara, fotoAleatoria } from "@/lib/imagens";
import { extrairHashtags } from "@/lib/hashtags";

// ---------- USUÁRIOS ----------

// Cria um usuário novo e já entra com ele
export async function criarUsuario(formData) {
  const nome = formData.get("nome").trim().toLowerCase();

  // O nome é @unique: não pode existir outro igual
  const existe = await prisma.usuario.findUnique({ where: { nome } });
  if (existe) redirect("/entrar?erro=nome");

  const usuario = await prisma.usuario.create({
    data: { nome, avatar: avatarPara(nome) },
  });

  const cookieStore = await cookies();
  cookieStore.set("usuarioId", String(usuario.id));
  redirect("/");
}

// Troca o usuário que está usando o site
export async function entrarComo(formData) {
  const cookieStore = await cookies();
  cookieStore.set("usuarioId", String(formData.get("usuarioId")));
  redirect("/");
}

// ---------- POSTS ----------

// Cria um post do usuário atual
export async function criarPost(formData) {
  const eu = await usuarioAtual();
  if (!eu) redirect("/entrar");

  const legenda = formData.get("legenda").trim();
  const imagem = formData.get("imagem").trim() || fotoAleatoria();
  const tags = extrairHashtags(legenda);

  await prisma.post.create({
    data: {
      legenda,
      imagem,
      // Liga o post ao autor (relação 1 para N)
      autor: { connect: { id: eu.id } },
      // Liga o post às tags. Se a tag ainda não existe, cria (N para N)
      tags: {
        connectOrCreate: tags.map((nome) => ({
          where: { nome },
          create: { nome },
        })),
      },
    },
  });

  revalidatePath("/", "layout");
}

// ---------- CURTIDAS E COMENTÁRIOS ----------

// Curte o post. Se já tinha curtido, descurte.
export async function curtir(formData) {
  const eu = await usuarioAtual();
  if (!eu) redirect("/entrar");

  const postId = Number(formData.get("postId"));

  // Com @@id([usuarioId, postId]), a chave tem as duas colunas juntas
  const chave = { usuarioId_postId: { usuarioId: eu.id, postId } };
  const jaCurtiu = await prisma.curtida.findUnique({ where: chave });

  if (jaCurtiu) {
    await prisma.curtida.delete({ where: chave });
  } else {
    await prisma.curtida.create({ data: { usuarioId: eu.id, postId } });
  }

  revalidatePath("/", "layout");
}

// Comenta em um post
export async function comentar(formData) {
  const eu = await usuarioAtual();
  if (!eu) redirect("/entrar");

  const postId = Number(formData.get("postId"));
  const texto = formData.get("texto").trim();
  if (texto === "") return;

  await prisma.comentario.create({
    data: {
      texto,
      autor: { connect: { id: eu.id } },
      post: { connect: { id: postId } },
    },
  });

  revalidatePath("/", "layout");
}

// Apaga um post. As curtidas e comentários dele somem junto (cascata).
export async function apagarPost(formData) {
  const eu = await usuarioAtual();
  if (!eu) redirect("/entrar");

  const id = Number(formData.get("postId"));

  // Só apaga se o post for MEU: o where tem o id E o autor
  await prisma.post.deleteMany({ where: { id, autorId: eu.id } });

  revalidatePath("/", "layout");
  redirect("/");
}

// ---------- PERFIL ----------

// Salva a bio do usuário atual: cria o perfil ou atualiza o que já existe
export async function salvarBio(formData) {
  const eu = await usuarioAtual();
  if (!eu) redirect("/entrar");

  const bio = formData.get("bio").trim();

  await prisma.perfil.upsert({
    where: { usuarioId: eu.id },
    update: { bio },
    create: { bio, usuario: { connect: { id: eu.id } } },
  });

  revalidatePath("/", "layout");
}

// ---------- SEGUIDORES ----------

// Segue um usuário. Se já seguia, deixa de seguir.
export async function seguir(formData) {
  const eu = await usuarioAtual();
  if (!eu) redirect("/entrar");

  const outroId = Number(formData.get("usuarioId"));
  if (outroId === eu.id) return; // ninguém segue a si mesmo

  const jaSigo = formData.get("jaSigo") === "true";

  await prisma.usuario.update({
    where: { id: eu.id },
    data: {
      // connect cria a ligação; disconnect desfaz (os usuários continuam existindo)
      seguindo: jaSigo ? { disconnect: { id: outroId } } : { connect: { id: outroId } },
    },
  });

  revalidatePath("/", "layout");
}
