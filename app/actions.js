"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { usuarioAtual } from "@/lib/usuarioAtual";
import { avatarPara, fotoAleatoria } from "@/lib/imagens";

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

  await prisma.post.create({
    data: {
      legenda,
      imagem,
      // Liga o post ao autor (relação 1 para N)
      autor: { connect: { id: eu.id } },
    },
  });

  revalidatePath("/", "layout");
}
