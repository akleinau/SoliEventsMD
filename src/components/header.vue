<script setup lang="ts">

import { ref, watch } from 'vue'
import { useDataStore } from '../stores/dataStore.ts'
import { MAIN_CATEGORIES, type CategoryDefinition } from '../constants/categoryConfig'
import { useRoute } from 'vue-router';

const dataStore = useDataStore()

type SelectionOption = CategoryDefinition & { path: string }

const looking_for_options: SelectionOption[] = [
  { label: 'Alles', path: 'alles', color: 'light-orange', icon: 'mdi-star', icon2: '' },
  ...MAIN_CATEGORIES,
]

const route = useRoute();
const looking_for = ref('alles') // Default value

// if URL path changes, also change the category class
watch(
  () => route.params.category,
  (newCategory) => {
    if (newCategory === 'home') {
      looking_for.value = 'alles';
    }
    else if (newCategory === '') {
      looking_for.value = 'alles';
    }
    else {
      looking_for.value = ''+newCategory;
    }
    // Whenever the looking_for value changes, apply the filter
    apply_filter()
  }
);

const apply_filter = () => {
  // This function will apply the filter based on the selected looking_for value
  // You can implement the logic to filter your data here

  if (looking_for.value === undefined) {
    looking_for.value = 'alles'
  }

  if (looking_for.value === 'alles') {
    dataStore.clear_filter('Kategorie') // Clear all filters if 'Alles' is selected
    return
  }
  dataStore.add_filter('Kategorie', [looking_for.value])
}

</script>

<template>
    <div class="header-container text-center">
      <div class="title-container">
        <h1><router-link to="/alles">Magdeburg teilt!</router-link></h1>
      </div>
      <div class="categories-container mb-3 mt-3">
        <v-item-group
            v-model="looking_for"
            class="d-flex flex-wrap justify-center align-center">
            <v-item v-slot="{ isSelected, toggle }" v-for="option in looking_for_options"
                :key="option.label"
                :value="option.path">
                <v-btn class="category-button"
                    variant="flat"
                    :class="{ 'category-button--selected': isSelected }"
                    :to="'/' + option.path"                
                    :style="{
                        backgroundColor: isSelected ? option.color : '#ffffff',
                        // ToDo: Was genau soll mit der folgenden Zeile erreicht werden? Ist da auf dem Weg etwas kaputtgegangen? Falls ja, bitte fixen.
                        '--category-border-color': isSelected ? option.color : 'transparent',
                    } as Record<string, string>"
                    @click="toggle">
                <span class="category-button__label">{{ option.label }}</span>
                <v-icon size="x-large" color="ec4d0b" class="pl-2 mr-2">
                    {{ option.icon }}
                </v-icon>
                </v-btn>
            </v-item>
        </v-item-group>
      </div>
      <div class="space-container"></div>
    </div>

</template>

<style scoped>

    .header-container {
        display: flex;
        position: sticky;
        top: 0; /* Klebt am oberen Rand */
        color: #ec4d0b;
        background-color: white;
        padding: 10px;
        z-index: 100; /* Stellt sicher, dass der Header über anderen Elementen liegt */
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Optional: Schatten für bessere Sichtbarkeit */
    }

    .title-container, .space-container {
        align-content: center;
        padding: 0 10px;
        flex: 2;
    }

    .categories-container {
        align-self: top;
        flex: 5;
        justify-content: space-between;
    }

    a {
        color: inherit;
    }

    .v-btn--active {
        border-bottom: 5px solid #ec4d0b;
        padding-bottom: 0 !important;
    }

    .v-btn {
        padding-bottom: 5px;
    }

    .category-button {
        position: relative;
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        column-gap: 8px;
        padding: 5px 10px;
    }


    .category-button__label {
        display: inline-flex;
        align-items: center;
    }

    .category-button__icon {
        width: 28px;
        height: 28px;
        opacity: 0.6;
        pointer-events: none;
    }

    :deep(.v-btn__overlay) {
        display: none
    }


/* Desktop-Ansicht */
@media (min-width: 768px) {
    .header-container {
        flex-direction: row;
    }
}

/* Mobile-Ansicht ToDo: fix code or this section -> use "@media ..."" OR use "".XYZ--mobile" ! */
@media (max-width: 767px) {
    .header-container {
        flex-direction: column;
    }
}
</style>


