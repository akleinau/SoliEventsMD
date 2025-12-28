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

// Prüfen, ob mobiles Gerät
const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 768;
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
    <Data_loader />
    <Initial_selection class="mt-5" />
    <Filter_menu/>
    <Curr_item_dialog class="mt-5" v-if="dataStore.current_item !== null" />
    <div class="home-container">
        <Datatable 
            :headers="reduced_columns"
            :items="dataStore.get_filtered_data()"
            @item-clicked="handleItemClick"
        />
        <!--Datamap /-->
        <DatamapSetup 
            ref="datamap"
            :isMobile="isMobile"
        />
    </div>
    

</template>

<style scoped>

.home-container {
    position: relative;
    height: 100vh;
    width: 100%;
    overflow: hidden; /* Verhindert Überlappung */
}

</style>
