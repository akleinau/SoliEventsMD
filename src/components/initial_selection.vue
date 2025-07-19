<script setup lang="ts">

import { ref, watch } from 'vue'
import { useDataStore } from '../stores/dataStore.ts'

const dataStore = useDataStore()

const looking_for_options = [
    // Essen, Bücher, Reparieren, Begegnen, Ressourcen, Digital
  { label: 'Essen', value: 'Essen' },
  { label: 'Bücher', value: 'Bücher'},
  { label: 'Reparieren', value: 'Reparieren' },
  { label: 'Begegnen', value: 'Begegnen' },
  { label: 'Ressourcen', value: 'Ressourcen' },
  { label: 'Digital', value: 'Digital' },
  { label: 'Alles', value: 'Alles' } // Default option to show all

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
        <v-btn :color="isSelected? dataStore.getCardColor(looking_for) : 'white'"
               variant="flat"
               @click="toggle">
          {{ option.label }}
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

:deep(.v-btn__overlay) {
  display: none
}

</style>