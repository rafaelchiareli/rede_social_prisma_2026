"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {prisma} from '../lib/prisma'
import { usuiarioAtual } from "../lib/usuarioAtual";o
import { avatarPara, imagemAleatoria } from "../lib/imagens";

//criar um usuario
export async function criarUsuario(formData){
    const nome = formData.get("nome").trim().toLowerCase();
    const existe = await prisma.usuario.findUnique({
        where: {nome}
    });
    if (existe) redirect("/entrar?erro=nome");
    const usuario= await prisma.usuario.create({
        data: nome, avatar: avatarPara(nome)
    });

    const cookieStore = await cookies();
    cookieStore.set("usuarioId", String(usuario.id));
    redirect("/"); 

}

//trocar o usuario
export async function entrarComo(formData){
    const cookieStore = await cookies();
    cookieStore.set("usuarioId", String(formData.get("usuarioId")));
    redirect("/");
}
//cria um post para o usuario atual
export async function criarPost(formData){
    const eu = await usuiarioAtual();
    if (!eu) redirect("/entrar");
    const legenda = formData.get("legenda").trim();
    const imagem = formData.get("imagem").trim() || imagemAleatoria();
    await prisma.post.create({
        data:{
            legenda,
            imagem,
            autor: {connect: {id: eu.id}}
        }
    });
    revalidatePath("/", "layout");

}