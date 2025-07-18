<script setup lang="ts">

import { ref } from 'vue'
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

const apply_filter = () => {
  // This function will apply the filter based on the selected looking_for value
  // You can implement the logic to filter your data here
  console.log("Applying filter for:", looking_for.value)

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

    <v-btn-toggle
        v-model="looking_for"
        class="mb-3 mt-3" color="red"
        @click="apply_filter">
      <v-btn
          v-for="option in looking_for_options"
          :key="option.value"
          :value="option.value">
        {{ option.label }}
      </v-btn>
    </v-btn-toggle>
  </div>

</template>

<style scoped>

</style>