<script setup lang="ts">

import {useDataStore} from "../stores/dataStore.ts";
import {onMounted, ref, watch} from "vue";

const dataStore = useDataStore()

const active = ref(true)

onMounted(() => {
  active.value = true
})

watch(() => active.value, (newValue) => {
  if (!newValue) {
    dataStore.current_item = null
  }
})

let item = dataStore.current_item

</script>

<template>
  <v-dialog v-model="active" style="max-width: 1000px">
    <v-card >
      <v-card-title>{{ item.Was }}</v-card-title>
      <v-card-subtitle>{{ item.Wer }}</v-card-subtitle>
      <v-card-text>
        <p class="mb-1"> <v-icon>mdi-map-marker</v-icon> {{ item.Wo }}</p>
        <p class="mb-1"> <v-icon>mdi-calendar</v-icon> {{ dataStore.format_weekday(item.Wochentag) }}, {{ item.Rhythmus }} </p>
        <p> <v-icon>mdi-clock</v-icon>{{ item.Uhrzeit }}</p>
        <p class="mt-5"> <a :href="item.Link" target="_blank" >{{item.Link}}</a> </p>

        <p class="mt-5 text-grey-darken-1">Letzte Überprüfung: {{item.Letzte_Ueberpruefung}}</p>

        <div v-if="item.Kommentar !== ''" class="mt-5">
        Kommentar: <br>
        <div class="rounded bg-light pa-2" style="border: 1px solid #ccc;"><i>{{item.Kommentar}}</i></div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>