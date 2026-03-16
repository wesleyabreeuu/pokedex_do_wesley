"use client";

import { useDeferredValue, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SearchFiltersProps = {
  availableTypes: string[];
};

export function SearchFilters({ availableTypes }: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (deferredQuery) {
      params.set("query", deferredQuery);
    } else {
      params.delete("query");
    }

    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }

    params.delete("page");

    startTransition(() => {
      const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(nextUrl, { scroll: false });
    });
  }, [deferredQuery, pathname, router, searchParams, type]);

  return (
    <div className="filters-panel">
      <label className="field">
        <span>Buscar pokemon</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ex.: Pikachu, Charizard..."
        />
      </label>

      <label className="field">
        <span>Tipo</span>
        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="">Todos os tipos</option>
          {availableTypes.map((item) => (
            <option key={item} value={item.toLowerCase()}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <div className="filters-status">{isPending ? "Atualizando resultados..." : "Resultados prontos"}</div>
    </div>
  );
}
