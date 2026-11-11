import { getRouteApi } from "@tanstack/react-router";
import type { SiteSettings } from "@/lib/catalog.functions";
import { useI18n } from "@/lib/i18n";
import { listings as samples } from "@/lib/listings";

const rootRoute = getRouteApi("__root__");

export function useCatalog() {
  const data = rootRoute.useLoaderData();
  return {
    listings: data.listings ?? samples,
    usingSamples: data.listings == null,
    settings: (data.settings ?? null) as SiteSettings | null,
  };
}

export function useHeroCopy() {
  const { settings } = useCatalog();
  const { t, lang } = useI18n();
  const pick = (value: string | undefined, fallback: string) => (value && value.trim() ? value : fallback);
  return {
    kicker: pick(settings?.heroKicker[lang], t.hero.kicker),
    title: pick(settings?.heroTitle[lang], t.hero.title),
    sub: pick(settings?.heroSub[lang], t.hero.sub),
  };
}

export function useContactInfo() {
  const { settings } = useCatalog();
  const { t, lang } = useI18n();
  const phone = settings?.phone?.trim() || "(323) 555-0198";
  const email = settings?.email?.trim() || "rentals@harborhomes.example";
  const hours = settings?.hours[lang]?.trim() || t.hours;
  return {
    phone,
    email,
    hours,
    phoneHref: `tel:${phone.replace(/[^\d+]/g, "")}`,
    emailHref: `mailto:${email}`,
  };
}
