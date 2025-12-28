<script setup lang="ts">

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {useDataStore} from "../stores/dataStore.ts";
import { ref, onMounted, watch, nextTick } from 'vue';

// Props
const props = defineProps<{
  isMobile: boolean;
  isMapOpen: boolean;
}>();

const dataStore = useDataStore();

// Reaktive Variablen
const mapElement = ref<HTMLElement | null>(null);
const map = ref(null);
const markers = ref([]);


// Adresse in Koordinaten umwandeln
const getCoordinates = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const city = "Magdeburg"; // Ersetze durch deine Stadt
    const fullAddress = address.includes(city) ? address : `${address}, ${city}`;
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
  }
};

// Marker für ein Item erstellen
const addMarker = async (item: any) => {
  if (!map.value) return;

  const coords = await getCoordinates(item.Wo);
  if (coords) {
    // Icon für die Kategorie laden
    const iconUrl = dataStore.getCategoryIcon(item.Kategorie);
    const icon = L.icon({
      iconUrl: iconUrl,
      iconSize: [32, 32], // Größe des Icons
      iconAnchor: [16, 32], // Position des Icons
    });

    // Marker mit Icon hinzufügen
    const marker = L.marker([coords.lat, coords.lng], { icon: icon })
      .addTo(map.value)
      .bindPopup(`
        <b>${item.Was}</b><br>
        ${item.Wer}<br>
        ${item.Wo}
      `);
    markers.value.push(marker);
  }
};

// Karte initialisieren
const initMap = () => {  
  //mapElement = this.$refs.map;
  if (!mapElement.value) return;

  // Karte initialisieren
  map.value = L.map(mapElement.value).setView([51.1657, 10.4515], 6); // Zentrum: Deutschland

  // OpenStreetMap-Kacheln hinzufügen
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map.value);

  // Marker für alle Items hinzufügen
  dataStore.get_filtered_data().forEach(async (item) => {
    addMarker(item);
  });
};

// Fokus auf ein Item setzen (z. B. nach Klick in der Tabelle)
const focusOnItem = (item: any) => {
  if (!map.value) return;
  getCoordinates(item.Wo).then((coords) => {
    if (coords) {
      //map.value?.setView([coords.lat, coords.lng], 15);
      console.log("map view changed")
      map.value = L.map(mapElement.value).setView([coords.lat, coords.lng], 15);
    }
      console.log("map view END changed")
  });
};

/** Items beobachten und Marker aktualisieren -- ToDo implement when wanting the filter also to impact the map markers
watch(() => props.items, (newItems) => {
  markers.value.forEach(marker => marker.remove());
  markers.value = [];
  newItems.forEach(async (item) => {
    const coords = await getCoordinates(item.Wo);
    if (coords) {
      addMarker(item, coords);
    }
  });
});*/

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
      :class="{
        'map--mobile': isMobile,
      }"      
    ></div>
  </div>
</template>

<style scoped>

.map-container {
  padding: 1rem; /* gleiche Größe wie im Container in databable.vue*/
  border-left: 1px lightgrey solid;
  overflow: hidden; /* Verhindert Überlappung */
}

/* Karte (Desktop & Mobile) */
.map {
  height: 100%;
  width: 100%;
  z-index: 100;
  transition: transform 0.3s ease;
}

</style>