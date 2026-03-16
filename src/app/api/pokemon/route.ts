import { NextRequest, NextResponse } from "next/server";

import { getPokemonList } from "@/lib/pokemon";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const data = await getPokemonList({
    query: searchParams.get("query") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 12,
  });

  return NextResponse.json(data);
}
