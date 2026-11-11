import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ListingCard } from "@/components/listing-card";
import { CountLabel } from "@/components/chrome";
import { SearchForm } from "@/components/search-form";
import { useCatalog } from "@/lib/catalog";
import { fill, useI18n } from "@/lib/i18n";
import { filterListings, type Listing } from "@/lib/listings";
import { cleanSearch, parseSearch, type HomeType, type ListingSearch, type SortKey } from "@/lib/search";

export const Route = createFileRoute("/search")({
  validateSearch: (search) => parseSearch(search),
  component: SearchPage,
});

function SearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const { listings } = useCatalog();
  const results = filterListings(search, listings);

  useEffect(() => {
    document.title = t.results;
  }, [t.results]);

  function update(partial: ListingSearch) {
    void navigate({
      search: (prev) => cleanSearch({ ...prev, ...partial }),
    });
  }

  const select = "h-11 w-full rounded-full border border-line bg-surface px-3 text-base text-ink";

  return (
    <main>
      <div className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <SearchForm key={`${search.city ?? ""}-${search.max ?? ""}-${search.beds ?? ""}`} initial={search} />
        </div>
      </div>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(20rem,38%)]">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-semibold text-ink">{t.results}</h1>
          <p className="mt-1 text-sm text-muted">
            <CountLabel count={results.length} />
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              className="press inline-flex h-11 items-center rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink lg:hidden"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? t.hideFilters : t.filters}
            </button>
            <label className="ml-auto hidden text-sm font-semibold text-ink lg:block">
              <span className="sr-only">{t.sort}</span>
              <SortSelect value={search.sort ?? "featured"} onChange={(sort) => update({ sort })} />
            </label>
          </div>

          <div className={(open ? "mt-3 grid" : "hidden") + " gap-3 lg:mt-4 lg:grid lg:grid-cols-2"}>
            <label className="text-sm font-semibold text-ink">
              {t.baths}
              <select
                className={"mt-1 " + select}
                value={search.baths ?? ""}
                onChange={(event) => update({ baths: event.target.value ? Number(event.target.value) : undefined })}
              >
                <option value="">{t.search.any}</option>
                {[1, 2, 3].map((value) => (
                  <option key={value} value={value}>
                    {fill(t.bathsPlus, value)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-ink">
              {t.type}
              <select
                className={"mt-1 " + select}
                value={search.type ?? ""}
                onChange={(event) =>
                  update({ type: event.target.value ? (event.target.value as HomeType) : undefined })
                }
              >
                <option value="">{t.search.any}</option>
                <option value="house">{t.house}</option>
                <option value="townhouse">{t.townhouse}</option>
              </select>
            </label>
            <label className="inline-flex h-11 items-center gap-2 self-end text-sm font-semibold text-ink">
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={Boolean(search.pets)}
                onChange={(event) => update({ pets: event.target.checked || undefined })}
              />
              {t.pets}
            </label>
            <label className="text-sm font-semibold text-ink lg:hidden">
              {t.sort}
              <SortSelect value={search.sort ?? "featured"} onChange={(sort) => update({ sort })} />
            </label>
          </div>

          {results.length === 0 ? (
            <div className="mt-8 rounded-lg border border-line bg-surface p-8 text-center">
              <h2 className="text-xl font-semibold text-ink">{t.emptyTitle}</h2>
              <p className="mt-2 text-muted">{t.emptyBody}</p>
              <button
                type="button"
                className="press mt-4 inline-flex h-11 items-center rounded-full bg-primary px-5 font-semibold text-on-primary"
                onClick={() => void navigate({ search: {} })}
              >
                {t.clear}
              </button>
            </div>
          ) : (
            <div className="rise-list mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {results.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
        <aside className="hidden border-l border-line lg:block">
          <div className="sticky top-16">
            <ResultsMap listings={results} />
          </div>
        </aside>
      </div>
    </main>
  );
}

function ResultsMap({ listings }: { listings: Listing[] }) {
  const { t } = useI18n();
  if (listings.length === 0) {
    return <div className="map-pane bg-canvas" />;
  }
  const minLat = Math.min(...listings.map((item) => item.lat)) - 0.08;
  const maxLat = Math.max(...listings.map((item) => item.lat)) + 0.08;
  const minLng = Math.min(...listings.map((item) => item.lng)) - 0.08;
  const maxLng = Math.max(...listings.map((item) => item.lng)) + 0.08;
  const lat = listings.reduce((sum, item) => sum + item.lat, 0) / listings.length;
  const lng = listings.reduce((sum, item) => sum + item.lng, 0) / listings.length;
  const bbox = `${minLng},${minLat},${maxLng},${maxLat}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`;
  return <iframe title={t.map} src={src} className="map-pane w-full border-0" loading="lazy" />;
}

function SortSelect({ value, onChange }: { value: SortKey; onChange: (sort: SortKey) => void }) {
  const { t } = useI18n();
  return (
    <select
      className="mt-1 h-11 w-full rounded-full border border-line bg-surface px-3 text-base font-medium text-ink lg:mt-0 lg:w-56"
      value={value}
      onChange={(event) => onChange(event.target.value as SortKey)}
    >
      <option value="featured">{t.sortFeatured}</option>
      <option value="price-asc">{t.sortAsc}</option>
      <option value="price-desc">{t.sortDesc}</option>
      <option value="newest">{t.sortNew}</option>
    </select>
  );
}