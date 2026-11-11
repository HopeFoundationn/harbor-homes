import type { Lang } from "@/lib/i18n";

export function money(value: number, lang: Lang) {
  return new Intl.NumberFormat(lang === "es" ? "es-US" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso: string, lang: Lang) {
  const date = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat(lang === "es" ? "es-US" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function sqft(value: number, lang: Lang) {
  const n = new Intl.NumberFormat(lang === "es" ? "es-US" : "en-US").format(value);
  return lang === "es" ? `${n} pies²` : `${n} sqft`;
}
