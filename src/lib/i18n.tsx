import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSaved } from "@/lib/saved";

export type Lang = "es" | "en";

const copy = {
  es: {
    metaHome: "Harbor Homes — Casas en alquiler mensual",
    skip: "Saltar al contenido",
    nav: {
      rentals: "Alquileres",
      saved: "Guardadas",
      renting: "Cómo alquilar",
      contact: "Contacto",
      panel: "Panel",
      menu: "Menú",
      close: "Cerrar",
    },
    hero: {
      kicker: "Alquiler mensual en Estados Unidos",
      title: "Casas para vivir, publicadas por nosotros.",
      sub: "Un solo inventario. Buscas, visitas y firmas directo con Harbor Homes. Contrato de 12 meses.",
    },
    sample:
      "Estas 12 casas son de ejemplo para que veas el portal. Después las cambiamos por las tuyas.",
    search: {
      city: "Ciudad",
      all: "Todas las ciudades",
      max: "Renta máxima",
      any: "Cualquiera",
      beds: "Habitaciones",
      bedsPlus: "{n}+ hab.",
      submit: "Buscar casas",
    },
    stats: {
      homes: "casas activas",
      cities: "ciudades",
      replyValue: "1 día",
      reply: "para confirmar una visita",
    },
    featured: "Casas destacadas",
    featuredLead: "Una selección del inventario. El listado completo está en Alquileres.",
    seeAll: "Ver todas las casas",
    citiesTitle: "Ciudades",
    whyTitle: "Cómo trabaja Harbor Homes",
    why: [
      {
        title: "Un solo arrendador",
        body: "No hay otros agentes en la página. Cada casa la publica y la muestra Harbor Homes.",
      },
      {
        title: "Visita antes de aplicar",
        body: "Pides una visita con tu teléfono. Confirmamos horario en un día hábil.",
      },
      {
        title: "Contrato de 12 meses",
        body: "Alquiler para vivir, no por noche. Depósito de un mes y servicios a cargo del inquilino.",
      },
    ],
    ctaTitle: "¿Buscas en una ciudad concreta?",
    ctaBody: "Filtra por renta, habitaciones y mascotas. Lo que ves es lo que está disponible.",
    ctaButton: "Abrir el listado",
    results: "Casas en alquiler",
    count: "{n} casas",
    countOne: "1 casa",
    emptyTitle: "Ninguna casa coincide",
    emptyBody: "Prueba con otra ciudad, una renta más alta o sin el filtro de mascotas.",
    clear: "Quitar filtros",
    filters: "Filtros",
    hideFilters: "Ocultar filtros",
    baths: "Baños",
    bathsPlus: "{n}+ baños",
    pets: "Acepta mascotas",
    type: "Tipo",
    house: "Casa",
    townhouse: "Adosada",
    forRent: "Casa en alquiler",
    sort: "Orden",
    sortFeatured: "Destacadas",
    sortAsc: "Precio: menor a mayor",
    sortDesc: "Precio: mayor a menor",
    sortNew: "Más recientes",
    perMonth: "/ mes",
    bedShort: "{n} hab.",
    bathShort: "{n} baños",
    featuredBadge: "Destacada",
    petsBadge: "Mascotas",
    save: "Guardar",
    saved: "Guardada",
    back: "Volver al listado",
    listedBy: "Publicada por Harbor Homes",
    available: "Disponible",
    deposit: "Depósito",
    year: "Año",
    parking: "Estacionamiento",
    parkingNone: "En la calle",
    parkingN: "{n} espacio(s)",
    laundry: "Lavandería",
    inUnit: "Dentro de la casa",
    hookups: "Conexiones",
    lease: "Contrato",
    leaseValue: "12 meses",
    utilities: "Servicios",
    utilitiesValue: "Los paga el inquilino",
    about: "La casa",
    amenities: "Incluye",
    amenity: {
      yard: "Jardín",
      porch: "Porche",
      hardwood: "Piso de madera",
      ac: "Aire acondicionado",
      heat: "Calefacción",
      fireplace: "Chimenea",
      "updated-kitchen": "Cocina actualizada",
      dishwasher: "Lavavajillas",
      fenced: "Patio cercado",
      garage: "Garage",
      patio: "Patio",
      laundry: "Lavandería",
    },
    map: "Ubicación",
    mapOpen: "Abrir en el mapa",
    tourTitle: "Agendar visita",
    tourLead: "Sin compromiso. Te llamamos o escribimos para confirmar.",
    name: "Nombre",
    phone: "Teléfono",
    email: "Correo",
    move: "Fecha deseada",
    message: "Mensaje",
    send: "Enviar solicitud",
    sentTitle: "Solicitud recibida",
    sentBody: "Harbor Homes te contacta en un día hábil para confirmar la visita.",
    errName: "Escribe tu nombre.",
    errPhone: "Escribe un teléfono.",
    errEmail: "Escribe un correo válido.",
    similar: "Otras casas",
    missingTitle: "No encontramos esa casa",
    missingBody: "Puede que el enlace esté viejo. Vuelve al listado.",
    savedTitle: "Casas guardadas",
    savedLead: "Quedan en este navegador. No hace falta una cuenta.",
    savedEmpty: "Todavía no guardas ninguna. Marca el corazón en una casa.",
    browse: "Ver alquileres",
    rentingTitle: "Cómo alquilar",
    rentingLead: "El proceso es el mismo en todas las ciudades. Tú eliges la casa; nosotros coordinamos la visita y el contrato.",
    steps: [
      { title: "Elige una casa", body: "Filtra por ciudad, renta y habitaciones. Los datos de la ficha son los del contrato: renta, depósito y fecha." },
      { title: "Pide una visita", body: "Deja nombre y teléfono. Confirmamos un horario en un día hábil. La visita es en la casa, contigo." },
      { title: "Aplica", body: "Identificación, comprobante de ingresos de al menos 3 veces la renta y referencias. No pedimos datos por esta página." },
      { title: "Firma y entra", body: "Contrato de 12 meses, depósito de un mes y servicios a tu nombre a partir del día de entrada." },
    ],
    reqTitle: "Qué revisamos",
    reqs: [
      "Identificación con foto vigente",
      "Ingresos brutos de unas 3 veces la renta mensual",
      "Referencias de arrendador o, si es la primera vez, de empleo",
      "Mascotas solo en las casas marcadas, y con aprobación",
    ],
    contactTitle: "Contacto",
    contactLead: "Harbor Homes atiende el inventario completo. Una sola línea para visitas y contratos.",
    hours: "Lunes a viernes, 9:00–18:00. Sábados, 10:00–14:00.",
    phoneLabel: "Teléfono",
    emailLabel: "Correo",
    note: "El teléfono y el correo de esta demo se reemplazan por los tuyos.",
    footerNote: "Inventario de ejemplo · Estados Unidos",
    rights: "Harbor Homes. Alquiler mensual de casas.",
  },
  en: {
    metaHome: "Harbor Homes — Monthly house rentals",
    skip: "Skip to content",
    nav: {
      rentals: "Rentals",
      saved: "Saved",
      renting: "How leasing works",
      contact: "Contact",
      panel: "Panel",
      menu: "Menu",
      close: "Close",
    },
    hero: {
      kicker: "Monthly rentals across the United States",
      title: "Houses to live in, listed by us.",
      sub: "One inventory. Search, tour, and sign directly with Harbor Homes. Twelve-month lease.",
    },
    sample: "These 12 houses are samples so you can see the site. We swap them for yours next.",
    search: {
      city: "City",
      all: "All cities",
      max: "Max rent",
      any: "Any",
      beds: "Bedrooms",
      bedsPlus: "{n}+ bd",
      submit: "Search homes",
    },
    stats: {
      homes: "homes listed",
      cities: "cities",
      replyValue: "1 day",
      reply: "to confirm a tour",
    },
    featured: "Featured homes",
    featuredLead: "A cut of the inventory. The full list is under Rentals.",
    seeAll: "See all homes",
    citiesTitle: "Cities",
    whyTitle: "How Harbor Homes works",
    why: [
      {
        title: "One landlord",
        body: "No other agents on the page. Harbor Homes lists and shows every house.",
      },
      {
        title: "Tour before you apply",
        body: "Request a visit with your phone number. We confirm a time within one business day.",
      },
      {
        title: "Twelve-month lease",
        body: "Housing, not nightly stays. One month’s deposit. Tenant pays utilities.",
      },
    ],
    ctaTitle: "Looking in a specific city?",
    ctaBody: "Filter by rent, bedrooms, and pets. What you see is what is available.",
    ctaButton: "Open the listings",
    results: "Homes for rent",
    count: "{n} homes",
    countOne: "1 home",
    emptyTitle: "No homes match",
    emptyBody: "Try another city, a higher rent, or clear the pet filter.",
    clear: "Clear filters",
    filters: "Filters",
    hideFilters: "Hide filters",
    baths: "Bathrooms",
    bathsPlus: "{n}+ ba",
    pets: "Pets allowed",
    type: "Type",
    house: "House",
    townhouse: "Townhouse",
    forRent: "House for rent",
    sort: "Sort",
    sortFeatured: "Featured",
    sortAsc: "Price: low to high",
    sortDesc: "Price: high to low",
    sortNew: "Newest",
    perMonth: "/ mo",
    bedShort: "{n} bd",
    bathShort: "{n} ba",
    featuredBadge: "Featured",
    petsBadge: "Pets",
    save: "Save",
    saved: "Saved",
    back: "Back to listings",
    listedBy: "Listed by Harbor Homes",
    available: "Available",
    deposit: "Deposit",
    year: "Year built",
    parking: "Parking",
    parkingNone: "Street parking",
    parkingN: "{n} space(s)",
    laundry: "Laundry",
    inUnit: "Inside the home",
    hookups: "Hookups",
    lease: "Lease",
    leaseValue: "12 months",
    utilities: "Utilities",
    utilitiesValue: "Paid by the tenant",
    about: "The home",
    amenities: "Includes",
    amenity: {
      yard: "Yard",
      porch: "Porch",
      hardwood: "Hardwood floors",
      ac: "Air conditioning",
      heat: "Heat",
      fireplace: "Fireplace",
      "updated-kitchen": "Updated kitchen",
      dishwasher: "Dishwasher",
      fenced: "Fenced yard",
      garage: "Garage",
      patio: "Patio",
      laundry: "Laundry",
    },
    map: "Location",
    mapOpen: "Open in maps",
    tourTitle: "Request a tour",
    tourLead: "No commitment. We call or write to confirm a time.",
    name: "Name",
    phone: "Phone",
    email: "Email",
    move: "Preferred date",
    message: "Message",
    send: "Send request",
    sentTitle: "Request received",
    sentBody: "Harbor Homes will contact you within one business day to confirm the tour.",
    errName: "Enter your name.",
    errPhone: "Enter a phone number.",
    errEmail: "Enter a valid email.",
    similar: "Other homes",
    missingTitle: "We couldn’t find that home",
    missingBody: "The link may be out of date. Go back to the listings.",
    savedTitle: "Saved homes",
    savedLead: "Stored in this browser. No account needed.",
    savedEmpty: "You have not saved a home yet. Tap the heart on a listing.",
    browse: "Browse rentals",
    rentingTitle: "How leasing works",
    rentingLead: "The process is the same in every city. You pick the house; we set the tour and the lease.",
    steps: [
      { title: "Pick a house", body: "Filter by city, rent, and bedrooms. The listing shows the lease facts: rent, deposit, and date." },
      { title: "Request a tour", body: "Leave your name and phone. We confirm a time within one business day. The tour is at the house, with you." },
      { title: "Apply", body: "Photo ID, proof of income of about 3× the rent, and references. We do not collect that on this page." },
      { title: "Sign and move in", body: "A 12-month lease, one month’s deposit, and utilities in your name from move-in day." },
    ],
    reqTitle: "What we review",
    reqs: [
      "A current photo ID",
      "Gross income of about 3× the monthly rent",
      "A landlord reference, or an employment reference if this is your first lease",
      "Pets only in homes marked for them, and only with approval",
    ],
    contactTitle: "Contact",
    contactLead: "Harbor Homes handles the full inventory. One line for tours and leases.",
    hours: "Monday–Friday, 9:00–6:00. Saturdays, 10:00–2:00.",
    phoneLabel: "Phone",
    emailLabel: "Email",
    note: "The phone and email on this demo are placeholders for yours.",
    footerNote: "Sample inventory · United States",
    rights: "Harbor Homes. Monthly house rentals.",
  },
} satisfies Record<Lang, Record<string, unknown>>;

export type Copy = (typeof copy)[Lang];

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Copy;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const stored = localStorage.getItem("harbor-lang");
    if (stored === "en" || stored === "es") setLangState(stored);
    void Promise.resolve(useSaved.persist.rehydrate()).finally(() => {
      useSaved.setState({ hydrated: true });
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next: Lang) => {
    setLangState(next);
    localStorage.setItem("harbor-lang", next);
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t: copy[lang] }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}

export function fill(template: string, n: number | string) {
  return template.replace("{n}", String(n));
}
