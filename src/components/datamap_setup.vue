<script setup lang="ts">

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {useDataStore} from "../stores/dataStore.ts";
import { ref, onMounted, watch, nextTick } from 'vue';

// Props
const props = defineProps<{
  isMobile: boolean;
}>();

const dataStore = useDataStore();

// Reaktive Variablen
const isMapOpen = ref(true);
const mapElement = ref<HTMLElement | null>(null);
const map = ref(null);
const markers = ref([]);

// Karte ein-/ausklappen
const toggleMap = () => {
  isMapOpen.value = !isMapOpen.value;
};

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

/** Items beobachten und Marker aktualisieren
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
    <!-- Button zum Ein-/Ausklappen der Karte (Desktop & Mobile) -->
    <button
      @click="toggleMap"
      class="toggle-map-button"
      :class="{ 'toggle-map-button--mobile': isMobile }"
    >
      {{ isMapOpen ? (isMobile ? '▼' : '▶') : (isMobile ? '▲' : '◀') }}
    </button>

    <!-- Karte -->
    <div
      ref="mapElement"
      class="map"
      :class="{
        'map--collapsed': !isMapOpen,
        'map--mobile': isMobile,
      }"      
    ></div>
  </div>

</template>

<style scoped>
.map-container {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden; /* Verhindert Überlappung */
}

/* Karte (Desktop & Mobile) */
.map {
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 100;
  transition: transform 0.3s ease;
}

/* Desktop: Karte rechts, 40% Breite (min. 200px) */
.map:not(.map--mobile) {
  top: 0;
  right: 0;
  width: 40%;
  min-width: 200px;
  height: 100%;
}

/* Mobile: Karte unten, volle Breite, 40% Höhe */
.map--mobile {
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  min-width: unset;
}

/* Eingeklappte Karte (Desktop & Mobile) */
.map--collapsed:not(.map--mobile) {
  transform: translateX(calc(100% + 40px));
}

.map--mobile.map--collapsed {
  transform: translateY(calc(100% - 40px));
}

/* Button zum Ein-/Ausklappen */
.toggle-map-button {
  position: fixed;
  width: 40px;
  height: 60px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  z-index: 101;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Button-Position für Desktop */
.toggle-map-button:not(.toggle-map-button--mobile) {
  top: 50%;
  right: 100%;
  transform: translateY(-50%);
  border-radius: 4px 0 0 4px;
}

/* Button-Position für Mobile */
.toggle-map-button--mobile {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 0 0 4px 4px;
}

</style>