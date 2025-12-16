<!--script> setup lang="ts"-->
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
            .addTo(map)
            .bindPopup(`
              <b>${item.Was}</b><br>
              ${item.Wer}<br>
              ${item.Wo}
            `);
        }
      });
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

    <!-- Karte -->
    <div id="map" style="width: 60%; height: 80vh;"></div>

</template>

<style scoped>


</style>