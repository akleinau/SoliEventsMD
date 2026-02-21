<script setup lang="ts">

import { useDataStore } from "../stores/dataStore.ts";
import { getSubCategoryDefinition } from "../constants/categoryConfig.ts"
import { ref, computed } from "vue";

const dataStore = useDataStore();

// Heute-Filter
const heuteFilterActive = ref(false);

// Unterkategorie
const unterkategorieFilter = ref<string[]>([]);
const unterkategorien = computed(() => {
  if (!dataStore.data) return [];
  const uniqueUnterkategorie = new Set(dataStore.get_category_filtered_data()
    .filter(item => item.Unterkategorie && item.Unterkategorie.trim() !== "")
    .flatMap(item => 
      !item.Unterkategorie
        ? []
        : item.Unterkategorie
        .split(";")
        .map(value => value.trim())
        .filter(value => value !== "")
    ));
  return Array.from(uniqueUnterkategorie).sort()
    .map(unterkategorie => ({      
      value: unterkategorie, // Rohwert für die Logik
      title: getSubCategoryDefinition(unterkategorie)?.label, // Label aus der Konfiguration, oder der Rohwert als Fallback      
      icon: getSubCategoryDefinition(unterkategorie)?.icon, // Icon aus der Konfiguration
    }));
});

// Nutzungsart
const nutzungFilter = ref<string[]>([]);
const nutzungen = computed(() => {
  if (!dataStore.data) return [];
  const uniqueNutzung = new Set(dataStore.data
    .filter(item => item.Nutzung && item.Nutzung.trim() !== "")
    .flatMap(item => 
      !item.Nutzung
        ? []
        : item.Nutzung
        .split(";")
        .map(value => value.trim())
        .filter(value => value !== "")
    ));
  return Array.from(uniqueNutzung).sort();
});

// Wochentage bzw. alternative Beschreibung (alle Tage, werktags, jeden Tag, ...) - aber keine Aufzählung von Tagen.
const wochentagFilter = ref<string[]>([]);
const HEUTE_FILTER_VALUE = '__heute__';
const wochentage = computed(() => {
  if (!dataStore.data) return [];
  const uniqueWochentage = new Set(dataStore.data
    .filter(item => item.Wochentag && item.Wochentag.trim() !== "")
    .flatMap(item =>
      !item.Wochentag
        ? []
        : item.Wochentag
        .split(";")
        .map(value => value.trim())
        .filter(value => value !== "")
    ));
    
  // erst mit "0 alle Tage", "1 Montag", ... sortieren
  const sortedWochentage = Array.from(uniqueWochentage).sort()
    // und danach nur noch den 'kurzen' Titel anzeigen (via ".map(...)")
    .map(tag => ({ 
      value: tag, 
      title: dataStore.getFormattedDay(tag ?? '')
    }));
  // "Heute" als erste Option hinzufügen
  return [{ value: HEUTE_FILTER_VALUE, title: 'Heute' }, ...sortedWochentage];
});

const onWochentagFilterChange = (newFilter: string[]) => {
  const hasHeute = newFilter.includes(HEUTE_FILTER_VALUE);
  const wasHeuteActive = heuteFilterActive.value;
  
  // Handle "Heute" filter state
  if (hasHeute !== wasHeuteActive) {
    heuteFilterActive.value = hasHeute;
    dataStore.setHeuteFilter(hasHeute);
  }
  
  // Filter out "Heute" from the regular Wochentag filter
  const regularFilter = newFilter.filter(v => v !== HEUTE_FILTER_VALUE);
  dataStore.add_filter('Wochentag', regularFilter);
};

// Wer
const werFilter = ref<string[]>([]);
const wer = computed(() => {
  if (!dataStore.data) return [];
  const uniqueWer = new Set(dataStore.data
    .filter(item => item.Wer && item.Wer.trim() !== "")
    .flatMap(item => 
      !item.Wer
        ? []
        : item.Wer
        .split(";")
        .map(value => value.trim())
        .filter(value => value !== "")
    ));
  return Array.from(uniqueWer).sort();
});

const resetFilters = () => {
  dataStore.clear_all_filters();
  unterkategorieFilter.value = [];
  nutzungFilter.value = [];
  wochentagFilter.value = [];
  werFilter.value = [];
};

</script>

<template>
  <div class="filter-container d-flex py-1 px-3 align-center flex-wrap " style="background: #f3f3f3; max-width:100%">

    <!-- Button zum Umschalten des viewMode (Kacheln / Liste) -->
    <div>
      <v-btn v-if="dataStore.filter.length > 0" @click="resetFilters()">
        <v-icon>mdi-trash-can-outline</v-icon>
      </v-btn>
    </div>

    <div class="mx-3">
      <h3>Filter nach: </h3>
    </div>

    <div class="filter-items">

      <!-- Das folgende Element soll zu **Unterkategorien** umgebaut werden. Die Hauptkategorien sollen dann nur noch über den Header anwählbar sein. -->
      <div class="FilterDiv">
        <v-select label="Unterkategorie"
          variant="outlined" multiple density="compact" hide-details bg-color="white"
          :items="unterkategorien" v-model="unterkategorieFilter"
          @update:modelValue="dataStore.add_filter('Unterkategorie', unterkategorieFilter)">
          <template v-slot:selection="{ item, index }">
            <v-chip v-if="index < 2">
              <span class="pr-2">{{ item.title }}</span>
              <v-icon size="x-large" color="ec4d0b" class="pl-2 pr-2">
                  {{ dataStore.getSubCategoryIcon(item.value) }}
              </v-icon>
            </v-chip>
            <span v-if="index === 2" class="text-grey text-caption align-self-center">
                    (+{{ unterkategorieFilter.length - 2 }} weitere)
            </span>
          </template>        
        </v-select>
      </div>

      <div class="FilterDiv">
        <v-select label="Nutzung"
          variant="outlined" multiple density="compact" hide-details bg-color="white"
          :items="nutzungen" v-model="nutzungFilter"
          @update:modelValue="dataStore.add_filter('Nutzung', nutzungFilter)">
          <template v-slot:selection="{ item, index }">
            <v-chip v-if="index < 2">
              <span>{{ item.title }}</span>
            </v-chip>
            <span v-if="index === 2" class="text-grey text-caption align-self-center">
                    (+{{ nutzungFilter.length - 2 }} weitere)
            </span>
          </template>

        </v-select>
      </div>

      <!--div class="FilterDiv">
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
      </div-->
      
      <div class="FilterDiv">
        <v-select label="Wochentag"
          variant="outlined" multiple density="compact" hide-details bg-color="white"
          :items="wochentage" v-model="wochentagFilter"
          @update:modelValue="onWochentagFilterChange">
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
    </div>

    <!-- Button zum Umschalten des viewMode (Kacheln / Liste) -->
    <div>
      <v-btn @click="dataStore.switchViewMode()">
        {{ dataStore.getViewMode() === 'cards' ? 'Zur Listenansicht' : 'Zur Kachelansicht' }}
      </v-btn>
    </div>

  </div>
</template>

<style scoped>

.filter-container, .filter-items {
  display: flex;  
  flex-direction: row;
  justify-content: left;
  font-size: 14px;
}

.filter-container * {
  font-size: inherit;
}

/* Mobile-Ansicht */
@media (max-width: 1000px) {
  .filter-container {
    flex-direction: column;
    justify-content: center;
  }
}

/* Mobile-Ansicht */
@media (max-width: 650px) {
  .filter-items {
    flex-direction: column;
  }
}

.FilterDiv {
  margin-inline: 10px;
  min-width: 300px;
  margin-bottom: 5px;
  margin-top: 5px;
}

.category-button__icon {
  width: clamp(12px, 2vw, 16px); /* Mindestgröße: 12px, Ideal: 2vw, Maximum: 16px */
  height: clamp(12px, 2vw, 16px);
  object-fit: contain;
}

</style>