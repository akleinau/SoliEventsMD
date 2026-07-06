<script setup lang="ts">

import { computed, ref, watch } from 'vue'
import { useDataStore } from '../stores/dataStore.ts'
import { MAIN_CATEGORIES, type CategoryDefinition } from '../constants/categoryConfig'
import { useRoute } from 'vue-router';

const dataStore = useDataStore()

type SelectionOption = CategoryDefinition & { path: string }

const looking_for_options: SelectionOption[] = [
  { label: 'Alles', path: 'alles', textcolor: 'var(--color-anthrazit)', color: 'var(--color-offwhite)', 
  icon: 'mdi-grid-large', 
  //icon: 'mdi-format-text-variant', // Alternatives Icon: Buchstabe 'A'
  svg: ''},  
  ...MAIN_CATEGORIES,
]

const route = useRoute();
const looking_for = ref('alles'); // Default value

const isMobile = computed(() => dataStore.isMobile);

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

    <v-item-group
        v-model="looking_for"
        class="d-flex flex-wrap justify-center align-center button-container">
        <v-item v-slot="{ isSelected, toggle }" v-for="option in looking_for_options"
            :key="option.label"
            :value="option.path">
            <v-btn class="category-button"
                variant="elevated"
                :class="{ 'category-button--selected': isSelected }"
                :to="'/' + option.path"                                
                :style="{
                    'background-color': option.color
                } as Record<string, string>"
                @click="toggle">
              <span v-if="!isMobile" class="category-button__label">{{ option.label }}</span>
              <v-tooltip v-if="!(option.label == 'Alles' && !isMobile)" :text="option.label" location="bottom" open-on-click>
                <template v-slot:activator="{ props }">
                    <img v-if="option.svg != ''" v-bind="props" class="category-button__icon" color="#3b3b3b" :src="option.svg"/>
                    <v-icon v-else v-bind="props" class="category-button__icon" color="#3b3b3b" size="x-large">{{ option.icon }}</v-icon>
                </template>
              </v-tooltip>
            </v-btn>
        </v-item>
    </v-item-group>

</template>

<style scoped>

    a {
        color: inherit;
    }

    .v-btn--active {
      border: 2px solid var(--color-anthrazit);
    }

    .v-btn {
      padding-bottom: 5px;
    }

    .category-button {
        display: inline-flex;
        align-items: center;
        padding: 20px 10px;
    }

    .category-button__label {
        display: inline-flex;
        align-items: center;
    }

    .category-button__icon {
        height: 28px;
        padding-left: 5px;
        pointer-events: none;
    }

    .button-container {
        gap: 16px;
    }

    :deep(.v-btn__overlay) {
        display: none
    }


  /* Mobile-Ansicht ToDo: fix code or this section -> use "@media ..."" OR use "".XYZ--mobile" ! */
  @media (max-width: 767px) {
    .v-btn {
      min-width: 0 !important; /* allows the v-btn to be smaller  */
      flex: 1 1 auto;
      max-width: 40px !important; /* limits the button width, so all can appear next to each other on smaller mobile screen */
      margin: 3px; /* to avoid clicking the wrong item */
    }

    /* mobile: icon only, centered, no extra padding so it fills the small button */
    .category-button {
      padding: 5px !important;
      column-gap: 0;
      justify-content: center;
    }

    .category-button :deep(.v-icon) {
      padding-left: 0 !important;
      margin-right: 0 !important;
    }
  }

</style>


