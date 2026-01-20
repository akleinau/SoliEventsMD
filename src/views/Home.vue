<script setup lang="ts">

import { ref, onMounted, onBeforeUnmount } from 'vue';
import Data_loader from "../components/data_loader.vue";
import Filter_menu from "../components/filter_menu.vue";
import Datatable from "../components/datatable.vue";
import Datamap from "../components/datamap.vue";
import Curr_item_dialog from "../components/curr_item_dialog.vue";

//const reduced_columns = ['Was', 'Wer', 'Wo', 'Uhrzeit', 'Wochentag']

import { useDataStore } from "../stores/dataStore.ts";

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
  Datamap.value?.focusOnItem(item); // ToDo activate later
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
      <!--Initial_selection class="mt-5" /-->
      <Filter_menu />
    </div>

    <!--View when item selected /-->
    <Curr_item_dialog class="mt-5" v-if="dataStore.current_item !== null" />

    <div class="content-container" :class="{ 'map-open': isMapOpen, 'mobile': isMobile }">
        <!--List of Cards /-->
        <Datatable 
            class="datatable"
            :class="{ 'datatable--collapsed': isMapOpen }"
            :viewMode="dataStore.getViewMode()"
            :items="dataStore.get_filtered_data()"
            @item-clicked="handleItemClick"
        />

        <!-- Button zum Ein-/Ausklappen der Karte /-->
        <button
          @click="toggleMap"
          class="toggle-map-button"
          :class="{
            'toggle-map-button--mobile': isMobile,
            'toggle-map-button--open': isMapOpen
          }"
        >
          {{ isMapOpen ? (isMobile ? '▼ Karte ausblenden' : '◀ Karte ausblenden') : (isMobile ? '▲ Karte anzeigen' : 'Karte anzeigen ▶') }}
        </button>

        <!--Datamap /-->
        <Datamap 
            v-show="isMapOpen"
            ref="datamap"
            class="datamap"
            :class="{ 'datamap--mobile': isMobile }"
            :isMobile="isMobile"
            :isMapOpen="isMapOpen"
            :items="dataStore.get_filtered_data()"
        />
    </div>
  </div>

</template>

<style scoped>

.home-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.content-container {
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.datatable {
  width: 100%;
  height: 80vh;
  transition: all 0.3s ease;
}

.datamap {
  position: absolute;
  right: 0;
  top: 0;
  width: 40%;
  height: 100%;
  transition: all 0.3s ease;
  z-index: 1;
}

.toggle-map-button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 10px;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;
  z-index: 2;
  border-radius: 4px 0 0 4px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.toggle-map-button--mobile {
  top: auto;
  bottom: 10px;
  right: 40%;
  transform: translateX(50%);
  border-radius: 4px;
  writing-mode: horizontal-tb;
  text-orientation: initial;
}

.toggle-map-button--open {
  background-color: orange;
}

/* Desktop-Ansicht */
@media (min-width: 768px) {
  .content-container.map-open .datatable {
    width: 60%;
  }

  .toggle-map-button--open {
    transform: translateY(-50%) translateX(0);
  }
}

/* Mobile-Ansicht ToDo: fix code or this section -> use "@media ..."" OR use "".XYZ--mobile" ! */
@media (max-width: 767px) {
  .content-container {
    flex-direction: column;
  }

  .datatable {
    height: 80vh;
  }

  .datamap {
    position: relative;
    width: 100%;
    height: 0;
    order: 2;
  }

  .toggle-map-button {
    position: relative;
    height: 3rem;
    margin-top: 2rem;
    margin-bottom: 1.5rem;
    width: 80vw;
    align-self: center;
  }

  .content-container.map-open.mobile .datatable {
    height: 60vh;
  }

  .content-container.map-open.mobile .datamap {
    height: 40vh;
  }

  .toggle-map-button--open {
    margin-bottom: 0rem;
  }

}

</style>
