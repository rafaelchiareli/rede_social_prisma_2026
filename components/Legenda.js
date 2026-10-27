import Link from "next/link";
import { separarHashtags } from "@/lib/hashtags";

// Mostra o texto com as #hashtags viradas em links
export default function Legenda({ texto }) {
  return separarHashtags(texto).map((parte, i) =>
    parte.startsWith("#") ? (
      <Link
        key={i}
        href={`/tag/${encodeURIComponent(parte.slice(1).toLowerCase())}`}
        className="hashtag"
      >
        {parte}
      </Link>
    ) : (
      <span key={i}>{parte}</span>
    )
  );
}
