<script setup lang="ts">

import { useDataStore } from "../stores/dataStore.ts";
import { getSubCategoryDefinition } from "../constants/categoryConfig.ts"
import { ref, computed } from "vue";

const dataStore = useDataStore();

// --- Filter row visibility (toggles second row) ---
const isFilterRowOpen = ref(false);

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
  { key: 'Was', label: 'Name' },
  { key: 'Wer', label: 'Veranstalter' },
  { key: 'Wo', label: 'Ort' },
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

// --- Active filter chips ---
interface ActiveChip {
  key: string;
  label: string;
  icon?: string;
}
const activeChips = computed<ActiveChip[]>(() => {
  const chips: ActiveChip[] = [];

  if (heuteFilterActive.value) {
    chips.push({ key: 'heute', label: 'Heute', icon: 'mdi-calendar-today' });
  }

  unterkategorieFilter.value.forEach(val => {
    const def = getSubCategoryDefinition(val);
    chips.push({
      key: `unterkategorie:${val}`,
      label: def?.label ?? val,
      icon: def?.icon,
    });
  });

  nutzungFilter.value.forEach(val => {
    chips.push({ key: `nutzung:${val}`, label: val });
  });

  wochentagFilter.value
    .filter(v => v !== HEUTE_FILTER_VALUE)
    .forEach(val => {
      chips.push({
        key: `wochentag:${val}`,
        label: dataStore.getFormattedDay(val),
      });
    });

  return chips;
});
const MAX_VISIBLE_CHIPS = 3;
const visibleChips = computed(() => activeChips.value.slice(0, MAX_VISIBLE_CHIPS));
const hiddenChipCount = computed(() => Math.max(0, activeChips.value.length - MAX_VISIBLE_CHIPS));

// --- Remove a single chip ---
const removeChip = (chip: ActiveChip) => {
  if (chip.key === 'heute') {
    heuteFilterActive.value = false;
    dataStore.setHeuteFilter(false);
    // Also remove from wochentag selection
    wochentagFilter.value = wochentagFilter.value.filter(v => v !== HEUTE_FILTER_VALUE);
    return;
  }

  const [type, value] = chip.key.split(':');
  if (type === 'unterkategorie') {
    unterkategorieFilter.value = unterkategorieFilter.value.filter(v => v !== value);
    dataStore.add_filter('Unterkategorie', unterkategorieFilter.value);
  } else if (type === 'nutzung') {
    nutzungFilter.value = nutzungFilter.value.filter(v => v !== value);
    dataStore.add_filter('Nutzung', nutzungFilter.value);
  } else if (type === 'wochentag') {
    wochentagFilter.value = wochentagFilter.value.filter(v => v !== value);
    dataStore.add_filter('Wochentag', wochentagFilter.value.filter(v => v !== HEUTE_FILTER_VALUE));
  }
};

// --- Reset all ---
const resetFilters = () => {
  dataStore.clear_all_filters();
  unterkategorieFilter.value = [];
  nutzungFilter.value = [];
  wochentagFilter.value = [];
  heuteFilterActive.value = false;
  dataStore.setHeuteFilter(false);
  dataStore.setSearchTerm('');
};

</script>

<template>
  <div class="control-bar" style="background: #f3f3f3;">

    <!-- ═══ Row 1: main controls ═══ -->
    <div class="control-bar__row">

      <!-- Search -->
      <v-text-field
        class="control-bar__search"
        v-model="dataStore.searchTerm"
        prepend-inner-icon="mdi-magnify"
        label="Suche…"
        variant="outlined"
        density="compact"
        hide-details
        clearable
        bg-color="white"
      />

      <!-- Filter toggle button with badge -->
      <v-btn
        class="control-bar__btn"
        :variant="isFilterRowOpen ? 'flat' : 'outlined'"
        :color="isFilterRowOpen ? 'primary' : undefined"
        @click="isFilterRowOpen = !isFilterRowOpen"
      >
        <v-badge
          v-if="activeFilterCount > 0"
          :content="activeFilterCount"
          color="orange"
          floating
        >
          <v-icon>mdi-filter-variant</v-icon>
        </v-badge>
        <v-icon v-else>mdi-filter-variant</v-icon>
        <span class="hidden-xs ml-1">Filter</span>
        <v-icon end size="small">{{ isFilterRowOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>

      <!-- Sort menu -->
      <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
            class="control-bar__btn"
            :variant="dataStore.sortLevels.length > 0 ? 'flat' : 'outlined'"
            :color="dataStore.sortLevels.length > 0 ? 'primary' : undefined"
            v-bind="props"
          >
            <v-icon>mdi-sort</v-icon>
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

      <!-- View mode toggle -->
      <v-btn-toggle
        class="control-bar__view-toggle"
        :model-value="dataStore.getViewMode()"
        mandatory
        density="compact"
        variant="outlined"
      >
        <v-btn value="cards" @click="dataStore.viewMode !== 'cards' && dataStore.switchViewMode()">
          <v-icon>mdi-view-grid</v-icon>
        </v-btn>
        <v-btn value="list" @click="dataStore.viewMode !== 'list' && dataStore.switchViewMode()">
          <v-icon>mdi-view-list</v-icon>
        </v-btn>
      </v-btn-toggle>
    </div>

    <!-- ═══ Row 2: inline filter selects (slides open) ═══ -->
    <v-expand-transition>
      <div v-show="isFilterRowOpen" class="control-bar__filters">
        <div class="filter-select">
          <v-select label="Unterkategorie"
            variant="outlined" multiple density="compact" hide-details bg-color="white"
            :items="unterkategorien" v-model="unterkategorieFilter"
            @update:modelValue="dataStore.add_filter('Unterkategorie', unterkategorieFilter)">
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index < 2">
                <span class="pr-2">{{ item.title }}</span>
                <v-icon size="x-large" color="ec4d0b" class="pl-2 pr-2">{{ item.raw?.icon }}</v-icon>
              </v-chip>
              <span v-if="index === 2" class="text-grey text-caption align-self-center" style="white-space: nowrap;">
                (+{{ unterkategorieFilter.length - 2 }} weitere)
              </span>
            </template>
          </v-select>
        </div>

        <div class="filter-select">
          <v-select label="Nutzung"
            variant="outlined" multiple density="compact" hide-details bg-color="white"
            :items="nutzungen" v-model="nutzungFilter"
            @update:modelValue="dataStore.add_filter('Nutzung', nutzungFilter)">
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index < 2"><span>{{ item.title }}</span></v-chip>
              <span v-if="index === 2" class="text-grey text-caption align-self-center" style="white-space: nowrap;">
                (+{{ nutzungFilter.length - 2 }} weitere)
              </span>
            </template>
          </v-select>
        </div>

        <div class="filter-select">
          <v-select label="Wochentag"
            variant="outlined" multiple density="compact" hide-details bg-color="white"
            :items="wochentage" v-model="wochentagFilter"
            @update:modelValue="onWochentagFilterChange">
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index < 2"><span>{{ item.title }}</span></v-chip>
              <span v-if="index === 2" class="text-grey text-caption align-self-center" style="white-space: nowrap;">
                (+{{ wochentagFilter.length - 2 }} weitere)
              </span>
            </template>
          </v-select>
        </div>
      </div>
    </v-expand-transition>


  </div>
</template>

<style scoped>

/* ─── Control bar ─── */
.control-bar {
  padding: 8px 12px;
}

.control-bar__row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
}

.control-bar__search {
  flex: 1 1 180px;
  min-width: 120px;
  max-width: 360px;
}

.control-bar__btn {
  flex: 0 0 auto;
}

.control-bar__view-toggle {
  flex: 0 0 auto;
  margin-left: auto;
}

/* ─── Inline filter row ─── */
.control-bar__filters {
  display: flex;
  gap: 12px;
  padding-top: 8px;
  flex-wrap: wrap;
}

.filter-select {
  flex: 0 1 auto;
  min-width: 180px;
}

.filter-select :deep(.v-field__input) {
  flex-wrap: nowrap;
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
  border-color: rgb(var(--v-theme-primary));
  background-color: rgb(var(--v-theme-primary));
}

.sort-checkbox__number {
  font-size: 12px;
  font-weight: 700;
  color: white;
  line-height: 1;
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