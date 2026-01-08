<script setup lang="ts">

import { useDataStore } from "../stores/dataStore.ts";
import Scroll_up_button from "../components/scroll_up_button.vue";

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
    <div class="table-container d-flex flex-wrap pa-2" style="background: white">
      <v-card
        v-for="item in dataStore.get_filtered_data()" 
        class="ma-2 category-card" 
        width="350"
        max-height="180"
        :color="dataStore.getCardColor(item.Kategorie ?? '')"
        link @click="clicked(item)">
        <div class="category-card__icon" v-if="dataStore.getCategoryIcon(item.Kategorie)">
          <img :src="dataStore.getCategoryIcon(item.Kategorie)" :alt="`Icon für ${item.Kategorie}`" />
        </div>
        <v-card-title class="category-card__title">{{ item.Was }}</v-card-title>
        <v-card-subtitle>{{ item.Wer }}</v-card-subtitle>
        <v-card-text>
          <p class="mb-1"> <v-icon>mdi-map-marker</v-icon>  {{ item.Wo }}</p>
          <p class="mb-1"> <v-icon>mdi-calendar</v-icon> {{ dataStore.getFormattedDay(item.Wochentag) }}, {{ item.Uhrzeit_Start }} - {{ item.Uhrzeit_Ende }}</p>
        </v-card-text>
      </v-card>
      
      <Scroll_up_button />
    </div>
</template>

<style scoped>

.table-container {  
  position: relative;
  height: 100vh;
  overflow-y: auto; /* Scrollbar bei Bedarf */
  align-content: flex-start;
  justify-content: center;
}

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