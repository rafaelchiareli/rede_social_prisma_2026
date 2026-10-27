import Link from "next/link";

export default function Abas({ aba }) {
  return (
    <nav className="abas">
      <Link href="/" className={aba !== "seguindo" ? "ativa" : ""}>
        Para você
      </Link>
      <Link href="/?aba=seguindo" className={aba === "seguindo" ? "ativa" : ""}>
        Seguindo
      </Link>
    </nav>
  );
}
