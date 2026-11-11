"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from '../lib/prisma'
import { usuarioAtual } from "../lib/usuarioAtual";
import { avatarPara, imagemAleatoria } from "../lib/imagens";
import { extrairHashtags } from "../lib/hashtags";

//criar um usuario
export async function criarUsuario(formData) {
    const nome = formData.get("nome").trim().toLowerCase();
    const existe = await prisma.usuario.findUnique({
        where: { nome }
    });
    if (existe) redirect("/entrar?erro=nome");
    const usuario = await prisma.usuario.create({
        data: { nome, avatar: avatarPara(nome) },
    });

    const cookieStore = await cookies();
    cookieStore.set("usuarioId", String(usuario.id));
    redirect("/");

}

//trocar o usuario
export async function entrarComo(formData) {
    const cookieStore = await cookies();
    cookieStore.set("usuarioId", String(formData.get("usuarioId")));
    redirect("/");
}
//cria um post para o usuario atual
export async function criarPost(formData) {
    const eu = await usuarioAtual();
    if (!eu) redirect("/entrar");

    const legenda = formData.get("legenda").trim();
    const imagem = formData.get("imagem").trim() || imagemAleatoria();
    const tags= extrairHashtags(legenda);
    await prisma.post.create({
        data: {
            legenda,
            imagem,
            autor: { connect: { id: eu.id } },
            tags: {
                connectOrCreate: tags.map((nome) => ({
                    where: {nome},
                    create: {nome}
                }))
            }
        }
    });
    revalidatePath("/", "layout");

}

//curtir o post, se ja curtiu, descurte.
export async function curtir(formData) {
    const eu = await usuarioAtual();
    if (!eu) redirect("/entrar");

    const postId = Number(formData.get("postId"));

    //com @postId e @usuarioId ja temos a chave da tabela Curtida

    const chave = { postId_usuarioId: { postId: postId, usuarioId: eu.id } }
    const jaCurtiu = await prisma.curtida.findUnique({
        where: chave
    });
    if (jaCurtiu) {
        await prisma.curtida.delete({ where: chave })
    } else {
        await prisma.curtida.create({
            data: { postId: postId, usuarioId: eu.id }
        });
    }
    revalidatePath("/");
}
//cria um comentário em um post
export async function comentar(formData) {
    const eu = await usuarioAtual();
    if (!eu) redirect("/entrar");
    const postId = Number(formData.get("postId"))
    const texto = formData.get("texto").trim();
    if (texto === "") return;
    await prisma.comentario.create({
        data: {
            texto,
            autor: {connect :{id: eu.id}},
            post: {connect: {id: postId}}
        },
    });
    revalidatePath("/");
}
//deletar um post
export async function apagarPost(formData){
  const eu = await usuarioAtual();
    if (!eu) redirect("/entrar");
    const id = Number(formData.get("postId"));
    //so apaga o post se ele for do usuário que o criou.
    await prisma.post.deleteMany({
        where: {id,autorId: eu.id}
    });
    revalidatePath("/");
    redirect("/");
}

//Salva a bio do usuario atual: cria o perfil ou atualiza o que ja existe
export async function salvarBio(formData){
    const eu = await usuarioAtual();
    if (!eu) redirect("/entrar");

    const bio = formData.get("bio").trim();

    await prisma.perfil.upsert({
        where: {usuarioId: eu.id},
        update: {bio},
        create: {bio, usuario : { connect : {id: eu.id }}}
    });
}

