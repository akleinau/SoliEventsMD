<script setup lang="ts">

import { computed } from "vue";
import { useDataStore } from "../stores/dataStore.ts";

const dataStore = useDataStore();

const emptyItem = computed(() => {
  return dataStore.getEmptyItem()
});

const emit = defineEmits<{
  (e: 'item-clicked', item: any): void
}>()

const clicked = (item: any) => {
  emit('item-clicked', item);
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
        <v-card-title class="category-card__title">{{ item.Was }}</v-card-title>
        <div class="category-card__icon" v-if="dataStore.getCategoryIcon(item.Kategorie)">
          <v-tooltip :text="dataStore.getIconText(item)" location="top" open-on-click>
            <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="large" color="black">{{ dataStore.getIcon(item) }}</v-icon>
            </template>
          </v-tooltip>
        </div>
        <v-card-subtitle>{{ item.Wer }}</v-card-subtitle>
        <v-card-text>
          <p class="mb-1"> <v-icon>mdi-map-marker</v-icon>  {{ item.Wo }}</p>
          <p class="mb-1"> <v-icon>mdi-calendar</v-icon> {{ dataStore.getFormattedDay(item.Wochentag ?? '')}}, {{ item.Uhrzeit_Start }} - {{ item.Uhrzeit_Ende }}</p>
        </v-card-text>
    </v-card>
    <v-card
        class="ma-2 category-card" 
        width="350"
        max-height="180"
        :color="dataStore.getCardColor(emptyItem?.Kategorie ?? '')"
        link @click="clicked(emptyItem)">
        <div class="category-card__icon" v-if="dataStore.getCategoryIcon(emptyItem?.Kategorie)">
          <v-tooltip :text="dataStore.getIconText(emptyItem)" location="top" open-on-click>
            <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="large" color="black">{{ dataStore.getIcon(emptyItem) }}</v-icon>
            </template>
          </v-tooltip>          
        </div>
        <v-card-title class="category-card__title">{{ emptyItem?.Was }}</v-card-title>
        <v-card-subtitle>{{ emptyItem?.Wer }}</v-card-subtitle>
        <v-card-text>
          <p class="mb-1"> <v-icon>mdi-map-marker</v-icon>  {{ emptyItem?.Wo }}</p>
          <p class="mb-1"> <v-icon>mdi-calendar</v-icon> {{ dataStore.getFormattedDay(emptyItem?.Wochentag ?? '')}}, {{ emptyItem?.Uhrzeit_Start }} - {{ emptyItem?.Uhrzeit_Ende }}</p>
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
}

.category-card__icon img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

</style>


