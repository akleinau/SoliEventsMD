<script setup lang="ts">

import { useDataStore } from "../stores/dataStore.ts";
import { getSubCategoryDefinition } from "../constants/categoryConfig.ts"
import { ref, computed, onMounted, onUpdated } from "vue";

const dataStore = useDataStore();

const controlBar = ref<HTMLElement | null>(null);
let labelCounter = 0;

const fixFieldSemantics = () => {
  controlBar.value?.querySelectorAll('.filter-select').forEach((wrap) => {
    const label = wrap.querySelector('label');
    const combobox = wrap.querySelector('[role="combobox"]');
    if (!label || !combobox) return;
    if (!label.id) label.id = `filter-label-${++labelCounter}`;
    combobox.setAttribute('aria-labelledby', label.id);
    combobox.removeAttribute('aria-label');
  });

  const searchField = controlBar.value?.querySelector('.control-bar__search .v-field');
  if (searchField && !searchField.getAttribute('role')) {
    searchField.setAttribute('role', 'presentation');
  }
};
onMounted(fixFieldSemantics);
onUpdated(fixFieldSemantics);

// --- Mobile: collapsible secondary filters ---
const isMobile = computed(() => dataStore.isMobile);
const expanded = ref(false);

// --- Heute-Filter ---
const heuteFilterActive = ref(false);
const HEUTE_FILTER_VALUE = '__heute__';

// --- Unterkategorie ---
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
      value: unterkategorie,
      title: getSubCategoryDefinition(unterkategorie)?.label,
      icon: getSubCategoryDefinition(unterkategorie)?.icon,
    }));
});

// --- Nutzungsart ---
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

// --- Wochentag (includes "Heute" as first option) ---
const wochentagFilter = ref<string[]>([]);
const wochentage = computed(() => {
  const sortedWochentage = dataStore.getSortedWochentageOptionen();
  return [{ value: HEUTE_FILTER_VALUE, title: 'Heute' }, ...sortedWochentage];
});

const onWochentagFilterChange = (newFilter: string[]) => {
  const hasHeute = newFilter.includes(HEUTE_FILTER_VALUE);
  const wasHeuteActive = heuteFilterActive.value;

  if (hasHeute !== wasHeuteActive) {
    heuteFilterActive.value = hasHeute;
    dataStore.setHeuteFilter(hasHeute);
  }

  const regularFilter = newFilter.filter(v => v !== HEUTE_FILTER_VALUE);
  dataStore.add_filter('Wochentag', regularFilter);
};

// --- Sort categories (tri-state cycling) ---
const sortCategories = [
  { key: 'Letzte_Ueberpruefung', label: '* Neuste *' },
  { key: 'Was', label: 'Angebotsname' },
  { key: 'Kategorie', label: 'Kategorie' },
  //{ key: 'Nutzung', label: 'Nutzung' },
  { key: 'Wo', label: 'Ort' },
  //{ key: 'Unterkategorie', label: 'Unterkategorie' },
  { key: 'Wer', label: 'Veranstalter*in' },
  { key: 'Wochentag', label: 'Wochentag' },
];

const getSortState = (key: string) => {
  const level = dataStore.sortLevels.find(s => s.column === key);
  if (!level) return 'none';
  return level.direction;
};

const getSortPriority = (key: string) => {
  const idx = dataStore.sortLevels.findIndex(s => s.column === key);
  return idx === -1 ? null : idx + 1;
};

const getSortIcon = (key: string) => {
  const state = getSortState(key);
  if (state === 'asc') return 'mdi-arrow-up';
  if (state === 'desc') return 'mdi-arrow-down';
  return 'mdi-minus';
};

const onSortClick = (key: string) => {
  dataStore.toggleSortLevel(key);
};

// --- Active filter count (for badge on filter button) ---
const activeFilterCount = computed(() => {
  let count = dataStore.filter.filter(f => f.column !== 'Kategorie').length;
  if (heuteFilterActive.value) count++;
  return count;
});

const hasActiveControls = computed(() => {
  return dataStore.searchTerm.trim() !== '' || activeFilterCount.value > 0 || dataStore.sortLevels.length > 0;
});

// --- Reset all ---
const resetFilters = () => {
  dataStore.clear_all_filters();
  dataStore.clearSortLevels();
  unterkategorieFilter.value = [];
  nutzungFilter.value = [];
  wochentagFilter.value = [];
  heuteFilterActive.value = false;
  dataStore.setHeuteFilter(false);
  dataStore.setSearchTerm('');
};

</script>

<template>
  <div class="control-bar" ref="controlBar" style="background: var(--color-offwhite);">

    <!-- ═══ Row 1: main controls ═══ -->
    <div class="control-bar__row">

      <!-- Mobile: toggle to fold/unfold secondary filters -->
      <v-btn
        v-if="isMobile"
        class="control-bar__btn control-bar__filter-toggle"
        :class="{ 'control-bar__btn--active': activeFilterCount > 0 || dataStore.searchTerm.trim() !== '' }"
        variant="outlined"
        :aria-label="expanded ? 'Filter-Auswahl ausblenden' : 'Filter-Auswahl anzeigen'"
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >
        <div class="control-bar__sort-icon">
          <v-icon>mdi-filter-variant</v-icon>
          <span
            v-if="activeFilterCount > 0"
            class="control-bar__sort-count"
            aria-hidden="true"
          >
            {{ activeFilterCount }}
          </span>
        </div>
        <span class="ml-1">Filter</span>
        <v-icon size="small" class="ml-1">{{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>

      <!-- Collapsible secondary filters (always shown on desktop) -->
      <template v-if="!isMobile || expanded">

      <!-- Search -->
      <v-text-field
        class="control-bar__search"
        v-model="dataStore.searchTerm"
        prepend-inner-icon="mdi-magnify"
        label="Suche"
        variant="outlined"
        density="compact"
        hide-details
        bg-color="var(--color-white)"
      />

      <div class="filter-select">
        <v-select label="Unterkategorie"
          open-text="Unterkategorie-Filter öffnen" close-text="Unterkategorie-Filter schließen"
          variant="outlined" multiple density="compact" hide-details bg-color="var(--color-white)"
          :items="unterkategorien" v-model="unterkategorieFilter"
          @update:modelValue="dataStore.add_filter('Unterkategorie', unterkategorieFilter)">
          <template v-slot:selection="{ item, index }">
            <v-chip v-if="index < 1">
              <span>{{ item.title }}</span>
            </v-chip>
            <span v-if="index === 1" class="filter-select__more text-caption align-self-center" style="white-space: nowrap;">
              (+{{ unterkategorieFilter.length - 1 }})
            </span>
          </template>
        </v-select>
      </div>

      <div class="filter-select">
        <v-select label="Nutzung"
          open-text="Nutzungs-Filter öffnen" close-text="Nutzungs-Filter schließen"
          variant="outlined" multiple density="compact" hide-details bg-color="var(--color-white)"
          :items="nutzungen" v-model="nutzungFilter"
          @update:modelValue="dataStore.add_filter('Nutzung', nutzungFilter)">
          <template v-slot:selection="{ item, index }">
            <v-chip v-if="index < 1"><span>{{ item.title }}</span></v-chip>
            <span v-if="index === 1" class="filter-select__more text-caption align-self-center" style="white-space: nowrap;">
              (+{{ nutzungFilter.length - 1 }})
            </span>
          </template>
        </v-select>
      </div>

      <div class="filter-select">
        <v-select label="Wochentag"
          open-text="Wochentags-Filter öffnen" close-text="Wochentags-Filter schließen"
          variant="outlined" multiple density="compact" hide-details bg-color="var(--color-white)"
          :items="wochentage" v-model="wochentagFilter"
          @update:modelValue="onWochentagFilterChange">
          <template v-slot:selection="{ item, index }">
            <v-chip v-if="index < 1"><span>{{ item.title }}</span></v-chip>
            <span v-if="index === 1" class="filter-select__more text-caption align-self-center" style="white-space: nowrap;">
              (+{{ wochentagFilter.length - 1 }})
            </span>
          </template>
        </v-select>
      </div>

      <!-- Sort menu -->
      <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
            class="control-bar__btn control-bar__btn--sort"
            :class="{ 'control-bar__btn--active': dataStore.sortLevels.length > 0 }"
            variant="outlined"
            aria-label="Sortieren: Optionen anzeigen"
            v-bind="props"
          >
            <div class="control-bar__sort-icon">
              <v-icon>mdi-sort</v-icon>
              <span
                v-if="dataStore.sortLevels.length > 0"
                class="control-bar__sort-count"
                aria-hidden="true"
              >
                {{ dataStore.sortLevels.length }}
              </span>
            </div>
            <span class="hidden-xs ml-1">Sortieren</span>
          </v-btn>
        </template>
        <v-list density="compact" min-width="220">
          <v-list-item
            v-for="cat in sortCategories"
            :key="cat.key"
            @click="onSortClick(cat.key)"
            :active="false"
          >
            <template v-slot:prepend>
              <div class="sort-checkbox" :class="{ 'sort-checkbox--active': getSortState(cat.key) !== 'none' }">
                <span v-if="getSortPriority(cat.key)" class="sort-checkbox__number">{{ getSortPriority(cat.key) }}</span>
              </div>
            </template>
            <v-list-item-title>{{ cat.label }}</v-list-item-title>
            <template v-slot:append>
              <v-icon v-if="getSortState(cat.key) !== 'none'" size="small">{{ getSortIcon(cat.key) }}</v-icon>
            </template>
          </v-list-item>
          <v-divider v-if="dataStore.sortLevels.length > 0" />
          <v-list-item v-if="dataStore.sortLevels.length > 0" @click="dataStore.clearSortLevels()">
            <v-list-item-title class="text-caption">Sortierung zurücksetzen</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        v-if="hasActiveControls"
        class="control-bar__btn control-bar__clear-btn"
        variant="outlined"
        aria-label="Suche, Filter und Sortierung zurücksetzen"
        title="Suche, Filter und Sortierung zurücksetzen"
        @click="resetFilters"
      >
        <v-icon>mdi-close-circle-outline</v-icon>
      </v-btn>

      </template>

      <!-- View mode toggle -->
      <v-btn-toggle
        class="control-bar__view-toggle"
        aria-label="Ansicht wechseln"
        :model-value="dataStore.getViewMode()"
        mandatory
        density="compact"
        variant="outlined"
      >
        <v-btn class="control-bar__btn" value="cards"
          aria-label="Raster-Ansicht: Angebote als Kacheln anzeigen"
          title="Raster-Ansicht"
          @click="dataStore.viewMode !== 'cards' && dataStore.switchViewMode()">
          <v-icon>mdi-view-grid</v-icon>
        </v-btn>
        <v-btn class="control-bar__btn" value="list"
          aria-label="Listen-Ansicht: Angebote als Liste anzeigen"
          title="Listen-Ansicht"
          @click="dataStore.viewMode !== 'list' && dataStore.switchViewMode()">
          <v-icon>mdi-view-list</v-icon>
        </v-btn>
      </v-btn-toggle>
    </div>

  </div>
</template>

<style scoped>

/* ─── Control bar ─── */
.control-bar {
  padding: 8px 12px;
  --control-btn-height: 36px;
  --control-btn-bg: var(--color-white);
  --control-btn-border: rgba(0, 0, 0, 0.38);
}

.control-bar :deep(.v-field-label) {
  color: var(--color-anthrazit);
  opacity: 1;
}

.control-bar__row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.control-bar__search {
  flex: 1 1 180px;
  min-width: 120px;
  max-width: 360px;
  height: 36px;
}

.control-bar__search :deep(.v-input__control) {
  height: 36px;
  display: flex;
  align-items: center;
}

.control-bar__search :deep(.v-field) {
  height: 36px;
  min-height: 36px;
  display: flex;
  align-items: center;
}

.control-bar__search :deep(.v-field__input) {
  height: 36px;
  padding: 0 4px;
  display: flex;
  align-items: center;
}

.control-bar__search :deep(.v-input__slot) {
  height: 36px;
  display: flex;
  align-items: center;
}

.control-bar__search :deep(.v-field__prepend-inner) {
  display: flex;
  align-items: center;
  margin-top: 0;
}

.control-bar__search :deep(input) {
  height: 36px;
  line-height: 36px;
}

.control-bar__btn {
  flex: 0 0 auto;
  height: var(--control-btn-height);
  min-height: var(--control-btn-height);
  min-width: 44px;
}

.control-bar__btn--sort {
  position: relative;
  overflow: visible;
}

.control-bar__filter-toggle {
  position: relative;
  overflow: visible;
}

.control-bar__filter-toggle .control-bar__sort-icon {
  position: relative;
}

.control-bar__filter-toggle .control-bar__sort-count {
  top: -8px;
  right: -8px;
}

.control-bar__btn--active {
  border-color: var(--color-orange) !important;
  color: var(--color-orange);
}

.control-bar__view-toggle {
  flex: 0 0 auto;
  margin-left: auto;
  height: var(--control-btn-height);
}

.control-bar__clear-btn {
  flex: 0 0 auto;
}

.control-bar__view-toggle :deep(.v-btn-toggle) {
  height: var(--control-btn-height);
  background-color: var(--control-btn-bg);
  border-color: var(--control-btn-border);
}

.control-bar__view-toggle :deep(.v-btn) {
  min-height: var(--control-btn-height);
}

.filter-select__more {
  color: var(--color-anthrazit);
}

.filter-select {
  flex: 0 1 auto;
  min-width: 180px;
  height: var(--control-btn-height);
}

.filter-select :deep(.v-input),
.filter-select :deep(.v-input__control),
.filter-select :deep(.v-field) {
  height: var(--control-btn-height);
  min-height: var(--control-btn-height);
}

.filter-select :deep(.v-field__field),
.filter-select :deep(.v-field__input) {
  min-height: var(--control-btn-height);
  height: var(--control-btn-height);
  display: flex;
  align-items: center;
  padding-top: 0;
  padding-bottom: 0;
}

.filter-select :deep(.v-field__input) {
  flex-wrap: nowrap;
}

.filter-select :deep(.v-field__append-inner),
.filter-select :deep(.v-field__prepend-inner) {
  align-self: center;
  padding-top: 0;
  padding-bottom: 0;
}

/* ─── Chips row ─── */
.control-bar__chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-top: 4px;
}

/* ─── Sort checkbox ─── */
.sort-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.38);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  transition: all 0.15s ease;
}

.sort-checkbox--active {
  border-color: var(--color-orange);
  background-color: var(--color-orange);
}

.sort-checkbox__number {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-white);
  line-height: 1;
}

.control-bar__row :deep(.v-btn) {
  height: var(--control-btn-height);
  min-height: var(--control-btn-height);
  background-color: var(--control-btn-bg);
  border-color: var(--control-btn-border);
}

.control-bar__row :deep(.v-btn:hover) {
  background-color: var(--control-btn-bg);
}

.control-bar__sort-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.control-bar__sort-count {
  position: absolute;
  top: -9px;
  right: 85px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--color-orange);
  color: var(--color-white);
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  pointer-events: none;
}

/* Hide button text on very small screens, keep icons */
@media (max-width: 600px) {
  .hidden-xs {
    display: none;
  }

  .control-bar__search {
    max-width: none;
  }

  .control-bar__row {
    flex-wrap: wrap;
  }

  .filter-select {
    max-width: none;
    flex-basis: 100%;
  }
}

</style>