import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  query?: string;
  type?: string;
};

function buildHref(page: number, query?: string, type?: string) {
  const params = new URLSearchParams();

  if (query) {
    params.set("query", query);
  }

  if (type) {
    params.set("type", type);
  }

  params.set("page", String(page));

  return `/?${params.toString()}`;
}

export function Pagination({ page, totalPages, query, type }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Paginacao da pokedex">
      <Link href={buildHref(Math.max(1, page - 1), query, type)} aria-disabled={page === 1} className="button-link">
        Anterior
      </Link>

      <span>
        Pagina {page} de {totalPages}
      </span>

      <Link
        href={buildHref(Math.min(totalPages, page + 1), query, type)}
        aria-disabled={page === totalPages}
        className="button-link"
      >
        Proxima
      </Link>
    </nav>
  );
}
