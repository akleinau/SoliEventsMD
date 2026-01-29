<script setup lang="ts">

import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import Data_loader from "../components/data_loader.vue";
import Filter_menu from "../components/filter_menu.vue";
import Datatable from "../components/datatable.vue";
import Datamap from "../components/datamap.vue";
import Curr_item_dialog from "../components/curr_item_dialog.vue";

//const reduced_columns = ['Was', 'Wer', 'Wo', 'Uhrzeit', 'Wochentag']

import { useDataStore } from "../stores/dataStore.ts";

const dataStore = useDataStore();
const isMobile = ref(false);
const datamap = ref<InstanceType<typeof Datamap> | null>(null);

// Use store's isMapVisible instead of local ref
const isMapOpen = computed(() => dataStore.isMapVisible);

// Prüfen, ob mobiles Gerät
const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

// Karte ein-/ausklappen
const toggleMap = () => {
  dataStore.toggleMapVisible();
};

// Event-Handler für Klicks auf Items
const handleItemClick = (item: any) => {
  // Only focus on map if map is visible
  if (dataStore.isMapVisible && datamap.value) {
    dataStore.set_focused_item(item);
  }
};

// Close the detail dialog
const closeDialog = () => {
  dataStore.clear_current_item();
  dataStore.clear_focused_item();
};

// Track mouse position to distinguish click from pan/scroll
const backdropMouseStart = ref<{ x: number; y: number } | null>(null);

const onBackdropMouseDown = (e: MouseEvent) => {
  backdropMouseStart.value = { x: e.clientX, y: e.clientY };
};

const onBackdropMouseUp = (e: MouseEvent) => {
  if (!backdropMouseStart.value) return;
  
  const dx = Math.abs(e.clientX - backdropMouseStart.value.x);
  const dy = Math.abs(e.clientY - backdropMouseStart.value.y);
  
  // Only close if mouse moved less than 5px (true click, not pan)
  if (dx < 5 && dy < 5) {
    closeDialog();
  }
  
  backdropMouseStart.value = null;
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

    <div class="content-container" :class="{ 'map-open': isMapOpen, 'mobile': isMobile }">
        <!--Wrapper for datatable and dialog (dialog only overlays datatable, not map) -->
        <div class="datatable-wrapper" :class="{ 'datatable-wrapper--collapsed': isMapOpen }">
          <!--List of Cards /-->
          <Datatable 
              class="datatable"
              :viewMode="dataStore.getViewMode()"
              :items="dataStore.get_filtered_data()"
              @item-clicked="handleItemClick"
          />
          
          <!-- Overlay to capture clicks when dialog is open -->
          <div 
            v-if="dataStore.current_item !== null" 
            class="dialog-backdrop"
            @mousedown="onBackdropMouseDown"
            @mouseup="onBackdropMouseUp"
          ></div>
          
          <!--View when item selected - now only overlays datatable /-->
          <Curr_item_dialog class="mt-5" v-if="dataStore.current_item !== null" />
        </div>

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
  height: 80vh;
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
  height: 100%;
  transition: all 0.3s ease;
}

.datatable-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  transition: all 0.3s ease;
}

.dialog-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  cursor: pointer;
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
  .content-container.map-open .datatable-wrapper {
    width: 60%;
  }

  .toggle-map-button--open {
    transform: translateY(-50%) translateX(0);
  }
}

/* Mobile-Ansicht ToDo: fix css-code (in html above) or this css-section -> use "@media ..."" OR use "".XYZ--mobile" ! */
@media (max-width: 767px) {
  .content-container {
    flex-direction: column;
  }

  .datatable-wrapper {
    height: 80vh;
  }

  .datatable {
    height: 100%;
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
    height: 100vh;
  }

  .content-container.map-open.mobile .datamap {
    height: 100vh;
  }

  .toggle-map-button--open {
    margin-bottom: 0rem;
  }

}

</style>
