import type { HomeType, ListingSearch } from "@/lib/search";

export type Amenity =
  | "yard"
  | "porch"
  | "hardwood"
  | "ac"
  | "heat"
  | "fireplace"
  | "updated-kitchen"
  | "dishwasher"
  | "fenced"
  | "garage"
  | "patio"
  | "laundry";

export type Listing = {
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
  type: HomeType;
  pets: boolean;
  deposit: number;
  available: string;
  year: number;
  parking: number;
  laundry: "in-unit" | "hookups";
  photos: string[];
  featured: boolean;
  posted: string;
  amenities: Amenity[];
  blurb: { es: string; en: string };
};

export const listings: Listing[] = [
  {
    id: "echo-park",
    address: "1847 Laguna Ave",
    neighborhood: "Echo Park",
    city: "Los Angeles",
    state: "CA",
    zip: "90026",
    lat: 34.0782,
    lng: -118.2606,
    price: 4380,
    beds: 3,
    baths: 2,
    sqft: 1480,
    type: "house",
    pets: false,
    deposit: 4380,
    available: "2026-12-01",
    year: 1924,
    parking: 1,
    laundry: "in-unit",
    photos: ["/homes/la.jpg", "/homes/living.jpg", "/homes/kitchen.jpg"],
    featured: true,
    posted: "2026-11-02",
    amenities: ["porch", "hardwood", "ac", "heat", "updated-kitchen", "dishwasher", "yard", "laundry"],
    blurb: {
      es: "Casa de un piso con porche en Echo Park. Sala luminosa, piso de madera y un patio corto para el final del día. Contrato de 12 meses, directo con Harbor Homes.",
      en: "A single-story house with a front porch in Echo Park. Bright living room, hardwood floors, and a small backyard. Twelve-month lease, directly with Harbor Homes.",
    },
  },
  {
    id: "coral-gables",
    address: "412 Madrid St",
    neighborhood: "Coral Gables",
    city: "Miami",
    state: "FL",
    zip: "33134",
    lat: 25.749,
    lng: -80.258,
    price: 5650,
    beds: 4,
    baths: 3,
    sqft: 2210,
    type: "house",
    pets: true,
    deposit: 5650,
    available: "2026-12-15",
    year: 1952,
    parking: 2,
    laundry: "in-unit",
    photos: ["/homes/miami.jpg", "/homes/dining.jpg", "/homes/bed.jpg"],
    featured: true,
    posted: "2026-10-28",
    amenities: ["ac", "hardwood", "updated-kitchen", "dishwasher", "garage", "yard", "patio", "laundry"],
    blurb: {
      es: "Casa de una planta en Coral Gables, con entrada en arco y patio. Cuatro habitaciones y garage para dos autos. Se aceptan mascotas con aprobación.",
      en: "A single-story house in Coral Gables with an arched entry and a yard. Four bedrooms and a two-car garage. Pets considered with approval.",
    },
  },
  {
    id: "montrose",
    address: "806 Willard St",
    neighborhood: "Montrose",
    city: "Houston",
    state: "TX",
    zip: "77006",
    lat: 29.748,
    lng: -95.391,
    price: 2795,
    beds: 3,
    baths: 2,
    sqft: 1660,
    type: "house",
    pets: true,
    deposit: 2795,
    available: "2026-11-20",
    year: 1938,
    parking: 2,
    laundry: "in-unit",
    photos: ["/homes/houston.jpg", "/homes/living.jpg"],
    featured: false,
    posted: "2026-11-06",
    amenities: ["porch", "hardwood", "ac", "heat", "fireplace", "fenced", "updated-kitchen", "laundry"],
    blurb: {
      es: "Craftsman en Montrose con porche ancho y patio cercado. Cocina actualizada y lavandería dentro de la casa. Disponible este mes.",
      en: "A Montrose craftsman with a wide porch and a fenced yard. Updated kitchen and laundry inside the house. Available this month.",
    },
  },
  {
    id: "park-slope",
    address: "418 6th St",
    neighborhood: "Park Slope",
    city: "Brooklyn",
    state: "NY",
    zip: "11215",
    lat: 40.672,
    lng: -73.977,
    price: 6200,
    beds: 3,
    baths: 2,
    sqft: 1620,
    type: "townhouse",
    pets: false,
    deposit: 6200,
    available: "2027-01-01",
    year: 1908,
    parking: 0,
    laundry: "in-unit",
    photos: ["/homes/brooklyn.jpg", "/homes/dining.jpg", "/homes/kitchen.jpg"],
    featured: true,
    posted: "2026-10-18",
    amenities: ["hardwood", "heat", "fireplace", "updated-kitchen", "dishwasher", "laundry"],
    blurb: {
      es: "Piso de brownstone en Park Slope. Techos altos, chimenea y cocina renovada. Estacionamiento en la calle. Contrato desde el 1 de enero.",
      en: "A brownstone floor in Park Slope. Tall ceilings, a fireplace, and a renovated kitchen. Street parking. Lease starts January 1.",
    },
  },
  {
    id: "lincoln-park",
    address: "2140 N Seminary Ave",
    neighborhood: "Lincoln Park",
    city: "Chicago",
    state: "IL",
    zip: "60614",
    lat: 41.923,
    lng: -87.648,
    price: 4750,
    beds: 4,
    baths: 2.5,
    sqft: 2140,
    type: "townhouse",
    pets: true,
    deposit: 4750,
    available: "2026-12-01",
    year: 1896,
    parking: 1,
    laundry: "in-unit",
    photos: ["/homes/chicago.jpg", "/homes/living.jpg", "/homes/bed.jpg"],
    featured: false,
    posted: "2026-11-01",
    amenities: ["hardwood", "heat", "fireplace", "updated-kitchen", "dishwasher", "patio", "laundry"],
    blurb: {
      es: "Townhouse de piedra en Lincoln Park, con mirador y patio trasero. Cuatro habitaciones y un espacio de estacionamiento. Mascotas con aprobación.",
      en: "A limestone townhouse in Lincoln Park with a bay window and a rear patio. Four bedrooms and one parking space. Pets with approval.",
    },
  },
  {
    id: "inman-park",
    address: "891 Euclid Ave",
    neighborhood: "Inman Park",
    city: "Atlanta",
    state: "GA",
    zip: "30307",
    lat: 33.761,
    lng: -84.355,
    price: 3290,
    beds: 3,
    baths: 2,
    sqft: 1740,
    type: "house",
    pets: true,
    deposit: 3290,
    available: "2026-12-01",
    year: 1912,
    parking: 1,
    laundry: "hookups",
    photos: ["/homes/atlanta.jpg", "/homes/kitchen.jpg", "/homes/dining.jpg"],
    featured: true,
    posted: "2026-10-30",
    amenities: ["porch", "hardwood", "ac", "heat", "fireplace", "fenced", "yard"],
    blurb: {
      es: "Victoriana en Inman Park con porche que da la vuelta y jardín. Conexiones de lavadora en casa. Buena opción para quien quiere barrio caminable.",
      en: "An Inman Park Victorian with a wraparound porch and a yard. Washer hookups in the house. A walkable-neighborhood house.",
    },
  },
  {
    id: "arcadia",
    address: "4532 N 40th St",
    neighborhood: "Arcadia",
    city: "Phoenix",
    state: "AZ",
    zip: "85018",
    lat: 33.501,
    lng: -112.0,
    price: 2890,
    beds: 3,
    baths: 2,
    sqft: 1860,
    type: "house",
    pets: true,
    deposit: 2890,
    available: "2026-11-28",
    year: 1964,
    parking: 2,
    laundry: "in-unit",
    photos: ["/homes/phoenix.jpg", "/homes/kitchen.jpg"],
    featured: false,
    posted: "2026-11-08",
    amenities: ["ac", "patio", "garage", "updated-kitchen", "dishwasher", "laundry", "yard"],
    blurb: {
      es: "Ranch en Arcadia, de una planta, con patio de grava y garage doble. Aire acondicionado central y lavandería interior. Lista a finales de noviembre.",
      en: "A single-story Arcadia ranch with a gravel yard and a two-car garage. Central air and indoor laundry. Ready in late November.",
    },
  },
  {
    id: "north-park",
    address: "3412 Granada Ave",
    neighborhood: "North Park",
    city: "San Diego",
    state: "CA",
    zip: "92104",
    lat: 32.748,
    lng: -117.129,
    price: 3980,
    beds: 3,
    baths: 2,
    sqft: 1420,
    type: "house",
    pets: true,
    deposit: 3980,
    available: "2027-01-05",
    year: 1931,
    parking: 1,
    laundry: "in-unit",
    photos: ["/homes/sandiego.jpg", "/homes/living.jpg", "/homes/bed.jpg"],
    featured: false,
    posted: "2026-11-04",
    amenities: ["hardwood", "ac", "heat", "patio", "updated-kitchen", "fenced", "laundry"],
    blurb: {
      es: "Española en North Park, con teja de barro y un patio interior corto. Tres habitaciones y una plaza de estacionamiento. Mascotas medianas se revisan caso por caso.",
      en: "A Spanish-style house in North Park with a clay tile roof and a small court. Three bedrooms and one parking space. Medium pets reviewed case by case.",
    },
  },
  {
    id: "east-dallas",
    address: "5723 Victor St",
    neighborhood: "Lakewood",
    city: "Dallas",
    state: "TX",
    zip: "75214",
    lat: 32.802,
    lng: -96.769,
    price: 2640,
    beds: 3,
    baths: 1.5,
    sqft: 1510,
    type: "house",
    pets: false,
    deposit: 2640,
    available: "2026-12-10",
    year: 1936,
    parking: 1,
    laundry: "hookups",
    photos: ["/homes/dallas.jpg", "/homes/dining.jpg"],
    featured: false,
    posted: "2026-10-22",
    amenities: ["hardwood", "heat", "ac", "fireplace", "porch", "yard"],
    blurb: {
      es: "Cottage Tudor en Lakewood, bajo robles. Chimenea, porche y jardín delantero. Sin mascotas. Conexiones de lavadora listas.",
      en: "A Tudor cottage in Lakewood under the oaks. Fireplace, porch, and a front lawn. No pets. Washer hookups are in place.",
    },
  },
  {
    id: "ballard",
    address: "2214 NW 62nd St",
    neighborhood: "Ballard",
    city: "Seattle",
    state: "WA",
    zip: "98107",
    lat: 47.668,
    lng: -122.384,
    price: 3725,
    beds: 3,
    baths: 2,
    sqft: 1580,
    type: "house",
    pets: true,
    deposit: 3725,
    available: "2026-12-01",
    year: 1919,
    parking: 1,
    laundry: "in-unit",
    photos: ["/homes/seattle.jpg", "/homes/living.jpg", "/homes/kitchen.jpg"],
    featured: true,
    posted: "2026-11-09",
    amenities: ["porch", "hardwood", "heat", "fireplace", "updated-kitchen", "fenced", "laundry"],
    blurb: {
      es: "Bungalow en Ballard con porche cubierto y patio cercado. Cocina recién hecha y lavandería en casa. A unas cuadras de las tiendas de la avenida.",
      en: "A Ballard bungalow with a covered porch and a fenced yard. A newer kitchen and laundry in the house. A few blocks from the avenue shops.",
    },
  },
  {
    id: "clarksville",
    address: "1604 W 10th St",
    neighborhood: "Clarksville",
    city: "Austin",
    state: "TX",
    zip: "78703",
    lat: 30.298,
    lng: -97.756,
    price: 3340,
    beds: 2,
    baths: 2,
    sqft: 1180,
    type: "house",
    pets: true,
    deposit: 3340,
    available: "2026-11-18",
    year: 1934,
    parking: 1,
    laundry: "in-unit",
    photos: ["/homes/austin.jpg", "/homes/bed.jpg", "/homes/kitchen.jpg"],
    featured: false,
    posted: "2026-11-07",
    amenities: ["porch", "hardwood", "ac", "heat", "updated-kitchen", "patio", "laundry"],
    blurb: {
      es: "Bungalow de dos habitaciones en Clarksville. Porche delantero, patio atrás y las dos recámaras en suite. Disponible a mediados de noviembre.",
      en: "A two-bedroom bungalow in Clarksville. Front porch, back patio, and both bedrooms with their own bath. Available mid-November.",
    },
  },
  {
    id: "highlands",
    address: "3425 Newton St",
    neighborhood: "Highlands",
    city: "Denver",
    state: "CO",
    zip: "80211",
    lat: 39.761,
    lng: -105.012,
    price: 3050,
    beds: 3,
    baths: 2,
    sqft: 1460,
    type: "house",
    pets: true,
    deposit: 3050,
    available: "2027-01-15",
    year: 1905,
    parking: 1,
    laundry: "hookups",
    photos: ["/homes/denver.jpg", "/homes/living.jpg", "/homes/dining.jpg"],
    featured: true,
    posted: "2026-10-26",
    amenities: ["hardwood", "heat", "fireplace", "porch", "yard", "fenced"],
    blurb: {
      es: "Bungalow de ladrillo en Highlands. Chimenea, porche y jardín cercado. Conexiones de lavadora en el sótano. Ingreso a mediados de enero.",
      en: "A brick bungalow in the Highlands. Fireplace, porch, and a fenced yard. Washer hookups in the basement. Move-in mid-January.",
    },
  },
];

export function getListing(id: string, source: Listing[] = listings) {
  return source.find((listing) => listing.id === id);
}

export function cityOptions(source: Listing[] = listings) {
  const map = new Map<string, string>();
  for (const listing of source) map.set(listing.city, listing.state);
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([city, state]) => ({ city, state }));
}

export function filterListings(search: ListingSearch, source: Listing[] = listings) {
  const sort = search.sort ?? "featured";
  return source
    .filter((listing) => {
      if (search.city && listing.city !== search.city) return false;
      if (search.max && listing.price > search.max) return false;
      if (search.beds && listing.beds < search.beds) return false;
      if (search.baths && listing.baths < search.baths) return false;
      if (search.pets && !listing.pets) return false;
      if (search.type && listing.type !== search.type) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "newest") return b.posted.localeCompare(a.posted);
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.price - b.price;
    });
}

export function similarListings(id: string, source: Listing[] = listings) {
  const home = getListing(id, source);
  if (!home) return [];
  return source
    .filter((listing) => listing.id !== id)
    .map((listing) => ({
      listing,
      score:
        (listing.city === home.city ? 3 : 0) +
        (listing.state === home.state ? 1 : 0) +
        (listing.beds === home.beds ? 1 : 0) +
        (listing.type === home.type ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.listing.price - b.listing.price)
    .slice(0, 3)
    .map((item) => item.listing);
}
