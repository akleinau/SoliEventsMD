<script setup lang="ts">

import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import Data_loader from "../components/data_loader.vue";
import Datatable from "../components/datatable.vue";
import Datamap from "../components/datamap.vue";
import Curr_item_dialog from "../components/curr_item_dialog.vue";
import Filter_menu from "../components/filter_menu.vue";

//const reduced_columns = ['Was', 'Wer', 'Wo', 'Uhrzeit', 'Wochentag']

import { useDataStore } from "../stores/dataStore.ts";

const dataStore = useDataStore();
const datamap = ref<InstanceType<typeof Datamap> | null>(null);

// Use store's isMapVisible instead of local ref
const isMapOpen = computed(() => dataStore.isMapVisible);
const isMobile = computed(() => dataStore.isMobile);

// Karte ein-/ausklappen
const toggleMap = () => {
  dataStore.toggleMapVisible();
};

// Event-Handler für Klicks auf Items
const handleItemClick = (itemgroup: any) => {
  // Only focus on map if map is visible
  if (dataStore.isMapVisible && datamap.value) {
    dataStore.set_focused_itemgroup(itemgroup);
  }
};

// Close the detail dialog
const closeDialog = () => {
  dataStore.clear_current_itemgroup();
  dataStore.clear_focused_itemgroup();
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
  dataStore.checkIfMobile();
  window.addEventListener('resize', dataStore.checkIfMobile);
});

watch([isMobile, isMapOpen], ([mobile, mapOpen]) => {
  if (mobile && mapOpen) {
    document.body.style.overflow = 'hidden';
    return;
  }

  document.body.style.overflow = '';
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', dataStore.checkIfMobile);
  document.body.style.overflow = '';
});

</script>

<template>

  <div class="home-container">
    <!--Prepare data /-->
    <Data_loader />

    <div class="content-container" :class="{ 'map-open': isMapOpen, 'mobile': isMobile }">
        <!--Wrapper for datatable and dialog (dialog only overlays datatable, not map) -->
        <div class="datatable-wrapper" :class="{ 'datatable-wrapper--collapsed': isMapOpen }">
          <div class="datatable-controls">
            <Filter_menu />
          </div>

          <div class="datatable-content background-pattern">
            <!--List of Cards /-->
            <Datatable 
                class="datatable"
                :class="{ 'datatable--collapsed': isMapOpen}"
                :viewMode="dataStore.getViewMode()"
                :items="dataStore.get_filtered_data()"
                @itemgroup-clicked="handleItemClick"
            />

          </div>
        </div>

        <!-- Button zum Ein-/Ausklappen der Karte /-->
        <button
          @click="toggleMap"
          class="toggle-map-button"
          :class="{
            'toggle-map-button--mobile': isMobile,
            'toggle-map-button--open': isMapOpen,
            'toggle-map-button--mobile-open': isMobile && isMapOpen
          }"
          :title="isMapOpen ? 'Karte ausblenden' : 'Karte anzeigen'"
          :aria-label="isMapOpen ? 'Karte ausblenden' : 'Karte anzeigen'"
        >
          <v-icon size="40">{{ isMapOpen ? 'mdi-menu-right' : 'mdi-menu-left' }}</v-icon>
        </button>

        <!--Datamap /-->
        <Datamap 
            v-show="isMapOpen"
            ref="datamap"
            class="datamap"
            :class="{
              'datamap--mobile': isMobile,
              'datamap--mobile-open': isMobile && isMapOpen
            }"
            :isMobile="isMobile"
            :isMapOpen="isMapOpen"
            :items="dataStore.get_filtered_data()"
        />

        <!-- Overlay to capture clicks when dialog is open -->
        <div 
          v-if="dataStore.current_itemgroup !== null"
          class="dialog-backdrop"
          :class="{ 'dialog-backdrop--fullscreen': isMobile && isMapOpen }"
          @mousedown="onBackdropMouseDown"
          @mouseup="onBackdropMouseUp"
        ></div>

        <!-- Item dialog is attached to content container so it also works above map fullscreen -->
        <Curr_item_dialog
          class="mt-5"
          v-if="dataStore.current_itemgroup !== null"
          attachTarget=".content-container"
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
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: all 0.3s ease;
}

.datatable-controls {
  flex: 0 0 auto;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  z-index: 3;
}

.datatable-content {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
}

.background-pattern::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("/src/assets/pattern/Muster_Endlos_Kachel.svg");
  background-repeat: repeat;
  background-size: 210px;
  opacity: 0.2;
  margin: 10px;
}

.dialog-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1250;
  cursor: pointer;
}

.dialog-backdrop--fullscreen {
  position: fixed;
  inset: 0;
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  padding: 0;
  background-color: var(--color-anthrazit);
  color: var(--color-offwhite);
  border: none;
  cursor: pointer;
  z-index: 2;
  border-radius: 4px 0 0 4px;
}

/* Icon hell halten – sonst dunkles Icon auf dunklem Anthrazit-Grund */
.toggle-map-button .v-icon {
  color: var(--color-offwhite);
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

/* Desktop-Ansicht */
@media (min-width: 768px) {
  .content-container.map-open .datatable-wrapper {
    width: 60%;
  }

  /* Bei offener Karte sitzt der Button INNEN an der linken Kante der Karte */
  .toggle-map-button--open {
    right: auto;
    left: 60%;
    border-radius: 0 4px 4px 0;
  }
}

/* Mobile-Ansicht ToDo: fix css-code (in html above) or this css-section -> use "@media ..."" OR use "".XYZ--mobile" ! */
@media (max-width: 767px) {
  .content-container {
    flex-direction: column;
  }

  .datatable-wrapper {
    overflow: hidden;
  }

  .datamap {
    position: relative;
    width: 100%;
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

  .content-container.map-open.mobile .datatable-wrapper {
    display: none;
  }

  .datamap--mobile-open {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100dvh;
    z-index: 1200;
    background: white;
  }

  .toggle-map-button--mobile-open {
    position: fixed;
    left: 50%;
    right: auto;
    bottom: max(12px, env(safe-area-inset-bottom));
    transform: translateX(-50%);
    margin: 0;
    z-index: 1300;
  }

  .toggle-map-button--open {
    margin-bottom: 0rem;
  }

}

</style>
