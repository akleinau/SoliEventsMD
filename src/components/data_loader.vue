<script setup lang="ts">

import * as d3 from 'd3'
import {onMounted, ref} from "vue";
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

const load_dataset = async () => {
  const csvFile = "https://raw.githubusercontent.com/akleinau/SoliEventsMD/refs/heads/main/dataset/SoliEventsMD.csv"
  const data = await d3.csv(csvFile, {crossOrigin: "anonymous"})
  if (!data || data.columns.length <= 3) {
    console.error("No data found online. Switch to manual upload.")
    return
  }
  dataStore.set_data(data)
}

onMounted(async () => {
  await load_dataset()
})


</script>

<template>
  <v-file-input label="Input the csv here" v-model="files"
                accept=".csv" v-if="dataStore.data == null"
                @update:modelValue="uploaded"></v-file-input>
</template>

<style scoped>

</style>
