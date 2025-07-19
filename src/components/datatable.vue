<script setup lang="ts">

import {useDataStore} from "../stores/dataStore.ts";

const dataStore = useDataStore()

const props = defineProps({
  headers: {
    type: Array,
    default: () => []
  }
})

const clicked = (item: any) => {
  dataStore.set_current_item(item)
}

</script>

<template>

  <div class="d-flex flex-wrap pa-2 justify-center" style="background: white">
    <v-card v-for="item in dataStore.get_filtered_data()" class="ma-2" width="350"
            :color="dataStore.getCardColor(item.Eventtyp)"
            link @click="clicked(item)">
      <v-card-title>{{ item.Was }}</v-card-title>
      <v-card-subtitle>{{ item.Wer }}</v-card-subtitle>
      <v-card-text>
        <p class="mb-1"> <v-icon>mdi-map-marker</v-icon>  {{ item.Wo }}</p>
        <p> <v-icon>mdi-calendar</v-icon> {{dataStore.format_weekday(item.Wochentag) }} {{ item.Uhrzeit }}</p>
      </v-card-text>
    </v-card>
  </div>

</template>

<style scoped>

.v-icon {
  color: #727272;
}

</style>