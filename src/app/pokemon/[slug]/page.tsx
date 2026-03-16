import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPokemonDetails } from "@/lib/pokemon";

type PokemonPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PokemonPage({ params }: PokemonPageProps) {
  const { slug } = await params;
  const pokemon = await getPokemonDetails(slug).catch(() => null);

  if (!pokemon) {
    notFound();
  }

  return (
    <main className="details-page">
      <Link href="/" className="back-link">
        Voltar para a Pokedex do Wesley
      </Link>

      <section className="details-hero">
        <div className="details-hero__media">
          <Image src={pokemon.image} alt={pokemon.name} width={420} height={420} priority unoptimized />
        </div>

        <div className="details-hero__content">
          <span className="eyebrow">#{pokemon.id.toString().padStart(3, "0")}</span>
          <h1>{pokemon.name}</h1>
          <p>{pokemon.description}</p>

          <div className="badge-row">
            {pokemon.types.map((type) => (
              <span key={type} className="badge">
                {type}
              </span>
            ))}
          </div>

          <div className="facts-grid">
            <div className="fact-card">
              <span>Altura</span>
              <strong>{pokemon.height} m</strong>
            </div>
            <div className="fact-card">
              <span>Peso</span>
              <strong>{pokemon.weight} kg</strong>
            </div>
            <div className="fact-card">
              <span>Habilidades</span>
              <strong>{pokemon.abilities.length}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="details-grid">
        <article className="panel">
          <h2>Status base</h2>
          <div className="stats-list">
            {pokemon.stats.map((stat) => (
              <div key={stat.name} className="stat-row">
                <span>{stat.name}</span>
                <div className="stat-bar">
                  <div style={{ width: `${Math.min(stat.value, 100)}%` }} />
                </div>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <h2>Habilidades</h2>
          <div className="stack-list">
            {pokemon.abilities.map((ability) => (
              <div key={ability.name} className="list-item">
                <span>{ability.name}</span>
                <strong>{ability.isHidden ? "Oculta" : "Principal"}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <h2>Evolucoes</h2>
          <div className="evolution-list">
            {pokemon.evolutionChain.map((stage) => (
              <span key={stage} className="evolution-pill">
                {stage}
              </span>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
