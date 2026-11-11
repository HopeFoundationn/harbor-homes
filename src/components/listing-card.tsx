import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { money, sqft } from "@/lib/format";
import { fill, useI18n } from "@/lib/i18n";
import type { Listing } from "@/lib/listings";
import { useSaved } from "@/lib/saved";

export function ListingCard({ listing }: { listing: Listing }) {
  const { t, lang } = useI18n();
  const hydrated = useSaved((state) => state.hydrated);
  const saved = useSaved((state) => state.ids.includes(listing.id));
  const toggle = useSaved((state) => state.toggle);
  const on = hydrated && saved;
  const alt =
    lang === "es"
      ? `Casa en ${listing.neighborhood}, ${listing.city}`
      : `Home in ${listing.neighborhood}, ${listing.city}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-card transition-shadow duration-200 hover:shadow-card">
      <Link to="/homes/$homeId" params={{ homeId: listing.id }} className="flex flex-1 flex-col">
        <div className="overflow-hidden">
          <img src={listing.photos[0]} alt={alt} className="photo-zoom aspect-photo w-full object-cover" />
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3">
          <p className="text-xl font-semibold tabular-nums text-ink">
            {money(listing.price, lang)}
            <span className="text-sm font-medium text-muted">{t.perMonth}</span>
          </p>
          <p className="text-sm text-ink">
            <span className="font-semibold">{fill(t.bedShort, listing.beds)}</span>
            <span className="px-1.5 text-muted">|</span>
            <span className="font-semibold">{fill(t.bathShort, listing.baths)}</span>
            <span className="px-1.5 text-muted">|</span>
            <span className="font-semibold">{sqft(listing.sqft, lang)}</span>
          </p>
          <p className="truncate text-sm text-muted">
            {listing.address}, {listing.city}, {listing.state} {listing.zip}
          </p>
          <p className="text-sm text-muted">
            {listing.type === "house" ? t.forRent : t.townhouse}
            {listing.pets ? ` · ${t.petsBadge}` : ""}
          </p>
        </div>
      </Link>
      <button
        type="button"
        aria-pressed={on}
        aria-label={on ? t.saved : t.save}
        onClick={() => toggle(listing.id)}
        className="press absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-full bg-surface text-ink shadow-card"
      >
        <span className="relative grid size-5 place-items-center">
          <Heart
            className={
              "col-start-1 row-start-1 size-5 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] " +
              (on ? "scale-100 fill-primary text-primary opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]")
            }
          />
          <Heart
            className={
              "col-start-1 row-start-1 size-5 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] " +
              (on ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none")
            }
          />
        </span>
      </button>
    </article>
  );
}
