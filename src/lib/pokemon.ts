const API_URL = "https://pokeapi.co/api/v2";
export const DEFAULT_LIMIT = Number(process.env.POKEDEX_LIMIT ?? "151");
const REVALIDATE_SECONDS = 60 * 60 * 12;

type NamedApiResource = {
  name: string;
  url: string;
};

type PokemonListResponse = {
  results: NamedApiResource[];
};

type PokemonTypeResponse = {
  damage_relations: {
    double_damage_from: NamedApiResource[];
  };
  pokemon: {
    pokemon: NamedApiResource;
  }[];
};

type EvolutionChainResponse = {
  chain: EvolutionNode;
};

type EvolutionNode = {
  species: NamedApiResource;
  evolves_to: EvolutionNode[];
};

type FlavorTextEntry = {
  flavor_text: string;
  language: {
    name: string;
  };
};

type PokemonSpeciesResponse = {
  flavor_text_entries: FlavorTextEntry[];
  evolution_chain: {
    url: string;
  };
};

type PokemonApiResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: {
    type: NamedApiResource;
  }[];
  stats: {
    base_stat: number;
    stat: NamedApiResource;
  }[];
  abilities: {
    ability: NamedApiResource;
    is_hidden: boolean;
  }[];
  sprites: {
    other?: {
      "official-artwork"?: {
        front_default: string | null;
      };
    };
  };
};

export type PokemonCard = {
  id: number;
  name: string;
  image: string;
  types: string[];
};

export type PokemonDetails = PokemonCard & {
  height: number;
  weight: number;
  abilities: {
    name: string;
    isHidden: boolean;
  }[];
  stats: {
    name: string;
    value: number;
  }[];
  description: string;
  evolutionChain: string[];
  weaknesses: string[];
  totalStats: number;
};

export type PokemonListFilters = {
  query?: string;
  type?: string;
  page?: number;
  pageSize?: number;
};

export type PokemonListResult = {
  items: PokemonCard[];
  page: number;
  totalPages: number;
  totalItems: number;
  availableTypes: string[];
};

async function fetchFromPokeApi<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    next: {
      revalidate: REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar ${path} na PokeAPI.`);
  }

  return response.json() as Promise<T>;
}

function toTitleCase(value: string) {
  return value
    .split(/[-\s]+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function formatFlavorText(entries: FlavorTextEntry[]) {
  const entry = entries.find((item) => item.language.name === "en");
  return (entry?.flavor_text ?? "No description available.").replace(/\f/g, " ");
}

function buildArtwork(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function extractIdFromUrl(url: string) {
  const match = url.match(/\/pokemon\/(\d+)\//);
  return match ? Number(match[1]) : 0;
}

function mapPokemonCard(pokemon: PokemonApiResponse): PokemonCard {
  return {
    id: pokemon.id,
    name: toTitleCase(pokemon.name),
    image: pokemon.sprites.other?.["official-artwork"]?.front_default ?? buildArtwork(pokemon.id),
    types: pokemon.types.map((item) => toTitleCase(item.type.name)),
  };
}

async function getPokemonIndex(type?: string) {
  if (!type) {
    const response = await fetchFromPokeApi<PokemonListResponse>(`/pokemon?limit=${DEFAULT_LIMIT}`);
    return response.results;
  }

  const response = await fetchFromPokeApi<PokemonTypeResponse>(`/type/${type.toLowerCase()}`);

  return response.pokemon
    .map((item) => item.pokemon)
    .filter((item) => extractIdFromUrl(item.url) <= DEFAULT_LIMIT);
}

export async function getPokemonTypes() {
  const response = await fetchFromPokeApi<{ results: NamedApiResource[] }>("/type");
  return response.results
    .map((item) => item.name)
    .filter((type) => !["unknown", "shadow"].includes(type))
    .map(toTitleCase);
}

export async function getPokemonList(filters: PokemonListFilters = {}): Promise<PokemonListResult> {
  const query = filters.query?.trim().toLowerCase() ?? "";
  const currentPage = Math.max(filters.page ?? 1, 1);
  const pageSize = filters.pageSize ?? 12;
  const availableTypes = await getPokemonTypes();
  const index = await getPokemonIndex(filters.type);

  const filtered = index.filter((item) => item.name.includes(query));
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const items = await Promise.all(
    pageItems.map(async (item) => {
      const pokemon = await fetchFromPokeApi<PokemonApiResponse>(`/pokemon/${item.name}`);
      return mapPokemonCard(pokemon);
    }),
  );

  return {
    items,
    page: safePage,
    totalPages,
    totalItems,
    availableTypes,
  };
}

function flattenEvolutionChain(node: EvolutionNode, chain: string[] = []) {
  chain.push(toTitleCase(node.species.name));
  node.evolves_to.forEach((next) => flattenEvolutionChain(next, chain));
  return [...new Set(chain)];
}

export async function getPokemonDetails(slug: string): Promise<PokemonDetails> {
  const pokemon = await fetchFromPokeApi<PokemonApiResponse>(`/pokemon/${slug.toLowerCase()}`);
  const species = await fetchFromPokeApi<PokemonSpeciesResponse>(`/pokemon-species/${slug.toLowerCase()}`);
  const typeResponses = await Promise.all(
    pokemon.types.map((item) => fetchFromPokeApi<PokemonTypeResponse>(`/type/${item.type.name}`)),
  );

  const evolutionPath = species.evolution_chain.url.replace("https://pokeapi.co/api/v2", "");
  const evolutionChain = await fetchFromPokeApi<EvolutionChainResponse>(evolutionPath);
  const stats = pokemon.stats.map((item) => ({
    name: toTitleCase(item.stat.name),
    value: item.base_stat,
  }));
  const weaknesses = [
    ...new Set(
      typeResponses.flatMap((response) => response.damage_relations.double_damage_from.map((item) => toTitleCase(item.name))),
    ),
  ];

  return {
    ...mapPokemonCard(pokemon),
    height: pokemon.height / 10,
    weight: pokemon.weight / 10,
    abilities: pokemon.abilities.map((item) => ({
      name: toTitleCase(item.ability.name),
      isHidden: item.is_hidden,
    })),
    stats,
    description: formatFlavorText(species.flavor_text_entries),
    evolutionChain: flattenEvolutionChain(evolutionChain.chain),
    weaknesses,
    totalStats: stats.reduce((sum, stat) => sum + stat.value, 0),
  };
}

export async function getPokemonByQuery(query?: string): Promise<PokemonDetails> {
  const normalized = query?.trim().toLowerCase();

  if (!normalized) {
    return getPokemonDetails("1");
  }

  if (/^\d+$/.test(normalized)) {
    const id = Math.min(Math.max(Number(normalized), 1), DEFAULT_LIMIT);
    return getPokemonDetails(String(id));
  }

  return getPokemonDetails(normalized);
}
