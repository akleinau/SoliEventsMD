// Ordnet Angeboten anhand ihrer Koordinaten einen Stadtteil zu.
// Grenzen: src/assets/geo/stadtteile.json (OpenStreetMap, ODbL), erzeugt mit scripts/stadtteile/build.mjs
// aus den Einstellungen in siteConfig.districts. Ist die Datei leer, ist die Funktion aus.
import { geoBounds, geoContains } from 'd3';
import stadtteileGeo from '../assets/geo/stadtteile.json' with { type: 'json' };
import { siteConfig } from '../constants/siteConfig.ts';

export const STADTTEIL_ONLINE = 'online';
export const STADTTEIL_AUSSERHALB = siteConfig.districts.outsideLabel;

type Row = Record<string, string | undefined>;
type Bounds = [[number, number], [number, number]];

const features = stadtteileGeo.features.map(feature => ({
  feature,
  name: feature.properties.name,
  bounds: geoBounds(feature) as Bounds,
}));

export const STADTTEIL_NAMES: string[] = features.map(f => f.name);

export function findStadtteil(koordinaten: string | undefined): string {
  const value = koordinaten?.trim() ?? '';
  if (features.length === 0) return ''; // no district file for this city: feature off
  if (value.toLowerCase() === 'internet') return STADTTEIL_ONLINE;

  const parts = value.split('/');
  if (parts.length !== 2 || parts.some(p => p.trim() === '')) return '';
  const [lat, lng] = parts.map(Number);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return '';

  for (const { feature, name, bounds: [[west, south], [east, north]] } of features) {
    if (lng < west || lng > east || lat < south || lat > north) continue;
    if (geoContains(feature, [lng, lat])) return name;
  }
  return STADTTEIL_AUSSERHALB;
}

// Setzt row.Stadtteil, außer die CSV liefert schon einen (manuelle Korrektur).
export function assignStadtteile<T extends Row>(rows: T[]): T[] {
  for (const row of rows) {
    if (!row.Stadtteil?.trim()) (row as Row).Stadtteil = findStadtteil(row.Koordinaten);
  }
  return rows;
}

const SPECIALS_LAST = [STADTTEIL_ONLINE, STADTTEIL_AUSSERHALB];

export function stadtteilOptions(rows: Row[]): string[] {
  const names = new Set(rows.map(r => r.Stadtteil?.trim() ?? '').filter(Boolean));
  const districts = [...names].filter(n => !SPECIALS_LAST.includes(n)).sort((a, b) => a.localeCompare(b, 'de'));
  return [...districts, ...SPECIALS_LAST.filter(n => names.has(n))];
}
