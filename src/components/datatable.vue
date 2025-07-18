<script setup lang="ts">

import {useDataStore} from "../stores/dataStore.ts";

const dataStore = useDataStore()

const reduced_columns = ['Was', 'Wer', 'Wo', 'Uhrzeit', 'Wochentag']

</script>

<template>
  <v-data-table :items="dataStore.data" :headers="dataStore.get_columns(reduced_columns)" />
</template>

<style scoped>

</style>