import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <main>
      <h1>Página não encontrada</h1>
      <p>
        <Link href="/">Voltar para o feed</Link>
      </p>
    </main>
  );
}
