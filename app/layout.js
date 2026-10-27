import "./globals.css";
import Topo from "@/components/Topo";

export const metadata = {
  title: "Turmagram",
  description: "A rede social da turma",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Topo />
        <div className="conteudo">{children}</div>
      </body>
    </html>
  );
}
