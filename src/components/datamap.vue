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

const dataStore = useDataStore();;

// Reaktive Variablen
const mapElement = ref<HTMLElement | null>(null);
const map = ref(null);
const markers = ref([]);
const markersClusterGroup = ref(null);


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
  const icon = L.icon({
    iconUrl: iconUrl,
    iconSize: [32, 32], // Größe des Icons
    iconAnchor: [16, 32], // Position des Icons
  });;

  // Marker mit Icon hinzufügen
  const marker = L.marker([coords.lat, coords.lng], { icon: icon })
    // Inhalt vom Popup, wenn auf Marker geklickt wird
    .bindPopup(`
      <b>${item.Was}</b><br>
      ${item.Wer}<br>
      ${item.Wo}
    `)
    // Marker über das MarkersCluster zur Karte hinzufügen (und je nach Zoomstufe automatisch anzeigen oder clustern)
    .addTo(markersClusterGroup.value);

  // Optional: Marker im Array speichern (falls benötigt)
  markers.value.push(marker);
};

const updateMarkers = () => {
  // alle bisherigen Marker aus der Cluster-Gruppe entfernen, falls vorhanden
  if (!markersClusterGroup.value) return;
  markersClusterGroup.value.clearLayers();

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
const focusOnItem = (item: any) => {
  if (!map.value) return;
  getCoordinates(item.Wo).then((coords) => {
    if (coords) {
      //map.value?.setView([coords.lat, coords.lng], 15);
      console.log("map view changed")
      map.value = L.map(mapElement.value).setView([coords.lat, coords.lng], 15);
    }
  });
  console.log("map view END changed")
};

// Reagiert auf Filter-Änderungen an den Items (props)
watch(() => props.items, () => {
  // alle bisherigen Marker aus der Cluster-Gruppe entfernen, falls vorhanden
  if (!markersClusterGroup.value) return;
  markersClusterGroup.value.clearLayers();
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