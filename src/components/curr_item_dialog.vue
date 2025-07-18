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
  <v-dialog v-model="active">
    <v-card>
      <v-card-title>{{ item.Was }}</v-card-title>
      <v-card-subtitle>{{ item.Wer }}</v-card-subtitle>
      <v-card-text>
        <p>{{ item.Wo }}</p>
        <p>{{ item.Uhrzeit }}</p>
        <p>{{ item.Wochentag }} </p>
        <p>{{ item.Rhythmus }}</p>
        <p class="mt-5"> <a :href="item.Link">{{item.Link}}</a> </p>

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