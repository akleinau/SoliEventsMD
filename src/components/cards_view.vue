<script setup lang="ts">

import { useDataStore } from "../stores/dataStore.ts";

const dataStore = useDataStore()

const clicked = (item: any) => {
  dataStore.set_current_item(item);
}

</script>

<template>

    <v-card
        v-for="item in dataStore.get_filtered_data()" 
        class="ma-2 category-card" 
        width="350"
        max-height="180"
        :color="dataStore.getCardColor(item.Kategorie ?? '')"
        link @click="clicked(item)">
        <div class="category-card__icon" v-if="dataStore.getCategoryIcon(item.Kategorie)">
          <v-icon size="large" color="black">{{ dataStore.getCategoryIcon(item.Kategorie) }}</v-icon>          
        </div>
        <v-card-title class="category-card__title">{{ item.Was }}</v-card-title>
        <v-card-subtitle>{{ item.Wer }}</v-card-subtitle>
        <v-card-text>
          <p class="mb-1"> <v-icon>mdi-map-marker</v-icon>  {{ item.Wo }}</p>
          <p class="mb-1"> <v-icon>mdi-calendar</v-icon> {{ dataStore.getFormattedDay(item.Wochentag ?? '')}}, {{ item.Uhrzeit_Start }} - {{ item.Uhrzeit_Ende }}</p>
        </v-card-text>
    </v-card>

</template>

<style scoped>

.v-icon {
  color: #727272;
}


.category-card {
  position: relative;
  overflow: hidden;
}

.category-card__title {
  padding-right: 64px;
  word-break: break-word;
}

.category-card__icon {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 30px;
  height: 30px;
  opacity: 0.9;
  pointer-events: none;
}

.category-card__icon img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

</style>


