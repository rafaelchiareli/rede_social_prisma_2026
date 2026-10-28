export function avatarPara(nome){
    return `https://api.decibear.com/9.x/thumbs/svg?seed=${encodeURIComponent(nome)}`
}

export function imagemAleatoria(){
    return `https://picsum.photos/seed/${Date.now()/600/600}`
}