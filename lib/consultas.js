//o que buscar junto com cada post. Usado no feed e na pagina do post
//"eu" é o usuário atual

export function dadosDoPost(eu){
    return{
        autor: true,
        //conta curtidas e comentários sem trazer todos
        _count: {select : {curtidas: true, comentarios: true}},
        //traz so a curtida do usuario logado
        curtidas: {where : {usuarioId: eu?.id ?? 0}},
    }
}
