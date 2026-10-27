export default function Avatar({ usuario, tamanho = 36 }) {
  return (
    <img
      src={usuario.avatar}
      alt={usuario.nome}
      width={tamanho}
      height={tamanho}
      className="avatar"
    />
  );
}
