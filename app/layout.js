import Topo from "./components/topo";
import "./globals.css";

export const metadata = {
  title: "Turmagram",
  description: "A rede social da turma",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Topo></Topo>
        <div className="conteudo">{children}</div>
      </body>
    </html>
  );
}
