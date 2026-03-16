import Image from "next/image";
import Link from "next/link";

import { DEFAULT_LIMIT, getPokemonByQuery } from "@/lib/pokemon";

type HomeProps = {
  searchParams: Promise<{
    query?: string;
    tab?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const pokemon = await getPokemonByQuery(params.query).catch(() => null);
  const currentPokemon = pokemon ?? (await getPokemonByQuery("1"));
  const prevId = currentPokemon.id <= 1 ? DEFAULT_LIMIT : currentPokemon.id - 1;
  const nextId = currentPokemon.id >= DEFAULT_LIMIT ? 1 : currentPokemon.id + 1;
  const featuredStats = currentPokemon.stats.filter((stat) =>
    ["Hp", "Attack", "Defense", "Speed"].includes(stat.name),
  );
  const currentTab = ["view", "stats", "info", "evo"].includes(params.tab ?? "")
    ? (params.tab as "view" | "stats" | "info" | "evo")
    : null;

  function buildTabHref(tab: "view" | "stats" | "info" | "evo") {
    const tabParams = new URLSearchParams();

    if (params.query) {
      tabParams.set("query", params.query);
    }

    if (currentTab !== tab) {
      tabParams.set("tab", tab);
    }

    const queryString = tabParams.toString();
    return queryString ? `/?${queryString}` : "/";
  }

  function buildNavHref(id: number) {
    const navParams = new URLSearchParams({ query: String(id) });

    if (currentTab !== "view") {
      navParams.set("tab", currentTab);
    }

    return `/?${navParams.toString()}`;
  }

  return (
    <main className="app-stage">
      <section className="pokedex-shell" aria-label="Pokedex">
        <div className="pokedex-top">
          <div className="lens" />
          <div className="indicator-row">
            <span className="indicator indicator--red" />
            <span className="indicator indicator--yellow" />
            <span className="indicator indicator--green" />
          </div>
        </div>

        <div className="pokedex-inner">
          <div className="screen-frame">
            <div className="screen-leds">
              <span />
              <span />
            </div>

            <div className="screen">
              <div className="screen-scanline" />
              <Image
                src={currentPokemon.image}
                alt={currentPokemon.name}
                width={220}
                height={220}
                priority
                unoptimized
                className="screen-image"
              />
            </div>

            <div className="screen-label">
              {currentPokemon.id} - {currentPokemon.name}
            </div>
          </div>

          <form className="search-box" action="/" method="get">
            <input
              type="text"
              name="query"
              defaultValue={params.query ?? ""}
              placeholder="Name or Number"
              aria-label="Search pokemon by name or number"
            />
            <button type="submit">Search</button>
          </form>

          {!pokemon && params.query ? <p className="search-feedback">Pokemon nao encontrado. Exibindo o #1.</p> : null}

          <div className="tab-row" role="tablist" aria-label="Modos da pokedex">
            <Link href={buildTabHref("view")} className={`tab-button${currentTab === "view" ? " is-active" : ""}`}>
              Ver
            </Link>
            <Link href={buildTabHref("stats")} className={`tab-button${currentTab === "stats" ? " is-active" : ""}`}>
              Stats
            </Link>
            <Link href={buildTabHref("info")} className={`tab-button${currentTab === "info" ? " is-active" : ""}`}>
              Dados
            </Link>
            <Link href={buildTabHref("evo")} className={`tab-button${currentTab === "evo" ? " is-active" : ""}`}>
              Evol.
            </Link>
          </div>

          {currentTab ? (
            <section className="data-screen" aria-live="polite">
              {currentTab === "view" ? (
                <div className="data-screen__content">
                  <div className="type-row">
                    {currentPokemon.types.map((type) => (
                      <span key={type} className="chip chip--type">
                        {type}
                      </span>
                    ))}
                  </div>
                  <p className="data-screen__text">{currentPokemon.description}</p>
                </div>
              ) : null}

              {currentTab === "stats" ? (
                <div className="stat-list">
                  {featuredStats.map((stat) => (
                    <div key={stat.name} className="stat-item">
                      <span>{translateStat(stat.name)}</span>
                      <div className="stat-track">
                        <div style={{ width: `${Math.min((stat.value / 180) * 100, 100)}%` }} />
                      </div>
                      <strong>{stat.value}</strong>
                    </div>
                  ))}
                </div>
              ) : null}

              {currentTab === "info" ? (
                <div className="stack-group">
                  <div className="stack-item">
                    <span>Altura</span>
                    <strong>{currentPokemon.height} m</strong>
                  </div>
                  <div className="stack-item">
                    <span>Peso</span>
                    <strong>{currentPokemon.weight} kg</strong>
                  </div>
                  <div className="stack-item">
                    <span>Habilidade</span>
                    <strong>{currentPokemon.abilities[0]?.name ?? "-"}</strong>
                  </div>
                  <div className="stack-item">
                    <span>Fraquezas</span>
                    <strong>{currentPokemon.weaknesses.slice(0, 2).join(", ") || "-"}</strong>
                  </div>
                </div>
              ) : null}

              {currentTab === "evo" ? (
                <div className="chip-row">
                  {currentPokemon.evolutionChain.map((stage) => (
                    <span key={stage} className="chip chip--evolution">
                      {stage}
                    </span>
                  ))}
                </div>
              ) : null}
            </section>
          ) : (
            <p className="data-hint">Clique em Ver, Stats, Dados ou Evol. para abrir os detalhes.</p>
          )}

          <div className="nav-row">
            <Link href={buildNavHref(prevId)} className="nav-button">
              Anterior
            </Link>
            <Link href={buildNavHref(nextId)} className="nav-button">
              Proximo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
  function translateStat(statName: string) {
    const statMap: Record<string, string> = {
      Hp: "HP",
      Attack: "Ataque",
      Defense: "Defesa",
      Speed: "Velocidade",
    };

    return statMap[statName] ?? statName;
  }
