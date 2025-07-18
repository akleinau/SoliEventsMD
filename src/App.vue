<script setup lang="ts">

import Data_loader from "./components/data_loader.vue";
import Datatable from "./components/datatable.vue";
import Initial_selection from "./components/initial_selection.vue";
import Curr_item_dialog from "./components/curr_item_dialog.vue";

const reduced_columns = ['Was', 'Wer', 'Wo', 'Uhrzeit', 'Wochentag']

import { useDataStore } from "./stores/dataStore.ts";
const dataStore = useDataStore()

</script>

<template>
  <div class="ma-auto text-center mt-3" style="color: #4e6c3b">
      <h1> Soli Events Magdeburg</h1>
  </div>


  <data_loader />
  <initial_selection class="mt-5" />
  <curr_item_dialog class="mt-5" v-if="dataStore.current_item !== null" />
  <datatable :headers="reduced_columns" />
</template>

<style scoped>

</style>
