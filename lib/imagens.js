// Avatar desenhado automaticamente a partir do nome
export function avatarPara(nome) {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(nome)}`;
}

// Foto aleatória para quando o post não tiver imagem
export function fotoAleatoria() {
  return `https://picsum.photos/seed/${Date.now()}/600/600`;
}
