import Link from "next/link";

export default function GradePosts({ posts }) {
    if (posts.length === 0) return <p className="vazio">Nenhum post ainda</p>;

    return (
        <div className="grade">
            {posts.map((p) => (
                <div key={p.id} className="grade-item">
                    <img src={p.imagem} alt={p.legenda}></img>
                    <span className='grade-info'>
                        <span>🖤 {post._count.curdidas}</span>
                        <span>✏️ {post._count.comentarios}</span>
                    </span>
                </div>
            ))}
        </div>
    );
}