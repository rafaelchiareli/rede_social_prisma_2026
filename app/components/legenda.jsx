import { Link } from "next/link";
import { extrairHashtags } from "@/lib/hashtags";

//mostra o texto com as #hashtags viradas em link
export default function Legenda({ texto }) {
    return extrairHashtags(texto).map((parte, i) =>
        parte.startsWith("#") ? (
            <Link key={i} href={`/tag/${encodeURIComponent(parte.slice(1).toLowerCase())}`}
                className="hashtag" >
                {parte}
            </Link>
        ) : (<span key={i}>{parte}</span>)
    )
}
