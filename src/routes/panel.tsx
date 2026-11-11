import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { SignInGate } from "@/lib/auth/gates";
import {
  deleteListing,
  getAdminState,
  importSamples,
  saveListing,
  saveSettings,
  type ListingInput,
  type SiteSettings,
} from "@/lib/catalog.functions";
import { useI18n } from "@/lib/i18n";
import type { Amenity, Listing } from "@/lib/listings";
import { money } from "@/lib/format";

export const Route = createFileRoute("/panel")({ component: PanelGate });

const AMENITIES: Amenity[] = [
  "yard",
  "porch",
  "hardwood",
  "ac",
  "heat",
  "fireplace",
  "updated-kitchen",
  "dishwasher",
  "fenced",
  "garage",
  "patio",
  "laundry",
];

function PanelGate() {
  const { lang } = useI18n();
  return (
    <SignInGate
      fallback={
        <main className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 py-16">
          <div className="w-full rounded-lg border border-line bg-surface p-6 shadow-card">
            <h1 className="text-2xl font-semibold text-ink">
              {lang === "es" ? "Entra para editar" : "Sign in to edit"}
            </h1>
            <p className="mt-2 text-muted">
              {lang === "es"
                ? "Este panel no es público. Aquí cambias casas, precios y la portada."
                : "This panel is not public. Change homes, prices, and the homepage here."}
            </p>
            <div className="mt-6 grid gap-2">
              {authEnabled
                ? GROK_PROVIDERS.map((provider) => (
                    <button
                      key={provider.providerId}
                      type="button"
                      onClick={() => signIn(provider.providerId, { callbackURL: "/panel" })}
                      className="press h-11 rounded-full bg-primary px-4 text-sm font-semibold text-on-primary"
                    >
                      {lang === "es" ? "Continuar con" : "Continue with"} {provider.label}
                    </button>
                  ))
                : null}
            </div>
          </div>
        </main>
      }
    >
      <Panel />
    </SignInGate>
  );
}

function blank(): ListingInput {
  return {
    address: "",
    neighborhood: "",
    city: "",
    state: "",
    zip: "",
    price: 2500,
    beds: 3,
    baths: 2,
    sqft: 1400,
    type: "house",
    pets: false,
    deposit: 2500,
    available: new Date().toISOString().slice(0, 10),
    year: 1995,
    parking: 1,
    laundry: "in-unit",
    featured: false,
    amenities: [],
    blurbEs: "",
    blurbEn: "",
    photos: [],
  };
}

function fromListing(listing: Listing): ListingInput {
  return {
    id: listing.id,
    address: listing.address,
    neighborhood: listing.neighborhood,
    city: listing.city,
    state: listing.state,
    zip: listing.zip,
    price: listing.price,
    beds: listing.beds,
    baths: listing.baths,
    sqft: listing.sqft,
    type: listing.type,
    pets: listing.pets,
    deposit: listing.deposit,
    available: listing.available,
    year: listing.year,
    parking: listing.parking,
    laundry: listing.laundry,
    featured: listing.featured,
    amenities: listing.amenities,
    blurbEs: listing.blurb.es,
    blurbEn: listing.blurb.en,
    photos: listing.photos,
  };
}

function Panel() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const es = lang === "es";
  const [tab, setTab] = useState<"homes" | "page">("homes");
  const [ready, setReady] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [homes, setHomes] = useState<Listing[]>([]);
  const [draft, setDraft] = useState<ListingInput | null>(null);
  const [settings, setSettings] = useState<SiteSettings>({
    heroKicker: {
      es: "Alquiler mensual en Estados Unidos",
      en: "Monthly rentals across the United States",
    },
    heroTitle: {
      es: "Casas para vivir, publicadas por nosotros.",
      en: "Houses to live in, listed by us.",
    },
    heroSub: {
      es: "Un solo inventario. Buscas, visitas y firmas directo con Harbor Homes. Contrato de 12 meses.",
      en: "One inventory. Search, tour, and sign directly with Harbor Homes. Twelve-month lease.",
    },
    phone: "(323) 555-0198",
    email: "rentals@harborhomes.example",
    hours: {
      es: "Lunes a viernes, 9:00–18:00. Sábados, 10:00–14:00.",
      en: "Monday–Friday, 9:00–6:00. Saturdays, 10:00–2:00.",
    },
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function load() {
    const state = await getAdminState();
    setForbidden(state.forbidden);
    setHomes(state.listings);
    if (state.settings) {
      setSettings(state.settings);
    } else {
      setSettings({
        heroKicker: { es: t.hero.kicker, en: "Monthly rentals across the United States" },
        heroTitle: { es: t.hero.title, en: "Houses to live in, listed by us." },
        heroSub: {
          es: t.hero.sub,
          en: "One inventory. Search, tour, and sign directly with Harbor Homes. Twelve-month lease.",
        },
        phone: "(323) 555-0198",
        email: "rentals@harborhomes.example",
        hours: {
          es: "Lunes a viernes, 9:00–18:00. Sábados, 10:00–14:00.",
          en: "Monday–Friday, 9:00–6:00. Saturdays, 10:00–2:00.",
        },
      });
    }
    setReady(true);
  }

  useEffect(() => {
    let cancel = false;
    getAdminState()
      .then((state) => {
        if (cancel) return;
        setForbidden(state.forbidden);
        setHomes(state.listings);
        if (state.settings) setSettings(state.settings);
        setReady(true);
      })
      .catch(() => {
        if (!cancel) {
          setError(es ? "No se pudo abrir el panel." : "The panel could not be opened.");
          setReady(true);
        }
      });
    return () => {
      cancel = true;
    };
  }, []);

  async function refreshPublic() {
    await router.invalidate();
  }

  async function onSaveHome() {
    if (!draft) return;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const saved = await saveListing({ data: draft });
      setHomes((current) => {
        const next = current.filter((item) => item.id !== saved.id);
        return [saved, ...next];
      });
      setDraft(fromListing(saved));
      setStatus(es ? "Casa guardada. Ya se ve en el sitio." : "Home saved. It is live on the site.");
      await refreshPublic();
    } catch {
      setError(es ? "Revisa precio, dirección, estado (2 letras) y al menos una foto." : "Check price, address, a 2-letter state, and at least one photo.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!draft?.id) return;
    setBusy(true);
    setError("");
    try {
      await deleteListing({ data: draft.id });
      setHomes((current) => current.filter((item) => item.id !== draft.id));
      setDraft(null);
      setConfirmDelete(false);
      setStatus(es ? "Casa borrada." : "Home deleted.");
      await refreshPublic();
    } catch {
      setError(es ? "No se pudo borrar." : "Could not delete.");
    } finally {
      setBusy(false);
    }
  }

  async function onImport() {
    setBusy(true);
    setError("");
    try {
      await importSamples();
      await load();
      setStatus(es ? "Casas de ejemplo cargadas. Puedes editarlas." : "Sample homes loaded. You can edit them.");
      await refreshPublic();
    } catch {
      setError(es ? "No se pudieron cargar los ejemplos." : "Could not load the samples.");
    } finally {
      setBusy(false);
    }
  }

  async function onSavePage() {
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const saved = await saveSettings({ data: settings });
      setSettings(saved);
      setStatus(es ? "Textos guardados." : "Page text saved.");
      await refreshPublic();
    } catch {
      setError(es ? "Revisa el correo. Tiene que verse como nombre@correo.com." : "Check the email address.");
    } finally {
      setBusy(false);
    }
  }

  async function addPhotos(files: FileList | null) {
    if (!draft || !files) return;
    const room = 6 - draft.photos.length;
    const next = [...draft.photos];
    for (const file of [...files].slice(0, room)) {
      const data = await compressImage(file);
      if (data.length >= 450_000) {
        setError(es ? "Una foto sigue muy pesada. Elige otra." : "One photo is still too large. Pick another.");
        continue;
      }
      next.push(data);
    }
    setDraft({ ...draft, photos: next });
  }

  if (!ready) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-muted">{es ? "Abriendo el panel…" : "Opening the panel…"}</p>
      </main>
    );
  }

  if (forbidden) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <h1 className="text-2xl font-semibold text-ink">{es ? "Panel ocupado" : "Panel already claimed"}</h1>
        <p className="mt-2 text-muted">
          {es
            ? "Este sitio ya tiene un administrador. Entra con esa cuenta para cambiar casas y precios."
            : "This site already has an administrator. Sign in with that account to edit."}
        </p>
      </main>
    );
  }

  const field = "mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-base text-ink";

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-sm font-semibold text-primary">{es ? "Solo lo ves tú" : "Only you see this"}</p>
      <h1 className="mt-1 text-3xl font-semibold text-ink">{es ? "Panel de Harbor Homes" : "Harbor Homes panel"}</h1>
      <p className="mt-2 max-w-2xl text-muted">
        {es
          ? "Cambia precios, fotos, características y el texto de la portada. Al guardar, el sitio público se actualiza."
          : "Change prices, photos, features, and the homepage text. Saving updates the public site."}
      </p>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("homes")}
          className={
            "press h-11 rounded-full px-4 text-sm font-semibold " +
            (tab === "homes" ? "bg-primary text-on-primary" : "border border-line bg-surface text-ink")
          }
        >
          {es ? "Casas" : "Homes"}
        </button>
        <button
          type="button"
          onClick={() => setTab("page")}
          className={
            "press h-11 rounded-full px-4 text-sm font-semibold " +
            (tab === "page" ? "bg-primary text-on-primary" : "border border-line bg-surface text-ink")
          }
        >
          {es ? "Portada y contacto" : "Homepage and contact"}
        </button>
      </div>

      {status ? <p className="mt-4 text-sm font-semibold text-ink">{status}</p> : null}
      {error ? <p className="mt-4 text-sm font-semibold text-primary">{error}</p> : null}

      {tab === "page" ? (
        <form
          className="mt-6 grid gap-4 rounded-lg border border-line bg-surface p-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            void onSavePage();
          }}
        >
          <label className="text-sm font-semibold text-ink">
            {es ? "Línea corta, español" : "Short line, Spanish"}
            <input className={field} value={settings.heroKicker.es} onChange={(event) => setSettings({ ...settings, heroKicker: { ...settings.heroKicker, es: event.target.value } })} />
          </label>
          <label className="text-sm font-semibold text-ink">
            {es ? "Línea corta, inglés" : "Short line, English"}
            <input className={field} value={settings.heroKicker.en} onChange={(event) => setSettings({ ...settings, heroKicker: { ...settings.heroKicker, en: event.target.value } })} />
          </label>
          <label className="text-sm font-semibold text-ink sm:col-span-2">
            {es ? "Título, español" : "Title, Spanish"}
            <input className={field} value={settings.heroTitle.es} onChange={(event) => setSettings({ ...settings, heroTitle: { ...settings.heroTitle, es: event.target.value } })} />
          </label>
          <label className="text-sm font-semibold text-ink sm:col-span-2">
            {es ? "Título, inglés" : "Title, English"}
            <input className={field} value={settings.heroTitle.en} onChange={(event) => setSettings({ ...settings, heroTitle: { ...settings.heroTitle, en: event.target.value } })} />
          </label>
          <label className="text-sm font-semibold text-ink sm:col-span-2">
            {es ? "Subtítulo, español" : "Subtitle, Spanish"}
            <textarea className="mt-1 min-h-24 w-full rounded-md border border-line bg-surface px-3 py-2 text-base text-ink" value={settings.heroSub.es} onChange={(event) => setSettings({ ...settings, heroSub: { ...settings.heroSub, es: event.target.value } })} />
          </label>
          <label className="text-sm font-semibold text-ink sm:col-span-2">
            {es ? "Subtítulo, inglés" : "Subtitle, English"}
            <textarea className="mt-1 min-h-24 w-full rounded-md border border-line bg-surface px-3 py-2 text-base text-ink" value={settings.heroSub.en} onChange={(event) => setSettings({ ...settings, heroSub: { ...settings.heroSub, en: event.target.value } })} />
          </label>
          <label className="text-sm font-semibold text-ink">
            {t.phoneLabel}
            <input className={field} value={settings.phone} onChange={(event) => setSettings({ ...settings, phone: event.target.value })} />
          </label>
          <label className="text-sm font-semibold text-ink">
            {t.emailLabel}
            <input className={field} type="email" value={settings.email} onChange={(event) => setSettings({ ...settings, email: event.target.value })} />
          </label>
          <label className="text-sm font-semibold text-ink sm:col-span-2">
            {es ? "Horario, español" : "Hours, Spanish"}
            <input className={field} value={settings.hours.es} onChange={(event) => setSettings({ ...settings, hours: { ...settings.hours, es: event.target.value } })} />
          </label>
          <label className="text-sm font-semibold text-ink sm:col-span-2">
            {es ? "Horario, inglés" : "Hours, English"}
            <input className={field} value={settings.hours.en} onChange={(event) => setSettings({ ...settings, hours: { ...settings.hours, en: event.target.value } })} />
          </label>
          <div>
            <button type="submit" disabled={busy} className="press h-11 rounded-full bg-primary px-5 font-semibold text-on-primary disabled:opacity-60">
              {es ? "Guardar la página" : "Save the page"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="press h-11 rounded-full bg-primary px-4 text-sm font-semibold text-on-primary" onClick={() => { setDraft(blank()); setConfirmDelete(false); setError(""); }}>
                {es ? "Nueva casa" : "New home"}
              </button>
              <button type="button" disabled={busy} className="press h-11 rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink disabled:opacity-60" onClick={() => void onImport()}>
                {es ? "Cargar ejemplos" : "Load samples"}
              </button>
            </div>
            {homes.length === 0 ? (
              <p className="mt-4 text-sm text-muted">
                {es ? "Todavía no hay casas tuyas. Crea una o carga los ejemplos y luego cámbiales el precio." : "No homes yet. Create one, or load the samples and then change the prices."}
              </p>
            ) : (
              <ul className="mt-4 grid gap-2">
                {homes.map((home) => (
                  <li key={home.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setDraft(fromListing(home));
                        setConfirmDelete(false);
                        setError("");
                      }}
                      className={
                        "w-full rounded-lg border px-3 py-2 text-left " +
                        (draft?.id === home.id ? "border-primary bg-chip" : "border-line bg-surface")
                      }
                    >
                      <span className="block font-semibold text-ink">{money(home.price, lang)}{t.perMonth}</span>
                      <span className="block truncate text-sm text-muted">{home.address}, {home.city}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {draft ? (
            <form
              className="grid gap-4 rounded-lg border border-line bg-surface p-4 sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                void onSaveHome();
              }}
            >
              <label className="text-sm font-semibold text-ink sm:col-span-2">
                {es ? "Dirección" : "Address"}
                <input className={field} required value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} />
              </label>
              <label className="text-sm font-semibold text-ink">
                {es ? "Barrio" : "Neighborhood"}
                <input className={field} value={draft.neighborhood} onChange={(event) => setDraft({ ...draft, neighborhood: event.target.value })} />
              </label>
              <label className="text-sm font-semibold text-ink">
                {t.search.city}
                <input className={field} required value={draft.city} onChange={(event) => setDraft({ ...draft, city: event.target.value })} />
              </label>
              <label className="text-sm font-semibold text-ink">
                {es ? "Estado" : "State"}
                <input className={field} required maxLength={2} value={draft.state} onChange={(event) => setDraft({ ...draft, state: event.target.value.toUpperCase() })} />
              </label>
              <label className="text-sm font-semibold text-ink">
                ZIP
                <input className={field} required value={draft.zip} onChange={(event) => setDraft({ ...draft, zip: event.target.value })} />
              </label>
              <label className="text-sm font-semibold text-ink">
                {es ? "Renta mensual" : "Monthly rent"}
                <input className={field} type="number" min={1} required value={draft.price} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} />
              </label>
              <label className="text-sm font-semibold text-ink">
                {es ? "Depósito" : "Deposit"}
                <input className={field} type="number" min={0} value={draft.deposit} onChange={(event) => setDraft({ ...draft, deposit: Number(event.target.value) })} />
              </label>
              <label className="text-sm font-semibold text-ink">
                {t.search.beds}
                <input className={field} type="number" min={0} max={12} value={draft.beds} onChange={(event) => setDraft({ ...draft, beds: Number(event.target.value) })} />
              </label>
              <label className="text-sm font-semibold text-ink">
                {t.baths}
                <input className={field} type="number" min={0} max={12} step={0.5} value={draft.baths} onChange={(event) => setDraft({ ...draft, baths: Number(event.target.value) })} />
              </label>
              <label className="text-sm font-semibold text-ink">
                {es ? "Pies cuadrados" : "Square feet"}
                <input className={field} type="number" min={1} value={draft.sqft} onChange={(event) => setDraft({ ...draft, sqft: Number(event.target.value) })} />
              </label>
              <label className="text-sm font-semibold text-ink">
                {t.type}
                <select className={field} value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as ListingInput["type"] })}>
                  <option value="house">{t.house}</option>
                  <option value="townhouse">{t.townhouse}</option>
                </select>
              </label>
              <label className="text-sm font-semibold text-ink">
                {es ? "Disponible" : "Available"}
                <input className={field} type="date" value={draft.available} onChange={(event) => setDraft({ ...draft, available: event.target.value })} />
              </label>
              <label className="text-sm font-semibold text-ink">
                {es ? "Año" : "Year"}
                <input className={field} type="number" min={1800} max={2035} value={draft.year} onChange={(event) => setDraft({ ...draft, year: Number(event.target.value) })} />
              </label>
              <label className="text-sm font-semibold text-ink">
                {es ? "Estacionamientos" : "Parking spots"}
                <input className={field} type="number" min={0} max={8} value={draft.parking} onChange={(event) => setDraft({ ...draft, parking: Number(event.target.value) })} />
              </label>
              <label className="text-sm font-semibold text-ink">
                {es ? "Lavandería" : "Laundry"}
                <select className={field} value={draft.laundry} onChange={(event) => setDraft({ ...draft, laundry: event.target.value as ListingInput["laundry"] })}>
                  <option value="in-unit">{es ? "Dentro de la casa" : "In the home"}</option>
                  <option value="hookups">{es ? "Solo conexiones" : "Hookups only"}</option>
                </select>
              </label>
              <label className="inline-flex h-11 items-center gap-2 text-sm font-semibold text-ink">
                <input type="checkbox" className="size-4 accent-primary" checked={draft.pets} onChange={(event) => setDraft({ ...draft, pets: event.target.checked })} />
                {t.pets}
              </label>
              <label className="inline-flex h-11 items-center gap-2 text-sm font-semibold text-ink">
                <input type="checkbox" className="size-4 accent-primary" checked={draft.featured} onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} />
                {es ? "Destacada en la portada" : "Featured on the homepage"}
              </label>
              <fieldset className="sm:col-span-2">
                <legend className="text-sm font-semibold text-ink">{es ? "Características" : "Features"}</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {AMENITIES.map((amenity) => {
                    const on = draft.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          setDraft({
                            ...draft,
                            amenities: on
                              ? draft.amenities.filter((item) => item !== amenity)
                              : [...draft.amenities, amenity],
                          })
                        }
                        className={
                          "h-10 rounded-full px-3 text-sm font-semibold " +
                          (on ? "bg-primary text-on-primary" : "border border-line text-ink")
                        }
                      >
                        {t.amenity[amenity]}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <label className="text-sm font-semibold text-ink sm:col-span-2">
                {es ? "Descripción en español" : "Spanish description"}
                <textarea className="mt-1 min-h-24 w-full rounded-md border border-line bg-surface px-3 py-2 text-base text-ink" value={draft.blurbEs} onChange={(event) => setDraft({ ...draft, blurbEs: event.target.value })} />
              </label>
              <label className="text-sm font-semibold text-ink sm:col-span-2">
                {es ? "Descripción en inglés" : "English description"}
                <textarea className="mt-1 min-h-24 w-full rounded-md border border-line bg-surface px-3 py-2 text-base text-ink" value={draft.blurbEn} onChange={(event) => setDraft({ ...draft, blurbEn: event.target.value })} />
              </label>
              <div className="sm:col-span-2">
                <p className="text-sm font-semibold text-ink">{es ? "Fotos (hasta 6)" : "Photos (up to 6)"}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {draft.photos.map((photo, index) => (
                    <div key={photo.slice(0, 48) + index} className="relative">
                      <img src={photo} alt="" className="h-24 w-32 rounded-md object-cover" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 rounded-full bg-surface px-2 text-xs font-semibold text-ink"
                        onClick={() => setDraft({ ...draft, photos: draft.photos.filter((_, photoIndex) => photoIndex !== index) })}
                      >
                        {es ? "Quitar" : "Remove"}
                      </button>
                    </div>
                  ))}
                </div>
                {draft.photos.length < 6 ? (
                  <label className="mt-3 inline-flex h-11 cursor-pointer items-center rounded-full border border-line px-4 text-sm font-semibold text-ink">
                    {es ? "Subir fotos" : "Upload photos"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={(event) => {
                        void addPhotos(event.target.files);
                        event.target.value = "";
                      }}
                    />
                  </label>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <button type="submit" disabled={busy} className="press h-11 rounded-full bg-primary px-5 font-semibold text-on-primary disabled:opacity-60">
                  {es ? "Guardar casa" : "Save home"}
                </button>
                {draft.id ? (
                  confirmDelete ? (
                    <>
                      <button type="button" disabled={busy} className="press h-11 rounded-full bg-ink px-4 text-sm font-semibold text-surface" onClick={() => void onDelete()}>
                        {es ? "Sí, borrar" : "Yes, delete"}
                      </button>
                      <button type="button" className="press h-11 rounded-full border border-line px-4 text-sm font-semibold" onClick={() => setConfirmDelete(false)}>
                        {es ? "Cancelar" : "Cancel"}
                      </button>
                    </>
                  ) : (
                    <button type="button" className="press h-11 rounded-full border border-line px-4 text-sm font-semibold text-ink" onClick={() => setConfirmDelete(true)}>
                      {es ? "Borrar casa" : "Delete home"}
                    </button>
                  )
                ) : null}
              </div>
            </form>
          ) : (
            <p className="text-muted">{es ? "Elige una casa o crea una nueva." : "Pick a home or create a new one."}</p>
          )}
        </div>
      )}
    </main>
  );
}

function compressImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const max = 1400;
      const scale = Math.min(1, max / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error("canvas"));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image"));
    };
    image.src = url;
  });
}
