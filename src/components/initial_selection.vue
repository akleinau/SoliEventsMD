<script setup lang="ts">

import { ref, watch } from 'vue'
import { useDataStore } from '../stores/dataStore.ts'
import { MAIN_CATEGORIES, type CategoryDefinition } from '../constants/categoryConfig'

const dataStore = useDataStore()

type SelectionOption = CategoryDefinition & { value: string }

const looking_for_options: SelectionOption[] = [
  ...MAIN_CATEGORIES,
  { label: 'Alles', value: 'Alles', color: '#ffffff', icon: '' },
]

const looking_for = ref('Alles') // Default value

watch(looking_for, () => {
  // Whenever the looking_for value changes, apply the filter
  apply_filter()
})

const apply_filter = () => {
  // This function will apply the filter based on the selected looking_for value
  // You can implement the logic to filter your data here
  console.log("Applying filter for:", looking_for.value)

  if (looking_for.value === undefined) {
    looking_for.value = 'Alles'
  }

  if (looking_for.value === 'Alles') {
    dataStore.clear_filter('Eventtyp') // Clear all filters if 'Alles' is selected
    return
  }
  dataStore.add_filter('Eventtyp', [looking_for.value])
}

const getOptionColor = (value: string) => {
  if (value === 'Alles') {
    return '#ffffff'
  }
  return dataStore.getCardColor(value)
}

</script>

<template>
  <div class="d-flex flex-column align-center justify-center">
    <h2><i>Ich suche nach... </i></h2>

    <v-item-group
        v-model="looking_for"
        class="d-flex flex-wrap mb-3 mt-3 justify-center align-center">
      <v-item v-slot="{ isSelected, toggle }" v-for="option in looking_for_options"
              :key="option.value"
              :value="option.value">
        <v-btn class="category-button"
               variant="flat"
               :class="{ 'category-button--selected': isSelected }"
               :style="{
                 backgroundColor: isSelected ? getOptionColor(option.value) : '#ffffff',
                 '--category-border-color': isSelected ? getOptionColor(option.value) : 'transparent'
               } as Record<string, string>"
               @click="toggle">
          <span class="category-button__label">{{ option.label }}</span>
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