# Tenkiller Map

An interactive terrain and recreation map for Lake Tenkiller, Oklahoma. Explore
3D terrain, elevation contours, public lands, parks, campgrounds, trails and
recreation facilities. Selecting a point shows its coordinates and available
terrain elevation. The map does not show property-owner records or claim to
provide lake-bottom depth data.

## Data sources

- **OpenStreetMap** parks, campgrounds, nature reserves, marinas, boat ramps
  and named peaks. Licensed under [ODbL](https://opendatacommons.org/licenses/odbl/).
  It is free for commercial use; the required attribution is configured on the
  map source. Do not remove it.
- **USGS PAD-US** public-land boundaries. US Government data in the public
  domain; credited in the map attribution.
- **Recreation.gov RIDB** recreation areas and facilities.
- **USACE Tulsa District** lake-pool elevation, fetched on demand and cached
  briefly by the server endpoint.
- **Mapbox** terrain, elevation and basemap services. A Mapbox token is required.

OpenStreetMap features are stored locally in `public/data/landmarks.geojson`
rather than fetched from Overpass on each visit. The features change
infrequently, and querying the volunteer-run service on every page load would
be abusive. To regenerate the data, POST this query to
`https://overpass-api.de/api/interpreter` with a descriptive `User-Agent` and
convert the response to GeoJSON:

```
[out:json][timeout:90];
(
  way["leisure"="park"](35.44,-95.28,35.94,-94.72);
  relation["leisure"="park"](35.44,-95.28,35.94,-94.72);
  way["tourism"="camp_site"](35.44,-95.28,35.94,-94.72);
  relation["tourism"="camp_site"](35.44,-95.28,35.94,-94.72);
  node["tourism"="camp_site"](35.44,-95.28,35.94,-94.72);
  way["leisure"="nature_reserve"](35.44,-95.28,35.94,-94.72);
  relation["leisure"="nature_reserve"](35.44,-95.28,35.94,-94.72);
  way["boundary"="protected_area"](35.44,-95.28,35.94,-94.72);
  relation["boundary"="protected_area"](35.44,-95.28,35.94,-94.72);
  way["leisure"="marina"](35.44,-95.28,35.94,-94.72);
  node["leisure"="marina"](35.44,-95.28,35.94,-94.72);
  node["natural"="peak"](35.44,-95.28,35.94,-94.72);
  node["leisure"="slipway"](35.44,-95.28,35.94,-94.72);
  way["leisure"="slipway"](35.44,-95.28,35.94,-94.72);
);
out geom;
```

Commercial map data such as Google, Esri basemaps and Navionics is licensed for
display inside their own products; do not extract data from those products.
USGS PAD-US and GNIS are public-domain sources for federal protected areas and
geographic names.

## Run locally

```sh
npm install
```

Set `VITE_MAPBOX_TOKEN` in `.env`, then run:

```sh
npm run dev
```

Build the static app with `npm run build`. The `/api/lake-level` endpoint is
provided by the Cloudflare Worker, Netlify function, and Vite development
middleware so the browser can read the USACE gage data.
