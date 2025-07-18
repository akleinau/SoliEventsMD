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

  <div class="d-flex flex-wrap" style="background: #ff9371">
    <v-card v-for="item in dataStore.get_filtered_data()" class="ma-2" width="250" link @click="clicked(item)">
      <v-card-title>{{ item.Was }}</v-card-title>
      <v-card-subtitle>{{ item.Wer }}</v-card-subtitle>
      <v-card-text>
        <p>{{ item.Wo }}</p>
        <p>{{ item.Wochentag }} {{ item.Uhrzeit }}</p>
      </v-card-text>
    </v-card>
  </div>

</template>

<style scoped>

</style>