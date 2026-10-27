// O que buscar junto com cada post. Usado no feed e na página do post.
// "eu" é o usuário atual (pode ser null).
export function dadosDoPost(eu) {
  return {
    autor: true,
    // Conta curtidas e comentários sem trazer todos eles
    _count: { select: { curtidas: true, comentarios: true } },
    // Traz só a MINHA curtida (para saber se eu já curti)
    curtidas: { where: { usuarioId: eu?.id ?? 0 } },
  };
}
