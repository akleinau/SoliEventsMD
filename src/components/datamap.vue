<script setup lang="ts">

import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';


import { useDataStore } from "../stores/dataStore.ts";
import { ref, onMounted, watch, nextTick } from 'vue';

// Props
const props = defineProps<{
  isMobile: boolean;
  isMapOpen: boolean;
  items: any;
}>();

const dataStore = useDataStore();

// Reaktive Variablen
const mapElement = ref<HTMLElement | null>(null);
const map = ref<L.Map | null>(null);
const markers = ref<Map<string, { marker: L.Marker; originalIcon: L.DivIcon; highlightIcon: L.DivIcon }>>(new Map());
const markersClusterGroup = ref<L.MarkerClusterGroup | null>(null);
const highlightedKey = ref<string | null>(null);

// Stable key for an itemgroup (mirrors the grouping key in dataStore.get_grouped_data()).
// Used to match markers to itemgroups by content, since get_grouped_data() returns fresh
// objects on every call and object identity can therefore not be relied upon.
const itemKey = (group: any): string => `${group?.Was}|${group?.Wer}|${group?.Wo}`;


// Adresse in Koordinaten umwandeln
const getCoordinates = async (location: string): Promise<{ lat: number; lng: number } | null> => {
 // OPTION 1: load from openstreetmap coordinates via nominatim
  /*try {
    const city = "Magdeburg"; // Ersetze durch deine Stadt
    const fullAddress = location.includes(city) ? location : `${location}, ${city}`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
    );
    const data = await response.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    console.warn(`Keine Koordinaten für "${fullAddress}" gefunden.`);
    return null;
  } catch (error) {
    console.error("Fehler beim Geocoding:", error);
    return null;
  }*/

 // OPTION 2: load from csv coordiates
  try {
    if (location.includes('/')) {
      const [lat, lng] = location.split('/').map(Number);
      return { lat: lat, lng: lng};
    }
    else {
      return null;
    }
  } catch (error) {
    console.error("Fehler in den Koordinaten: ", error);
    return null;
  }
};

// Marker für eine Item-Gruppe erstellen
const addMarker = async (item: any) => {
  // Sicherstellen, dass Karte vorhanden ist
  if (!map.value) return;

  // Prüfen, dass Koordinaten vorhanden sind
  const coords = await getCoordinates(item.Koordinaten);
  if (!coords) return;

  // Symbol wählen: bei genau einer Unterkategorie deren Outline-Icon, sonst das
  // Hauptkategorie-Icon. Nur im Unterkategorie-Fall kommt dahinter ein farbiger
  // "Klecks" in der Hauptkategorie-Farbe; die Hauptkategorie-Icons bringen ihren
  // eigenen Hintergrund bereits mit und bleiben daher ohne Klecks.
  const subNames = dataStore.getSubCategoryNames(item.Unterkategorie);
  const singleSub = subNames && subNames.length === 1 ? subNames[0] : null;
  const symbolSvg = singleSub
    ? dataStore.getSubCategorySvg(singleSub)
    : dataStore.getCategorySvg(item.Kategorie);
  if (!symbolSvg) return;

  const blobColor = dataStore.getCardTextColor(item.Kategorie);
  const blobSpan = singleSub
    ? `<span class="map-marker__blob" style="background:${blobColor}"></span>`
    : '';
  const markerHtml = `
    <div class="map-marker${singleSub ? '' : ' map-marker--plain'}">
      ${blobSpan}
      <img class="map-marker__symbol" src="${symbolSvg}" alt="" />
    </div>`;

  // Original icon
  const originalIcon = L.divIcon({
    className: 'map-marker-icon',
    html: markerHtml,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  // Highlighted icon with glow effect
  const highlightIcon = L.divIcon({
    className: 'map-marker-icon highlighted-marker-icon',
    html: markerHtml,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  // Marker mit Icon hinzufügen
  const marker = L.marker([coords.lat, coords.lng], { icon: originalIcon })
    // Kurzinfos als Tooltip: erscheint beim Hovern, nicht beim Klick
    .bindTooltip(`
      <b>${item.Was}</b><br>
      ${item.Wer}<br>
      ${item.Wo}
    `, { direction: 'top', offset: [0, -28] })
    // Marker über das MarkersCluster zur Karte hinzufügen (und je nach Zoomstufe automatisch anzeigen oder clustern)
    .addTo(markersClusterGroup.value!);

  // Klick öffnet die volle Karte (Dialog); der Tooltip bleibt dem Hover vorbehalten
  marker.on('click', () => {
    dataStore.set_current_itemgroup(item);
  });

  // Marker im Map speichern (für Fokus-Funktionalität), gekeyed über den stabilen itemKey
  markers.value.set(itemKey(item), { marker, originalIcon, highlightIcon });
};

const updateMarkers = () => {
  // alle bisherigen Marker aus der Cluster-Gruppe entfernen, falls vorhanden
  if (!markersClusterGroup.value) return;
  markersClusterGroup.value.clearLayers();
  markers.value.clear();

  // Marker für alle derzeit gefilterten Item-Gruppen hinzufügen.
  // Wir nutzen die gruppierten Daten (wie Karten-/Listenansicht und Dialog),
  // damit ein Marker-Klick eine vollständige Item-Gruppe liefert.
  dataStore.get_grouped_data().forEach((group: any) => {
    addMarker(group);
  });
}

// Karte initialisieren
const initMap = () => {  
  //mapElement = this.$refs.map;
  // Sicherstellen, dass Karten-Element (DOM) vorhanden ist
  if (!mapElement.value) return;
  
  // Karte initialisieren
  map.value = L.map(mapElement.value).setView([52.1250, 11.6390], 12); // Zentrum: Magdeburg

  // OpenStreetMap-Kacheln hinzufügen
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map.value);

  // MarkerClusterGroup zur Karte hinzufügen (nur einmalig)
  if (!map.value) return;
  markersClusterGroup.value = L.markerClusterGroup();
  map.value.addLayer(markersClusterGroup.value);

  // Marker basierend auf der aktuellen Filterung hinzufügen
  updateMarkers();
};

// Fokus auf ein Item setzen (z. B. nach Klick in der Liste)
const focusOnItemInternal = async (item: any) => {
  if (!map.value || !item || !markersClusterGroup.value) return;

  // Find the marker data for this itemgroup
  const markerData = markers.value.get(itemKey(item));
  if (!markerData) {
    // Marker might not exist yet (async loading), try to get coords and just center
    const coords = await getCoordinates(item.Koordinaten);
    if (coords) {
      map.value.setView([coords.lat, coords.lng], 15, { animate: true });
    }
    return;
  }

  const { marker, highlightIcon } = markerData;

  // Set the highlighted icon on the marker (stays within cluster group)
  marker.setIcon(highlightIcon);
  highlightedKey.value = itemKey(item);

  // zoomToShowLayer will zoom in and spiderfy the cluster if needed to reveal the marker
  markersClusterGroup.value.zoomToShowLayer(marker, () => {
    // After zoom/spiderfy, ensure the marker is centered
    if (map.value) {
      const latlng = marker.getLatLng();
      map.value.setView(latlng, Math.max(map.value.getZoom(), 15), { animate: true });
    }
  });
};

// Public function to focus on an itemgroup (sets the store which triggers the watch)
const focusOnItem = (item: any) => {
  dataStore.set_focused_itemgroup(item);
};

const clearHighlight = () => {
  // Restore the original icon on the previously highlighted marker
  if (highlightedKey.value) {
    const markerData = markers.value.get(highlightedKey.value);
    if (markerData) {
      markerData.marker.setIcon(markerData.originalIcon);
    }
    highlightedKey.value = null;
  }
};

// Watch for focused_itemgroup changes from the store (e.g. after a card/list click)
watch(() => dataStore.focused_itemgroup, (newItem, oldItem) => {
  // Only react if there's actually a change
  if (newItem === oldItem) return;

  if (newItem && props.isMapOpen) {
    // Clear previous highlight
    if (highlightedKey.value && highlightedKey.value !== itemKey(newItem)) {
      const markerData = markers.value.get(highlightedKey.value);
      if (markerData) {
        markerData.marker.setIcon(markerData.originalIcon);
      }
      highlightedKey.value = null;
    }
    // Now focus on the new itemgroup
    focusOnItemInternal(newItem);
  } else if (!newItem) {
    clearHighlight();
  }
});

// Reagiert auf Filter-Änderungen an den Items (props)
watch(() => props.items, () => {
  // alle bisherigen Marker aus der Cluster-Gruppe entfernen, falls vorhanden
  if (!markersClusterGroup.value) return;
  markersClusterGroup.value.clearLayers();
  markers.value.clear();
  clearHighlight();
  updateMarkers();
});

watch(() => [props.isMapOpen, props.isMobile], async ([isMapOpen, isMobile]) => {
  if (!map.value || !isMapOpen) return;

  // Leaflet needs a resize signal after layout switches to fullscreen.
  await nextTick();
  map.value.invalidateSize();

  if (isMobile) {
    map.value.invalidateSize();
  }
});

// Lebenszyklus-Hooks
onMounted(() => {
  nextTick(() => {
    initMap();
  });
});

// Expose-Methoden für Elternkomponenten
defineExpose({
  focusOnItem,
  clearHighlight,
});

</script>

<template>
  <div class="map-container">
    <!-- Karte -->
    <div
      ref="mapElement"
      class="map"
    ></div>
  </div>
</template>

<style scoped>

.map-container {
  padding: 1rem; /* gleiche Größe wie im Container in databable.vue*/
  border-left: 1px var(--color-anthrazit) solid;
  height: 100vh;
  overflow: hidden; /* Verhindert Überlappung */
}

/* Karte (Desktop & Mobile) */
.map {
  height: 100%;
  width: 100%;
  z-index: 1; /* kleiner als 100, damit es hinter dem Header bleibt */
  transition: transform 0.3s ease;
}

</style>

<style>
/* Global styles for Leaflet map marker icons */
.map-marker-icon {
  background: none !important;
  border: none !important;
}

.map-marker {
  position: relative;
  width: 40px;
  height: 40px;
}

/* Farbiger "Klecks" hinter dem Symbol, halbtransparent in der Kategoriefarbe */
.map-marker__blob {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0.65;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.map-marker__symbol {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 70%;
  object-fit: contain;
  pointer-events: none;
}

/* Hauptkategorie-Icon ohne Klecks: Symbol füllt den ganzen Marker */
.map-marker--plain .map-marker__symbol {
  width: 100%;
  height: 100%;
}

/* Hervorgehobener Marker (z. B. nach Karten-/Listen-Klick) */
.highlighted-marker-icon .map-marker {
  filter: drop-shadow(0 0 6px var(--color-orange));
  transform: scale(1.15);
}
.highlighted-marker-icon .map-marker__blob {
  opacity: 0.9;
  box-shadow: 0 0 0 2px var(--color-orange), 0 1px 3px rgba(0, 0, 0, 0.3);
}

  /* Marker-Cluster: distinktes Blau je nach Anzahl der Einträge */
  /* SMALL: < 10 items */
  .marker-cluster-small {
    background-color: rgba(170, 210, 255, 0.6) !important;
  }
  .marker-cluster-small div {
    background-color: rgb(170, 210, 255, 1.0) !important;
    color: var(--color-anthrazit);
    font-weight: bold;
  }

  /* MEDIUM: >= 10 items */
  .marker-cluster-medium {
    background-color: rgba(128, 186, 253, 0.6) !important;
  }
  .marker-cluster-medium div {
    background-color: rgb(128, 186, 253, 1.0) !important;
    color: var(--color-anthrazit);
    font-weight: bold;
  }

  /* LARGE: >= 100 items */
  .marker-cluster-large {
    background-color: rgba(70, 156, 255, 0.6) !important;
  }
  .marker-cluster-large div{
    background-color: rgb(70, 156, 255, 1.0) !important;
    color: var(--color-anthrazit);
    font-weight: bold;
  }

/* Leaflet Zoom-Buttons an das neutrale Markendesign angleichen */
.leaflet-bar a,
.leaflet-bar a:link {
  background-color: var(--color-offwhite);
  color: var(--color-anthrazit);
  border-bottom-color: rgba(0, 0, 0, 0.12);
}
.leaflet-bar a:hover {
  background-color: #ececec;
  color: var(--color-anthrazit);
}
</style>