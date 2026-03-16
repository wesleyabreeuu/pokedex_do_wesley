"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { PokemonDetails } from "@/lib/pokemon";
import { usePokedexStore, type PokedexTab } from "@/store/pokedex-store";

type PokedexPanelProps = {
  pokemon: PokemonDetails;
  prevId: number;
  nextId: number;
  feedbackMessage?: string | null;
  feedbackTone?: "warning" | "error";
};

function translateStat(statName: string) {
  const statMap: Record<string, string> = {
    Hp: "HP",
    Attack: "Ataque",
    Defense: "Defesa",
    Speed: "Velocidade",
  };

  return statMap[statName] ?? statName;
}

export function PokedexPanel({
  pokemon,
  prevId,
  nextId,
  feedbackMessage,
  feedbackTone = "warning",
}: PokedexPanelProps) {
  const [showIntro, setShowIntro] = useState(true);
  const featuredStats = pokemon.stats.filter((stat) => ["Hp", "Attack", "Defense", "Speed"].includes(stat.name));
  const selectedTab = usePokedexStore((state) => state.selectedTab);
  const toggleTab = usePokedexStore((state) => state.toggleTab);
  const resetTab = usePokedexStore((state) => state.resetTab);

  useEffect(() => {
    resetTab();
  }, [pokemon.id, resetTab]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShowIntro(false);
    }, 1650);

    return () => window.clearTimeout(timeoutId);
  }, []);

  function handleTab(tab: Exclude<PokedexTab, null>) {
    toggleTab(tab);
  }

  function buildNavHref(id: number) {
    const navParams = new URLSearchParams({ query: String(id) });
    return `/?${navParams.toString()}`;
  }

  return (
    <div className="intro-shell">
      {showIntro ? (
        <div className="intro-overlay" aria-hidden="true">
          <div className="intro-card">
            <div className="intro-pokeball">
              <div className="intro-pokeball__top" />
              <div className="intro-pokeball__bottom" />
              <div className="intro-pokeball__center" />
            </div>
            <strong>Pokedex do Wesley</strong>
            <span>Carregando seu proximo pokemon...</span>
          </div>
        </div>
      ) : null}

      <section className={`pokedex-shell${showIntro ? " pokedex-shell--hidden" : " pokedex-shell--ready"}`} aria-label="Pokedex">
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
              <Image src={pokemon.image} alt={pokemon.name} width={220} height={220} priority unoptimized className="screen-image" />
            </div>

            <div className="screen-label">
              {pokemon.id} - {pokemon.name}
            </div>
          </div>

          <form className="search-box" action="/" method="get">
            <input
              type="text"
              name="query"
              placeholder="Nome ou numero"
              aria-label="Buscar pokemon por nome ou numero"
            />
            <button type="submit">Buscar</button>
          </form>

          {feedbackMessage ? (
            <p className={`search-feedback${feedbackTone === "error" ? " is-error" : ""}`}>{feedbackMessage}</p>
          ) : null}

          <div className="tab-row" role="tablist" aria-label="Modos da pokedex">
            <button type="button" className={`tab-button${selectedTab === "view" ? " is-active" : ""}`} onClick={() => handleTab("view")}>
              Ver
            </button>
            <button type="button" className={`tab-button${selectedTab === "stats" ? " is-active" : ""}`} onClick={() => handleTab("stats")}>
              Stats
            </button>
            <button type="button" className={`tab-button${selectedTab === "info" ? " is-active" : ""}`} onClick={() => handleTab("info")}>
              Dados
            </button>
            <button type="button" className={`tab-button${selectedTab === "evo" ? " is-active" : ""}`} onClick={() => handleTab("evo")}>
              Evol.
            </button>
          </div>

          {selectedTab ? (
            <section className="data-screen" aria-live="polite">
              {selectedTab === "view" ? (
                <div className="data-screen__content">
                  <div className="type-row">
                    {pokemon.types.map((type) => (
                      <span key={type} className="chip chip--type">
                        {type}
                      </span>
                    ))}
                  </div>
                  <p className="data-screen__text">{pokemon.description}</p>
                </div>
              ) : null}

              {selectedTab === "stats" ? (
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
                  <div className="stack-item stack-item--highlight">
                    <span>Total Base</span>
                    <strong>{pokemon.totalStats}</strong>
                  </div>
                </div>
              ) : null}

              {selectedTab === "info" ? (
                <div className="stack-group">
                  <div className="stack-item">
                    <span>Altura</span>
                    <strong>{pokemon.height} m</strong>
                  </div>
                  <div className="stack-item">
                    <span>Peso</span>
                    <strong>{pokemon.weight} kg</strong>
                  </div>
                  <div className="stack-item">
                    <span>Habilidade principal</span>
                    <strong>{pokemon.abilities[0]?.name ?? "-"}</strong>
                  </div>
                  <div className="stack-item">
                    <span>Fraquezas</span>
                    <strong>{pokemon.weaknesses.join(", ") || "-"}</strong>
                  </div>
                </div>
              ) : null}

              {selectedTab === "evo" ? (
                <div className="chip-row">
                  {pokemon.evolutionChain.map((stage) => (
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
    </div>
  );
}
