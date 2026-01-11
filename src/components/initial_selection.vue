<script setup lang="ts">

import { ref, watch } from 'vue'
import { useDataStore } from '../stores/dataStore.ts'
import { MAIN_CATEGORIES, type CategoryDefinition } from '../constants/categoryConfig'
import { useRoute } from 'vue-router';

const dataStore = useDataStore()

type SelectionOption = CategoryDefinition & { path: string }

const looking_for_options: SelectionOption[] = [
  ...MAIN_CATEGORIES,
  { label: 'Alles', path: 'alles', color: '#ffffff', icon: '' },
]


const route = useRoute();
const looking_for = ref('Alles') // Default value

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

const getOptionColor = (value: string) => {
  if (value === 'alles') {
    return '#ffffff'
  }
  return dataStore.getCardColor(value)
}

</script>

<template>
  <div><!-- class="d-flex flex-column align-center justify-center"-->
    <v-item-group
        v-model="looking_for"
        class="d-flex flex-wrap mb-3 mt-3 justify-center align-center">
      <h3 class="px-10"><i>Ich suche nach... </i></h3>
      <v-item v-slot="{ isSelected, toggle }" v-for="option in looking_for_options"
              :key="option.label"
              :value="option.path">
        <v-btn class="category-button"
               variant="flat"
               :class="{ 'category-button--selected': isSelected }"
               :to="'/' + option.path"                
               :style="{
                 backgroundColor: isSelected ? getOptionColor(option.color) : '#ffffff',
                 '--category-border-color': isSelected ? getOptionColor(option.color) : 'transparent'
               } as Record<string, string>"
               @click="toggle">
          <span class="category-button__label">{{ option.label }}</span>
          <span style="width: 5px;"></span>
          <img v-if="option.icon" class="category-button__icon" :src="option.icon" :alt="`${option.label} Icon`" />
        </v-btn>
      </v-item>
    </v-item-group>
  </div>

</template>

<style scoped>

.v-btn--active {
  border-bottom: 5px solid #4e6c3b;
  padding-bottom: 0 !important;
}

.v-btn {
  padding-bottom: 5px
}

.category-button {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  column-gap: 12px;
  padding: 6px 16px;
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

</style>