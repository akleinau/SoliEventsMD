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
const markers = ref<Map<any, { marker: L.Marker; originalIcon: L.Icon; highlightIcon: L.DivIcon }>>(new Map());
const markersClusterGroup = ref<L.MarkerClusterGroup | null>(null);
const highlightedItem = ref<any | null>(null);


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

// Marker für ein Item erstellen
const addMarker = async (item: any) => {
  // Sicherstellen, dass Karte vorhanden ist
  if (!map.value) return;

  // Prüfen, dass Koordinaten vorhanden sind
  const coords = await getCoordinates(item.Koordinaten);
  if (!coords) return;

  // Icon für die Kategorie laden
  const iconName = dataStore.getCategoryIcon(item.Kategorie);
  const iconUrl = import.meta.env.VITE_ICONS_URL + 'src/assets/category-icons/' +  iconName + '.svg';
  
  // Original icon
  const originalIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  // Highlighted icon using DivIcon with the same image but with a highlight ring
  const highlightIcon = L.divIcon({
    className: 'highlighted-marker-icon',
    html: `<img src="${iconUrl}" class="marker-icon-img" />`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  // Marker mit Icon hinzufügen
  const marker = L.marker([coords.lat, coords.lng], { icon: originalIcon })
    // Inhalt vom Popup, wenn auf Marker geklickt wird
    .bindPopup(`
      <b>${item.Was}</b><br>
      ${item.Wer}<br>
      ${item.Wo}
    `)
    // Marker über das MarkersCluster zur Karte hinzufügen (und je nach Zoomstufe automatisch anzeigen oder clustern)
    .addTo(markersClusterGroup.value!);

  // Click handler to open item dialog
  marker.on('click', () => {
    dataStore.set_current_item(item);
  });

  // Marker im Map speichern (für Fokus-Funktionalität)
  markers.value.set(item, { marker, originalIcon, highlightIcon });
};

const updateMarkers = () => {
  // alle bisherigen Marker aus der Cluster-Gruppe entfernen, falls vorhanden
  if (!markersClusterGroup.value) return;
  markersClusterGroup.value.clearLayers();
  markers.value.clear();

  // Marker für alle derzeit gefilterten Items hinzufügen
  props.items.map((item : any) => {
    addMarker(item);
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

// TODO ##### Fokus auf ein Item setzen (z. B. nach Klick in der Tabelle)
const focusOnItemInternal = async (item: any) => {
  if (!map.value || !item || !markersClusterGroup.value) return;

  // Find the marker data for this item
  const markerData = markers.value.get(item);
  if (!markerData) {
    // Marker might not exist yet (async loading), try to get coords and just center
    const coords = await getCoordinates(item.Koordinaten);
    if (coords) {
      map.value.setView([coords.lat, coords.lng], 15, { animate: true });
    }
    return;
  }

  const { marker, highlightIcon } = markerData;
  
  // Remove marker from cluster group and add directly to map
  // This way it stays visible even when zoomed out
  markersClusterGroup.value.removeLayer(marker);
  marker.addTo(map.value);
  
  // Set the highlighted icon on the marker
  marker.setIcon(highlightIcon);
  highlightedItem.value = item;
  
  // Center on the marker
  const latlng = marker.getLatLng();
  map.value.setView(latlng, Math.max(map.value.getZoom(), 15), { animate: true });
};

// Public function to focus on item (sets the store which triggers the watch)
const focusOnItem = (item: any) => {
  dataStore.set_focused_item(item);
};

const clearHighlight = () => {
  // Restore the original icon on the previously highlighted marker
  // and move it back to the cluster group
  if (highlightedItem.value && map.value && markersClusterGroup.value) {
    const markerData = markers.value.get(highlightedItem.value);
    if (markerData) {
      // Remove from map and add back to cluster group
      map.value.removeLayer(markerData.marker);
      markerData.marker.setIcon(markerData.originalIcon);
      markersClusterGroup.value.addLayer(markerData.marker);
    }
    highlightedItem.value = null;
  }
};

// Watch for focused_item changes from the store
watch(() => dataStore.focused_item, (newItem, oldItem) => {
  // Only react if there's actually a change
  if (newItem === oldItem) return;
  
  if (newItem && props.isMapOpen) {
    // Clear previous highlight and move marker back to cluster
    if (highlightedItem.value && highlightedItem.value !== newItem) {
      const markerData = markers.value.get(highlightedItem.value);
      if (markerData && map.value && markersClusterGroup.value) {
        map.value.removeLayer(markerData.marker);
        markerData.marker.setIcon(markerData.originalIcon);
        markersClusterGroup.value.addLayer(markerData.marker);
      }
      highlightedItem.value = null;
    }
    // Now focus on the new item
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
  border-left: 1px lightgrey solid;
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
/* Global styles for Leaflet highlighted marker */
.highlighted-marker-icon {
  position: relative;
}

.highlighted-marker-icon .marker-icon-img {
  width: 32px;
  height: 32px;
  display: block;
  filter: drop-shadow(0 0 4px rgba(255, 102, 0, 1)) drop-shadow(0 0 8px rgba(255, 102, 0, 0.8));
}
</style>