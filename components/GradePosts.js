export default function GradePosts({ posts }) {
  if (posts.length === 0) return <p className="vazio">Nenhum post ainda.</p>;

  return (
    <div className="grade">
      {posts.map((post) => (
        <div key={post.id} className="grade-item">
          <img src={post.imagem} alt={post.legenda} />
        </div>
      ))}
    </div>
  );
}
