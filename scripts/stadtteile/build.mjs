// Erzeugt src/assets/geo/stadtteile.json aus den OpenStreetMap-Stadtteilgrenzen der Stadt
// aus src/constants/siteConfig.ts (Abschnitt "districts").
// Aufruf (Node ≥ 22.18): node scripts/stadtteile/build.mjs [overpass-antwort.json]
// Ohne Argument wird die Overpass-API abgefragt.
import { readFileSync, writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { siteConfig } from '../../src/constants/siteConfig.ts';

const OUT = new URL('../../src/assets/geo/stadtteile.json', import.meta.url);
const { osmRelationId, adminLevels, count: EXPECTED } = siteConfig.districts;
const TOLERANCE = 0.0001; // Grad, ca. 7–11 m
const QUERY = `[out:json][timeout:120];area(${3600000000 + osmRelationId})->.a;(`
  + adminLevels.map(level => `rel(area.a)["boundary"="administrative"]["admin_level"="${level}"];`).join('')
  + ');out geom;';

async function fetchOverpass() {
  for (const wait of [0, 15, 30, 45]) {
    if (wait) { console.log(`Overpass busy, retrying in ${wait} s …`); await sleep(wait * 1000); }
    try {
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST', body: new URLSearchParams({ data: QUERY }),
      });
      if (res.ok) return await res.json();
      console.log(`Overpass answered HTTP ${res.status}`);
    } catch (error) {
      console.log(`Overpass request failed: ${error.message}`);
    }
  }
  throw new Error('Overpass API not reachable');
}

const same = (a, b) => a[0] === b[0] && a[1] === b[1];

// Join ways sharing end nodes into closed rings.
function stitch(ways) {
  ways = ways.map(w => [...w]);
  const rings = [];
  while (ways.length) {
    let ring = ways.shift();
    while (!same(ring[0], ring.at(-1))) {
      const i = ways.findIndex(w => same(w[0], ring.at(-1)) || same(w.at(-1), ring.at(-1))
        || same(w.at(-1), ring[0]) || same(w[0], ring[0]));
      if (i === -1) throw new Error('unclosed ring');
      const [w] = ways.splice(i, 1);
      if (same(w[0], ring.at(-1))) ring = ring.concat(w.slice(1));
      else if (same(w.at(-1), ring.at(-1))) ring = ring.concat(w.slice(0, -1).reverse());
      else if (same(w.at(-1), ring[0])) ring = w.concat(ring.slice(1));
      else ring = w.slice(1).reverse().concat(ring);
    }
    rings.push(ring);
  }
  return rings;
}

function douglasPeucker(pts) {
  if (pts.length < 3) return pts;
  const [[x1, y1], [x2, y2]] = [pts[0], pts.at(-1)];
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1e-12;
  let best = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / len;
    if (d > best) { best = d; idx = i; }
  }
  if (best <= TOLERANCE) return [pts[0], pts.at(-1)];
  return douglasPeucker(pts.slice(0, idx + 1)).slice(0, -1).concat(douglasPeucker(pts.slice(idx)));
}

// Simplify each OSM way (endpoints fixed) *before* stitching: a border shared by two
// districts is the same way in both, so it stays identical and leaves no gaps or overlaps.
function simplifyWay(way) {
  let s;
  if (same(way[0], way.at(-1))) { // closed way: split so both halves have distinct endpoints
    const m = Math.floor(way.length / 2);
    s = douglasPeucker(way.slice(0, m + 1)).slice(0, -1).concat(douglasPeucker(way.slice(m)));
  } else {
    s = douglasPeucker(way);
  }
  return s.map(([x, y]) => [+x.toFixed(5), +y.toFixed(5)]);
}

// Planar signed area: > 0 means counter-clockwise.
const signedArea = r => r.slice(1).reduce((s, b, i) => s + r[i][0] * b[1] - b[0] * r[i][1], 0) / 2;

function inside([x, y], ring) {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

function toFeature(rel) {
  const ways = role => rel.members
    .filter(m => m.type === 'way' && m.role === role && m.geometry)
    .map(m => simplifyWay(m.geometry.map(p => [p.lon, p.lat])));
  const usable = r => r.length >= 4 && signedArea(r) !== 0;
  // d3 (spherical) expects exterior rings clockwise, holes counter-clockwise.
  const polygons = stitch(ways('outer')).filter(usable).map(s => [signedArea(s) > 0 ? s.reverse() : s]);
  for (const s of (ways('inner').length ? stitch(ways('inner')) : []).filter(usable)) {
    const hole = signedArea(s) < 0 ? s.reverse() : s;
    const owner = polygons.find(p => inside(hole[0], p[0])) ?? polygons[0];
    owner.push(hole);
  }
  return {
    type: 'Feature',
    properties: { name: rel.tags.name },
    geometry: { type: 'MultiPolygon', coordinates: polygons },
  };
}

const raw = process.argv[2] ? JSON.parse(readFileSync(process.argv[2], 'utf8')) : await fetchOverpass();
const features = raw.elements.filter(e => e.type === 'relation').map(toFeature)
  .sort((a, b) => a.properties.name.localeCompare(b.properties.name, 'de'));
if (features.length !== EXPECTED) throw new Error(`expected ${EXPECTED} Stadtteile, got ${features.length}`);

const json = JSON.stringify({ type: 'FeatureCollection', features });
writeFileSync(OUT, json);
console.log(`${features.length} features, ${json.length} bytes → ${OUT.pathname}`);
