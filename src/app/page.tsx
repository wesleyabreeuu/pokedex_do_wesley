import { PokedexPanel } from "@/components/pokedex-panel";
import { DEFAULT_LIMIT, getPokemonByQuery, PokemonQueryError } from "@/lib/pokemon";

type HomeProps = {
  searchParams: Promise<{
    query?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const result = await resolvePokemon(params.query);
  const currentPokemon = result.pokemon;

  if (!currentPokemon) {
    return (
      <main className="app-stage">
        <section className="fatal-error" aria-live="assertive">
          <h1>Pokedex do Wesley</h1>
          <p>Nao foi possivel carregar os dados dos pokemons no momento.</p>
          <p>Verifique sua conexao com a internet ou tente novamente em instantes.</p>
        </section>
      </main>
    );
  }

  const prevId = currentPokemon.id <= 1 ? DEFAULT_LIMIT : currentPokemon.id - 1;
  const nextId = currentPokemon.id >= DEFAULT_LIMIT ? 1 : currentPokemon.id + 1;

  return (
    <main className="app-stage">
      <PokedexPanel
        pokemon={currentPokemon}
        prevId={prevId}
        nextId={nextId}
        feedbackMessage={result.feedbackMessage}
        feedbackTone={result.feedbackTone}
      />
    </main>
  );
}

async function resolvePokemon(query?: string) {
  try {
    const pokemon = await getPokemonByQuery(query);
    return {
      pokemon,
      feedbackMessage: null,
      feedbackTone: "warning" as const,
    };
  } catch (error) {
    const fallbackPokemon = await getPokemonByQuery("1").catch(() => null);

    if (error instanceof PokemonQueryError) {
      if (error.code === "NOT_FOUND") {
        return {
          pokemon: fallbackPokemon,
          feedbackMessage: "Pokemon nao encontrado. Exibindo o #1.",
          feedbackTone: "warning" as const,
        };
      }

      return {
        pokemon: fallbackPokemon,
        feedbackMessage: "Nao foi possivel carregar a PokeAPI agora. Exibindo um pokemon de contingencia.",
        feedbackTone: "error" as const,
      };
    }

    return {
      pokemon: fallbackPokemon,
      feedbackMessage: "Ocorreu um erro inesperado. Exibindo um pokemon de contingencia.",
      feedbackTone: "error" as const,
    };
  }
}
