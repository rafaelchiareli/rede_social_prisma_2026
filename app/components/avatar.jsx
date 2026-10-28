export default function Avatar({usuario, tamanho = 36}){
    return (
        <img src={usuario.avatatr} 
        alt={usuario.nome}
        width={tamanho}
        height={tamanho}
        className="avatar" />
    )
}