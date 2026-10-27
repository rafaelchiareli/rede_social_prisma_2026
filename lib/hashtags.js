// Letras (com acento), números e _ depois do #
const PADRAO = /#[\p{L}\p{N}_]+/gu;

// "Praia com a turma #verao #ferias #verao" → ["verao", "ferias"]
export function extrairHashtags(texto) {
  const encontradas = texto.match(PADRAO) ?? [];
  const nomes = encontradas.map((h) => h.slice(1).toLowerCase());
  return [...new Set(nomes)]; // o Set tira as repetidas
}

// Separa o texto em pedaços, deixando cada hashtag num pedaço só
// "Oi #turma!" → ["Oi ", "#turma", "!"]
export function separarHashtags(texto) {
  return texto.split(/(#[\p{L}\p{N}_]+)/u);
}
