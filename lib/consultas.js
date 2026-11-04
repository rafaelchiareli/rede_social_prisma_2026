//o que buscar junto com cada post. Usado no feed e na pagina do post
//"eu" é o usuário atual

export async function dadosDoPost(eu){
    return{
        autor: true,
        //conta curtidas de comentatios sem trazer todos
        _count: {select : {curtidas: true, comentarios: true}},
        //traz so a curtida do usuario logado
        curtidas: {where : {usuarioId: eu?.id ?? 0}},
    }
}