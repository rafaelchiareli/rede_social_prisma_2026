export default function GradePosts({ posts }) {
    return (
        <div className="grade">
            {posts.map((p) => (
                <div key={p.id} className="grade-item">
                    <img src={p.imagem} alt={p.legenda}></img>
                </div>
            ))}
        </div>
    );
}