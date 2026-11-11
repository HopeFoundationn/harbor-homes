import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCatalog } from "@/lib/catalog";
import { useI18n, fill } from "@/lib/i18n";
import { cityOptions } from "@/lib/listings";
import { cleanSearch, type ListingSearch } from "@/lib/search";

const MAXES = [2500, 3000, 3500, 4000, 5000, 7000];
const BEDS = [1, 2, 3, 4];

export function SearchForm({ initial }: { initial?: ListingSearch }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const cities = cityOptions(useCatalog().listings);
  const [city, setCity] = useState(initial?.city ?? "");
  const [max, setMax] = useState(initial?.max ? String(initial.max) : "");
  const [beds, setBeds] = useState(initial?.beds ? String(initial.beds) : "");

  return (
    <form
      className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-2 shadow-card sm:flex-row sm:items-center sm:rounded-full sm:pl-4"
      onSubmit={(event) => {
        event.preventDefault();
        void navigate({
          to: "/search",
          search: cleanSearch({
            ...initial,
            city: city || undefined,
            max: max ? Number(max) : undefined,
            beds: beds ? Number(beds) : undefined,
          }),
        });
      }}
    >
      <label className="min-w-0 flex-1 text-sm font-semibold text-ink">
        <span className="sr-only">{t.search.city}</span>
        <select
          value={city}
          onChange={(event) => setCity(event.target.value)}
          className="h-11 w-full rounded-full bg-surface px-3 text-base font-medium text-ink outline-none"
        >
          <option value="">{t.search.all}</option>
          {cities.map((item) => (
            <option key={item.city} value={item.city}>
              {item.city}, {item.state}
            </option>
          ))}
        </select>
      </label>
      <label className="min-w-0 flex-1 border-line text-sm font-semibold text-ink sm:border-l">
        <span className="sr-only">{t.search.max}</span>
        <select
          value={max}
          onChange={(event) => setMax(event.target.value)}
          className="h-11 w-full rounded-full bg-surface px-3 text-base font-medium text-ink outline-none"
        >
          <option value="">{t.search.max}</option>
          {MAXES.map((value) => (
            <option key={value} value={value}>
              ${value.toLocaleString("en-US")}
            </option>
          ))}
        </select>
      </label>
      <label className="min-w-0 flex-1 border-line text-sm font-semibold text-ink sm:border-l">
        <span className="sr-only">{t.search.beds}</span>
        <select
          value={beds}
          onChange={(event) => setBeds(event.target.value)}
          className="h-11 w-full rounded-full bg-surface px-3 text-base font-medium text-ink outline-none"
        >
          <option value="">{t.search.beds}</option>
          {BEDS.map((value) => (
            <option key={value} value={value}>
              {fill(t.search.bedsPlus, value)}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="press h-11 shrink-0 rounded-full bg-primary px-6 text-base font-semibold text-on-primary"
      >
        {t.search.submit}
      </button>
    </form>
  );
}
