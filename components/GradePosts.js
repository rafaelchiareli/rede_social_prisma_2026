import Link from "next/link";

export default function GradePosts({ posts }) {
  if (posts.length === 0) return <p className="vazio">Nenhum post ainda.</p>;

  return (
    <div className="grade">
      {posts.map((post) => (
        <Link key={post.id} href={`/post/${post.id}`} className="grade-item">
          <img src={post.imagem} alt={post.legenda} />
          <span className="grade-info">
            <span>♥ {post._count.curtidas}</span>
            <span>💬 {post._count.comentarios}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
