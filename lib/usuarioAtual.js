import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Descobre quem está usando o site, lendo o cookie "usuarioId".
// Não é um login de verdade: é só para a aula ficar simples.
export async function usuarioAtual() {
  const cookieStore = await cookies();
  const id = cookieStore.get("usuarioId")?.value;
  if (!id) return null;

  return prisma.usuario.findUnique({ where: { id: Number(id) } });
}
