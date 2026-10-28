import { cookies } from "next/headers";
import {prisma} from'../lib/prisma';
//descobre quem está acessando o site, lendo o cookie usuarioId
//não é um login de verdade é só uma demonstração

export async function usuiarioAtual() {
    const cookieStore = await cookies();
    const id = cookieStore.get("usuarioId")?.value;
    if (!id) return null;  

    return prisma.usuario.findUnique({
        where: {id: Number(id)}
    });

    

}