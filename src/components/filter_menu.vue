<script setup lang="ts">

import { useDataStore } from "../stores/dataStore.ts";
import { getCategoryDefinition } from "../constants/categoryConfig.ts"
import { ref, computed } from "vue";

const dataStore = useDataStore();

// Heute-Filter
const heuteFilterActive = ref(false);

const toggleHeuteFilter = () => {
  heuteFilterActive.value = !heuteFilterActive.value;
  if (heuteFilterActive.value) {
    dataStore.setHeuteFilter(true);
  } else {
    dataStore.setHeuteFilter(false);
  }
};

// Kategorie
const kategorieFilter = ref<string[]>([]);
const kategorie = computed(() => {
  if (!dataStore.data) return [];
  const uniqueKategorie = new Set(dataStore.data.map(item => item.Kategorie));
  return Array.from(uniqueKategorie).sort()
    .map(kategorie => ({      
      value: kategorie, // Rohwert für die Logik
      title: getCategoryDefinition(kategorie)?.label ?? kategorie, // Label aus der Konfiguration, oder der Rohwert als Fallback      
      icon: getCategoryDefinition(kategorie)?.icon, // Icon aus der Konfiguration
    }));
});

// Wochentage bzw. alternative Beschreibung (alle Tage, werktags, jeden Tag, ...) - aber keine Aufzählung von Tagen.
const wochentagFilter = ref<string[]>([]);
const wochentage = computed(() => {
  if (!dataStore.data) return [];
  const uniqueWochentage = new Set(dataStore.data.map(item => item.Wochentag));
  // erst mit "0 alle Tage", "1 Montag", ... sortieren
  return Array.from(uniqueWochentage).sort()
    // und danach nur noch den 'kurzen' Titel anzeigen (via ".map(...)")
    .map(tag => ({ 
      value: tag, 
      title: dataStore.getFormattedDay(tag ?? '')
    }));
});

// Wer
const werFilter = ref<string[]>([]);
const wer = computed(() => {
  if (!dataStore.data) return [];
  const uniqueWer = new Set(dataStore.data.map(item => item.Wer));
  return Array.from(uniqueWer).sort();
});

</script>

<template>
  <div class="d-flex px-3 justify-center align-center flex-wrap " style="background: #f3f3f3; max-width:100%">
    <div class="mx-3">
      <h3>Filter nach: </h3>
    </div>

    <!-- Das folgende Element soll zu **Unterkategorien** umgebaut werden. Die Hauptkategorien sollen dann nur noch über den Header anwählbar sein. >
    <div class="FilterDiv">
      <v-select label="Kategorie"
        variant="outlined" multiple density="compact" hide-details bg-color="white"
        :items="kategorie" v-model="kategorieFilter"
        @update:modelValue="dataStore.add_filter('Kategorie', kategorieFilter)">
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index < 2">
            <span class="pr-2">{{ item.title }}</span>
            <v-icon size="x-large" color="ec4d0b" class="pl-2 pr-2">
                {{ getCategoryDefinition(item.value)?.icon }}
            </v-icon>
          </v-chip>
          <span v-if="index === 2" class="text-grey text-caption align-self-center">
                  (+{{ kategorieFilter.length - 2 }} weitere)
          </span>
        </template>        
      </v-select>
    </div-->

    <div class="FilterDiv">
      <v-select label="Wochentag"
        variant="outlined" multiple density="compact" hide-details bg-color="white"
        :items="wochentage" v-model="wochentagFilter"
        @update:modelValue="dataStore.add_filter('Wochentag', wochentagFilter)">
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index < 2">
            <span>{{ item.title }}</span>
          </v-chip>
          <span v-if="index === 2" class="text-grey text-caption align-self-center">
                  (+{{ wochentagFilter.length - 2 }} weitere)
          </span>
        </template>
      </v-select>
    </div>

    <div class="FilterDiv">
      <v-select label="Veranstalter"
        variant="outlined" multiple density="compact" hide-details bg-color="white"
        :items="wer" v-model="werFilter"
        @update:modelValue="dataStore.add_filter('Wer', werFilter)">
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index < 2">
            <span>{{ item.title }}</span>
          </v-chip>
          <span v-if="index === 2" class="text-grey text-caption align-self-center">
                  (+{{ werFilter.length - 2 }} weitere)
          </span>
        </template>
      </v-select>
    </div>

    <div class="FilterDiv HeuteButton">
      <v-btn
        :color="heuteFilterActive ? '#ec4d0b' : undefined"
        :variant="heuteFilterActive ? 'flat' : 'outlined'"
        :class="{ 'heute-inactive': !heuteFilterActive }"
        @click="toggleHeuteFilter"
        density="default"
        prepend-icon="mdi-calendar-today"
        height="40"
      >
        Heute
      </v-btn>
    </div>

  </div>
</template>

<style scoped>

.FilterDiv {
  margin-inline: 10px;
  min-width: 300px;
  margin-bottom: 5px;
  margin-top: 5px;
}

.FilterDiv.HeuteButton {
  min-width: auto;
}

.heute-inactive {
  background-color: white !important;
  border-color: rgba(0, 0, 0, 0.38) !important;
  opacity: 0.8;
}

.heute-inactive:hover {
  opacity: 1;
}

.category-button__icon {
  width: clamp(12px, 2vw, 16px); /* Mindestgröße: 12px, Ideal: 2vw, Maximum: 16px */
  height: clamp(12px, 2vw, 16px);
  object-fit: contain;
}

</style>