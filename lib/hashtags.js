//Letras (com acento), numeros e _ depois do #
const PADRAO = /#[\p{L}\p{N}_]+/gu;

export function extrairHashtags(texto){
    const encontradas = texto.match(PADRAO) ?? [];
    const nomes = encontradas.map((h) => h.slice(1).toLowerCase());
    return [...new Set(nomes)];

   
    //separa o texto em pedaços, deixando cada hashtag num pedaço só
    //oi #turma! - ["oi", "#turma", "!"]  
    return texto.split(/#[\p{L}\p{N}_]+/u)

}