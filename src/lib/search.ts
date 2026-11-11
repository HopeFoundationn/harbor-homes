export type HomeType = "house" | "townhouse";
export type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

export type ListingSearch = {
  city?: string;
  max?: number;
  beds?: number;
  baths?: number;
  pets?: boolean;
  type?: HomeType;
  sort?: SortKey;
};

function num(value: unknown): number | undefined {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return n;
}

export function cleanSearch(search: ListingSearch): ListingSearch {
  const next: ListingSearch = {};
  if (search.city) next.city = search.city;
  if (search.max && search.max > 0) next.max = search.max;
  if (search.beds && search.beds > 0) next.beds = search.beds;
  if (search.baths && search.baths > 0) next.baths = search.baths;
  if (search.pets) next.pets = true;
  if (search.type) next.type = search.type;
  if (search.sort && search.sort !== "featured") next.sort = search.sort;
  return next;
}

export function parseSearch(raw: Record<string, unknown>): ListingSearch {
  const type = raw.type === "house" || raw.type === "townhouse" ? raw.type : undefined;
  const sort =
    raw.sort === "price-asc" ||
    raw.sort === "price-desc" ||
    raw.sort === "newest" ||
    raw.sort === "featured"
      ? raw.sort
      : undefined;
  return cleanSearch({
    city: typeof raw.city === "string" ? raw.city : undefined,
    max: num(raw.max),
    beds: num(raw.beds),
    baths: num(raw.baths),
    pets: raw.pets === true || raw.pets === "true" || raw.pets === "1",
    type,
    sort,
  });
}
