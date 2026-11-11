import { createFileRoute, Link } from "@tanstack/react-router";
import { Bath, BedDouble, Check, Heart, MapPin, Ruler } from "lucide-react";
import { useEffect, useState } from "react";
import { TourForm } from "@/components/tour-form";
import { ListingCard } from "@/components/listing-card";
import { useCatalog } from "@/lib/catalog";
import { getPublicHome } from "@/lib/catalog.functions";
import { formatDate, money, sqft } from "@/lib/format";
import { fill, useI18n } from "@/lib/i18n";
import { getListing, similarListings, type Listing } from "@/lib/listings";
import { useSaved } from "@/lib/saved";

export const Route = createFileRoute("/homes/$homeId")({ component: HomeDetail });

function HomeDetail() {
  const { homeId } = Route.useParams();
  const { listings, usingSamples } = useCatalog();
  const base = getListing(homeId, listings);
  const [extra, setExtra] = useState<Listing | null>(null);
  const listing = extra ?? base;
  const { t, lang } = useI18n();
  const [photo, setPhoto] = useState(0);
  const hydrated = useSaved((state) => state.hydrated);
  const saved = useSaved((state) => (listing ? state.ids.includes(listing.id) : false));
  const toggle = useSaved((state) => state.toggle);

  useEffect(() => {
    setPhoto(0);
    setExtra(null);
  }, [homeId]);

  useEffect(() => {
    if (usingSamples) return;
    let cancel = false;
    getPublicHome({ data: homeId })
      .then((home) => {
        if (!cancel && home) setExtra(home);
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [homeId, usingSamples]);

  useEffect(() => {
    if (listing) {
      document.title = `${listing.neighborhood}, ${listing.city} — Harbor Homes`;
    }
  }, [listing]);

  if (!listing) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-ink">{t.missingTitle}</h1>
        <p className="mt-2 text-muted">{t.missingBody}</p>
        <Link to="/search" className="mt-6 inline-flex h-11 items-center font-semibold text-primary">
          {t.back}
        </Link>
      </main>
    );
  }

  const alt =
    lang === "es"
      ? `Casa en ${listing.neighborhood}, ${listing.city}`
      : `Home in ${listing.neighborhood}, ${listing.city}`;
  const parking =
    listing.parking === 0
      ? t.parkingNone
      : lang === "es"
        ? `${listing.parking} ${listing.parking === 1 ? "espacio" : "espacios"}`
        : `${listing.parking} ${listing.parking === 1 ? "space" : "spaces"}`;
  const pad = 0.02;
  const bbox = `${listing.lng - pad},${listing.lat - pad * 0.7},${listing.lng + pad},${listing.lat + pad * 0.7}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${listing.lat}%2C${listing.lng}`;
  const mapHref = `https://www.openstreetmap.org/?mlat=${listing.lat}&mlon=${listing.lng}#map=15/${listing.lat}/${listing.lng}`;
  const related = similarListings(listing.id, listings);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Link to="/search" search={{ city: listing.city }} className="text-sm font-semibold text-primary">
        {t.back}
      </Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <img
            key={photo}
            src={listing.photos[photo]}
            alt={alt}
            className="rise aspect-photo w-full rounded-lg object-cover"
          />
          {listing.photos.length > 1 ? (
            <div className="mt-3 flex gap-2">
              {listing.photos.map((src, index) => (
                <button
                  key={src + index}
                  type="button"
                  aria-label={`${index + 1}`}
                  onClick={() => setPhoto(index)}
                  className={
                    "h-16 w-24 overflow-hidden rounded-md border-2 " +
                    (photo === index ? "border-primary" : "border-transparent")
                  }
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">{t.listedBy}</p>
              <h1 className="mt-1 text-3xl font-semibold text-ink">
                {listing.neighborhood}
                <span className="block text-lg font-medium text-muted">
                  {listing.address}, {listing.city}, {listing.state} {listing.zip}
                </span>
              </h1>
            </div>
            <button
              type="button"
              aria-pressed={hydrated && saved}
              onClick={() => toggle(listing.id)}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm font-semibold text-ink"
            >
              <Heart className={hydrated && saved ? "size-4 fill-primary text-primary" : "size-4"} />
              {hydrated && saved ? t.saved : t.save}
            </button>
          </div>

          <p className="mt-4 text-3xl font-semibold tabular-nums text-ink">
            {money(listing.price, lang)}
            <span className="text-base font-medium text-muted">{t.perMonth}</span>
          </p>
          <ul className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
            <li className="inline-flex items-center gap-1">
              <BedDouble className="size-4" aria-hidden="true" />
              {fill(t.bedShort, listing.beds)}
            </li>
            <li className="inline-flex items-center gap-1">
              <Bath className="size-4" aria-hidden="true" />
              {fill(t.bathShort, listing.baths)}
            </li>
            <li className="inline-flex items-center gap-1">
              <Ruler className="size-4" aria-hidden="true" />
              {sqft(listing.sqft, lang)}
            </li>
            <li>{listing.type === "house" ? t.house : t.townhouse}</li>
          </ul>

          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Fact label={t.available} value={formatDate(listing.available, lang)} />
            <Fact label={t.deposit} value={money(listing.deposit, lang)} />
            <Fact label={t.lease} value={t.leaseValue} />
            <Fact label={t.year} value={String(listing.year)} />
            <Fact label={t.parking} value={parking} />
            <Fact label={t.laundry} value={listing.laundry === "in-unit" ? t.inUnit : t.hookups} />
            <Fact label={t.utilities} value={t.utilitiesValue} />
            <Fact label={t.pets} value={listing.pets ? t.petsBadge : "—"} />
          </dl>

          <h2 className="mt-8 text-xl font-semibold text-ink">{t.about}</h2>
          <p className="mt-2 max-w-2xl text-ink">{listing.blurb[lang]}</p>

          <h2 className="mt-8 text-xl font-semibold text-ink">{t.amenities}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {listing.amenities.map((key) => (
              <li key={key} className="inline-flex items-center gap-2 text-sm text-ink">
                <Check className="size-4 text-primary" aria-hidden="true" />
                {t.amenity[key]}
              </li>
            ))}
          </ul>

          <h2 className="mt-8 inline-flex items-center gap-2 text-xl font-semibold text-ink">
            <MapPin className="size-5 text-primary" aria-hidden="true" />
            {t.map}
          </h2>
          <iframe
            title={listing.address}
            src={mapSrc}
            className="mt-3 h-72 w-full rounded-lg border border-line"
            loading="lazy"
          />
          <a href={mapHref} target="_blank" rel="noreferrer" className="mt-2 inline-flex h-11 items-center text-sm font-semibold text-primary">
            {t.mapOpen}
          </a>

          <div className="mt-8 lg:hidden">
            <TourForm />
          </div>
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TourForm />
          </div>
        </aside>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-ink">{t.similar}</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-surface px-3 py-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}
