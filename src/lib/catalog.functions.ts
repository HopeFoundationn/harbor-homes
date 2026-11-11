import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type { Amenity, Listing } from "@/lib/listings";

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

const CITIES: Record<string, [number, number]> = {
  "los angeles": [34.05, -118.24],
  miami: [25.76, -80.19],
  houston: [29.76, -95.37],
  chicago: [41.88, -87.63],
  atlanta: [33.75, -84.39],
  phoenix: [33.45, -112.07],
  philadelphia: [39.95, -75.16],
  dallas: [32.78, -96.8],
  austin: [30.27, -97.74],
  seattle: [47.61, -122.33],
  denver: [39.74, -104.99],
  boston: [42.36, -71.06],
  "new york": [40.71, -74.01],
  "san francisco": [37.77, -122.42],
  "san diego": [32.72, -117.16],
  orlando: [28.54, -81.38],
  tampa: [27.95, -82.46],
  charlotte: [35.23, -80.84],
  nashville: [36.16, -86.78],
  "las vegas": [36.17, -115.14],
};

export type SiteSettings = {
  heroKicker: { es: string; en: string };
  heroTitle: { es: string; en: string };
  heroSub: { es: string; en: string };
  phone: string;
  email: string;
  hours: { es: string; en: string };
};

export type PublicCatalog = {
  listings: Listing[] | null;
  settings: SiteSettings | null;
};

export type ListingInput = {
  id?: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: "house" | "townhouse";
  pets: boolean;
  deposit: number;
  available: string;
  year: number;
  parking: number;
  laundry: "in-unit" | "hookups";
  featured: boolean;
  amenities: string[];
  blurbEs: string;
  blurbEn: string;
  photos: string[];
};

type ListingRow = {
  id: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  home_type: string;
  pets: boolean;
  deposit: number;
  available: string;
  year_built: number;
  parking: number;
  laundry: string;
  featured: boolean;
  posted: string;
  amenities: string;
  blurb_es: string;
  blurb_en: string;
};

type SettingsRow = {
  hero_kicker_es: string;
  hero_title_es: string;
  hero_sub_es: string;
  hero_kicker_en: string;
  hero_title_en: string;
  hero_sub_en: string;
  phone: string;
  email: string;
  hours_es: string;
  hours_en: string;
};

function clip(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function coords(city: string): [number, number] {
  return CITIES[city.trim().toLowerCase()] ?? [39.8, -98.6];
}

function toSettings(row: SettingsRow): SiteSettings {
  return {
    heroKicker: { es: row.hero_kicker_es, en: row.hero_kicker_en },
    heroTitle: { es: row.hero_title_es, en: row.hero_title_en },
    heroSub: { es: row.hero_sub_es, en: row.hero_sub_en },
    phone: row.phone,
    email: row.email,
    hours: { es: row.hours_es, en: row.hours_en },
  };
}

function toListing(row: ListingRow, photos: string[]): Listing {
  const amenities = row.amenities
    .split(",")
    .filter((item): item is Amenity => AMENITIES.includes(item as Amenity));
  return {
    id: row.id,
    address: row.address,
    neighborhood: row.neighborhood,
    city: row.city,
    state: row.state,
    zip: row.zip,
    lat: Number(row.lat),
    lng: Number(row.lng),
    price: Number(row.price),
    beds: Number(row.beds),
    baths: Number(row.baths),
    sqft: Number(row.sqft),
    type: row.home_type === "townhouse" ? "townhouse" : "house",
    pets: Boolean(row.pets),
    deposit: Number(row.deposit),
    available: String(row.available).slice(0, 10),
    year: Number(row.year_built),
    parking: Number(row.parking),
    laundry: row.laundry === "hookups" ? "hookups" : "in-unit",
    photos: photos.length > 0 ? photos : ["/homes/living.jpg"],
    featured: Boolean(row.featured),
    posted: String(row.posted).slice(0, 10),
    amenities,
    blurb: { es: row.blurb_es, en: row.blurb_en },
  };
}

function cleanListing(input: ListingInput): ListingInput {
  const photos = (Array.isArray(input.photos) ? input.photos : []).filter(
    (photo) =>
      typeof photo === "string" &&
      photo.length < 450_000 &&
      (photo.startsWith("data:image/jpeg;base64,") || /^\/homes\/[a-z0-9.-]+$/.test(photo)),
  );
  if (photos.length === 0 || photos.length > 6) throw new Error("photos");
  const available = clip(input.available, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(available)) throw new Error("date");
  const state = clip(input.state, 2).toUpperCase();
  if (!/^[A-Z]{2}$/.test(state)) throw new Error("state");
  const price = Math.round(Number(input.price));
  const beds = Math.round(Number(input.beds));
  const baths = Math.round(Number(input.baths) * 2) / 2;
  const sqft = Math.round(Number(input.sqft));
  const year = Math.round(Number(input.year));
  const parking = Math.round(Number(input.parking));
  const deposit = Math.round(Number(input.deposit));
  if (price < 1 || price > 100000) throw new Error("price");
  if (beds < 0 || beds > 12) throw new Error("beds");
  if (baths < 0 || baths > 12) throw new Error("baths");
  if (sqft < 1 || sqft > 20000) throw new Error("sqft");
  if (year < 1800 || year > 2035) throw new Error("year");
  if (parking < 0 || parking > 8) throw new Error("parking");
  if (deposit < 0 || deposit > 100000) throw new Error("deposit");
  const address = clip(input.address, 120);
  const city = clip(input.city, 60);
  const neighborhood = clip(input.neighborhood, 60) || city;
  const zip = clip(input.zip, 10);
  if (address.length < 3 || city.length < 2 || zip.length < 3) throw new Error("place");
  const amenities = (Array.isArray(input.amenities) ? input.amenities : []).filter((item) =>
    AMENITIES.includes(item as Amenity),
  );
  return {
    id: input.id ? clip(input.id, 40) : undefined,
    address,
    neighborhood,
    city,
    state,
    zip,
    price,
    beds,
    baths,
    sqft,
    type: input.type === "townhouse" ? "townhouse" : "house",
    pets: Boolean(input.pets),
    deposit,
    available,
    year,
    parking,
    laundry: input.laundry === "hookups" ? "hookups" : "in-unit",
    featured: Boolean(input.featured),
    amenities,
    blurbEs: clip(input.blurbEs, 800),
    blurbEn: clip(input.blurbEn, 800),
    photos: photos.slice(0, 6),
  };
}

function cleanSettings(input: SiteSettings): SiteSettings {
  const pair = (value: { es: string; en: string }, max: number) => ({
    es: clip(value?.es, max),
    en: clip(value?.en, max),
  });
  const email = clip(input.email, 120);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("email");
  return {
    heroKicker: pair(input.heroKicker, 80),
    heroTitle: pair(input.heroTitle, 140),
    heroSub: pair(input.heroSub, 280),
    phone: clip(input.phone, 40),
    email,
    hours: pair(input.hours, 160),
  };
}

async function db() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

async function requireOwner(userId: string) {
  const sql = await db();
  await sql`insert into site_owner (id, user_id) values (1, ${userId}) on conflict (id) do nothing`;
  const rows = await sql<{ user_id: string }>`select user_id from site_owner where id = 1`;
  if (rows[0]?.user_id !== userId) return null;
  return sql;
}

async function photosFor(ids: string[], coversOnly: boolean) {
  const sql = await db();
  if (ids.length === 0) return new Map<string, string[]>();
  const rows = coversOnly
    ? await sql<{ listing_id: string; data_url: string }>`
        select distinct on (listing_id) listing_id, data_url
        from listing_photos
        order by listing_id, position`
    : await sql<{ listing_id: string; data_url: string }>`
        select listing_id, data_url from listing_photos order by listing_id, position`;
  const map = new Map<string, string[]>();
  for (const row of rows) {
    if (!ids.includes(row.listing_id)) continue;
    const list = map.get(row.listing_id) ?? [];
    list.push(row.data_url);
    map.set(row.listing_id, list);
  }
  return map;
}

export const getPublicCatalog = createServerFn({ method: "GET" }).handler(async (): Promise<PublicCatalog> => {
  try {
    const sql = await db();
    const settingsRows = await sql<SettingsRow>`select * from site_settings where id = 1`;
    const listingRows = await sql<ListingRow>`select * from listings order by featured desc, posted desc`;
    const photos = await photosFor(
      listingRows.map((row) => row.id),
      true,
    );
    return {
      settings: settingsRows[0] ? toSettings(settingsRows[0]) : null,
      listings:
        listingRows.length > 0
          ? listingRows.map((row) => toListing(row, photos.get(row.id) ?? []))
          : null,
    };
  } catch (error) {
    console.error(error);
    return { listings: null, settings: null };
  }
});

export const getPublicHome = createServerFn({ method: "GET" })
  .validator((id: string) => clip(id, 40))
  .handler(async ({ data: id }): Promise<Listing | null> => {
    const sql = await db();
    const rows = await sql<ListingRow>`select * from listings where id = ${id}`;
    if (!rows[0]) return null;
    const photos = await sql<{ data_url: string }>`
      select data_url from listing_photos where listing_id = ${id} order by position`;
    return toListing(
      rows[0],
      photos.map((row) => row.data_url),
    );
  });

export const getAdminState = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await requireOwner(context.userId);
    if (!sql) return { forbidden: true as const, listings: [] as Listing[], settings: null };
    const settingsRows = await sql<SettingsRow>`select * from site_settings where id = 1`;
    const listingRows = await sql<ListingRow>`
      select * from listings where user_id = ${context.userId} order by featured desc, posted desc`;
    const photos = await photosFor(
      listingRows.map((row) => row.id),
      false,
    );
    return {
      forbidden: false as const,
      listings: listingRows.map((row) => toListing(row, photos.get(row.id) ?? [])),
      settings: settingsRows[0] ? toSettings(settingsRows[0]) : null,
    };
  });

export const saveSettings = createServerFn({ method: "POST" })
  .validator((input: SiteSettings) => cleanSettings(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await requireOwner(context.userId);
    if (!sql) throw new Error("Forbidden");
    await sql`
      insert into site_settings (
        id, user_id, hero_kicker_es, hero_title_es, hero_sub_es,
        hero_kicker_en, hero_title_en, hero_sub_en, phone, email, hours_es, hours_en
      ) values (
        1, ${context.userId}, ${data.heroKicker.es}, ${data.heroTitle.es}, ${data.heroSub.es},
        ${data.heroKicker.en}, ${data.heroTitle.en}, ${data.heroSub.en},
        ${data.phone}, ${data.email}, ${data.hours.es}, ${data.hours.en}
      )
      on conflict (id) do update set
        user_id = ${context.userId},
        hero_kicker_es = ${data.heroKicker.es},
        hero_title_es = ${data.heroTitle.es},
        hero_sub_es = ${data.heroSub.es},
        hero_kicker_en = ${data.heroKicker.en},
        hero_title_en = ${data.heroTitle.en},
        hero_sub_en = ${data.heroSub.en},
        phone = ${data.phone},
        email = ${data.email},
        hours_es = ${data.hours.es},
        hours_en = ${data.hours.en}`;
    return data;
  });

export const saveListing = createServerFn({ method: "POST" })
  .validator((input: ListingInput) => cleanListing(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await requireOwner(context.userId);
    if (!sql) throw new Error("Forbidden");
    const id = data.id && data.id.length > 0 ? data.id : `casa-${crypto.randomUUID().slice(0, 8)}`;
    const owned = await sql<{ posted: string }>`
      select posted from listings where id = ${id} and user_id = ${context.userId}`;
    const taken = await sql<{ id: string }>`select id from listings where id = ${id}`;
    if (taken[0] && !owned[0]) throw new Error("Forbidden");
    const posted = owned[0]?.posted ?? new Date().toISOString().slice(0, 10);
    const [lat, lng] = coords(data.city);
    const amenities = data.amenities.join(",");
    await sql`
      insert into listings (
        id, user_id, address, neighborhood, city, state, zip, lat, lng, price, beds, baths, sqft,
        home_type, pets, deposit, available, year_built, parking, laundry, featured, posted,
        amenities, blurb_es, blurb_en
      ) values (
        ${id}, ${context.userId}, ${data.address}, ${data.neighborhood}, ${data.city}, ${data.state},
        ${data.zip}, ${lat}, ${lng}, ${data.price}, ${data.beds}, ${data.baths}, ${data.sqft},
        ${data.type}, ${data.pets}, ${data.deposit}, ${data.available}, ${data.year}, ${data.parking},
        ${data.laundry}, ${data.featured}, ${posted}, ${amenities}, ${data.blurbEs}, ${data.blurbEn}
      )
      on conflict (id) do update set
        address = ${data.address},
        neighborhood = ${data.neighborhood},
        city = ${data.city},
        state = ${data.state},
        zip = ${data.zip},
        lat = ${lat},
        lng = ${lng},
        price = ${data.price},
        beds = ${data.beds},
        baths = ${data.baths},
        sqft = ${data.sqft},
        home_type = ${data.type},
        pets = ${data.pets},
        deposit = ${data.deposit},
        available = ${data.available},
        year_built = ${data.year},
        parking = ${data.parking},
        laundry = ${data.laundry},
        featured = ${data.featured},
        amenities = ${amenities},
        blurb_es = ${data.blurbEs},
        blurb_en = ${data.blurbEn}
      where listings.user_id = ${context.userId}`;
    await sql`delete from listing_photos where listing_id = ${id}`;
    for (let index = 0; index < data.photos.length; index += 1) {
      await sql`
        insert into listing_photos (listing_id, position, data_url)
        values (${id}, ${index}, ${data.photos[index]})`;
    }
    const rows = await sql<ListingRow>`select * from listings where id = ${id} and user_id = ${context.userId}`;
    return toListing(rows[0], data.photos);
  });

export const deleteListing = createServerFn({ method: "POST" })
  .validator((id: string) => clip(id, 40))
  .middleware([authMiddleware])
  .handler(async ({ context, data: id }) => {
    const sql = await requireOwner(context.userId);
    if (!sql) throw new Error("Forbidden");
    await sql`delete from listings where id = ${id} and user_id = ${context.userId}`;
    return { id };
  });

export const importSamples = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await requireOwner(context.userId);
    if (!sql) throw new Error("Forbidden");
    const { listings } = await import("@/lib/listings");
    for (const listing of listings) {
      const taken = await sql<{ user_id: string }>`select user_id from listings where id = ${listing.id}`;
      if (taken[0] && taken[0].user_id !== context.userId) continue;
      if (taken[0]) continue;
      await sql`
        insert into listings (
          id, user_id, address, neighborhood, city, state, zip, lat, lng, price, beds, baths, sqft,
          home_type, pets, deposit, available, year_built, parking, laundry, featured, posted,
          amenities, blurb_es, blurb_en
        ) values (
          ${listing.id}, ${context.userId}, ${listing.address}, ${listing.neighborhood}, ${listing.city},
          ${listing.state}, ${listing.zip}, ${listing.lat}, ${listing.lng}, ${listing.price}, ${listing.beds},
          ${listing.baths}, ${listing.sqft}, ${listing.type}, ${listing.pets}, ${listing.deposit},
          ${listing.available}, ${listing.year}, ${listing.parking}, ${listing.laundry}, ${listing.featured},
          ${listing.posted}, ${listing.amenities.join(",")}, ${listing.blurb.es}, ${listing.blurb.en}
        )`;
      for (let index = 0; index < listing.photos.length; index += 1) {
        await sql`
          insert into listing_photos (listing_id, position, data_url)
          values (${listing.id}, ${index}, ${listing.photos[index]})`;
      }
    }
    return { ok: true };
  });
