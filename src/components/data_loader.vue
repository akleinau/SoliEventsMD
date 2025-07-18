<script setup lang="ts">

import * as d3 from 'd3'
import {ref} from "vue";
import {useDataStore} from "../stores/dataStore.ts";

const files = ref(null)
const dataStore = useDataStore()

function uploaded(files: any) {
  const csvFile = files
  const reader = new FileReader()
  reader.onload = (event: any) => {
    let data = d3.csvParse(event.target.result)
    dataStore.set_data(data)
  }
  reader.readAsText(csvFile)
}
</script>

<template>
  <v-file-input label="Input the csv here" v-model="files"
                accept=".csv" v-if="files == null"
                @update:modelValue="uploaded"></v-file-input>
</template>

<style scoped>

</style>
