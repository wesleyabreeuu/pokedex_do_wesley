import Image from "next/image";
import Link from "next/link";

import type { PokemonCard as PokemonCardType } from "@/lib/pokemon";

type PokemonCardProps = {
  pokemon: PokemonCardType;
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link href={`/pokemon/${pokemon.name.toLowerCase()}`} className="pokemon-card">
      <div className="pokemon-card__media">
        <Image src={pokemon.image} alt={pokemon.name} width={220} height={220} priority={pokemon.id <= 4} unoptimized />
      </div>

      <div className="pokemon-card__body">
        <span className="pokemon-card__number">#{pokemon.id.toString().padStart(3, "0")}</span>
        <h3>{pokemon.name}</h3>

        <div className="badge-row">
          {pokemon.types.map((type) => (
            <span key={type} className="badge">
              {type}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
