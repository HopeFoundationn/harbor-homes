import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cityOptions } from "@/lib/listings";
import { useCatalog, useContactInfo } from "@/lib/catalog";
import { fill, useI18n } from "@/lib/i18n";
import { useSaved } from "@/lib/saved";
import { UserButton } from "@/lib/auth/gates";

const PHONE = "(323) 555-0198";
const EMAIL = "rentals@harborhomes.example";

export function phoneHref(phone = PHONE) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function emailHref(email = EMAIL) {
  return `mailto:${email}`;
}

export function contactEmail() {
  return EMAIL;
}

export function contactPhone() {
  return PHONE;
}

const links = [
  { to: "/search", key: "rentals" },
  { to: "/saved", key: "saved" },
  { to: "/renting", key: "renting" },
  { to: "/contact", key: "contact" },
  { to: "/panel", key: "panel" },
] as const;

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const savedCount = useSaved((state) => state.ids.length);
  const hydrated = useSaved((state) => state.hydrated);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-surface focus:px-3 focus:py-2 focus:text-ink"
      >
        {t.skip}
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 text-ink">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary">
            H
          </span>
          <span className="text-lg font-semibold tracking-tight text-primary">
            harbor<span className="font-medium text-ink">.homes</span>
          </span>
        </Link>
        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Principal">
          {links.map((link) => {
            const active =
              link.to === "/search"
                ? pathname === "/search" || pathname.startsWith("/homes")
                : pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={
                  "inline-flex h-11 items-center border-b-2 px-3 text-sm font-semibold transition-colors duration-200 " +
                  (active ? "border-primary text-primary" : "border-transparent text-ink hover:text-primary")
                }
              >
                {t.nav[link.key]}
                {link.key === "saved" && hydrated && savedCount > 0 ? (
                  <span className="ml-2 rounded-md bg-primary px-1.5 text-xs text-on-primary tabular-nums">
                    {savedCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="hidden lg:block">
          <UserButton />
        </div>
        <LangSwitch lang={lang} setLang={setLang} />
        <button
          type="button"
          className="press inline-flex size-11 items-center justify-center rounded-md border border-line text-ink lg:hidden"
          aria-expanded={open}
          aria-label={open ? t.nav.close : t.nav.menu}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open ? (
        <nav className="menu-in border-t border-line bg-surface px-4 py-3 lg:hidden" aria-label="Principal">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex h-12 items-center justify-between border-b border-line text-lg font-semibold text-ink"
            >
              {t.nav[link.key]}
              {link.key === "saved" && hydrated && savedCount > 0 ? (
                <span className="text-sm text-primary tabular-nums">{savedCount}</span>
              ) : null}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

function LangSwitch({ lang, setLang }: { lang: "es" | "en"; setLang: (lang: "es" | "en") => void }) {
  return (
    <div className="ml-auto flex rounded-md border border-line p-0.5 lg:ml-2" role="group" aria-label="Language">
      {(["es", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          className={
            "h-10 min-w-11 rounded-full px-2 text-sm font-semibold uppercase transition-colors duration-200 " +
            (lang === code ? "bg-primary text-on-primary" : "text-muted")
          }
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  const { listings } = useCatalog();
  const cities = cityOptions(listings);
  const contact = useContactInfo();
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-primary">
            harbor<span className="text-ink">.homes</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-muted">{t.rights}</p>
          <p className="mt-4 text-sm text-muted">{t.footerNote}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{t.citiesTitle}</p>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {cities.map((city) => (
              <li key={city.city}>
                <Link
                  to="/search"
                  search={{ city: city.city }}
                  className="text-sm text-muted hover:text-primary"
                >
                  {city.city}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{t.nav.contact}</p>
          <a href={contact.phoneHref} className="mt-3 block text-sm text-ink hover:text-primary">
            {contact.phone}
          </a>
          <a href={contact.emailHref} className="mt-1 block text-sm text-ink hover:text-primary">
            {contact.email}
          </a>
          <p className="mt-3 text-sm text-muted">{contact.hours}</p>
        </div>
      </div>
    </footer>
  );
}

export function CountLabel({ count }: { count: number }) {
  const { t } = useI18n();
  return <>{count === 1 ? t.countOne : fill(t.count, count)}</>;
}
