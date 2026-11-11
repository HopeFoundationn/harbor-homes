import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { SearchForm } from "@/components/search-form";
import { ListingCard } from "@/components/listing-card";
import { useCatalog, useHeroCopy } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { cityOptions } from "@/lib/listings";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { t } = useI18n();
  const hero = useHeroCopy();
  const { listings, usingSamples } = useCatalog();
  const featured = listings.filter((listing) => listing.featured);
  const cities = cityOptions(listings);

  useEffect(() => {
    document.title = t.metaHome;
  }, [t.metaHome]);

  return (
    <main>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
          <p className="rise text-sm font-semibold text-primary">{hero.kicker}</p>
          <h1 className="rise rise-d1 mt-2 max-w-3xl text-4xl font-semibold text-ink lg:text-5xl">{hero.title}</h1>
          <p className="rise rise-d2 mt-3 max-w-2xl text-lg text-muted">{hero.sub}</p>
          <div className="rise rise-d3 mt-6">
            <SearchForm />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-xl font-semibold text-ink">{t.citiesTitle}</h2>
        <ul className="rise-list mt-4 flex gap-3 overflow-x-auto pb-2">
          {cities.map((city) => {
            const photo = listings.find((listing) => listing.city === city.city)?.photos[0];
            return (
              <li key={city.city} className="shrink-0">
                <Link
                  to="/search"
                  search={{ city: city.city }}
                  className="group relative block h-36 w-44 overflow-hidden rounded-lg"
                >
                  {photo ? (
                    <img src={photo} alt="" className="photo-zoom h-full w-full object-cover" />
                  ) : null}
                  <span className="absolute inset-x-0 bottom-0 bg-ink/70 px-3 py-2 text-sm font-semibold text-surface">
                    {city.city}, {city.state}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-ink">{t.featured}</h2>
            <p className="mt-1 text-sm text-muted">{usingSamples ? t.sample : t.featuredLead}</p>
          </div>
          <Link to="/search" className="hidden h-11 items-center text-sm font-semibold text-primary sm:inline-flex">
            {t.seeAll}
          </Link>
        </div>
        <div className="rise-list mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-px px-4 py-8 sm:grid-cols-3">
        <Stat value={String(listings.length)} label={t.stats.homes} />
        <Stat value={String(cities.length)} label={t.stats.cities} />
        <Stat value={t.stats.replyValue} label={t.stats.reply} />
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface px-4 py-5">
      <p className="text-3xl font-semibold tabular-nums text-ink">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
