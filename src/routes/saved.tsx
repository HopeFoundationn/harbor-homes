import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ListingCard } from "@/components/listing-card";
import { useCatalog } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { useSaved } from "@/lib/saved";

export const Route = createFileRoute("/saved")({ component: SavedPage });

function SavedPage() {
  const { t } = useI18n();
  const ids = useSaved((state) => state.ids);
  const hydrated = useSaved((state) => state.hydrated);
  const { listings } = useCatalog();
  const saved = listings.filter((listing) => ids.includes(listing.id));

  useEffect(() => {
    document.title = t.savedTitle;
  }, [t.savedTitle]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-semibold text-ink">{t.savedTitle}</h1>
      <p className="mt-2 text-muted">{t.savedLead}</p>
      {!hydrated ? null : saved.length === 0 ? (
        <div className="mt-8 rounded-lg border border-line bg-surface p-8">
          <p className="text-ink">{t.savedEmpty}</p>
          <Link to="/search" className="mt-4 inline-flex h-11 items-center font-semibold text-primary">
            {t.browse}
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
