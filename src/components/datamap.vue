<script>

import {useDataStore} from "../stores/dataStore.ts";

export default {
  mounted() {
    this.initMap();
  },
  methods: {

    async initMap() {
      const dataStore = useDataStore();

      // Karte initialisieren
      const map = L.map('map').setView([51.1657, 10.4515], 6); // Zentrum: Deutschland

      // OpenStreetMap-Kacheln hinzufügen
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Marker für jedes Item hinzufügen
      dataStore.get_filtered_data().forEach(async (item) => {
        this.addMarker(item);
      });
    },

    async addMarker(item) {
      // Adresse in Koordinaten umwandeln (Geocoding)
      const coords = await this.getCoordinates(item.Wo);
      if (coords) {
        // Icon für die Kategorie erstellen
        const iconUrl = dataStore.getCategoryIcon(item.Kategorie);
        const icon = L.icon({
          iconUrl: iconUrl,
          iconSize: [32, 32], // Größe des Icons
          iconAnchor: [16, 32], // Position des Icons
        });

        // Marker mit Icon hinzufügen
        L.marker([coords.lat, coords.lng], { icon: icon })
          .addTo(this.map)
          .bindPopup(`
            <b>${item.Was}</b><br>
            ${item.Wer}<br>
            ${item.Wo}
          `);
      }
    },

    // Adresse in Koordinaten umwandeln (Nominatim-Geocoding)
    async getCoordinates(address) {
      try {
        // Stadt ergänzen, falls nicht vorhanden
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
    },
  },
};
</script>

<template>
  <div class="map-container">
    
    <!-- Karte -->
    <div
      id="map"
      style="width: 60%; height: 80vh;"
    ></div>
  </div>

</template>

<style scoped>
.map-container {
  /**position: relative; */
  height: 100%;
  border: 1px solid #ddd;
  padding: 1rem;
}

/* Karte (Desktop & Mobile) */
.map {
  position: fixed;
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