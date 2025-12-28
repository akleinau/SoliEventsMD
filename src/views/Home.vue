<script setup lang="ts">

import { ref, onMounted, onBeforeUnmount } from 'vue';
import Data_loader from "../components/data_loader.vue";
import Datatable from "../components/datatable.vue";
//import Datamap from "../components/datamap.vue";
import DatamapSetup from "../components/datamap_setup.vue"; // alternative implementation -- ToDo remove later
import Initial_selection from "../components/initial_selection.vue";
import Curr_item_dialog from "../components/curr_item_dialog.vue";

const reduced_columns = ['Was', 'Wer', 'Wo', 'Uhrzeit', 'Wochentag']

import { useDataStore } from "../stores/dataStore.ts";
import Filter_menu from "../components/filter_menu.vue";

const dataStore = useDataStore();

const isMobile = ref(false);
const isMapOpen = ref(true);

// Prüfen, ob mobiles Gerät
const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

// Karte ein-/ausklappen
const toggleMap = () => {
  isMapOpen.value = !isMapOpen.value;
};

// Event-Handler für Klicks auf Items
const handleItemClick = (item: any) => {
  DatamapSetup.value?.focusOnItem(item); // ToDo activate later
};

onMounted(() => {
  checkIfMobile();
  window.addEventListener('resize', checkIfMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIfMobile);
});

</script>

<template>

  <div class="home-container">
    <!--Prepare data /-->
    <Data_loader />

    <!--Filter the data in table [and map -- ToDo later] /-->
    <div class="filter-container">
      <Initial_selection class="mt-5" />
      <Filter_menu/>
    </div>

    <!--View when item selected /-->
    <Curr_item_dialog class="mt-5" v-if="dataStore.current_item !== null" />

    <div class="content-container">
        <!--List of Cards /-->
        <Datatable 
            :headers="reduced_columns"
            :items="dataStore.get_filtered_data()"
            @item-clicked="handleItemClick"
        />

        <!-- Button zum Ein-/Ausklappen der Karte (Desktop & Mobile) -->
        <button
          v-show="!isMapOpen"
          @click="toggleMap"
          class="toggle-map-button"
          :class="{ 'toggle-map-button--mobile': isMobile }"
        >
          {{ isMapOpen ? (isMobile ? '▼' : '▶') : (isMobile ? '▲' : '◀') }}
        </button>

        <!--Datamap /-->
        <DatamapSetup 
            v-show="isMapOpen"
            ref="datamap"
            :isMobile="isMobile"
            :isMapOpen="isMapOpen"
        />
    </div>
  </div>

</template>

<style scoped>

.home-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.content-container {
    display: grid;
    grid-template-columns: 6fr 4fr;
    gap: 1rem; /* Abstand zwischen den Spalten */
    flex: 1;
    height: 100vh;
    overflow: hidden;
}

</style>
