create table if not exists site_owner (
  id integer primary key,
  user_id text not null
);

create table if not exists site_settings (
  id integer primary key,
  user_id text not null,
  hero_kicker_es text not null default '',
  hero_title_es text not null default '',
  hero_sub_es text not null default '',
  hero_kicker_en text not null default '',
  hero_title_en text not null default '',
  hero_sub_en text not null default '',
  phone text not null default '',
  email text not null default '',
  hours_es text not null default '',
  hours_en text not null default ''
);

create table if not exists listings (
  id text primary key,
  user_id text not null,
  address text not null,
  neighborhood text not null,
  city text not null,
  state text not null,
  zip text not null,
  lat double precision not null,
  lng double precision not null,
  price integer not null,
  beds integer not null,
  baths double precision not null,
  sqft integer not null,
  home_type text not null,
  pets boolean not null default false,
  deposit integer not null,
  available text not null,
  year_built integer not null,
  parking integer not null default 0,
  laundry text not null,
  featured boolean not null default false,
  posted text not null,
  amenities text not null default '',
  blurb_es text not null default '',
  blurb_en text not null default ''
);

create index if not exists listings_user_id_idx on listings (user_id);

create table if not exists listing_photos (
  listing_id text not null references listings (id) on delete cascade,
  position integer not null,
  data_url text not null,
  primary key (listing_id, position)
);
