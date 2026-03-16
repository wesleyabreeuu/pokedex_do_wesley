import { NextResponse } from "next/server";

import { getPokemonDetails } from "@/lib/pokemon";

type RouteContext = {
  params: Promise<{
    name: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  try {
    const { name } = await context.params;
    const data = await getPokemonDetails(name);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Pokemon nao encontrado." }, { status: 404 });
  }
}
